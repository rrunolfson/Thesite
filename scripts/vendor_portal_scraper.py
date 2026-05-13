from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse, urlunparse

import gspread
import requests
import yaml
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials

TEMPLATE_HEADERS = [
    "industry_slug",
    "industry_name",
    "industry_description",
    "industry_sort_order",
    "industry_function_slug",
    "industry_function_name",
    "industry_function_description",
    "industry_function_sort_order",
    "vendor_slug",
    "vendor_name",
    "vendor_logo_url",
    "vendor_logo_asset",
    "vendor_summary",
    "vendor_sort_order",
    "product_slug",
    "product_name",
    "product_family",
    "integration_status",
    "integration_type",
    "integration_api_url",
    "product_summary",
    "product_sort_order",
    "is_visible",
    "internal_notes",
]

SHEETS_SCOPE = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]
DEFAULT_SPEC_ARTIFACT_POLICY = {
    "exact_artifact_extensions": [".json", ".yaml", ".yml"],
    "endpoint_hint_patterns": ["openapi", "swagger", "asyncapi", "api-docs", "api_docs", "schema", "spec"],
    "query_hint_patterns": [
        "format=json",
        "format=yaml",
        "format=yml",
        "spec=json",
        "spec=yaml",
        "spec=yml",
        "download=json",
        "download=yaml",
        "download=yml",
    ],
    "json_markers": ["openapi", "swagger", "asyncapi", "paths", "components", "channels", "info", "item", "servers", "eventNames"],
    "yaml_markers": ["openapi", "swagger", "asyncapi", "paths", "components", "channels", "info"],
    "yaml_text_markers": ["openapi:", "swagger:", "asyncapi:", "paths:", "channels:", "components:", "info:"],
}
SPEC_ARTIFACT_POLICY_PATH = Path(__file__).resolve().parents[1] / "data" / "spec-artifact-policy.json"
FOLLOW_UP_URL_RE = re.compile(r"(?:https?://|/|\.\.?/)[^\s\"'<>]+", re.IGNORECASE)
FOLLOW_UP_KEYWORD_RE = re.compile(
    r"(developer|developers|devportal|docs|documentation|api|apis|swagger|openapi|reference|sdk|portal|integration|integrations|connected|iot|device|asset|fleet|monitor|telemetry|payment|pos|terminal|inventory|hardware|schema|spec)",
    re.IGNORECASE,
)
EXTERNAL_DISCOVERY_DOMAINS = {
    "documenter.getpostman.com",
    "go.postman.co",
    "postman.com",
    "www.postman.com",
}
PLATFORM_SPEC_ATTRIBUTE_NAMES = [
    "data-openapi-url",
    "data-asyncapi-url",
    "data-spec-url",
    "data-schema-url",
    "spec-url",
    "schema-url",
    "data-url",
    "data-definition-url",
    "data-config-url",
    "data-swagger-url",
    "data-oas-url",
    "data-api-description-url",
]
PLATFORM_SPEC_REGEXES = [
    r"Redoc\.init\(\s*['\"]([^'\"]+)['\"]",
    r"(?:specUrl|spec-url|schemaUrl|schema-url|definitionUrl|configUrl|apiDescriptionUrl|swaggerUrl|openapiUrl|oasUrl)\s*[:=]\s*['\"]([^'\"]+)['\"]",
    r"urls\s*:\s*\[(?:.|\n|\r){0,800}?url\s*:\s*['\"]([^'\"]+)['\"]",
    r"['\"]((?:https?://|/|\.\.?/)[^'\"\s<>]*(?:openapi|swagger|asyncapi|api-docs|api/docs|schema|spec)[^'\"\s<>]*)['\"]",
    r"['\"](https?://(?:www\.)?postman\.com/[^'\"\s<>]+)['\"]",
    r"['\"](https?://documenter\.getpostman\.com/[^'\"\s<>]+)['\"]",
]


def load_spec_artifact_policy() -> dict[str, Any]:
    if not SPEC_ARTIFACT_POLICY_PATH.exists():
        return dict(DEFAULT_SPEC_ARTIFACT_POLICY)
    try:
        with SPEC_ARTIFACT_POLICY_PATH.open("r", encoding="utf-8") as handle:
            raw_policy = json.load(handle)
    except Exception:
        return dict(DEFAULT_SPEC_ARTIFACT_POLICY)

    policy = dict(DEFAULT_SPEC_ARTIFACT_POLICY)
    for key in policy:
        value = raw_policy.get(key)
        if isinstance(value, list):
            policy[key] = [str(item).strip() for item in value if str(item).strip()]
    return policy


SPEC_ARTIFACT_POLICY = load_spec_artifact_policy()


@dataclass
class CatalogEntry:
    url: str
    title: str
    summary: str


def infer_integration_type_from_sample(sample: str, default_type: str) -> str:
    lowered_sample = sample.lower()
    if "graphql" in lowered_sample:
        return "GraphQL API"
    if "mqtt" in lowered_sample:
        return "MQTT API"
    if "grpc" in lowered_sample or ".proto" in lowered_sample:
        return "gRPC API"
    if "sdk" in lowered_sample:
        return "SDK"
    if any(token in lowered_sample for token in ["swagger", "openapi", ".yaml", ".json"]):
        return "OpenAPI"
    return default_type


@dataclass
class VendorIdentity:
    slug: str
    name: str
    summary: str
    sort_order: int


def load_config(config_path: Path) -> dict[str, Any]:
    with config_path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def slugify(value: str) -> str:
    lowered = normalize_space(value).lower()
    lowered = re.sub(r"[^a-z0-9]+", "-", lowered)
    lowered = re.sub(r"-{2,}", "-", lowered)
    return lowered.strip("-") or "unknown"


def title_case_slug(value: str) -> str:
    return " ".join(part.capitalize() for part in value.split("-") if part)


def spec_extension(url: str) -> str:
    lowered_path = urlparse(url).path.lower()
    for extension in SPEC_ARTIFACT_POLICY["exact_artifact_extensions"]:
        if lowered_path.endswith(extension):
            return extension
    return ""


def path_matches_any(value: str, patterns: list[str]) -> bool:
    lowered = value.lower()
    return any(pattern.lower() in lowered for pattern in patterns)


def is_spec_artifact_url(url: str) -> bool:
    return bool(spec_extension(url))


def looks_like_spec_endpoint_url(url: str) -> bool:
    lowered = url.lower()
    return any(pattern in lowered for pattern in SPEC_ARTIFACT_POLICY["endpoint_hint_patterns"]) or any(
        pattern in lowered for pattern in SPEC_ARTIFACT_POLICY["query_hint_patterns"]
    )


def looks_like_yaml_document(text: str) -> bool:
    stripped = text.lstrip("\ufeff \t\r\n")
    if not stripped:
        return False
    markers = SPEC_ARTIFACT_POLICY["yaml_text_markers"]
    return any(marker in stripped[:2000] for marker in markers)


def is_consumable_json_document(payload: Any) -> bool:
    if isinstance(payload, dict):
        return bool(set(payload.keys()) & set(SPEC_ARTIFACT_POLICY["json_markers"]))
    return isinstance(payload, list)


def is_consumable_yaml_document(payload: Any) -> bool:
    if not isinstance(payload, dict):
        return False
    return bool(set(payload.keys()) & set(SPEC_ARTIFACT_POLICY["yaml_markers"]))


def extract_configured_spec_urls(soup: BeautifulSoup, base_url: str) -> list[str]:
    candidates: list[str] = []
    for attribute_name in PLATFORM_SPEC_ATTRIBUTE_NAMES:
        for node in soup.select(f"[{attribute_name}]"):
            raw_value = normalize_space(node.get(attribute_name, ""))
            if not raw_value:
                continue
            candidates.append(urlunparse(urlparse(urljoin(base_url, raw_value))._replace(fragment="")))
    return clean_text_list(candidates)


def extract_text_spec_urls(text: str, base_url: str) -> list[str]:
    candidates: list[str] = []
    for match in re.finditer(r"\[[^\]]+\]\(([^)]+\.(?:json|ya?ml))\)", text, flags=re.IGNORECASE):
        candidates.append(urlunparse(urlparse(urljoin(base_url, match.group(1)))._replace(fragment="")))
    for match in re.finditer(r"((?:https?://|/|\.\.?/)[^\s'\"<>()]+\.(?:json|ya?ml))", text, flags=re.IGNORECASE):
        candidates.append(urlunparse(urlparse(urljoin(base_url, match.group(1)))._replace(fragment="")))
    return clean_text_list(candidates)


def derive_follow_up_spec_pages(selected_url: str) -> list[str]:
    candidates: list[str] = []
    if selected_url.endswith("/overview.html"):
        candidates.append(selected_url[: -len("/overview.html")] + "/api-reference.html")
    if selected_url.endswith("-overview.html"):
        candidates.append(selected_url[: -len("-overview.html")] + "-api.html")
    return clean_text_list(candidates)


def derive_neighboring_spec_urls(selected_url: str) -> list[str]:
    candidates: list[str] = []
    parsed = urlparse(selected_url)
    path = parsed.path or ""

    if path.endswith(".html"):
        for extension in SPEC_ARTIFACT_POLICY["exact_artifact_extensions"]:
            candidates.append(urlunparse((parsed.scheme, parsed.netloc, path[: -len(".html")] + extension, parsed.params, parsed.query, "")))

        basename = path.rsplit("/", 1)[-1]
        dirname = path[: -len(basename)] if basename else path
        for source_token in ["api-docs", "api_docs", "reference", "redoc"]:
            if source_token not in basename.lower():
                continue
            for replacement_token in ["openapi", "swagger", "spec"]:
                if replacement_token == source_token:
                    continue
                for extension in SPEC_ARTIFACT_POLICY["exact_artifact_extensions"]:
                    replacement_name = re.sub(source_token, replacement_token, basename, flags=re.IGNORECASE)
                    if replacement_name.lower().endswith(".html"):
                        replacement_name = replacement_name[: -len(".html")] + extension
                    candidates.append(urlunparse((parsed.scheme, parsed.netloc, dirname + replacement_name, parsed.params, parsed.query, "")))

    base_paths = [
        "/openapi.json",
        "/openapi.yaml",
        "/openapi.yml",
        "/swagger.json",
        "/swagger.yaml",
        "/swagger.yml",
        "/api-docs",
        "/api/docs",
    ]
    for candidate_path in base_paths:
        candidates.append(urlunparse((parsed.scheme, parsed.netloc, candidate_path, "", "", "")))

    return clean_text_list(candidates)


def clean_text_list(values: list[str]) -> list[str]:
    seen: set[str] = set()
    cleaned: list[str] = []
    for value in values:
        item = normalize_space(value)
        if not item:
            continue
        key = item.lower()
        if key in seen:
            continue
        seen.add(key)
        cleaned.append(item)
    return cleaned


def iter_string_values(payload: Any) -> list[str]:
    values: list[str] = []
    stack: list[Any] = [payload]
    while stack:
        current = stack.pop()
        if isinstance(current, dict):
            stack.extend(current.values())
            continue
        if isinstance(current, list):
            stack.extend(current)
            continue
        if isinstance(current, str):
            values.append(current)
    return values


def extract_platform_specific_spec_urls(soup: BeautifulSoup, text: str, base_url: str) -> list[str]:
    candidates: list[str] = []
    candidates.extend(extract_configured_spec_urls(soup, base_url))

    for pattern in PLATFORM_SPEC_REGEXES:
        for match in re.finditer(pattern, text, flags=re.IGNORECASE):
            candidates.append(urlunparse(urlparse(urljoin(base_url, match.group(1)))._replace(fragment="")))

    for script in soup.select("script[type='application/json'], script[type='application/ld+json']"):
        script_text = script.string or script.get_text(" ", strip=True)
        if not script_text:
            continue
        try:
            payload = json.loads(script_text)
        except Exception:
            continue
        for value in iter_string_values(payload):
            normalized_value = normalize_space(value)
            if not normalized_value:
                continue
            if re.search(r"(?:openapi|swagger|asyncapi|api-docs|api/docs|schema|spec|postman)", normalized_value, flags=re.IGNORECASE):
                candidates.append(urlunparse(urlparse(urljoin(base_url, normalized_value))._replace(fragment="")))

    return clean_text_list(candidates)


def load_manual_postman_collection_candidate_urls(collection_paths: list[Path]) -> list[str]:
    candidate_urls: list[str] = []
    for path in collection_paths:
        if not path.exists() or not path.is_file():
            continue
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        for value in iter_string_values(payload):
            normalized_value = normalize_space(value)
            if not normalized_value.lower().startswith(("http://", "https://")):
                continue
            if re.search(r"(?:openapi|swagger|asyncapi|api-docs|api/docs|schema|spec|postman|collection)", normalized_value, flags=re.IGNORECASE):
                candidate_urls.append(urlunparse(urlparse(normalized_value)._replace(fragment="")))
    return clean_text_list(candidate_urls)


def is_generic_product_text(value: str) -> bool:
    lowered = normalize_space(value).lower()
    return lowered in {
        "overview",
        "home",
        "introduction",
        "getting started",
        "you already have access to this api",
        "you already have access to this api via developer dashboard",
    }


def row_has_spec_artifact(row: dict[str, str]) -> bool:
    return is_spec_artifact_url(row.get("integration_api_url", ""))


def row_has_usable_spec_artifact(row: dict[str, str], unusable_patterns: list[str] | None = None) -> bool:
    api_url = normalize_space(row.get("integration_api_url", ""))
    if not is_spec_artifact_url(api_url):
        return False
    patterns = unusable_patterns or []
    if patterns and path_matches_any(api_url, patterns):
        return False
    return True


def is_tooling_without_spec(row: dict[str, str]) -> bool:
    if row_has_spec_artifact(row):
        return False
    sample = " ".join(
        [
            row.get("product_name", ""),
            row.get("product_summary", ""),
            row.get("integration_type", ""),
            extract_internal_note_value(row.get("internal_notes", ""), "source_product_line_name"),
            extract_internal_note_value(row.get("internal_notes", ""), "tags"),
        ]
    ).lower()
    tooling_patterns = [
        r"\bcli\b",
        r"\bsdk\b",
        r"\blibrary\b",
        r"\btoolkit\b",
        r"\btool\b",
        r"\bconnector\b",
        r"\bchrome extension\b",
        r"\bnode-red\b",
        r"\bopen source\b",
        r"\bdemo application\b",
        r"\bconnectivity tools\b",
    ]
    return any(re.search(pattern, sample) for pattern in tooling_patterns)


def should_purge_row(row: dict[str, str], config: dict[str, Any]) -> bool:
    purge_rules = config.get("purge_rules", {})
    unusable_patterns = purge_rules.get("unusable_spec_url_patterns", [])

    if is_tooling_without_spec(row):
        return True
    if purge_rules.get("drop_without_spec", False) and not row_has_usable_spec_artifact(row, unusable_patterns):
        return True
    if purge_rules.get("drop_unusable_spec_urls", False) and not row_has_usable_spec_artifact(row, unusable_patterns):
        return True
    return False


class VendorPortalScraper:
    def __init__(self, config: dict[str, Any]) -> None:
        self.config = config
        self.catalog_rules = config.get("catalog_rules", {})
        self.entry_rules = config.get("entry_rules", {})
        self.field_mapping = config.get("field_mapping", {})
        self.row_defaults = config.get("row_defaults", {})
        self.allowed_domains = set(config.get("allowed_domains", []))
        self.discovery_domains = {domain.lower() for domain in self.allowed_domains}
        self.discovery_domains.update(domain.lower() for domain in config.get("artifact_allowed_domains", []))
        self.discovery_domains.update(EXTERNAL_DISCOVERY_DOMAINS)
        self.sleep_seconds = float(config.get("sleep_seconds", 0.0))
        self.timeout_seconds = int(config.get("timeout_seconds", 30))
        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": (
                    "LastMileVendorPortalScraper/1.0 "
                    "(+https://lastmileinc.ai)"
                )
            }
        )
        self.vendor_sort_order_cache: dict[str, int] = {}
        self.page_cache: dict[str, tuple[BeautifulSoup, str] | None] = {}
        self.valid_spec_cache: dict[str, bool] = {}
        self.max_spec_search_depth = int(config.get("spec_search_depth", 5))
        self.max_spec_search_pages = int(config.get("spec_search_pages", 60))
        self.manual_postman_candidate_urls = load_manual_postman_collection_candidate_urls(self.manual_postman_collection_paths())

    def manual_postman_collection_paths(self) -> list[Path]:
        configured_paths = list(self.config.get("postman_collection_files", []))
        env_paths = [item.strip() for item in os.getenv("POSTMAN_COLLECTION_FILES", "").split(",") if item.strip()]
        collection_paths: list[Path] = []
        for raw_value in configured_paths + env_paths:
            path = Path(str(raw_value)).expanduser()
            if not path.is_absolute():
                path = (Path(__file__).resolve().parents[1] / path).resolve()
            collection_paths.append(path)
        return collection_paths

    def seeded_catalog_entries(self) -> list[CatalogEntry]:
        configured_entries = self.config.get("catalog_seed_entries", [])
        seeded_entries: list[CatalogEntry] = []
        for entry in configured_entries:
            if not isinstance(entry, dict):
                continue
            url = self._strip_fragment(normalize_space(str(entry.get("url", ""))))
            title = normalize_space(str(entry.get("title", "")))
            summary = normalize_space(str(entry.get("summary", "")))
            if not url or not title:
                continue
            if not self.is_allowed_url(url):
                continue
            seeded_entries.append(CatalogEntry(url=url, title=title, summary=summary))
        return seeded_entries

    def source_key(self) -> str:
        return slugify(self.config.get("source_key") or self.config.get("name", "vendor-portal"))

    def fetch_soup(self, url: str) -> BeautifulSoup:
        response = self.session.get(url, timeout=self.timeout_seconds)
        response.raise_for_status()
        if response.encoding:
            response.encoding = response.apparent_encoding or response.encoding
        if self.sleep_seconds > 0:
            time.sleep(self.sleep_seconds)
        return BeautifulSoup(response.text, "lxml")

    def is_allowed_url(self, url: str) -> bool:
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"}:
            return False
        if not self.allowed_domains:
            return True
        return parsed.netloc.lower() in {domain.lower() for domain in self.allowed_domains}

    def is_allowed_discovery_url(self, url: str) -> bool:
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"}:
            return False
        if not self.discovery_domains:
            return True
        return parsed.netloc.lower() in self.discovery_domains

    def discover_catalog_entries(self, catalog_url: str) -> list[CatalogEntry]:
        soup = self.fetch_soup(catalog_url)
        entries: dict[str, CatalogEntry] = {}
        catalog_base = self._strip_fragment(catalog_url)

        include_patterns = self.catalog_rules.get("entry_include_url_patterns", [])
        exclude_patterns = self.catalog_rules.get("entry_exclude_url_patterns", [])
        text_patterns = [pattern.lower() for pattern in self.catalog_rules.get("entry_text_patterns", [])]

        for anchor in soup.select("a[href]"):
            href = self._strip_fragment(urljoin(catalog_url, anchor.get("href", "")))
            text = normalize_space(anchor.get_text(" ", strip=True))
            if not href or not text:
                continue
            if href == catalog_base:
                continue
            if not self.is_allowed_url(href):
                continue
            if exclude_patterns and path_matches_any(href, exclude_patterns):
                continue
            looks_like_entry = False
            score = 0
            if include_patterns and path_matches_any(href, include_patterns):
                score += 3
            if re.search(r"\b(api|sdk|graphql|mqtt|grpc|openapi|swagger|rest)\b", text, re.IGNORECASE):
                looks_like_entry = True
                score += 2
            if text_patterns and any(pattern in text.lower() for pattern in text_patterns):
                looks_like_entry = True
                score += 2
            if len(text.split()) > 30:
                score -= 2
            if not looks_like_entry or score <= 0:
                continue
            summary = self._extract_anchor_summary(anchor)
            existing = entries.get(href)
            if existing is None or len(text) < len(existing.title):
                entries[href] = CatalogEntry(url=href, title=text, summary=summary)

        return list(entries.values())

    def _extract_anchor_summary(self, anchor: Any) -> str:
        parent_text = normalize_space(anchor.parent.get_text(" ", strip=True)) if anchor.parent else ""
        anchor_text = normalize_space(anchor.get_text(" ", strip=True))
        if parent_text and parent_text != anchor_text:
            summary = parent_text.replace(anchor_text, "", 1).strip(" -:\n")
            return normalize_space(summary)
        return ""

    def scrape_entry(self, entry: CatalogEntry, product_sort_order: int) -> dict[str, str]:
        if self.config.get("seed_entries_skip_fetch", False):
            return self.build_seeded_row(entry, product_sort_order)

        try:
            soup = self.fetch_soup(entry.url)
        except Exception:
            if not self.config.get("allow_seed_entry_fallback_on_fetch_error", False):
                raise
            return self.build_seeded_row(entry, product_sort_order)

        page_title = self.extract_page_title(soup) or entry.title
        product_summary = self.extract_page_summary(soup) or entry.summary or page_title
        tag_slugs = self.extract_tag_slugs(soup)
        source_product_line_slug = self.infer_source_product_line_slug(entry.url)
        source_product_line_name = self.infer_source_product_line_name(source_product_line_slug)
        vendor = self.infer_vendor_identity(source_product_line_slug)
        industry = self.infer_industry(tag_slugs, source_product_line_slug)
        integration_api_url = self.select_integration_api_url(entry.url, soup)
        integration_type = self.infer_integration_type(page_title, product_summary, integration_api_url)
        product_name = self.clean_product_name(page_title) or self.fallback_product_name(entry.title, source_product_line_name, integration_type)
        vendor_summary = self.infer_vendor_summary(vendor, source_product_line_name, product_summary)
        internal_notes = self.build_internal_notes(entry.url, integration_api_url, tag_slugs, source_product_line_slug, source_product_line_name)
        product_family = self.infer_product_family(page_title, integration_type, source_product_line_name)
        is_visible = bool(integration_api_url) and bool(self.row_defaults.get("is_visible", True))

        row = {
            "industry_slug": industry["slug"],
            "industry_name": industry["name"],
            "industry_description": industry["description"],
            "industry_sort_order": str(industry["sort_order"]),
            "industry_function_slug": self.row_defaults.get("industry_function_slug", ""),
            "industry_function_name": self.row_defaults.get("industry_function_name", ""),
            "industry_function_description": self.row_defaults.get("industry_function_description", ""),
            "industry_function_sort_order": str(self.row_defaults.get("industry_function_sort_order", "")),
            "vendor_slug": vendor.slug,
            "vendor_name": vendor.name,
            "vendor_logo_url": self.row_defaults.get("vendor_logo_url", ""),
            "vendor_logo_asset": self.row_defaults.get("vendor_logo_asset", ""),
            "vendor_summary": vendor_summary,
            "vendor_sort_order": str(vendor.sort_order),
            "product_slug": slugify(product_name),
            "product_name": product_name,
            "product_family": product_family,
            "integration_status": self.row_defaults.get("integration_status", "built"),
            "integration_type": integration_type,
            "integration_api_url": integration_api_url,
            "product_summary": product_summary,
            "product_sort_order": str(product_sort_order),
            "is_visible": str(is_visible).upper(),
            "internal_notes": internal_notes,
        }
        return row

    def build_seeded_row(self, entry: CatalogEntry, product_sort_order: int) -> dict[str, str]:
        source_product_line_slug = self.infer_source_product_line_slug(entry.url)
        source_product_line_name = self.infer_source_product_line_name(source_product_line_slug)
        vendor = self.infer_vendor_identity(source_product_line_slug)
        industry = self.infer_industry([], source_product_line_slug)
        product_name = self.clean_product_name(entry.title) or self.fallback_product_name(entry.title, source_product_line_name, self.row_defaults.get("integration_type", "REST API"))
        product_summary = entry.summary or product_name
        integration_api_url = self.resolve_spec_artifact_url(entry.url)
        integration_type = infer_integration_type_from_sample(
            f"{product_name} {product_summary} {integration_api_url}",
            self.row_defaults.get("integration_type", "REST API"),
        )
        vendor_summary = self.infer_vendor_summary(vendor, source_product_line_name, product_summary)
        internal_notes = self.build_internal_notes(entry.url, integration_api_url, [], source_product_line_slug, source_product_line_name)
        product_family = self.infer_product_family(product_name, integration_type, source_product_line_name)
        is_visible = bool(integration_api_url) and bool(self.row_defaults.get("is_visible", True))

        return {
            "industry_slug": industry["slug"],
            "industry_name": industry["name"],
            "industry_description": industry["description"],
            "industry_sort_order": str(industry["sort_order"]),
            "industry_function_slug": self.row_defaults.get("industry_function_slug", ""),
            "industry_function_name": self.row_defaults.get("industry_function_name", ""),
            "industry_function_description": self.row_defaults.get("industry_function_description", ""),
            "industry_function_sort_order": str(self.row_defaults.get("industry_function_sort_order", "")),
            "vendor_slug": vendor.slug,
            "vendor_name": vendor.name,
            "vendor_logo_url": self.row_defaults.get("vendor_logo_url", ""),
            "vendor_logo_asset": self.row_defaults.get("vendor_logo_asset", ""),
            "vendor_summary": vendor_summary,
            "vendor_sort_order": str(vendor.sort_order),
            "product_slug": slugify(product_name),
            "product_name": product_name,
            "product_family": product_family,
            "integration_status": self.row_defaults.get("integration_status", "built"),
            "integration_type": integration_type,
            "integration_api_url": integration_api_url,
            "product_summary": product_summary,
            "product_sort_order": str(product_sort_order),
            "is_visible": str(is_visible).upper(),
            "internal_notes": internal_notes,
        }

    def infer_vendor_identity(self, source_product_line_slug: str) -> VendorIdentity:
        vendor_identity = self.config.get("vendor_identity", {})
        if vendor_identity:
            slug = slugify(vendor_identity.get("slug") or self.config.get("name", "vendor"))
            name = normalize_space(vendor_identity.get("name") or title_case_slug(slug))
            summary = normalize_space(vendor_identity.get("summary", ""))
            sort_order = int(vendor_identity.get("sort_order", 10))
            return VendorIdentity(slug=slug, name=name, summary=summary, sort_order=sort_order)

        slug = source_product_line_slug
        name = self.infer_source_product_line_name(source_product_line_slug)
        return VendorIdentity(slug=slug, name=name, summary="", sort_order=self.vendor_sort_order(slug))

    def extract_page_title(self, soup: BeautifulSoup) -> str:
        generic_titles = {"overview", "home", "introduction", "getting started"}
        for selector in ["main h1", "article h1", "h1", "title"]:
            node = soup.select_one(selector)
            if node:
                candidate = normalize_space(node.get_text(" ", strip=True))
                candidate = re.sub(r"\s*-\s*developer\.siemens\.com$", "", candidate, flags=re.IGNORECASE)
                if selector != "title" and candidate.lower() in generic_titles:
                    continue
                return candidate
        return ""

    def clean_product_name(self, value: str) -> str:
        cleaned = normalize_space(value.replace("¶", "").replace("Â", ""))
        for pattern, replacement in self.entry_rules.get("product_name_cleanups", []):
            cleaned = re.sub(pattern, replacement, cleaned, flags=re.IGNORECASE)
        cleaned = normalize_space(cleaned)
        return "" if is_generic_product_text(cleaned) else cleaned

    def fallback_product_name(self, seed_title: str, vendor_name: str, integration_type: str) -> str:
        cleaned_seed = self.clean_product_name(seed_title)
        if cleaned_seed:
            matches = re.findall(
                r"([A-Z0-9][A-Za-z0-9()\- /@]*?(?:API|SDK|GraphQL|Service|Toolkit|CLI|Library|Connector|Kit))",
                cleaned_seed,
                re.IGNORECASE,
            )
            for match in matches:
                candidate = normalize_space(match)
                candidate = re.sub(r"^via\s+Developer\s+Dashboard\s+", "", candidate, flags=re.IGNORECASE)
                if vendor_name:
                    escaped_vendor_name = re.escape(vendor_name)
                    candidate = re.sub(
                        rf"^({escaped_vendor_name})\s+\1\b",
                        vendor_name,
                        candidate,
                        flags=re.IGNORECASE,
                    )
                if not is_generic_product_text(candidate):
                    return candidate
            return cleaned_seed
        if re.search(r"\b(api|sdk|graphql|service|toolkit|cli|library|connector|kit)\b", vendor_name, re.IGNORECASE):
            return vendor_name
        return f"{vendor_name} {integration_type}"

    def _strip_fragment(self, value: str) -> str:
        parsed = urlparse(value)
        return urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, parsed.query, ""))

    def extract_page_summary(self, soup: BeautifulSoup) -> str:
        candidates: list[str] = []
        for selector in ["main p", "article p", "p"]:
            for paragraph in soup.select(selector):
                text = normalize_space(paragraph.get_text(" ", strip=True))
                if len(text) < 40:
                    continue
                if any(bad in text.lower() for bad in ["cookie", "privacy", "accept all cookies", "back to top"]):
                    continue
                candidates.append(text)
            if candidates:
                break
        return candidates[0] if candidates else ""

    def extract_tag_slugs(self, soup: BeautifulSoup) -> list[str]:
        tags: list[str] = []
        for anchor in soup.select("a[href*='tags.html#tag:']"):
            href = anchor.get("href", "")
            match = re.search(r"tags\.html#tag:([^\s#]+)", href)
            if not match:
                continue
            raw_tag = match.group(1).split("/")[-1]
            tags.append(slugify(raw_tag))
        return clean_text_list(tags)

    def infer_source_product_line_slug(self, url: str) -> str:
        path_parts = [part for part in urlparse(url).path.split("/") if part]
        if not path_parts:
            return slugify(self.config.get("name", "vendor"))
        if path_parts[0].lower() in {"docs", "doc", "documentation"} and len(path_parts) > 1:
            return slugify(path_parts[1])
        return slugify(path_parts[0])

    def infer_source_product_line_name(self, source_product_line_slug: str) -> str:
        return self.field_mapping.get("path_vendor_overrides", {}).get(source_product_line_slug, title_case_slug(source_product_line_slug))

    def infer_industry(self, tag_slugs: list[str], vendor_slug: str) -> dict[str, Any]:
        tag_to_industry = self.field_mapping.get("tag_to_industry", {})
        industry_definitions = self.field_mapping.get("industry_definitions", {})
        for tag_slug in tag_slugs + [vendor_slug]:
            industry_slug = tag_to_industry.get(tag_slug)
            if industry_slug and industry_slug in industry_definitions:
                return industry_definitions[industry_slug]
        default_slug = self.row_defaults.get("industry_slug", "manufacturing")
        return {
            "slug": default_slug,
            "name": self.row_defaults.get("industry_name", title_case_slug(default_slug)),
            "description": self.row_defaults.get("industry_description", ""),
            "sort_order": int(self.row_defaults.get("industry_sort_order", 10)),
        }

    def vendor_sort_order(self, vendor_slug: str) -> int:
        if vendor_slug not in self.vendor_sort_order_cache:
            self.vendor_sort_order_cache[vendor_slug] = len(self.vendor_sort_order_cache) * 10 + 10
        return self.vendor_sort_order_cache[vendor_slug]

    def select_integration_api_url(self, current_url: str, soup: BeautifulSoup) -> str:
        candidates: dict[str, int] = {}
        candidates[current_url] = self.score_api_candidate(current_url, current_url, "")
        for anchor in soup.select("a[href]"):
            href = urljoin(current_url, anchor.get("href", ""))
            if not self.is_allowed_url(href):
                continue
            text = normalize_space(anchor.get_text(" ", strip=True))
            score = self.score_api_candidate(href, current_url, text)
            if score > candidates.get(href, -10_000):
                candidates[href] = score
        viable = [(url, score) for url, score in candidates.items() if score > 0]
        if not viable:
            return ""
        viable.sort(key=lambda item: (item[1], len(item[0])), reverse=True)
        best_url = viable[0][0]
        resolved_url = self.resolve_spec_artifact_url(best_url)
        return resolved_url

    def fetch_page(self, url: str) -> tuple[BeautifulSoup, str] | None:
        url = self._strip_fragment(url)
        if not self.is_allowed_discovery_url(url):
            return None
        cached = self.page_cache.get(url)
        if cached is not None or url in self.page_cache:
            return cached
        try:
            response = self.session.get(url, timeout=self.timeout_seconds)
            response.raise_for_status()
            if response.encoding:
                response.encoding = response.apparent_encoding or response.encoding
            response_text = response.text
            if self.sleep_seconds > 0:
                time.sleep(self.sleep_seconds)
            result = (BeautifulSoup(response_text, "lxml"), response_text)
            self.page_cache[url] = result
            return result
        except Exception:
            self.page_cache[url] = None
            return None

    def is_machine_readable_spec_url(self, candidate_url: str) -> bool:
        candidate_url = self._strip_fragment(candidate_url)
        cached = self.valid_spec_cache.get(candidate_url)
        if cached is not None:
            return cached
        try:
            response = self.session.get(candidate_url, timeout=self.timeout_seconds, allow_redirects=True)
            response.raise_for_status()
        except Exception:
            self.valid_spec_cache[candidate_url] = False
            return False

        try:
            body = response.text if response.encoding else response.content.decode("utf-8", errors="replace")
            content_type = response.headers.get("content-type", "").lower()
            extension = spec_extension(response.url) or spec_extension(candidate_url)

            if extension == ".json" or "json" in content_type or body.lstrip().startswith(("{", "[")):
                payload = json.loads(body)
                is_valid = is_consumable_json_document(payload)
                self.valid_spec_cache[candidate_url] = is_valid
                return is_valid

            if extension in {".yaml", ".yml"} or "yaml" in content_type or "yml" in content_type or looks_like_yaml_document(body):
                payload = yaml.safe_load(body)
                is_valid = is_consumable_yaml_document(payload)
                self.valid_spec_cache[candidate_url] = is_valid
                return is_valid
        except Exception:
            self.valid_spec_cache[candidate_url] = False
            return False

        self.valid_spec_cache[candidate_url] = False
        return False

    def extract_embedded_spec_urls(self, text: str, base_url: str) -> list[str]:
        candidates: list[str] = []
        patterns = [
            r'"((?:https?://|/|\.\.?/)[^"\s<>]+\.(?:json|ya?ml)(?:\?[^"\s<>]*)?)"',
            r"'((?:https?://|/|\.\.?/)[^'\s<>]+\.(?:json|ya?ml)(?:\?[^'\s<>]*)?)'",
            r"(?:url|spec|openapi|asyncapi)[^\n]{0,80}?((?:https?://|/|\.\.?/)[^\s'\"<>]+\.(?:json|ya?ml)(?:\?[^\s'\"<>]*)?)",
            r'"((?:https?://|/|\.\.?/)[^"\s<>]*(?:openapi|swagger|asyncapi|api/docs|schema|spec)[^"\s<>]*)"',
            r"'((?:https?://|/|\.\.?/)[^'\s<>]*(?:openapi|swagger|asyncapi|api/docs|schema|spec)[^'\s<>]*)'",
            r"(?:href|src|url)\s*[:=]\s*[\"']((?:https?://|/|\.\.?/)[^\"'\s<>]+)[\"']",
            r"(?:href|src|url)\s*[:=]\s*((?:https?://|/|\.\.?/)[^,\s<>]+)",
        ]
        for pattern in patterns:
            for match in re.finditer(pattern, text, flags=re.IGNORECASE):
                candidates.append(urlunparse(urlparse(urljoin(base_url, match.group(1)))._replace(fragment="")))
        return clean_text_list(candidates)

    def extract_follow_up_urls_from_text(self, text: str, base_url: str) -> list[str]:
        follow_up_pages: list[str] = []
        for match in FOLLOW_UP_URL_RE.finditer(text):
            raw_value = normalize_space(match.group(0).strip("'\"()[]{}"))
            if not raw_value:
                continue
            if raw_value.startswith("/*") or raw_value.startswith("//"):
                continue
            try:
                href = urlunparse(urlparse(urljoin(base_url, raw_value))._replace(fragment=""))
            except ValueError:
                continue
            if not self.is_allowed_discovery_url(href):
                continue
            if href == base_url:
                continue
            lowered_href = href.lower()
            if spec_extension(href):
                continue
            if lowered_href.endswith(("/title", "/style", "/script")):
                continue
            if FOLLOW_UP_KEYWORD_RE.search(lowered_href):
                follow_up_pages.append(href)
        return clean_text_list(follow_up_pages)

    def collect_follow_up_pages(self, page_url: str, soup: BeautifulSoup, response_text: str) -> list[str]:
        follow_up_pages: list[str] = []
        for follow_up_page in derive_follow_up_spec_pages(page_url):
            if self.is_allowed_discovery_url(follow_up_page):
                follow_up_pages.append(follow_up_page)

        for neighboring_spec_url in derive_neighboring_spec_urls(page_url):
            if self.is_allowed_discovery_url(neighboring_spec_url):
                follow_up_pages.append(neighboring_spec_url)

        for node in soup.select("link[rel='next'][href], link[rel='alternate'][href], a[href]"):
            href = self._strip_fragment(urljoin(page_url, node.get("href", "")))
            if not self.is_allowed_discovery_url(href):
                continue
            if href == page_url:
                continue
            text = normalize_space(node.get_text(" ", strip=True))
            lowered_href = href.lower()
            lowered_text = text.lower()
            if spec_extension(href):
                continue
            if self.score_api_candidate(href, page_url, text) >= 40:
                follow_up_pages.append(href)
                continue
            if re.search(r"\b(api|reference|openapi|swagger|asyncapi|postman|schema|spec|developer)\b", lowered_text):
                follow_up_pages.append(href)
                continue
            if re.search(r"(openapi|swagger|asyncapi|postman|schema|spec)", lowered_href):
                follow_up_pages.append(href)
        for text_url in self.extract_follow_up_urls_from_text(response_text, page_url):
            follow_up_pages.append(text_url)
        return clean_text_list(follow_up_pages)

    def enqueue_follow_up_pages(
        self,
        queued: list[tuple[str, int]],
        queued_urls: set[str],
        visited: set[str],
        current_url: str,
        depth: int,
        follow_up_pages: list[str],
    ) -> None:
        ranked_pages: list[tuple[int, str]] = []
        for follow_up_page in follow_up_pages:
            if follow_up_page in visited or follow_up_page in queued_urls:
                continue
            score = self.score_api_candidate(follow_up_page, current_url, "")
            if FOLLOW_UP_KEYWORD_RE.search(follow_up_page):
                score += 25
            if looks_like_spec_endpoint_url(follow_up_page) or is_spec_artifact_url(follow_up_page):
                score += 80
            ranked_pages.append((score, follow_up_page))

        ranked_pages.sort(key=lambda item: (item[0], len(item[1])), reverse=True)
        for _, follow_up_page in ranked_pages:
            queued.append((follow_up_page, depth + 1))
            queued_urls.add(follow_up_page)

    def resolve_spec_artifact_url(self, selected_url: str) -> str:
        if self.is_machine_readable_spec_url(selected_url):
            return selected_url

        artifact_candidates: dict[str, int] = {}
        queued: list[tuple[str, int]] = [(selected_url, 0)]
        queued_urls: set[str] = {selected_url}
        visited: set[str] = set()

        for candidate_url in self.manual_postman_candidate_urls:
            if not self.is_allowed_discovery_url(candidate_url):
                continue
            if not (is_spec_artifact_url(candidate_url) or looks_like_spec_endpoint_url(candidate_url)):
                continue
            score = self.score_api_candidate(candidate_url, selected_url, "postman collection") + 160
            if self.is_machine_readable_spec_url(candidate_url):
                artifact_candidates[candidate_url] = max(score, artifact_candidates.get(candidate_url, -10_000))

        while queued and len(visited) < self.max_spec_search_pages:
            page_url, depth = queued.pop(0)
            queued_urls.discard(page_url)
            if page_url in visited:
                continue
            visited.add(page_url)

            fetched_page = self.fetch_page(page_url)
            if fetched_page is None:
                continue
            soup, response_text = fetched_page

            candidate_urls: dict[str, int] = {}
            for configured_url in extract_platform_specific_spec_urls(soup, response_text, page_url):
                if self.is_allowed_discovery_url(configured_url) and (
                    is_spec_artifact_url(configured_url) or looks_like_spec_endpoint_url(configured_url)
                ):
                    candidate_urls[configured_url] = max(240 - depth * 5, candidate_urls.get(configured_url, -10_000))

            for text_url in extract_text_spec_urls(response_text, page_url):
                if self.is_allowed_discovery_url(text_url) and (
                    is_spec_artifact_url(text_url) or looks_like_spec_endpoint_url(text_url)
                ):
                    candidate_urls[text_url] = max(230 - depth * 5, candidate_urls.get(text_url, -10_000))

            for embedded_url in self.extract_embedded_spec_urls(response_text, page_url):
                if self.is_allowed_discovery_url(embedded_url) and (
                    is_spec_artifact_url(embedded_url) or looks_like_spec_endpoint_url(embedded_url)
                ):
                    candidate_urls[embedded_url] = max(220 - depth * 5, candidate_urls.get(embedded_url, -10_000))

            for neighboring_spec_url in derive_neighboring_spec_urls(page_url):
                if self.is_allowed_discovery_url(neighboring_spec_url) and (
                    is_spec_artifact_url(neighboring_spec_url) or looks_like_spec_endpoint_url(neighboring_spec_url)
                ):
                    candidate_urls[neighboring_spec_url] = max(210 - depth * 5, candidate_urls.get(neighboring_spec_url, -10_000))

            for node in soup.select("a[href], script[src], link[href]"):
                attr_name = "src" if node.has_attr("src") else "href"
                href = self._strip_fragment(urljoin(page_url, node.get(attr_name, "")))
                if not self.is_allowed_discovery_url(href):
                    continue
                if not (is_spec_artifact_url(href) or looks_like_spec_endpoint_url(href)):
                    continue
                text = normalize_space(node.get_text(" ", strip=True))
                score = self.score_api_candidate(href, page_url, text) + 100 - depth * 5
                candidate_urls[href] = max(score, candidate_urls.get(href, -10_000))

            for candidate_url, score in candidate_urls.items():
                if self.is_machine_readable_spec_url(candidate_url):
                    artifact_candidates[candidate_url] = max(score, artifact_candidates.get(candidate_url, -10_000))

            if depth >= self.max_spec_search_depth:
                continue

            self.enqueue_follow_up_pages(
                queued,
                queued_urls,
                visited,
                page_url,
                depth,
                self.collect_follow_up_pages(page_url, soup, response_text),
            )

        if not artifact_candidates:
            return ""

        ranked_artifacts = sorted(artifact_candidates.items(), key=lambda item: (item[1], len(item[0])), reverse=True)
        return ranked_artifacts[0][0]

    def score_api_candidate(self, candidate_url: str, current_url: str, text: str) -> int:
        score = 0
        lowered_url = candidate_url.lower()
        lowered_text = text.lower()
        candidate_parts = [part for part in urlparse(candidate_url).path.split("/") if part]
        current_parts = [part for part in urlparse(current_url).path.split("/") if part]

        if candidate_url == current_url:
            score += 20

        if current_parts and candidate_parts:
            shared_prefix = 0
            for current_part, candidate_part in zip(current_parts, candidate_parts):
                if current_part != candidate_part:
                    break
                shared_prefix += 1

            if shared_prefix >= max(1, min(len(current_parts), len(candidate_parts)) - 1):
                score += 80
            elif shared_prefix >= 2:
                score += 40

            current_parent = current_parts[:-1]
            candidate_parent = candidate_parts[:-1]
            if current_parent and candidate_parent == current_parent:
                score += 70

            if candidate_parts[0] != current_parts[0]:
                score -= 120

        if is_spec_artifact_url(lowered_url):
            score += 120
        if path_matches_any(lowered_url, self.entry_rules.get("api_url_preference_patterns", [])):
            score += 60
        if path_matches_any(lowered_text, self.entry_rules.get("api_url_preference_patterns", [])):
            score += 30
        if re.search(r"\b(api reference|openapi|swagger|graphql|reference|protocol documentation)\b", lowered_text):
            score += 50
        if re.search(r"\b(get|post|put|delete|patch)/", lowered_text):
            score += 30
        if re.search(r"\boas\b|\bopenapi\b", lowered_text):
            score += 40
        if path_matches_any(lowered_url, self.entry_rules.get("api_url_reject_patterns", [])):
            score -= 80
        if path_matches_any(lowered_text, self.entry_rules.get("api_url_reject_patterns", [])):
            score -= 60
        if "overview.html#" in lowered_url:
            score -= 30
        if re.search(r"/overview\.html$", lowered_url):
            score -= 10
        return score

    def infer_integration_type(self, page_title: str, summary: str, api_url: str) -> str:
        return infer_integration_type_from_sample(
            f"{page_title} {summary} {api_url}",
            self.row_defaults.get("integration_type", "REST API"),
        )

    def infer_vendor_summary(self, vendor: VendorIdentity, source_product_line_name: str, product_summary: str) -> str:
        if vendor.summary:
            return vendor.summary
        template = self.field_mapping.get("vendor_summary_template")
        if template:
            return normalize_space(
                template.format(
                    vendor_name=vendor.name,
                    product_summary=product_summary,
                    source_product_line_name=source_product_line_name,
                )
            )
        return product_summary

    def infer_product_family(self, page_title: str, integration_type: str, source_product_line_name: str) -> str:
        if self.config.get("vendor_identity") and source_product_line_name:
            return source_product_line_name
        if integration_type == "SDK":
            return "SDK"
        title = page_title.lower()
        if "asset" in title:
            return "Asset Management"
        if "security" in title:
            return "Security"
        if "energy" in title:
            return "Energy"
        if "product" in title:
            return "Product Data"
        return integration_type

    def build_internal_notes(
        self,
        source_url: str,
        api_url: str,
        tag_slugs: list[str],
        source_product_line_slug: str,
        source_product_line_name: str,
    ) -> str:
        tag_note = f"tags={','.join(tag_slugs)}" if tag_slugs else "tags="
        return (
            f"source_key={self.source_key()}; "
            f"source_product_line_slug={source_product_line_slug}; "
            f"source_product_line_name={source_product_line_name}; "
            f"scraped_source={source_url}; integration_api_url={api_url}; {tag_note}"
        )


def extract_internal_note_value(notes: str, key: str) -> str:
    match = re.search(rf"(?:^|;\s*){re.escape(key)}=([^;]*)", notes or "")
    return normalize_space(match.group(1)) if match else ""


def prefix_product_name(row: dict[str, str], prefix: str) -> dict[str, str]:
    updated = dict(row)
    product_name = normalize_space(updated.get("product_name", ""))
    prefixed_name = product_name if product_name.lower().startswith(prefix.lower()) else f"{prefix} {product_name}"
    updated["product_name"] = normalize_space(prefixed_name)
    updated["product_slug"] = slugify(updated["product_name"])
    return updated


def finalize_rows(rows: list[dict[str, str]], config: dict[str, Any]) -> list[dict[str, str]]:
    rows_by_key: dict[tuple[str, str, str], list[dict[str, str]]] = {}
    for row in rows:
        if should_purge_row(row, config):
            continue
        key = (row["industry_slug"], row["vendor_slug"], row["product_slug"])
        rows_by_key.setdefault(key, []).append(row)

    updated_rows: list[dict[str, str]] = []
    for row in rows:
        if should_purge_row(row, config):
            continue
        key = (row["industry_slug"], row["vendor_slug"], row["product_slug"])
        duplicates = rows_by_key.get(key, [])
        source_product_line_name = extract_internal_note_value(row.get("internal_notes", ""), "source_product_line_name")
        if len(duplicates) > 1 and source_product_line_name:
            updated_rows.append(prefix_product_name(row, source_product_line_name))
            continue
        updated_rows.append(dict(row))
    return updated_rows


def deduplicate_rows(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    seen: set[tuple[str, str, str]] = set()
    deduped: list[dict[str, str]] = []
    for row in rows:
        key = (row["industry_slug"], row["vendor_slug"], row["product_slug"])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(row)
    return deduped


def write_csv(rows: list[dict[str, str]], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=TEMPLATE_HEADERS)
        writer.writeheader()
        writer.writerows(rows)


def normalize_row_for_template(row: dict[str, str]) -> dict[str, str]:
    return {header: str(row.get(header, "")) for header in TEMPLATE_HEADERS}


def google_client() -> gspread.Client:
    creds_file = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "").strip()
    creds_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "").strip()
    creds_data: dict[str, Any] | None = None
    if creds_json:
        creds_data = json.loads(creds_json)
    elif creds_file:
        with open(creds_file, "r", encoding="utf-8") as handle:
            creds_data = json.load(handle)
    else:
        raise RuntimeError("Missing GOOGLE_SERVICE_ACCOUNT_FILE or GOOGLE_SERVICE_ACCOUNT_JSON for Google Sheets access.")
    credentials = Credentials.from_service_account_info(creds_data, scopes=SHEETS_SCOPE)
    return gspread.authorize(credentials)


def build_replacement_criteria(rows: list[dict[str, str]]) -> dict[str, set[str]]:
    source_keys = {
        extract_internal_note_value(candidate.get("internal_notes", ""), "source_key")
        for candidate in rows
        if extract_internal_note_value(candidate.get("internal_notes", ""), "source_key")
    }
    source_domains = {
        urlparse(extract_internal_note_value(candidate.get("internal_notes", ""), "scraped_source")).netloc.lower()
        for candidate in rows
        if extract_internal_note_value(candidate.get("internal_notes", ""), "scraped_source")
    }
    vendor_slugs = {candidate["vendor_slug"] for candidate in rows if candidate.get("vendor_slug")}
    return {
        "vendor_slugs": vendor_slugs,
        "source_keys": source_keys,
        "source_domains": source_domains,
    }


def should_replace_existing_row(row: dict[str, str], replacement_criteria: dict[str, set[str]]) -> bool:
    if row.get("vendor_slug", "") in replacement_criteria["vendor_slugs"]:
        return True

    existing_source_key = extract_internal_note_value(row.get("internal_notes", ""), "source_key")
    if existing_source_key and existing_source_key in replacement_criteria["source_keys"]:
        return True

    existing_source = extract_internal_note_value(row.get("internal_notes", ""), "scraped_source")
    existing_domain = urlparse(existing_source).netloc.lower() if existing_source else ""
    return bool(existing_domain and existing_domain in replacement_criteria["source_domains"])


def upsert_google_sheet(rows: list[dict[str, str]], spreadsheet_id: str, worksheet_title: str, replace_by_vendor: bool) -> None:
    client = google_client()
    spreadsheet = client.open_by_key(spreadsheet_id)
    try:
        worksheet = spreadsheet.worksheet(worksheet_title)
    except gspread.WorksheetNotFound:
        worksheet = spreadsheet.add_worksheet(title=worksheet_title, rows=2000, cols=len(TEMPLATE_HEADERS) + 4)

    existing_values = worksheet.get_all_values()
    headers = TEMPLATE_HEADERS
    if not existing_values:
        worksheet.update([headers])
        existing_values = [headers]

    existing_rows: list[dict[str, str]] = []
    source_headers = existing_values[0]
    for raw_row in existing_values[1:]:
        padded = raw_row + [""] * max(0, len(source_headers) - len(raw_row))
        source_row = dict(zip(source_headers, padded))
        existing_rows.append(normalize_row_for_template(source_row))

    if replace_by_vendor:
        replacement_criteria = build_replacement_criteria(rows)
        existing_rows = [row for row in existing_rows if not should_replace_existing_row(row, replacement_criteria)]

    merged_rows = [normalize_row_for_template(row) for row in existing_rows + rows]
    values = [headers] + [[row.get(header, "") for header in headers] for row in merged_rows]
    worksheet.clear()
    worksheet.update(values)


def build_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Scrape a vendor developer portal into integrations sheet rows.")
    parser.add_argument("--config", required=True, help="Path to scraper configuration JSON.")
    parser.add_argument("--catalog-url", help="Override the top-level catalog URL from config.")
    parser.add_argument("--limit", type=int, default=0, help="Optional limit on discovered entries for dry runs.")
    parser.add_argument("--output-csv", help="Write scraped rows to a CSV file.")
    parser.add_argument("--output-json", help="Write scraped rows to a JSON file.")
    parser.add_argument("--write-google-sheet", action="store_true", help="Write results to Google Sheets.")
    parser.add_argument("--spreadsheet-id", help="Google Spreadsheet ID override.")
    parser.add_argument("--worksheet", help="Worksheet title override.")
    parser.add_argument("--replace-by-vendor", action="store_true", help="Replace existing rows whose vendor_slug matches scraped rows.")
    parser.add_argument(
        "--postman-collection-file",
        action="append",
        default=[],
        help="Optional path to a manually exported Postman collection JSON file. Repeat for multiple files.",
    )
    return parser


def main() -> int:
    load_dotenv(Path(__file__).resolve().parents[1] / ".env.scraper")
    load_dotenv()
    parser = build_argument_parser()
    args = parser.parse_args()

    config_path = Path(args.config)
    config = load_config(config_path)
    if args.postman_collection_file:
        configured_files = list(config.get("postman_collection_files", []))
        configured_files.extend(args.postman_collection_file)
        config["postman_collection_files"] = configured_files
    scraper = VendorPortalScraper(config)
    catalog_url = args.catalog_url or config["catalog_url"]
    product_sort_start = int(scraper.row_defaults.get("product_sort_start", 10))
    product_sort_step = int(scraper.row_defaults.get("product_sort_step", 10))

    entries = scraper.seeded_catalog_entries()
    if not entries:
        entries = scraper.discover_catalog_entries(catalog_url)
    if args.limit > 0:
        entries = entries[: args.limit]

    rows: list[dict[str, str]] = []
    for index, entry in enumerate(entries):
        sort_order = product_sort_start + index * product_sort_step
        try:
            rows.append(scraper.scrape_entry(entry, sort_order))
        except Exception as exc:
            print(f"Warning: failed to scrape {entry.url}: {exc}", file=sys.stderr)

    rows = deduplicate_rows(rows)
    rows = finalize_rows(rows, config)
    rows = deduplicate_rows(rows)
    rows = [normalize_row_for_template(row) for row in rows]

    if args.output_csv:
        write_csv(rows, Path(args.output_csv))
    if args.output_json:
        output_path = Path(args.output_json)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")

    if args.write_google_sheet:
        spreadsheet_id = args.spreadsheet_id or os.getenv("GOOGLE_SHEET_ID") or config.get("google_sheets", {}).get("spreadsheet_id")
        worksheet_title = args.worksheet or os.getenv("GOOGLE_WORKSHEET_TITLE") or config.get("google_sheets", {}).get("worksheet_title", "Integrations")
        if not spreadsheet_id:
            raise RuntimeError("Missing spreadsheet id. Pass --spreadsheet-id or set GOOGLE_SHEET_ID.")
        upsert_google_sheet(rows, spreadsheet_id, worksheet_title, args.replace_by_vendor)

    print(f"Discovered {len(entries)} entries and produced {len(rows)} rows.")
    if rows:
        print(json.dumps(rows[: min(3, len(rows))], indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())