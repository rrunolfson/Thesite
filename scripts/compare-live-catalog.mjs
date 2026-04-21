import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(repoRoot, "public", "integrations.json");
const liveCatalogUrl = process.env.LIVE_CATALOG_URL || "https://lastmileinc.ai/integrations.json";
const requireMatch = process.argv.includes("--require-match");

function countVendors(industries) {
  const vendorSlugs = new Set();

  for (const industry of industries) {
    for (const vendor of industry.vendors || []) {
      vendorSlugs.add(vendor.vendor_slug);
    }
  }

  return vendorSlugs.size;
}

function normalizeCatalog(catalog) {
  return {
    industries: catalog.industries || [],
  };
}

function setOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

async function fetchLiveCatalog(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json,text/plain;q=0.9,*/*;q=0.8",
      "user-agent": "Last Mile Live Catalog Compare/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch live catalog: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  const localCatalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

  const localRecordCount = String(localCatalog.meta?.record_count ?? 0);
  const localVendorCount = String(countVendors(localCatalog.industries || []));
  const localGeneratedAt = String(localCatalog.meta?.generated_at ?? "");

  let deployNeeded = false;
  let reason = "live-site-matches-generated-catalog";
  let liveRecordCount = "0";
  let liveVendorCount = "0";
  let liveGeneratedAt = "";

  try {
    const liveCatalog = await fetchLiveCatalog(liveCatalogUrl);
    const localNormalized = JSON.stringify(normalizeCatalog(localCatalog));
    const liveNormalized = JSON.stringify(normalizeCatalog(liveCatalog));

    liveRecordCount = String(liveCatalog.meta?.record_count ?? 0);
    liveVendorCount = String(countVendors(liveCatalog.industries || []));
    liveGeneratedAt = String(liveCatalog.meta?.generated_at ?? "");

    if (localNormalized !== liveNormalized) {
      deployNeeded = true;
      reason = "live-site-catalog-differs-from-generated-catalog";
    }
  } catch (error) {
    deployNeeded = true;
    reason = error instanceof Error ? error.message : String(error);
  }

  setOutput("deploy_needed", String(deployNeeded));
  setOutput("reason", reason.replace(/\s+/g, "-"));
  setOutput("local_record_count", localRecordCount);
  setOutput("live_record_count", liveRecordCount);
  setOutput("local_vendor_count", localVendorCount);
  setOutput("live_vendor_count", liveVendorCount);
  setOutput("local_generated_at", localGeneratedAt);
  setOutput("live_generated_at", liveGeneratedAt);

  console.log(JSON.stringify({
    deployNeeded,
    reason,
    localRecordCount,
    liveRecordCount,
    localVendorCount,
    liveVendorCount,
    localGeneratedAt,
    liveGeneratedAt,
    liveCatalogUrl,
  }, null, 2));

  if (requireMatch && deployNeeded) {
    process.exitCode = 1;
  }
}

await main();