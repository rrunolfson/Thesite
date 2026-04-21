import argparse
import json
import re
from collections import deque
from urllib.parse import urljoin, urlparse

import requests


HEADERS = {"User-Agent": "Mozilla/5.0"}
SPEC_RE = re.compile(
    r"https?://[^\"'\s<>]+(?:openapi|swagger|api|json|ya?ml)[^\"'\s<>]*|/[^\"'\s<>]+(?:openapi|swagger|api|json|ya?ml)[^\"'\s<>]*",
    re.I,
)
HREF_RE = re.compile(r"<a[^>]+href=[\"']([^\"']+)[\"']", re.I)
KEYWORD_RE = re.compile(
    r"(developer|developers|devportal|docs|documentation|api|apis|swagger|openapi|reference|sdk|portal|integration|integrations|connected|iot|device|asset|fleet|monitor|telemetry|payment|pos|terminal|inventory|hardware)",
    re.I,
)
SKIP_EXTENSIONS = (
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".css",
    ".js",
    ".woff",
    ".woff2",
    ".ico",
    ".pdf",
    ".zip",
    ".mp4",
    ".webp",
)


def should_follow(url: str, host: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        return False
    parsed_host = parsed.netloc.replace("www.", "")
    normalized_host = host.replace("www.", "")
    if normalized_host not in parsed_host and parsed_host not in normalized_host:
        return False
    if url.lower().endswith(SKIP_EXTENSIONS):
        return False
    return True


def crawl_vendor(name: str, seeds: list[str], max_pages: int) -> dict:
    session = requests.Session()
    session.headers.update(HEADERS)

    queue = deque(seeds)
    seen: set[str] = set()
    pages = []
    specs: set[str] = set()
    errors = []

    while queue and len(seen) < max_pages:
        url = queue.popleft()
        if url in seen:
            continue
        seen.add(url)
        try:
            response = session.get(url, timeout=20, allow_redirects=True)
            final_url = response.url
            text = response.text[:250000]
            title_match = re.search(r"<title>(.*?)</title>", text, re.I | re.S)
            title = re.sub(r"\s+", " ", title_match.group(1)).strip() if title_match else ""
            pages.append(
                {
                    "requested_url": url,
                    "status": response.status_code,
                    "final_url": final_url,
                    "title": title,
                }
            )
            for match in SPEC_RE.findall(text):
                specs.add(urljoin(final_url, match))

            host = urlparse(final_url).netloc
            for href in HREF_RE.findall(text):
                href = href.strip()
                if not href or href.startswith("#") or href.startswith("mailto:") or href.startswith("javascript:"):
                    continue
                absolute = urljoin(final_url, href)
                if not should_follow(absolute, host):
                    continue
                if KEYWORD_RE.search(absolute) and absolute not in seen and absolute not in queue:
                    queue.append(absolute)
        except Exception as exc:  # noqa: BLE001
            errors.append({"url": url, "error": repr(exc)})

    return {
        "vendor": name,
        "pages": pages,
        "specs": sorted(specs),
        "errors": errors,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Deep crawl vendor sites for public API/spec candidates.")
    parser.add_argument("--input", required=True, help="Path to vendor seed JSON file.")
    parser.add_argument("--output", required=True, help="Path to write crawl result JSON.")
    parser.add_argument("--max-pages", type=int, default=18, help="Maximum pages to fetch per vendor.")
    args = parser.parse_args()

    with open(args.input, "r", encoding="utf-8") as handle:
        vendor_map = json.load(handle)

    results = [crawl_vendor(name, seeds, args.max_pages) for name, seeds in vendor_map.items()]

    with open(args.output, "w", encoding="utf-8") as handle:
        json.dump(results, handle, indent=2)

    for item in results:
        print(f"VENDOR {item['vendor']}")
        print(f"PAGES {len(item['pages'])}")
        print(f"SPECS {len(item['specs'])}")
        if item["specs"]:
            for spec in item["specs"][:15]:
                print(f"SPEC {spec}")
        if item["errors"]:
            for error in item["errors"][:10]:
                print(f"ERROR {error['url']} || {error['error']}")
        print("=====")


if __name__ == "__main__":
    main()