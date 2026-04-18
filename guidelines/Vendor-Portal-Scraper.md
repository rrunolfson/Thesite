# Vendor Portal Scraper

## Purpose
- Scrape a vendor developer portal from a top-level catalog URL.
- Extract integration rows that match the Google Sheet schema used by this repo.
- Optionally upsert the results into a Google Sheet.
- Keep the scraper engine vendor-independent by driving portal-specific behavior through a JSON config file.

## Files
- Python scraper: `scripts/vendor_portal_scraper.py`
- Siemens example config: `scripts/vendor-scraper-siemens.json`
- Python dependencies: `requirements-scraper.txt`
- Google Sheets env example: `.env.scraper.example`

## How It Works
1. Load the top-level catalog URL.
2. Discover candidate product/API pages from links that look like APIs or SDKs.
3. Visit each candidate page.
4. Pick the best `integration_api_url` by scoring the current page and any child links such as OpenAPI, Swagger, API Reference, GraphQL, or YAML spec links.
5. Normalize the result into the integration sheet column layout.
6. Write the output to CSV, JSON, or directly into Google Sheets.

## Required Config Concepts
- `catalog_url`: top-level page to crawl.
- `catalog_seed_entries`: optional fixed list of entry URLs, titles, and summaries to scrape when the catalog page is too broad or unreliable.
- `allow_seed_entry_fallback_on_fetch_error`: optional boolean that lets the scraper emit rows from seeded metadata when live page fetches time out or fail.
- `seed_entries_skip_fetch`: optional boolean that skips live page fetches entirely and emits rows directly from seeded metadata.
- `vendor_identity`: optional canonical vendor mapping when one portal represents a single OEM with many product lines.
- `allowed_domains`: domains the scraper is allowed to follow.
- `catalog_rules`: patterns that include or exclude product links.
- `entry_rules`: patterns that prioritize final API/spec URLs and reject non-reference pages like quickstart or changelog.
- `field_mapping`: vendor name overrides, tag-to-industry mapping, and industry definitions.
- `row_defaults`: fallback values for sheet columns when the portal does not expose a field clearly.

## Canonical Vendor Model
- Some portals, including Siemens, expose many product lines under one OEM vendor.
- In those cases, configure `vendor_identity` so every scraped row writes the same `vendor_slug` and `vendor_name`.
- The path-derived product-line label should stay on the product row, for example in `product_family`, instead of turning each product line into a separate vendor.
- This keeps the public page and generated JSON accurate: one OEM vendor with many products, not dozens of fake OEMs created from URL path segments.

## Dry Run Example
```powershell
"c:/Users/rruno/OneDrive - lastmileinc.ai/Documents/Last Mile/Website/.venv/Scripts/python.exe" scripts/vendor_portal_scraper.py --config scripts/vendor-scraper-siemens.json --limit 10 --output-csv data/scraped/siemens-sample.csv --output-json data/scraped/siemens-sample.json
```

## Google Sheets Write Example
Set either `GOOGLE_SERVICE_ACCOUNT_FILE` or `GOOGLE_SERVICE_ACCOUNT_JSON`, plus `GOOGLE_SHEET_ID`.

```powershell
"c:/Users/rruno/OneDrive - lastmileinc.ai/Documents/Last Mile/Website/.venv/Scripts/python.exe" scripts/vendor_portal_scraper.py --config scripts/vendor-scraper-siemens.json --write-google-sheet --replace-by-vendor
```

## Notes
- `--replace-by-vendor` removes existing rows whose `vendor_slug` matches the incoming scrape before writing updated rows.
- Industry grouping is configurable. The Siemens sample maps portal tags like `industrial-edge`, `nurse-call-system`, and `sustainability` to sheet industry slugs.
- For a different vendor, copy the Siemens config and change the URL patterns, allowed domains, and field mapping rules.