from __future__ import annotations

import argparse
import csv
import os
from pathlib import Path

from dotenv import load_dotenv

from vendor_portal_scraper import TEMPLATE_HEADERS, google_client, normalize_row_for_template


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


def publish_rows(rows: list[dict[str, str]], spreadsheet_id: str, worksheet_title: str) -> None:
    client = google_client()
    spreadsheet = client.open_by_key(spreadsheet_id)
    try:
        worksheet = spreadsheet.worksheet(worksheet_title)
    except Exception as exc:
        raise RuntimeError(f"Unable to open worksheet '{worksheet_title}': {exc}") from exc

    values = [TEMPLATE_HEADERS] + [[row.get(header, "") for header in TEMPLATE_HEADERS] for row in rows]
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

    publish_rows(rows, spreadsheet_id, worksheet_title)
    print(f"Published {len(rows)} rows from {csv_path} to worksheet '{worksheet_title}'.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())