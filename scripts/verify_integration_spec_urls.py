from __future__ import annotations

import argparse
import csv
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests
import yaml


CONSUMABLE_EXTENSIONS = {".json", ".yaml", ".yml"}
REQUEST_TIMEOUT = (15, 30)
USER_AGENT = "Last-Mile-Integrations-Validator/1.0"


@dataclass
class ValidationResult:
    line_number: int
    vendor_name: str
    product_name: str
    url: str
    final_url: str
    content_type: str
    ok: bool
    reason: str
    resolved_format: str


def normalize_bool(value: str) -> bool:
    return str(value or "").strip().lower() in {"1", "true", "yes", "y"}


def load_rows(csv_path: Path) -> tuple[list[dict[str, str]], list[str]]:
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)
        return rows, list(reader.fieldnames or [])


def looks_like_yaml(text: str) -> bool:
    stripped = text.lstrip("\ufeff \t\r\n")
    if not stripped:
        return False
    yaml_markers = ["openapi:", "swagger:", "asyncapi:", "paths:", "info:"]
    return any(marker in stripped[:2000] for marker in yaml_markers)


def extension_from_url(value: str) -> str:
    path = urlparse(value).path.lower()
    for extension in CONSUMABLE_EXTENSIONS:
        if path.endswith(extension):
            return extension
    return ""


def is_consumable_json(payload: Any) -> bool:
    if isinstance(payload, dict):
        top_level_keys = set(payload.keys())
        api_markers = {
            "openapi",
            "swagger",
            "asyncapi",
            "paths",
            "components",
            "servers",
            "info",
            "item",
            "eventNames",
            "channels",
        }
        return bool(top_level_keys & api_markers)
    return isinstance(payload, list)


def is_consumable_yaml(payload: Any) -> bool:
    if not isinstance(payload, dict):
        return False
    top_level_keys = set(payload.keys())
    yaml_markers = {"openapi", "swagger", "asyncapi", "paths", "components", "channels", "info"}
    return bool(top_level_keys & yaml_markers)


def fetch_and_validate(session: requests.Session, row: dict[str, str], line_number: int) -> ValidationResult:
    url = (row.get("integration_api_url") or "").strip()
    vendor_name = (row.get("vendor_name") or "").strip()
    product_name = (row.get("product_name") or "").strip()

    if not url:
        return ValidationResult(line_number, vendor_name, product_name, url, "", "", False, "blank integration_api_url", "")

    try:
        response = session.get(url, timeout=REQUEST_TIMEOUT, allow_redirects=True, stream=True)
        response.raise_for_status()
    except requests.RequestException as exc:
        return ValidationResult(line_number, vendor_name, product_name, url, "", "", False, f"request failed: {exc}", "")

    try:
        body = response.content
    finally:
        response.close()

    final_url = response.url
    content_type = response.headers.get("content-type", "").lower()
    extension = extension_from_url(final_url) or extension_from_url(url)

    if "text/html" in content_type and not extension:
        return ValidationResult(line_number, vendor_name, product_name, url, final_url, content_type, False, "resolved to HTML, not a machine-consumable spec artifact", "html")

    text = body.decode("utf-8", errors="replace")

    if extension == ".json" or "json" in content_type or text.lstrip().startswith(("{", "[")):
        try:
            payload = json.loads(text)
        except json.JSONDecodeError as exc:
            return ValidationResult(line_number, vendor_name, product_name, url, final_url, content_type, False, f"json parse failed: {exc}", "json")
        if not is_consumable_json(payload):
            return ValidationResult(line_number, vendor_name, product_name, url, final_url, content_type, False, "json resolved but does not look like an API spec or collection", "json")
        return ValidationResult(line_number, vendor_name, product_name, url, final_url, content_type, True, "ok", "json")

    if extension in {".yaml", ".yml"} or "yaml" in content_type or "yml" in content_type or looks_like_yaml(text):
        try:
            payload = yaml.safe_load(text)
        except yaml.YAMLError as exc:
            return ValidationResult(line_number, vendor_name, product_name, url, final_url, content_type, False, f"yaml parse failed: {exc}", "yaml")
        if not is_consumable_yaml(payload):
            return ValidationResult(line_number, vendor_name, product_name, url, final_url, content_type, False, "yaml resolved but does not look like an API spec", "yaml")
        return ValidationResult(line_number, vendor_name, product_name, url, final_url, content_type, True, "ok", "yaml")

    return ValidationResult(line_number, vendor_name, product_name, url, final_url, content_type, False, "response is not JSON/YAML or another recognized machine-consumable spec format", "unknown")


def write_rows(csv_path: Path, fieldnames: list[str], rows: list[dict[str, str]]) -> None:
    with csv_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def build_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Validate integration_api_url values and optionally hide rows whose spec URLs are not machine-consumable.")
    parser.add_argument("--csv-path", default="data/integrations.csv", help="Path to the canonical integrations CSV.")
    parser.add_argument("--all-rows", action="store_true", help="Validate all rows instead of only rows currently marked visible.")
    parser.add_argument("--limit", type=int, default=0, help="Limit the number of rows validated. Useful for a quick smoke test.")
    parser.add_argument("--apply", action="store_true", help="Write failing rows back to the CSV with is_visible=FALSE.")
    return parser


def main() -> int:
    repo_root = Path(__file__).resolve().parents[1]
    parser = build_argument_parser()
    args = parser.parse_args()

    csv_path = Path(args.csv_path)
    if not csv_path.is_absolute():
        csv_path = repo_root / csv_path

    rows, fieldnames = load_rows(csv_path)
    selected: list[tuple[int, dict[str, str]]] = []
    for index, row in enumerate(rows, start=2):
        if not args.all_rows and not normalize_bool(row.get("is_visible", "")):
            continue
        selected.append((index, row))

    if args.limit > 0:
        selected = selected[: args.limit]

    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT, "Accept": "application/json, application/yaml, text/yaml, text/plain;q=0.9, */*;q=0.1"})

    results: list[ValidationResult] = []
    for line_number, row in selected:
        result = fetch_and_validate(session, row, line_number)
        results.append(result)
        status = "OK" if result.ok else "FAIL"
        print(f"[{status}] line={result.line_number} vendor={result.vendor_name} product={result.product_name} format={result.resolved_format or '-'} reason={result.reason}")

    failures = [result for result in results if not result.ok]
    print(f"Validated {len(results)} row(s); failures={len(failures)}")

    if args.apply and failures:
        failed_lines = {result.line_number for result in failures}
        changed = 0
        for line_number, row in enumerate(rows, start=2):
            if line_number not in failed_lines:
                continue
            if row.get("is_visible", "").strip().upper() != "FALSE":
                row["is_visible"] = "FALSE"
                changed += 1
        write_rows(csv_path, fieldnames, rows)
        print(f"Updated {changed} row(s) in {csv_path} with is_visible=FALSE")

    return 1 if failures and not args.apply else 0


if __name__ == "__main__":
    raise SystemExit(main())