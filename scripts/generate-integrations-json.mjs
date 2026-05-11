import { createHash } from "node:crypto";
import { access, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const sourceCsvPath = path.join(repoRoot, "data", "integrations.csv");
const outputJsonPath = path.join(repoRoot, "public", "integrations.json");
const detailSourceDir = path.join(repoRoot, "data", "integration-details");
const detailOutputDir = path.join(repoRoot, "public", "integration-details");
const defaultConfigPath = path.join(repoRoot, "data", "integrations-source.json");
const functionTaxonomyPath = path.join(repoRoot, "data", "industry-function-taxonomy.json");
const publicSiteBaseUrl = "https://lastmileinc.ai";
const logoDevCdnBaseUrl = "https://img.logo.dev";
const googleFaviconBaseUrl = "https://www.google.com/s2/favicons";
const vendorDomainOverrides = new Map([
  ["fiix", "fiixsoftware.com"],
  ["nextech", "nextech.com"],
  ["onshape", "onshape.com"],
  ["ptc", "ptc.com"],
  ["zebra", "zebra.com"],
]);
const remoteCsvFetchTimeoutMs = 30000;
const remoteCsvFetchMaxAttempts = 3;
const requiredHeaders = [
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
];
const optionalFunctionHeaders = [
  "industry_function_slug",
  "industry_function_name",
  "industry_function_description",
  "industry_function_sort_order",
];
const allowedStatuses = new Set(["planned", "in-progress", "built", "deprecated"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const detailRequiredFields = [
  "vendor_slug",
  "vendor_name",
  "product_slug",
  "product_name",
  "data_coverage_summary",
  "data_domains",
  "overview",
  "source_evidence",
];
const unclassifiedFunction = {
  industry_function_slug: "unclassified",
  industry_function_name: "Unclassified",
  industry_function_description:
    "Legacy or newly added rows that have not yet been classified into a specific operational function.",
  industry_function_sort_order: 9999,
};

function parseArguments(argv) {
  const args = {
    configPath: defaultConfigPath,
    configSpecified: false,
    sourceUrl: "",
    saveSource: false,
    validateOnly: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--save-source") {
      args.saveSource = true;
      continue;
    }

    if (argument === "--validate-only") {
      args.validateOnly = true;
      continue;
    }

    if (argument === "--config") {
      args.configPath = path.resolve(repoRoot, argv[index + 1] ?? "");
      args.configSpecified = true;
      index += 1;
      continue;
    }

    if (argument.startsWith("--config=")) {
      args.configPath = path.resolve(repoRoot, argument.slice("--config=".length));
      args.configSpecified = true;
      continue;
    }

    if (argument === "--source-url") {
      args.sourceUrl = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (argument.startsWith("--source-url=")) {
      args.sourceUrl = argument.slice("--source-url=".length);
    }
  }

  return args;
}

async function fileExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonIfExists(targetPath) {
  if (!(await fileExists(targetPath))) {
    return null;
  }

  try {
    const content = await readFile(targetPath, "utf8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function loadFunctionTaxonomy() {
  const rawTaxonomy = await readJsonIfExists(functionTaxonomyPath);

  if (!rawTaxonomy || !Array.isArray(rawTaxonomy.industries)) {
    return new Map();
  }

  const taxonomy = new Map();

  for (const industry of rawTaxonomy.industries) {
    const industrySlug = String(industry?.industry_slug ?? "").trim();

    if (!industrySlug) {
      continue;
    }

    const definitions = Array.isArray(industry.functions)
      ? industry.functions
          .map((definition) => ({
            industry_function_slug: String(definition?.industry_function_slug ?? "").trim(),
            industry_function_name: String(definition?.industry_function_name ?? "").trim(),
            industry_function_description: String(definition?.industry_function_description ?? "").trim(),
            industry_function_sort_order: toNumber(definition?.industry_function_sort_order ?? 0),
          }))
          .filter((definition) => definition.industry_function_slug && definition.industry_function_name)
      : [];

    taxonomy.set(industrySlug, definitions);
  }

  return taxonomy;
}

async function walkJsonFiles(targetDir) {
  if (!(await fileExists(targetDir))) {
    return [];
  }

  const entries = await readdir(targetDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkJsonFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(entryPath);
    }
  }

  return files;
}

function normalizeTextList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
}

function normalizeCapabilityValue(value) {
  if (value === null || value === undefined || String(value ?? "").trim() === "") {
    return null;
  }

  if (value === true || String(value ?? "").trim().toLowerCase() === "true") {
    return "Supported";
  }

  if (value === false || String(value ?? "").trim().toLowerCase() === "false") {
    return "Not Supported";
  }

  const normalizedValue = String(value ?? "").trim().toLowerCase();

  if (normalizedValue === "supported") {
    return "Supported";
  }

  if (normalizedValue === "not supported" || normalizedValue === "un-supported" || normalizedValue === "unsupported") {
    return "Not Supported";
  }

  if (normalizedValue === "n/a" || normalizedValue === "na") {
    return "N/A";
  }

  return null;
}

function detailKey(vendorSlug, productSlug) {
  return `${vendorSlug}::${productSlug}`;
}

function toDetailFileName(productSlug) {
  const normalizedSlug = String(productSlug ?? "").trim();

  if (normalizedSlug.length <= 80) {
    return normalizedSlug;
  }

  const hashSuffix = createHash("sha1").update(normalizedSlug).digest("hex").slice(0, 12);
  return `${normalizedSlug.slice(0, 64)}-${hashSuffix}`;
}

async function loadIntegrationDetails() {
  const detailFiles = await walkJsonFiles(detailSourceDir);
  const details = new Map();
  const errors = [];

  for (const detailFilePath of detailFiles) {
    const rawContent = await readFile(detailFilePath, "utf8");
    const rawDetail = JSON.parse(rawContent);

    for (const fieldName of detailRequiredFields) {
      if (rawDetail[fieldName] === undefined || rawDetail[fieldName] === null || rawDetail[fieldName] === "") {
        errors.push(`${path.relative(repoRoot, detailFilePath)} is missing required field '${fieldName}'.`);
      }
    }

    const vendorSlug = String(rawDetail.vendor_slug ?? "").trim();
    const productSlug = String(rawDetail.product_slug ?? "").trim();

    if (!slugPattern.test(vendorSlug)) {
      errors.push(`${path.relative(repoRoot, detailFilePath)} has invalid vendor_slug '${vendorSlug}'.`);
    }

    if (!slugPattern.test(productSlug)) {
      errors.push(`${path.relative(repoRoot, detailFilePath)} has invalid product_slug '${productSlug}'.`);
    }

    const relativeFilePath = path.relative(detailSourceDir, detailFilePath).replace(/\\/g, "/");
    const detailPath = `/integration-details/${relativeFilePath}`;
    const key = detailKey(vendorSlug, productSlug);

    if (details.has(key)) {
      errors.push(`Duplicate integration detail found for ${key}.`);
      continue;
    }

    const normalizedDetail = {
      vendor_slug: vendorSlug,
      vendor_name: String(rawDetail.vendor_name ?? "").trim(),
      product_slug: productSlug,
      product_name: String(rawDetail.product_name ?? "").trim(),
      product_family: String(rawDetail.product_family ?? "").trim(),
      integration_type: String(rawDetail.integration_type ?? "").trim(),
      integration_api_url: String(rawDetail.integration_api_url ?? "").trim(),
      spec_artifact_url: String(rawDetail.spec_artifact_url ?? "").trim(),
      detail_completeness: String(rawDetail.detail_completeness ?? "researched").trim() || "researched",
      data_coverage_summary: String(rawDetail.data_coverage_summary ?? "").trim(),
      data_domains: normalizeTextList(rawDetail.data_domains),
      asset_data_available: normalizeCapabilityValue(rawDetail.asset_data_available),
      telemetry_data_available: normalizeCapabilityValue(rawDetail.telemetry_data_available),
      writeback_supported: normalizeCapabilityValue(rawDetail.writeback_supported),
      key_entities: normalizeTextList(rawDetail.key_entities),
      buyer_guidance: String(rawDetail.buyer_guidance ?? "").trim(),
      overview: String(rawDetail.overview ?? "").trim(),
      available_data: Array.isArray(rawDetail.available_data) ? rawDetail.available_data : [],
      ingest_considerations: normalizeTextList(rawDetail.ingest_considerations),
      source_evidence: rawDetail.source_evidence ?? {},
      detail_path: detailPath,
    };

    details.set(key, normalizedDetail);
  }

  if (errors.length > 0) {
    throw new Error(`Integration detail validation failed:\n- ${errors.join("\n- ")}`);
  }

  return details;
}

function toDisplayStatus(status) {
  return String(status ?? "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildGeneratedBuyerGuidance(record) {
  const integrationType = record.integration_type || "API";
  const productFamilyText = record.product_family ? `${record.product_family} ` : "";

  return `Use the published ${productFamilyText}${integrationType} documentation to confirm supported entities, access patterns, and implementation constraints before scoping a build.`;
}

function buildGeneratedOverview(record) {
  const productSummary = String(record.product_summary ?? "").trim();

  if (productSummary) {
    return `${productSummary} This baseline detail page was generated from the catalog metadata and linked documentation so the product can be reviewed consistently alongside researched integrations.`;
  }

  return `This baseline detail page was generated from the catalog metadata and linked documentation so ${record.product_name} can be reviewed consistently alongside researched integrations.`;
}

function buildGeneratedAvailableData(record) {
  const productSummary = String(record.product_summary ?? "").trim();
  const dataPoints = [];

  if (productSummary) {
    dataPoints.push(`Published summary: ${productSummary}`);
  }

  if (record.product_family) {
    dataPoints.push(`Product family: ${record.product_family}`);
  }

  if (record.integration_type) {
    dataPoints.push(`Integration type: ${record.integration_type}`);
  }

  if (record.integration_status) {
    dataPoints.push(`Lifecycle status: ${toDisplayStatus(record.integration_status)}`);
  }

  if (record.integration_api_url) {
    dataPoints.push("Published API documentation is available from the linked source documentation.");
  }

  dataPoints.push("Exact entities, payloads, and operations should be confirmed in the source documentation before implementation.");

  return [
    {
      category: "Published API Scope",
      description:
        "This standardized detail view was generated from the catalog row and linked documentation so every currently captured product has a consistent review surface.",
      data_points: dataPoints,
      relevant_operations: [],
    },
  ];
}

function createGeneratedDetailRecord(record) {
  const detailPath = `/integration-details/${record.vendor_slug}/${toDetailFileName(record.product_slug)}.json`;
  const productSummary = String(record.product_summary ?? "").trim();
  const generatedSummary = productSummary || `${record.product_name} has published API documentation available for review.`;

  return {
    vendor_slug: record.vendor_slug,
    vendor_name: record.vendor_name,
    product_slug: record.product_slug,
    product_name: record.product_name,
    product_family: record.product_family,
    integration_type: record.integration_type,
    integration_api_url: record.integration_api_url,
    spec_artifact_url: record.integration_api_url,
    detail_completeness: "generated-summary",
    data_coverage_summary: generatedSummary,
    data_domains: [],
    asset_data_available: null,
    telemetry_data_available: null,
    writeback_supported: null,
    key_entities: [],
    buyer_guidance: buildGeneratedBuyerGuidance(record),
    overview: buildGeneratedOverview(record),
    available_data: buildGeneratedAvailableData(record),
    ingest_considerations: [],
    source_evidence: {
      documentation_url: record.integration_api_url,
      spec_url: record.integration_api_url,
      reviewed_at: new Date().toISOString().slice(0, 10),
      evidence_notes:
        "This detail payload was automatically generated from the catalog row and linked documentation URL. Manual data-element profiling has not yet been completed for this product.",
    },
    detail_path: detailPath,
  };
}

function normalizeCatalogForComparison(catalog) {
  return {
    ...catalog,
    meta: {
      ...catalog.meta,
      generated_at: "",
    },
  };
}

function normalizeDetailForComparison(detailRecord) {
  return {
    ...detailRecord,
    source_evidence: {
      ...(detailRecord.source_evidence ?? {}),
      reviewed_at: "",
    },
  };
}

function preserveCatalogTimestamp(catalog, existingCatalog) {
  if (!existingCatalog?.meta?.generated_at) {
    return catalog;
  }

  const nextCatalog = normalizeCatalogForComparison(catalog);
  const previousCatalog = normalizeCatalogForComparison(existingCatalog);

  if (JSON.stringify(nextCatalog) !== JSON.stringify(previousCatalog)) {
    return catalog;
  }

  return {
    ...catalog,
    meta: {
      ...catalog.meta,
      generated_at: existingCatalog.meta.generated_at,
    },
  };
}

async function preserveGeneratedDetailTimestamps(detailRecords) {
  const stabilizedRecords = new Map();

  for (const [key, detailRecord] of detailRecords.entries()) {
    if (detailRecord.detail_completeness !== "generated-summary") {
      stabilizedRecords.set(key, detailRecord);
      continue;
    }

    const outputPath = path.join(repoRoot, "public", detailRecord.detail_path.replace(/^\//, ""));
    const existingDetail = await readJsonIfExists(outputPath);

    if (!existingDetail?.source_evidence?.reviewed_at) {
      stabilizedRecords.set(key, detailRecord);
      continue;
    }

    const nextDetail = normalizeDetailForComparison(detailRecord);
    const previousDetail = normalizeDetailForComparison(existingDetail);

    if (JSON.stringify(nextDetail) !== JSON.stringify(previousDetail)) {
      stabilizedRecords.set(key, detailRecord);
      continue;
    }

    stabilizedRecords.set(key, {
      ...detailRecord,
      source_evidence: {
        ...(detailRecord.source_evidence ?? {}),
        reviewed_at: existingDetail.source_evidence.reviewed_at,
      },
    });
  }

  return stabilizedRecords;
}

function buildDetailRecords(records, manualDetailRecords) {
  const details = new Map(manualDetailRecords);

  for (const record of records.filter((currentRecord) => currentRecord.is_visible)) {
    const key = detailKey(record.vendor_slug, record.product_slug);

    if (details.has(key)) {
      continue;
    }

    details.set(key, createGeneratedDetailRecord(record));
  }

  return details;
}

async function writeIntegrationDetails(detailRecords) {
  const existingFiles = await walkJsonFiles(detailOutputDir);
  const nextOutputPaths = new Set(
    Array.from(detailRecords.values()).map((detailRecord) =>
      path.join(repoRoot, "public", detailRecord.detail_path.replace(/^\//, "")),
    ),
  );

  for (const existingFile of existingFiles) {
    if (nextOutputPaths.has(existingFile)) {
      continue;
    }

    try {
      await rm(existingFile, { force: true });
    } catch (error) {
      console.warn(`Warning: unable to remove stale integration detail file ${existingFile}: ${error}`);
    }
  }

  for (const detailRecord of detailRecords.values()) {
    const outputPath = path.join(repoRoot, "public", detailRecord.detail_path.replace(/^\//, ""));
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(detailRecord, null, 2)}\n`, "utf8");
  }
}

async function readConfig(configPath) {
  if (!(await fileExists(configPath))) {
    return null;
  }

  const content = await readFile(configPath, "utf8");
  return JSON.parse(content);
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function fetchRemoteText(url) {
  let lastError = null;

  for (let attempt = 1; attempt <= remoteCsvFetchMaxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort(new Error(`Timed out after ${remoteCsvFetchTimeoutMs}ms`));
    }, remoteCsvFetchTimeoutMs);

    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": "Last Mile Integrations Sync/1.0",
          accept: "text/csv,text/plain;q=0.9,*/*;q=0.8",
        },
        redirect: "follow",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Unable to fetch CSV source: ${response.status} ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      lastError = error;

      if (attempt < remoteCsvFetchMaxAttempts) {
        console.warn(`Warning: remote CSV fetch attempt ${attempt} failed for ${url}. Retrying...`);
        await delay(attempt * 2000);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

async function readSourceCsv(sourceIdentifier) {
  if (!sourceIdentifier) {
    return {
      csvContent: await readFile(sourceCsvPath, "utf8"),
      sourceLabel: "data/integrations.csv",
      sourceMode: "local-file",
    };
  }

  if (sourceIdentifier.startsWith("http://") || sourceIdentifier.startsWith("https://")) {
    return {
      csvContent: await fetchRemoteText(sourceIdentifier),
      sourceLabel: sourceIdentifier,
      sourceMode: "remote-url",
    };
  }

  if (sourceIdentifier.startsWith("file://")) {
    const sourcePath = fileURLToPath(sourceIdentifier);
    return {
      csvContent: await readFile(sourcePath, "utf8"),
      sourceLabel: sourceIdentifier,
      sourceMode: "file-url",
    };
  }

  const resolvedPath = path.resolve(repoRoot, sourceIdentifier);
  return {
    csvContent: await readFile(resolvedPath, "utf8"),
    sourceLabel: resolvedPath,
    sourceMode: "local-path",
  };
}

function parseCsv(content) {
  const rows = [];
  let currentField = "";
  let currentRow = [];
  let insideQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    const nextCharacter = content[index + 1];

    if (character === '"') {
      if (insideQuotes && nextCharacter === '"') {
        currentField += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (character === "," && !insideQuotes) {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !insideQuotes) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }

      currentRow.push(currentField);
      currentField = "";

      const hasValues = currentRow.some((value) => value.trim() !== "");
      if (hasValues) {
        rows.push(currentRow);
      }

      currentRow = [];
      continue;
    }

    currentField += character;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    const hasValues = currentRow.some((value) => value.trim() !== "");
    if (hasValues) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function toBoolean(value) {
  return String(value).trim().toLowerCase() === "true";
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sortByOrder(left, right, leftOrder, rightOrder, leftName, rightName) {
  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return String(left[leftName]).localeCompare(String(right[rightName]));
}

function normalizeFunctionMetadata(record, functionTaxonomy) {
  const taxonomyMatch = (functionTaxonomy.get(record.industry_slug) ?? []).find(
    (definition) => definition.industry_function_slug === record.industry_function_slug,
  );

  return {
    industry_function_slug: record.industry_function_slug,
    industry_function_name: record.industry_function_name || taxonomyMatch?.industry_function_name || "",
    industry_function_description:
      record.industry_function_description || taxonomyMatch?.industry_function_description || "",
    industry_function_sort_order:
      record.industry_function_sort_order || taxonomyMatch?.industry_function_sort_order || 0,
  };
}

function normalizeAssetPath(assetPath) {
  const trimmedAssetPath = assetPath.trim().replace(/\\/g, "/").replace(/^\/+/, "");
  return trimmedAssetPath ? `/${trimmedAssetPath}` : "";
}

function normalizeDomain(value) {
  const trimmedValue = String(value ?? "").trim().toLowerCase();

  if (!trimmedValue) {
    return "";
  }

  try {
    const parsedUrl = new URL(trimmedValue.includes("://") ? trimmedValue : `https://${trimmedValue}`);
    return parsedUrl.hostname.replace(/^www\./, "");
  } catch {
    return trimmedValue.replace(/^www\./, "").replace(/\/$/, "");
  }
}

function extractHostname(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function hasPlaceholderUrlSegments(value) {
  const normalizedValue = String(value ?? "").trim().toLowerCase();

  if (!normalizedValue) {
    return false;
  }

  return normalizedValue.includes("...");
}

function toRegistrableDomain(hostname) {
  const normalizedHostname = normalizeDomain(hostname);

  if (!normalizedHostname) {
    return "";
  }

  const labels = normalizedHostname.split(".").filter(Boolean);

  if (labels.length <= 2) {
    return normalizedHostname;
  }

  const topLevelDomain = labels.at(-1) ?? "";
  const secondLevelDomain = labels.at(-2) ?? "";
  const useThreeLabels = topLevelDomain.length === 2 && secondLevelDomain.length <= 3 && labels.length >= 3;

  return useThreeLabels ? labels.slice(-3).join(".") : labels.slice(-2).join(".");
}

function inferVendorDomain(record) {
  if (vendorDomainOverrides.has(record.vendor_slug)) {
    return vendorDomainOverrides.get(record.vendor_slug);
  }

  if (record.vendor_domain) {
    return normalizeDomain(record.vendor_domain);
  }

  return toRegistrableDomain(extractHostname(record.integration_api_url));
}

function resolveVendorLogoSrc(record, logoConfig) {
  if (record.vendor_logo_asset) {
    return record.vendor_logo_asset;
  }

  if (record.vendor_logo_url) {
    return record.vendor_logo_url;
  }

  if (!record.vendor_domain) {
    return "";
  }

  if (logoConfig.logoDevPublishableKey) {
    const token = encodeURIComponent(logoConfig.logoDevPublishableKey);
    const domain = encodeURIComponent(record.vendor_domain);
    return `${logoDevCdnBaseUrl}/${domain}?token=${token}&size=160&format=png`;
  }

  const domain = encodeURIComponent(record.vendor_domain);
  return `${googleFaviconBaseUrl}?domain=${domain}&sz=128`;
}

function isHttpUrl(value) {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

async function validateRecords(headerRow, dataRows, records, detailRecords) {
  const errors = [];
  const warnings = [];

  const missingHeaders = requiredHeaders.filter((header) => !headerRow.includes(header));
  if (missingHeaders.length > 0) {
    errors.push(`Missing required CSV columns: ${missingHeaders.join(", ")}`);
  }

  const duplicateHeaders = headerRow.filter((header, index) => headerRow.indexOf(header) !== index);
  if (duplicateHeaders.length > 0) {
    errors.push(`Duplicate CSV columns detected: ${Array.from(new Set(duplicateHeaders)).join(", ")}`);
  }

  const presentFunctionHeaders = optionalFunctionHeaders.filter((header) => headerRow.includes(header));
  if (presentFunctionHeaders.length > 0 && presentFunctionHeaders.length !== optionalFunctionHeaders.length) {
    warnings.push(
      `Function classification columns are only partially present. Expected all of: ${optionalFunctionHeaders.join(", ")}.`,
    );
  }

  const seenProductKeys = new Set();
  const catalogKeys = new Set();

  for (let index = 0; index < dataRows.length; index += 1) {
    const row = dataRows[index];
    const record = records[index];
    const lineNumber = index + 2;

    if (row.length !== headerRow.length) {
      errors.push(`Row ${lineNumber} has ${row.length} columns but expected ${headerRow.length}.`);
    }

    for (const fieldName of [
      "industry_slug",
      "industry_name",
      "vendor_slug",
      "vendor_name",
      "product_slug",
      "product_name",
      "integration_status",
    ]) {
      if (!record[fieldName]) {
        errors.push(`Row ${lineNumber} is missing required value for ${fieldName}.`);
      }
    }

    for (const slugField of ["industry_slug", "vendor_slug", "product_slug"]) {
      if (record[slugField] && !slugPattern.test(record[slugField])) {
        errors.push(`Row ${lineNumber} has invalid ${slugField}. Use lowercase letters, numbers, and hyphens only.`);
      }
    }

    if (record.industry_function_slug && !slugPattern.test(record.industry_function_slug)) {
      errors.push(
        `Row ${lineNumber} has invalid industry_function_slug. Use lowercase letters, numbers, and hyphens only.`,
      );
    }

    if (record.industry_function_name && !record.industry_function_slug) {
      warnings.push(
        `Row ${lineNumber} defines an industry function name without an industry_function_slug. The row will be treated as unclassified.`,
      );
    }

    if (record.integration_status && !allowedStatuses.has(record.integration_status)) {
      errors.push(`Row ${lineNumber} has unsupported integration_status '${record.integration_status}'.`);
    }

    if (record.vendor_logo_url && !isHttpUrl(record.vendor_logo_url)) {
      errors.push(`Row ${lineNumber} has invalid vendor_logo_url '${record.vendor_logo_url}'.`);
    }

    if (record.vendor_domain && String(record.vendor_domain).includes(" ")) {
      errors.push(`Row ${lineNumber} has invalid vendor_domain '${record.vendor_domain}'.`);
    }

    if (record.integration_api_url) {
      if (!isHttpUrl(record.integration_api_url)) {
        errors.push(`Row ${lineNumber} has invalid integration_api_url '${record.integration_api_url}'.`);
      } else if (hasPlaceholderUrlSegments(record.integration_api_url)) {
        errors.push(
          `Row ${lineNumber} has placeholder segments in integration_api_url '${record.integration_api_url}'. Replace it with a direct public documentation URL.`,
        );
      }
    } else {
      warnings.push(`Row ${lineNumber} has a blank integration_api_url. AI agents will not know where to find API docs for ${record.product_name}.`);
    }

    if (record.vendor_logo_asset) {
      const normalizedAssetPath = normalizeAssetPath(record.vendor_logo_asset);
      const assetFilePath = path.join(repoRoot, "public", normalizedAssetPath.slice(1));

      if (!(await fileExists(assetFilePath))) {
        errors.push(`Row ${lineNumber} references missing vendor_logo_asset '${record.vendor_logo_asset}'. Expected file at public${normalizedAssetPath}.`);
      }
    }

    const productKey = `${record.industry_slug}::${record.vendor_slug}::${record.product_slug}`;
    if (seenProductKeys.has(productKey)) {
      errors.push(`Row ${lineNumber} duplicates product key ${productKey}.`);
    }
    seenProductKeys.add(productKey);
    catalogKeys.add(detailKey(record.vendor_slug, record.product_slug));
  }

  for (const detailRecord of detailRecords.values()) {
    const key = detailKey(detailRecord.vendor_slug, detailRecord.product_slug);

    if (!catalogKeys.has(key)) {
      errors.push(`Detail metadata exists for ${key} but no matching visible integration row was found in the CSV.`);
    }
  }

  return { errors, warnings };
}

function buildCatalog(records, source, detailRecords, functionTaxonomy) {
  const visibleRecords = records.filter((record) => record.is_visible);
  const industries = new Map();

  for (const record of visibleRecords) {
    if (!industries.has(record.industry_slug)) {
      const functions = new Map();

      for (const definition of functionTaxonomy.get(record.industry_slug) ?? []) {
        functions.set(definition.industry_function_slug, {
          ...definition,
          vendor_slugs: new Set(),
          product_count: 0,
        });
      }

      industries.set(record.industry_slug, {
        industry_slug: record.industry_slug,
        industry_name: record.industry_name,
        industry_description: record.industry_description,
        industry_sort_order: record.industry_sort_order,
        functions,
        vendors: new Map(),
      });
    }

    const industry = industries.get(record.industry_slug);
    const functionMetadata = record.industry_function_slug
      ? {
          industry_function_slug: record.industry_function_slug,
          industry_function_name: record.industry_function_name,
          industry_function_description: record.industry_function_description,
          industry_function_sort_order: record.industry_function_sort_order,
        }
      : unclassifiedFunction;

    if (!industry.functions.has(functionMetadata.industry_function_slug)) {
      industry.functions.set(functionMetadata.industry_function_slug, {
        ...functionMetadata,
        vendor_slugs: new Set(),
        product_count: 0,
      });
    }

    const functionSummary = industry.functions.get(functionMetadata.industry_function_slug);
    functionSummary.vendor_slugs.add(record.vendor_slug);
    functionSummary.product_count += 1;

    if (!industry.vendors.has(record.vendor_slug)) {
      industry.vendors.set(record.vendor_slug, {
        vendor_slug: record.vendor_slug,
        vendor_name: record.vendor_name,
        vendor_domain: record.vendor_domain,
        vendor_logo_url: record.vendor_logo_url,
        vendor_logo_asset: record.vendor_logo_asset,
        vendor_logo_src: record.vendor_logo_src,
        vendor_summary: record.vendor_summary,
        vendor_sort_order: record.vendor_sort_order,
        products: [],
      });
    }

    industry.vendors.get(record.vendor_slug).products.push({
      product_slug: record.product_slug,
      product_name: record.product_name,
      industry_function_slug: record.industry_function_slug,
      industry_function_name: record.industry_function_name,
      industry_function_description: record.industry_function_description,
      industry_function_sort_order: record.industry_function_sort_order,
      product_family: record.product_family,
      integration_status: record.integration_status,
      integration_type: record.integration_type,
      integration_api_url: record.integration_api_url,
      product_summary: record.product_summary,
      product_sort_order: record.product_sort_order,
      is_visible: record.is_visible,
      has_detail: detailRecords.has(detailKey(record.vendor_slug, record.product_slug)),
      detail_path: detailRecords.get(detailKey(record.vendor_slug, record.product_slug))?.detail_path ?? "",
      data_domains: detailRecords.get(detailKey(record.vendor_slug, record.product_slug))?.data_domains ?? [],
      data_coverage_summary:
        detailRecords.get(detailKey(record.vendor_slug, record.product_slug))?.data_coverage_summary ?? "",
      asset_data_available:
        detailRecords.get(detailKey(record.vendor_slug, record.product_slug))?.asset_data_available ?? null,
      telemetry_data_available:
        detailRecords.get(detailKey(record.vendor_slug, record.product_slug))?.telemetry_data_available ?? null,
      writeback_supported:
        detailRecords.get(detailKey(record.vendor_slug, record.product_slug))?.writeback_supported ?? null,
      key_entities: detailRecords.get(detailKey(record.vendor_slug, record.product_slug))?.key_entities ?? [],
    });
  }

  const catalogIndustries = Array.from(industries.values())
    .sort((left, right) => sortByOrder(left, right, left.industry_sort_order, right.industry_sort_order, "industry_name", "industry_name"))
    .map((industry) => ({
      industry_slug: industry.industry_slug,
      industry_name: industry.industry_name,
      industry_description: industry.industry_description,
      functions: Array.from(industry.functions.values())
        .sort((left, right) =>
          sortByOrder(
            left,
            right,
            left.industry_function_sort_order,
            right.industry_function_sort_order,
            "industry_function_name",
            "industry_function_name",
          ),
        )
        .map(({ vendor_slugs, ...definition }) => ({
          ...definition,
          vendor_count: vendor_slugs.size,
          product_count: definition.product_count,
        })),
      vendors: Array.from(industry.vendors.values())
        .sort((left, right) => sortByOrder(left, right, left.vendor_sort_order, right.vendor_sort_order, "vendor_name", "vendor_name"))
        .map((vendor) => ({
          vendor_slug: vendor.vendor_slug,
          vendor_name: vendor.vendor_name,
          vendor_domain: vendor.vendor_domain,
          vendor_logo_url: vendor.vendor_logo_url,
          vendor_logo_asset: vendor.vendor_logo_asset,
          vendor_logo_src: vendor.vendor_logo_src,
          vendor_summary: vendor.vendor_summary,
          products: vendor.products.sort((left, right) =>
            sortByOrder(left, right, left.product_sort_order, right.product_sort_order, "product_name", "product_name"),
          ),
        })),
    }));

  return {
    meta: {
      generated_at: new Date().toISOString(),
      source_csv: source.sourceLabel,
      source_mode: source.sourceMode,
      public_json_path: "/integrations.json",
      public_json_url: `${publicSiteBaseUrl}/integrations.json`,
      record_count: visibleRecords.length,
      industry_count: catalogIndustries.length,
      function_count: catalogIndustries.reduce((total, industry) => total + industry.functions.length, 0),
      discovery: {
        html_meta_name: "lastmile:integrations-data",
        html_meta_content: `${publicSiteBaseUrl}/integrations.json`,
        html_link_rel: "alternate",
        html_link_type: "application/json",
        api_docs_field: "integration_api_url",
      },
      machine_readable_fields: {
        integration_api_url: "API documentation URL for AI agents. This field is intentionally present in JSON and not rendered in the public UI.",
        vendor_domain: "Resolved vendor domain used for scalable logo enrichment and vendor identity mapping.",
        vendor_logo_src: "Resolved public logo path or external image URL used by the UI when available.",
        detail_path: "Route-addressable JSON detail payload for a specific OEM product integration.",
        industry_function_slug: "Stable machine key for the operational function inside an industry, used for filtering and navigation.",
        industry_function_name: "Visible operational function label used by the UI and machine-readable clients.",
        data_domains: "Normalized capability tags describing the main data domains exposed by the integration.",
        data_coverage_summary: "Short buyer-facing summary of what data can be accessed via the integration.",
      },
    },
    industries: catalogIndustries,
  };
}

function buildVendorLookup(records) {
  const vendors = new Map();

  for (const record of records) {
    if (!vendors.has(record.vendor_slug)) {
      vendors.set(record.vendor_slug, {
        vendor_slug: record.vendor_slug,
        vendor_name: record.vendor_name,
        vendor_domain: record.vendor_domain,
        vendor_logo_src: record.vendor_logo_src,
      });
      continue;
    }

    const currentVendor = vendors.get(record.vendor_slug);

    if (!currentVendor.vendor_domain && record.vendor_domain) {
      currentVendor.vendor_domain = record.vendor_domain;
    }

    if (!currentVendor.vendor_logo_src && record.vendor_logo_src) {
      currentVendor.vendor_logo_src = record.vendor_logo_src;
    }
  }

  return vendors;
}

function enrichDetailRecords(detailRecords, vendorLookup) {
  const enrichedDetails = new Map();

  for (const [key, detailRecord] of detailRecords.entries()) {
    const vendor = vendorLookup.get(detailRecord.vendor_slug);

    enrichedDetails.set(key, {
      ...detailRecord,
      vendor_domain: vendor?.vendor_domain ?? "",
      vendor_logo_src: vendor?.vendor_logo_src ?? "",
    });
  }

  return enrichedDetails;
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  const config = args.configSpecified ? await readConfig(args.configPath) : null;
  const logoConfig = {
    logoDevPublishableKey:
      (typeof process.env.LOGO_DEV_PUBLISHABLE_KEY === "string" ? process.env.LOGO_DEV_PUBLISHABLE_KEY.trim() : "") ||
      (typeof config?.logo_dev_publishable_key === "string" ? config.logo_dev_publishable_key.trim() : ""),
  };
  const configuredSourceUrl = config?.csv_url && typeof config.csv_url === "string" ? config.csv_url.trim() : "";
  const shouldSaveSource = args.saveSource || config?.save_source_copy === true;
  const source = await readSourceCsv(args.sourceUrl || configuredSourceUrl);
  const functionTaxonomy = await loadFunctionTaxonomy();
  const manualDetailRecords = await loadIntegrationDetails();
  const csvContent = source.csvContent;
  const rows = parseCsv(csvContent);

  if (rows.length < 2) {
    throw new Error("The integrations CSV must contain a header row and at least one data row.");
  }

  const [headerRow, ...dataRows] = rows;
  const records = dataRows.map((row) => {
    const rawRecord = Object.fromEntries(
      headerRow.map((header, index) => [header, (row[index] ?? "").trim()]),
    );

    return {
      ...rawRecord,
      integration_status: rawRecord.integration_status.toLowerCase(),
      industry_function_slug: String(rawRecord.industry_function_slug ?? "").trim(),
      industry_function_name: String(rawRecord.industry_function_name ?? "").trim(),
      industry_function_description: String(rawRecord.industry_function_description ?? "").trim(),
      industry_function_sort_order: toNumber(rawRecord.industry_function_sort_order),
      vendor_domain: inferVendorDomain(rawRecord),
      vendor_logo_asset: normalizeAssetPath(rawRecord.vendor_logo_asset),
      industry_sort_order: toNumber(rawRecord.industry_sort_order),
      vendor_sort_order: toNumber(rawRecord.vendor_sort_order),
      product_sort_order: toNumber(rawRecord.product_sort_order),
      is_visible: toBoolean(rawRecord.is_visible),
    };
  })
    .map((record) => ({
      ...record,
      ...normalizeFunctionMetadata(record, functionTaxonomy),
    }))
    .map((record) => ({
      ...record,
      vendor_logo_src: resolveVendorLogoSrc(record, logoConfig),
    }));

  const generatedAndManualDetailRecords = buildDetailRecords(records, manualDetailRecords);
  const vendorLookup = buildVendorLookup(records);
  const enrichedDetailRecords = enrichDetailRecords(generatedAndManualDetailRecords, vendorLookup);
  const detailRecords = await preserveGeneratedDetailTimestamps(enrichedDetailRecords);

  const { errors, warnings } = await validateRecords(headerRow, dataRows, records, detailRecords);

  if (warnings.length > 0) {
    for (const warning of warnings) {
      console.warn(`Warning: ${warning}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Integrations CSV validation failed:\n- ${errors.join("\n- ")}`);
  }

  if (shouldSaveSource && source.sourceMode !== "local-file") {
    await mkdir(path.dirname(sourceCsvPath), { recursive: true });
    await writeFile(sourceCsvPath, csvContent, "utf8");
  }

  if (args.validateOnly) {
    console.log(`Validated integrations CSV from ${source.sourceLabel}`);
    return;
  }

  const existingCatalog = await readJsonIfExists(outputJsonPath);
  const nextCatalog = buildCatalog(records, source, detailRecords, functionTaxonomy);
  const catalog = preserveCatalogTimestamp(nextCatalog, existingCatalog);

  await mkdir(path.dirname(outputJsonPath), { recursive: true });
  await writeFile(outputJsonPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  await writeIntegrationDetails(detailRecords);

  console.log(`Generated ${outputJsonPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});