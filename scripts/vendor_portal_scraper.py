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
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials

TEMPLATE_HEADERS = [
    "industry_slug",
    "industry_name",
    "industry_description",
    "industry_sort_order",
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


def path_matches_any(value: str, patterns: list[str]) -> bool:
    lowered = value.lower()
    return any(pattern.lower() in lowered for pattern in patterns)


def is_spec_artifact_url(url: str) -> bool:
    lowered_url = url.lower()
    return any(lowered_url.endswith(ext) for ext in [".yaml", ".yml", ".json"])


def extract_configured_spec_urls(soup: BeautifulSoup, base_url: str) -> list[str]:
    candidates: list[str] = []
    for attribute_name in ["data-openapi-url", "data-asyncapi-url"]:
        for node in soup.select(f"[{attribute_name}]"):
            raw_value = normalize_space(node.get(attribute_name, ""))
            if not raw_value:
                continue
            candidates.append(urljoin(base_url, raw_value))
    return clean_text_list(candidates)


def extract_text_spec_urls(text: str, base_url: str) -> list[str]:
    candidates: list[str] = []
    for match in re.finditer(r"\[[^\]]+\]\(([^)]+\.(?:json|ya?ml))\)", text, flags=re.IGNORECASE):
        candidates.append(urljoin(base_url, match.group(1)))
    for match in re.finditer(r"((?:https?://|/|\.\.?/)[^\s'\"<>()]+\.(?:json|ya?ml))", text, flags=re.IGNORECASE):
        candidates.append(urljoin(base_url, match.group(1)))
    return clean_text_list(candidates)


def derive_follow_up_spec_pages(selected_url: str) -> list[str]:
    candidates: list[str] = []
    if selected_url.endswith("/overview.html"):
        candidates.append(selected_url[: -len("/overview.html")] + "/api-reference.html")
    if selected_url.endswith("-overview.html"):
        candidates.append(selected_url[: -len("-overview.html")] + "-api.html")
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

        row = {
            "industry_slug": industry["slug"],
            "industry_name": industry["name"],
            "industry_description": industry["description"],
            "industry_sort_order": str(industry["sort_order"]),
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
            "is_visible": str(self.row_defaults.get("is_visible", True)).upper(),
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
        integration_api_url = entry.url
        integration_type = infer_integration_type_from_sample(
            f"{product_name} {product_summary} {integration_api_url}",
            self.row_defaults.get("integration_type", "REST API"),
        )
        vendor_summary = self.infer_vendor_summary(vendor, source_product_line_name, product_summary)
        internal_notes = self.build_internal_notes(entry.url, integration_api_url, [], source_product_line_slug, source_product_line_name)
        product_family = self.infer_product_family(product_name, integration_type, source_product_line_name)

        return {
            "industry_slug": industry["slug"],
            "industry_name": industry["name"],
            "industry_description": industry["description"],
            "industry_sort_order": str(industry["sort_order"]),
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
            "is_visible": str(self.row_defaults.get("is_visible", True)).upper(),
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

    def resolve_spec_artifact_url(self, selected_url: str) -> str:
        if is_spec_artifact_url(selected_url):
            return selected_url

        def collect_artifact_candidates(page_url: str) -> dict[str, int]:
            try:
                response = self.session.get(page_url, timeout=self.timeout_seconds)
                response.raise_for_status()
                if response.encoding:
                    response.encoding = response.apparent_encoding or response.encoding
                response_text = response.text
                if self.sleep_seconds > 0:
                    time.sleep(self.sleep_seconds)
                soup = BeautifulSoup(response_text, "lxml")
            except Exception:
                return {}

            candidates: dict[str, int] = {}
            for configured_url in extract_configured_spec_urls(soup, page_url):
                if not self.is_allowed_url(configured_url):
                    continue
                if not is_spec_artifact_url(configured_url):
                    continue
                candidates[configured_url] = max(220, candidates.get(configured_url, -10_000))

            for text_url in extract_text_spec_urls(response_text, page_url):
                if not self.is_allowed_url(text_url):
                    continue
                if not is_spec_artifact_url(text_url):
                    continue
                candidates[text_url] = max(210, candidates.get(text_url, -10_000))

            for anchor in soup.select("a[href]"):
                href = urljoin(page_url, anchor.get("href", ""))
                if not self.is_allowed_url(href):
                    continue
                if not is_spec_artifact_url(href):
                    continue
                text = normalize_space(anchor.get_text(" ", strip=True))
                score = self.score_api_candidate(href, page_url, text) + 100
                candidates[href] = max(score, candidates.get(href, -10_000))
            return candidates

        artifact_candidates = collect_artifact_candidates(selected_url)

        if not artifact_candidates:
            try:
                selected_soup = self.fetch_soup(selected_url)
            except Exception:
                selected_soup = None

            preferred_follow_up_pages = derive_follow_up_spec_pages(selected_url)
            if selected_soup is not None:
                for node in selected_soup.select("link[rel='next'][href]"):
                    preferred_follow_up_pages.append(urljoin(selected_url, node.get("href", "")))

            for follow_up_page in clean_text_list(preferred_follow_up_pages):
                if not self.is_allowed_url(follow_up_page):
                    continue
                if follow_up_page == selected_url:
                    continue
                artifact_candidates = collect_artifact_candidates(follow_up_page)
                if artifact_candidates:
                    break

            if not artifact_candidates and selected_soup is not None:
                anchor_follow_up_pages: list[str] = []
                for anchor in selected_soup.select("a[href]"):
                    href = urljoin(selected_url, anchor.get("href", ""))
                    text = normalize_space(anchor.get_text(" ", strip=True))
                    if self.score_api_candidate(href, selected_url, text) >= 60:
                        anchor_follow_up_pages.append(href)

                for follow_up_page in clean_text_list(anchor_follow_up_pages):
                    if not self.is_allowed_url(follow_up_page):
                        continue
                    if follow_up_page == selected_url:
                        continue
                    artifact_candidates = collect_artifact_candidates(follow_up_page)
                    if artifact_candidates:
                        break

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


def should_replace_existing_row(row: dict[str, str], rows: list[dict[str, str]]) -> bool:
    vendor_slugs = {candidate["vendor_slug"] for candidate in rows}
    if row.get("vendor_slug", "") in vendor_slugs:
        return True

    incoming_source_keys = {
        extract_internal_note_value(candidate.get("internal_notes", ""), "source_key")
        for candidate in rows
        if extract_internal_note_value(candidate.get("internal_notes", ""), "source_key")
    }
    existing_source_key = extract_internal_note_value(row.get("internal_notes", ""), "source_key")
    if existing_source_key and existing_source_key in incoming_source_keys:
        return True

    incoming_domains = {
        urlparse(extract_internal_note_value(candidate.get("internal_notes", ""), "scraped_source")).netloc.lower()
        for candidate in rows
        if extract_internal_note_value(candidate.get("internal_notes", ""), "scraped_source")
    }
    existing_source = extract_internal_note_value(row.get("internal_notes", ""), "scraped_source")
    existing_domain = urlparse(existing_source).netloc.lower() if existing_source else ""
    return bool(existing_domain and existing_domain in incoming_domains)


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
        existing_rows = [row for row in existing_rows if not should_replace_existing_row(row, rows)]

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
    return parser


def main() -> int:
    load_dotenv(Path(__file__).resolve().parents[1] / ".env.scraper")
    load_dotenv()
    parser = build_argument_parser()
    args = parser.parse_args()

    config_path = Path(args.config)
    config = load_config(config_path)
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