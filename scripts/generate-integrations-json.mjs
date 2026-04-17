import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const sourceCsvPath = path.join(repoRoot, "data", "integrations.csv");
const outputJsonPath = path.join(repoRoot, "public", "integrations.json");
const defaultConfigPath = path.join(repoRoot, "data", "integrations-source.json");
const publicSiteBaseUrl = "https://lastmileinc.ai";
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
const allowedStatuses = new Set(["planned", "in-progress", "built", "deprecated"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

async function readConfig(configPath) {
  if (!(await fileExists(configPath))) {
    return null;
  }

  const content = await readFile(configPath, "utf8");
  return JSON.parse(content);
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
    const response = await fetch(sourceIdentifier);

    if (!response.ok) {
      throw new Error(`Unable to fetch CSV source: ${response.status} ${response.statusText}`);
    }

    return {
      csvContent: await response.text(),
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

function normalizeAssetPath(assetPath) {
  const trimmedAssetPath = assetPath.trim().replace(/\\/g, "/").replace(/^\/+/, "");
  return trimmedAssetPath ? `/${trimmedAssetPath}` : "";
}

function isHttpUrl(value) {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

async function validateRecords(headerRow, dataRows, records) {
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

  const seenProductKeys = new Set();

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

    if (record.integration_status && !allowedStatuses.has(record.integration_status)) {
      errors.push(`Row ${lineNumber} has unsupported integration_status '${record.integration_status}'.`);
    }

    if (record.vendor_logo_url && !isHttpUrl(record.vendor_logo_url)) {
      errors.push(`Row ${lineNumber} has invalid vendor_logo_url '${record.vendor_logo_url}'.`);
    }

    if (record.integration_api_url) {
      if (!isHttpUrl(record.integration_api_url)) {
        errors.push(`Row ${lineNumber} has invalid integration_api_url '${record.integration_api_url}'.`);
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
  }

  return { errors, warnings };
}

function buildCatalog(records, source) {
  const visibleRecords = records.filter((record) => record.is_visible);
  const industries = new Map();

  for (const record of visibleRecords) {
    if (!industries.has(record.industry_slug)) {
      industries.set(record.industry_slug, {
        industry_slug: record.industry_slug,
        industry_name: record.industry_name,
        industry_description: record.industry_description,
        industry_sort_order: record.industry_sort_order,
        vendors: new Map(),
      });
    }

    const industry = industries.get(record.industry_slug);

    if (!industry.vendors.has(record.vendor_slug)) {
      industry.vendors.set(record.vendor_slug, {
        vendor_slug: record.vendor_slug,
        vendor_name: record.vendor_name,
        vendor_logo_url: record.vendor_logo_url,
        vendor_logo_asset: record.vendor_logo_asset,
        vendor_logo_src: record.vendor_logo_asset || record.vendor_logo_url,
        vendor_summary: record.vendor_summary,
        vendor_sort_order: record.vendor_sort_order,
        products: [],
      });
    }

    industry.vendors.get(record.vendor_slug).products.push({
      product_slug: record.product_slug,
      product_name: record.product_name,
      product_family: record.product_family,
      integration_status: record.integration_status,
      integration_type: record.integration_type,
      integration_api_url: record.integration_api_url,
      product_summary: record.product_summary,
      product_sort_order: record.product_sort_order,
      is_visible: record.is_visible,
    });
  }

  const catalogIndustries = Array.from(industries.values())
    .sort((left, right) => sortByOrder(left, right, left.industry_sort_order, right.industry_sort_order, "industry_name", "industry_name"))
    .map((industry) => ({
      industry_slug: industry.industry_slug,
      industry_name: industry.industry_name,
      industry_description: industry.industry_description,
      vendors: Array.from(industry.vendors.values())
        .sort((left, right) => sortByOrder(left, right, left.vendor_sort_order, right.vendor_sort_order, "vendor_name", "vendor_name"))
        .map((vendor) => ({
          vendor_slug: vendor.vendor_slug,
          vendor_name: vendor.vendor_name,
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
      discovery: {
        html_meta_name: "lastmile:integrations-data",
        html_meta_content: `${publicSiteBaseUrl}/integrations.json`,
        html_link_rel: "alternate",
        html_link_type: "application/json",
        api_docs_field: "integration_api_url",
      },
      machine_readable_fields: {
        integration_api_url: "API documentation URL for AI agents. This field is intentionally present in JSON and not rendered in the public UI.",
        vendor_logo_src: "Resolved public logo path or external image URL used by the UI when available.",
      },
    },
    industries: catalogIndustries,
  };
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  const config = args.configSpecified ? await readConfig(args.configPath) : null;
  const configuredSourceUrl = config?.csv_url && typeof config.csv_url === "string" ? config.csv_url.trim() : "";
  const shouldSaveSource = args.saveSource || config?.save_source_copy === true;
  const source = await readSourceCsv(args.sourceUrl || configuredSourceUrl);
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
      vendor_logo_asset: normalizeAssetPath(rawRecord.vendor_logo_asset),
      industry_sort_order: toNumber(rawRecord.industry_sort_order),
      vendor_sort_order: toNumber(rawRecord.vendor_sort_order),
      product_sort_order: toNumber(rawRecord.product_sort_order),
      is_visible: toBoolean(rawRecord.is_visible),
    };
  });

  const { errors, warnings } = await validateRecords(headerRow, dataRows, records);

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

  const catalog = buildCatalog(records, source);

  await mkdir(path.dirname(outputJsonPath), { recursive: true });
  await writeFile(outputJsonPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

  console.log(`Generated ${outputJsonPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});