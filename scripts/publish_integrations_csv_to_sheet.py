from __future__ import annotations

import argparse
import csv
import json
import os
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv

from vendor_portal_scraper import TEMPLATE_HEADERS, google_client, normalize_row_for_template


CAPABILITY_HEADERS = [
    "asset_data_available",
    "telemetry_data_available",
    "writeback_supported",
]

DERIVED_HEADERS = ["api_spec_origin"]

SHEET_HEADERS = TEMPLATE_HEADERS + CAPABILITY_HEADERS + DERIVED_HEADERS
ALLOWED_DIRECT_SPEC_EXTENSIONS = {".json", ".yaml", ".yml", ".raml", ".wsdl", ".xml"}
ALLOWED_CAPABILITY_VALUES = {"Supported", "Unsupported"}
ALLOWED_API_SPEC_ORIGINS = {"vendor", "manufactured"}
PUBLIC_SITE_BASE_URL = "https://lastmileinc.ai"


def load_rows(csv_path: Path) -> list[dict[str, str]]:
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        headers = reader.fieldnames or []
        missing_headers = [header for header in TEMPLATE_HEADERS if header not in headers]
        if missing_headers:
            raise RuntimeError(
                "Integrations CSV is missing required headers: " + ", ".join(missing_headers)
            )
        return [normalize_row_for_template(row) for row in reader]


def detail_path_for_row(repo_root: Path, row: dict[str, str]) -> Path:
    vendor_slug = (row.get("vendor_slug") or "").strip()
    product_slug = (row.get("product_slug") or "").strip()
    return repo_root / "data" / "integration-details" / vendor_slug / f"{product_slug}.json"


def load_detail_record(repo_root: Path, row: dict[str, str]) -> dict[str, object]:
    detail_path = detail_path_for_row(repo_root, row)
    if not detail_path.exists():
        return {}
    with detail_path.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)
    return payload if isinstance(payload, dict) else {}


def normalize_capability_value(value: object) -> str:
    normalized = str(value or "").strip().lower()
    if normalized in {"true", "supported"}:
        return "Supported"
    if normalized in {"false", "not supported", "unsupported", "un-supported", "n/a", "na"}:
        return "Unsupported"
    return ""


def normalize_url_for_comparison(value: object) -> str:
    raw_value = str(value or "").strip()
    if not raw_value:
        return ""
    parsed = urlparse(raw_value)
    return parsed._replace(fragment="").geturl().rstrip("/").lower()


def detail_spec_url(detail_record: dict[str, object], row: dict[str, str]) -> str:
    if str(detail_record.get("detail_completeness", "")).strip() == "researched":
        vendor_slug = (row.get("vendor_slug") or "").strip()
        product_slug = (row.get("product_slug") or "").strip()
        if vendor_slug and product_slug:
            return f"{PUBLIC_SITE_BASE_URL}/manufactured-openapi/{vendor_slug}/{product_slug}.openapi.json"

    source_evidence = detail_record.get("source_evidence") if isinstance(detail_record.get("source_evidence"), dict) else {}
    spec_url = str(source_evidence.get("spec_url") or detail_record.get("spec_artifact_url") or "").strip()
    if spec_url:
        return spec_url
    return str(row.get("integration_api_url") or "").strip()


def detail_documentation_url(detail_record: dict[str, object], row: dict[str, str]) -> str:
    source_evidence = detail_record.get("source_evidence") if isinstance(detail_record.get("source_evidence"), dict) else {}
    documentation_url = str(source_evidence.get("documentation_url") or detail_record.get("integration_api_url") or "").strip()
    if documentation_url:
        return documentation_url
    return str(row.get("integration_api_url") or "").strip()


def has_direct_spec_file_url(value: str) -> bool:
    path = urlparse((value or "").strip()).path.lower()
    return any(path.endswith(extension) for extension in ALLOWED_DIRECT_SPEC_EXTENSIONS)


def normalize_sheet_row(repo_root: Path, row: dict[str, str]) -> dict[str, str]:
    normalized_row = dict(row)
    detail_record = load_detail_record(repo_root, row)

    for header in CAPABILITY_HEADERS:
        normalized_row[header] = normalize_capability_value(detail_record.get(header))

    source_visible = str(row.get("is_visible", "")).strip().upper() == "TRUE"
    has_researched_detail = str(detail_record.get("detail_completeness", "")).strip() == "researched"
    spec_url = detail_spec_url(detail_record, row)
    documentation_url = detail_documentation_url(detail_record, row)
    has_direct_spec_url = has_direct_spec_file_url(spec_url)
    has_allowed_capabilities = all(normalized_row.get(header, "") in ALLOWED_CAPABILITY_VALUES for header in CAPABILITY_HEADERS)
    has_distinct_documentation_and_spec = normalize_url_for_comparison(documentation_url) != normalize_url_for_comparison(spec_url)
    normalized_row["api_spec_origin"] = "manufactured" if has_researched_detail else "vendor"

    if normalized_row["api_spec_origin"] not in ALLOWED_API_SPEC_ORIGINS:
        normalized_row["api_spec_origin"] = "vendor"

    normalized_row["is_visible"] = (
        "TRUE"
        if source_visible and has_researched_detail and has_direct_spec_url and has_allowed_capabilities and has_distinct_documentation_and_spec
        else "FALSE"
    )
    return normalized_row


def publish_rows(rows: list[dict[str, str]], spreadsheet_id: str, worksheet_title: str) -> None:
    client = google_client()
    spreadsheet = client.open_by_key(spreadsheet_id)
    try:
        worksheet = spreadsheet.worksheet(worksheet_title)
    except Exception as exc:
        raise RuntimeError(f"Unable to open worksheet '{worksheet_title}': {exc}") from exc

    values = [SHEET_HEADERS] + [[row.get(header, "") for header in SHEET_HEADERS] for row in rows]
    worksheet.clear()
    worksheet.update(values)


def build_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Publish the curated integrations CSV to the Google Sheet as the authoritative worksheet."
    )
    parser.add_argument(
        "--csv-path",
        default="data/integrations.csv",
        help="Path to the canonical integrations CSV.",
    )
    parser.add_argument(
        "--spreadsheet-id",
        help="Google Spreadsheet ID override. Defaults to GOOGLE_SHEET_ID.",
    )
    parser.add_argument(
        "--worksheet",
        default=None,
        help="Worksheet title override. Defaults to GOOGLE_WORKSHEET_TITLE or 'Integrations'.",
    )
    return parser


def main() -> int:
    repo_root = Path(__file__).resolve().parents[1]
    load_dotenv(repo_root / ".env.scraper")
    load_dotenv()

    parser = build_argument_parser()
    args = parser.parse_args()

    csv_path = Path(args.csv_path)
    if not csv_path.is_absolute():
        csv_path = repo_root / csv_path

    spreadsheet_id = args.spreadsheet_id or os.getenv("GOOGLE_SHEET_ID", "").strip()
    worksheet_title = args.worksheet or os.getenv("GOOGLE_WORKSHEET_TITLE", "").strip() or "Integrations"

    if not spreadsheet_id:
        raise RuntimeError("Missing spreadsheet id. Pass --spreadsheet-id or set GOOGLE_SHEET_ID.")

    rows = load_rows(csv_path)
    if not rows:
        raise RuntimeError("The integrations CSV does not contain any data rows to publish.")

    rows = [normalize_sheet_row(repo_root, row) for row in rows]

    publish_rows(rows, spreadsheet_id, worksheet_title)
    print(f"Published {len(rows)} rows from {csv_path} to worksheet '{worksheet_title}'.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())