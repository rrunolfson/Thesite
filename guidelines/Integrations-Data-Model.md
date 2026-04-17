# Integrations Data Model

## Recommendation
- Use a Google Sheet as the editorial source of truth.
- Export the sheet as CSV.
- Convert the CSV into a structured JSON file at build time.
- Render the public Integrations page from that JSON.
- Generate a second, route-addressable detail JSON layer for individual products.
- Keep `integration_api_url` in the JSON even when it is not shown in the UI.
- In this repo, the working CSV lives at `data/integrations.csv` and the public machine-readable output is generated to `public/integrations.json`.
- Manual researched detail files can be authored under `data/integration-details/**/*.json`.
- The generator writes public product detail payloads to `public/integration-details/**/*.json`.
- The generated JSON also advertises its discovery contract in page metadata using `lastmile:integrations-data` and a JSON `alternate` link.

## Why This Works
- Business users can maintain data in a familiar spreadsheet.
- Engineering gets a stable, typed structure for rendering and filtering.
- AI agents get a machine-readable field with a predictable key name.
- Planned integrations can exist in the catalog before the implementation is built.
- Every visible product can present a uniform detail experience even before manual data-element research is complete.
- Rich manually researched detail can override the generated baseline without changing the public route structure.

## Required CSV Columns
- `industry_slug`: stable machine key for the industry group.
- `industry_name`: visible label for the industry.
- `industry_description`: optional short summary for the industry section.
- `industry_sort_order`: numeric sort order for industries.
- `vendor_slug`: stable machine key for the OEM or vendor.
- `vendor_name`: visible vendor label.
- `vendor_domain`: optional canonical vendor domain used for scalable logo enrichment, for example `siemens.com`.
- If `vendor_domain` is not explicitly supplied, the generator attempts to infer it from `integration_api_url`.
- `vendor_logo_url`: optional external URL to the vendor logo.
- `vendor_logo_asset`: optional local asset reference if logo files are stored in-repo.
- `vendor_logo_asset` should point to a file under `public/`, for example `images/vendor-logo.png`.
- Prefer `vendor_domain` over hand-curated image URLs when scaling to large catalogs. The generator can resolve vendor logos automatically from a logo provider based on domain.
- `vendor_summary`: short vendor description shown in the UI.
- `vendor_sort_order`: numeric sort order inside the industry.
- `product_slug`: stable machine key for the product or integration target.
- `product_name`: visible product label.
- `product_family`: optional grouping field for product type.
- `integration_status`: recommended values: `planned`, `in-progress`, `built`, `deprecated`.
- `integration_type`: optional classification such as `OEM API`, `Partner API`, `Webhook`, `File Feed`.
- `integration_api_url`: machine-readable documentation URL for AI agents. Keep this exact field name.
- `product_summary`: optional short description for the product row.
- `product_sort_order`: numeric sort order inside the vendor.
- `is_visible`: `TRUE` or `FALSE` flag for publishing control.
- `internal_notes`: non-rendered editorial or implementation notes.

## Identity Rules
- `vendor_slug` and `vendor_name` represent the OEM or canonical vendor identity, not a product line, documentation section, or URL path segment.
- `vendor_domain` should represent the vendor's canonical public brand domain when known, not a temporary documentation host unless that is the only reliable source.
- If a single vendor portal exposes many product lines, all rows from that portal can still share one canonical `vendor_slug` and `vendor_name`.
- Product-line, platform, suite, or business-unit labels should stay on the product row, typically in `product_name`, `product_family`, or `internal_notes`.
- Do not create fake vendors from path segments like `/comos/`, `/insights-hub/`, or `/building-x-openness/` when those are product lines under one OEM.
- A vendor may appear in multiple industries if its products span multiple domains, but it is still one vendor identity.

Example:

- Correct: `vendor_name=Siemens`, `product_family=Insights Hub`, `product_name=IoT Time Series Service`
- Incorrect: `vendor_name=Insights Hub`, `product_name=IoT Time Series Service` when the real OEM is Siemens

## Counting Rules
- Vendor counts should use unique `vendor_slug` values across the catalog, not the raw number of vendor entries rendered inside industry groups.
- Product counts should count product rows after validation and deduplication.
- If one vendor appears in multiple industries, UI summaries should avoid counting that vendor more than once in global totals.
- Industry sections may still render the same vendor separately within each industry bucket if the product set differs by industry.

## Output JSON Shape
The exported JSON should keep the API documentation field directly on each product record using the exact key `integration_api_url`.

```json
{
  "generated_at": "2026-04-16T00:00:00Z",
  "industries": [
    {
      "industry_slug": "manufacturing",
      "industry_name": "Manufacturing",
      "industry_description": "Machine health, controls, production assets, and plant-floor telemetry aligned to operational workflows.",
      "vendors": [
        {
          "vendor_slug": "atlas-motion-systems",
          "vendor_name": "Atlas Motion Systems",
          "vendor_domain": "atlasmotion.com",
          "vendor_logo_url": "",
          "vendor_logo_asset": "",
          "vendor_logo_src": "https://img.logo.dev/atlasmotion.com?token=<publishable-key>&size=160&format=png",
          "vendor_summary": "Discrete manufacturing automation and machine performance integrations.",
          "products": [
            {
              "product_slug": "atlas-servo-suite",
              "product_name": "Atlas Servo Suite",
              "product_family": "Motion Control",
              "integration_status": "planned",
              "integration_type": "OEM API",
              "integration_api_url": "https://my.apidocs.com",
              "product_summary": "Servo and drive integration planned for production telemetry workflows.",
              "has_detail": true,
              "detail_path": "/integration-details/atlas-motion-systems/atlas-servo-suite.json",
              "data_coverage_summary": "Servo and drive integration planned for production telemetry workflows.",
              "is_visible": true
            }
          ]
        }
      ]
    }
  ]
}
```

## Product Detail Layer
- Public product detail route shape: `/integrations/:vendorSlug/:productSlug`.
- Public detail payload shape: `/integration-details/<resolved-detail-file>.json`.
- The page route slug and the generated detail JSON filename are intentionally decoupled. The route resolves the correct `detail_path` from `integrations.json` before fetching the detail payload.
- The detail layer is generated from two sources:
  - Manual researched detail authored under `data/integration-details/**/*.json`.
  - Automatic baseline detail generated for visible products that do not yet have a manual detail file.
- Manual researched detail always wins over the generated baseline for the same `vendor_slug` + `product_slug` pair.

### Detail Completeness
- `detail_completeness=researched` is used for manually authored product detail with curated data-element coverage.
- `detail_completeness=generated-summary` is used for auto-generated baseline detail created from the catalog row and linked documentation.
- Generated baseline detail is intended to provide a uniform review surface, not to invent undocumented entities or operations.

### Detail JSON Example

```json
{
  "vendor_slug": "atlas-motion-systems",
  "vendor_name": "Atlas Motion Systems",
  "vendor_domain": "atlasmotion.com",
  "vendor_logo_src": "https://img.logo.dev/atlasmotion.com?token=<publishable-key>&size=160&format=png",
  "product_slug": "atlas-servo-suite",
  "product_name": "Atlas Servo Suite",
  "product_family": "Motion Control",
  "integration_type": "OEM API",
  "integration_api_url": "https://my.apidocs.com",
  "spec_artifact_url": "https://my.apidocs.com",
  "detail_path": "/integration-details/atlas-motion-systems/atlas-servo-suite.json",
  "detail_completeness": "generated-summary",
  "data_coverage_summary": "Servo and drive integration planned for production telemetry workflows.",
  "asset_data_available": null,
  "telemetry_data_available": null,
  "writeback_supported": null,
  "overview": "This baseline detail page was generated from the catalog metadata and linked documentation.",
  "buyer_guidance": "Use the published OEM API documentation to confirm supported entities, access patterns, and implementation constraints before scoping a build.",
  "available_data": [
    {
      "category": "Published API Scope",
      "description": "This standardized detail view was generated from the catalog row and linked documentation.",
      "data_points": [
        "Published summary: Servo and drive integration planned for production telemetry workflows.",
        "Product family: Motion Control",
        "Integration type: OEM API",
        "Lifecycle status: Planned"
      ],
      "relevant_operations": []
    }
  ],
  "source_evidence": {
    "documentation_url": "https://my.apidocs.com",
    "reviewed_at": "2026-04-17"
  }
}
```

## AI Agent Requirement
- AI agents should read `integration_api_url` from the JSON payload, not from visible UI text.
- The field should always be present on product records, even if the value is blank.
- If the integration is only planned, `integration_status` can still be `planned` while `integration_api_url` points to the target system documentation.
- Agents can also discover the JSON endpoint from the page head using the `lastmile:integrations-data` meta tag or the JSON `alternate` link.

## Public Delivery Recommendation
- Publish a static JSON file such as `/integrations.json` or `/data/integrations.json`.
- Keep the page UI and the machine-readable data sourced from the same generated dataset.
- Do not expose `internal_notes` in the public JSON if those notes contain sensitive implementation details.

## Current Repo Flow
- Maintain or replace `data/integrations.csv` with the latest Google Sheet export.
- Run `npm run integrations:generate` to refresh `public/integrations.json`.
- The same command also regenerates `public/integration-details/**/*.json`.
- Set `LOGO_DEV_PUBLISHABLE_KEY` or `logo_dev_publishable_key` in `data/integrations-source.json` to enable domain-based full-logo resolution via Logo.dev.
- `npm run build` now regenerates the JSON automatically before the site build.
- Run `npm run integrations:validate` to fail fast on missing columns, invalid slugs, duplicate products, missing logo assets, or malformed URLs.
- If no logo provider key is configured, the generator falls back to domain-based favicon resolution so the UI still has visual vendor identifiers without manual image management.
- If a visible product has no manual detail file, the generator emits a baseline detail payload automatically so the product still has a consistent detail page and route.
- If you publish the Google Sheet as CSV, create `data/integrations-source.json` from the example file and run `npm run integrations:sync-sheet`.

## Vendor Scraper To Sheet Flow
- The vendor portal scraper is intended to populate the same Google Sheet schema documented here, not a separate ad hoc worksheet shape.
- The scraper normalizes every row to the exact required column set from `guidelines/Integrations-Google-Sheet-Template.csv` before writing to Google Sheets.
- The canonical scraper entry point is `scripts/vendor_portal_scraper.py`.
- Example vendor config: `scripts/vendor-scraper-siemens.json`.
- If a portal belongs to one OEM with many product lines, configure one canonical vendor identity and preserve product-line context on the product rows.
- Use `--replace-by-vendor` when refreshing a vendor so old rows for the same `vendor_slug` are removed before the new scrape is written.
- Source-specific replacement logic should also remove prior rows from the same portal import when a canonical vendor mapping changes, so old incorrectly-modeled rows do not linger in the sheet.
- After the sheet is updated, continue using the existing repo flow to sync the sheet export back into `data/integrations.csv` and regenerate `public/integrations.json`.

Example command:

```powershell
"c:/Users/rruno/OneDrive - lastmileinc.ai/Documents/Last Mile/Website/.venv/Scripts/python.exe" scripts/vendor_portal_scraper.py --config scripts/vendor-scraper-siemens.json --write-google-sheet --replace-by-vendor
```

## Scheduled Automation
- The daily sync workflow lives at `.github/workflows/daily-integrations-sync.yml`.
- The workflow only runs on the repository default branch because GitHub scheduled workflows do not run from non-default branches.
- In this repo, that means the automation must stay on `main` if the daily refresh is expected to run.
- The workflow syncs the published sheet, validates the CSV, detects whether `data/integrations.csv` actually changed, and only then rebuilds and commits refreshed catalog artifacts.
- This avoids no-op daily commits caused only by a regenerated timestamp.

## Deployment Note
- Automatic production updates depend on deployment tracking the same branch that receives the workflow commit.
- If cPanel or any other Git-based deploy target is tracking a different branch, the workflow can update GitHub without updating production.
- Keep the deploy target pointed at `main` if you want the scheduled catalog sync to flow through to the live site automatically.

## Google Sheet Sync Setup
1. Publish the Google Sheet or tab as CSV.
2. Copy `data/integrations-source.example.json` to `data/integrations-source.json`.
3. Paste the published CSV export URL into `csv_url`.
4. Run `npm run integrations:sync-sheet`.

If the sheet is being populated by the vendor scraper, run the scraper first so the worksheet already contains the canonical template columns and current vendor rows before syncing the published CSV back into the repo.

That command fetches the remote CSV, validates it, optionally saves it back to `data/integrations.csv`, and regenerates `public/integrations.json`.

If Google returns `401 Unauthorized`, the sheet is not publicly readable yet. A plain edit URL is not enough by itself. The tab must be published or shared in a way that allows anonymous CSV export.

## JSON Discovery Contract
- Public JSON endpoint: `https://lastmileinc.ai/integrations.json`
- Relative JSON path: `/integrations.json`
- Public product detail path pattern: `/integration-details/:vendorSlug/:productSlug.json`
- Static HTML discovery meta tag in `index.html`: `lastmile:integrations-data`
- Static HTML discovery link in `index.html`: `<link rel="alternate" type="application/json" href="https://lastmileinc.ai/integrations.json">`
- The React page also mirrors the same discovery values at runtime for consistency.
- AI-facing API docs field on each product: `integration_api_url`