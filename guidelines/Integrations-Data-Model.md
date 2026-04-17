# Integrations Data Model

## Recommendation
- Use a Google Sheet as the editorial source of truth.
- Export the sheet as CSV.
- Convert the CSV into a structured JSON file at build time.
- Render the public Integrations page from that JSON.
- Keep `integration_api_url` in the JSON even when it is not shown in the UI.
- In this repo, the working CSV lives at `data/integrations.csv` and the public machine-readable output is generated to `public/integrations.json`.
- The generated JSON also advertises its discovery contract in page metadata using `lastmile:integrations-data` and a JSON `alternate` link.

## Why This Works
- Business users can maintain data in a familiar spreadsheet.
- Engineering gets a stable, typed structure for rendering and filtering.
- AI agents get a machine-readable field with a predictable key name.
- Planned integrations can exist in the catalog before the implementation is built.

## Required CSV Columns
- `industry_slug`: stable machine key for the industry group.
- `industry_name`: visible label for the industry.
- `industry_description`: optional short summary for the industry section.
- `industry_sort_order`: numeric sort order for industries.
- `vendor_slug`: stable machine key for the OEM or vendor.
- `vendor_name`: visible vendor label.
- `vendor_logo_url`: optional external URL to the vendor logo.
- `vendor_logo_asset`: optional local asset reference if logo files are stored in-repo.
- `vendor_logo_asset` should point to a file under `public/`, for example `images/vendor-logo.png`.
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
          "vendor_logo_url": "",
          "vendor_logo_asset": "",
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
              "is_visible": true
            }
          ]
        }
      ]
    }
  ]
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
- `npm run build` now regenerates the JSON automatically before the site build.
- Run `npm run integrations:validate` to fail fast on missing columns, invalid slugs, duplicate products, missing logo assets, or malformed URLs.
- If you publish the Google Sheet as CSV, create `data/integrations-source.json` from the example file and run `npm run integrations:sync-sheet`.

## Google Sheet Sync Setup
1. Publish the Google Sheet or tab as CSV.
2. Copy `data/integrations-source.example.json` to `data/integrations-source.json`.
3. Paste the published CSV export URL into `csv_url`.
4. Run `npm run integrations:sync-sheet`.

That command fetches the remote CSV, validates it, optionally saves it back to `data/integrations.csv`, and regenerates `public/integrations.json`.

If Google returns `401 Unauthorized`, the sheet is not publicly readable yet. A plain edit URL is not enough by itself. The tab must be published or shared in a way that allows anonymous CSV export.

## JSON Discovery Contract
- Public JSON endpoint: `https://lastmileinc.ai/integrations.json`
- Relative JSON path: `/integrations.json`
- Static HTML discovery meta tag in `index.html`: `lastmile:integrations-data`
- Static HTML discovery link in `index.html`: `<link rel="alternate" type="application/json" href="https://lastmileinc.ai/integrations.json">`
- The React page also mirrors the same discovery values at runtime for consistency.
- AI-facing API docs field on each product: `integration_api_url`

## Suggested Next Build Step
- Stage 1: keep Google Sheet as source.
- Stage 2: add a CSV-to-JSON transform step.
- Stage 3: render the Integrations page from real JSON instead of mock data.
- Stage 4: optionally publish a separate machine-readable public JSON endpoint for AI agents.