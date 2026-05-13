import { createHash } from "node:crypto";
import { access, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseCsvRows } from "csv-parse/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const sourceCsvPath = path.join(repoRoot, "data", "integrations.csv");
const outputJsonPath = path.join(repoRoot, "public", "integrations.json");
const detailSourceDir = path.join(repoRoot, "data", "integration-details");
const detailOutputDir = path.join(repoRoot, "public", "integration-details");
const manufacturedSpecOutputDir = path.join(repoRoot, "public", "manufactured-openapi");
const defaultConfigPath = path.join(repoRoot, "data", "integrations-source.json");
const functionTaxonomyPath = path.join(repoRoot, "data", "industry-function-taxonomy.json");
const specArtifactPolicyPath = path.join(repoRoot, "data", "spec-artifact-policy.json");
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
const defaultSpecArtifactPolicy = {
  exactArtifactExtensions: [".json", ".yaml", ".yml"],
  endpointHintPatterns: ["openapi", "swagger", "asyncapi", "api-docs", "api_docs", "schema", "spec"],
  queryHintPatterns: [
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
  jsonMarkers: ["openapi", "swagger", "asyncapi", "paths", "components", "channels", "info", "item", "servers", "eventNames"],
  yamlMarkers: ["openapi", "swagger", "asyncapi", "paths", "components", "channels", "info"],
  yamlTextMarkers: ["openapi:", "swagger:", "asyncapi:", "paths:", "channels:", "components:", "info:"],
};
let specArtifactPolicy = defaultSpecArtifactPolicy;
const strictCapabilityValues = new Set(["Supported", "Unsupported"]);
const blockedIntegrationTypes = new Set(["SDK", "Developer Portal"]);
const genericDetailPhrases = [
  "this baseline detail page was generated from the catalog metadata and linked documentation",
  "this standardized detail view was generated from the catalog row and linked documentation",
  "published api documentation is available from the linked source documentation",
  "exact entities, payloads, and operations should be confirmed in the source documentation before implementation",
  "manual data-element profiling has not yet been completed for this product",
];
const unclassifiedFunction = {
  industry_function_slug: "unclassified",
  industry_function_name: "Unclassified",
  industry_function_description:
    "Legacy or newly added rows that have not yet been classified into a specific operational function.",
  industry_function_sort_order: 9999,
};

const supportedOpenApiMethods = new Set(["get", "post", "put", "patch", "delete"]);

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

async function loadSpecArtifactPolicy() {
  const rawPolicy = await readJsonIfExists(specArtifactPolicyPath);

  if (!rawPolicy || typeof rawPolicy !== "object") {
    specArtifactPolicy = defaultSpecArtifactPolicy;
    return;
  }

  specArtifactPolicy = {
    exactArtifactExtensions: Array.isArray(rawPolicy.exact_artifact_extensions)
      ? rawPolicy.exact_artifact_extensions.map((value) => String(value ?? "").trim().toLowerCase()).filter(Boolean)
      : defaultSpecArtifactPolicy.exactArtifactExtensions,
    endpointHintPatterns: Array.isArray(rawPolicy.endpoint_hint_patterns)
      ? rawPolicy.endpoint_hint_patterns.map((value) => String(value ?? "").trim().toLowerCase()).filter(Boolean)
      : defaultSpecArtifactPolicy.endpointHintPatterns,
    queryHintPatterns: Array.isArray(rawPolicy.query_hint_patterns)
      ? rawPolicy.query_hint_patterns.map((value) => String(value ?? "").trim().toLowerCase()).filter(Boolean)
      : defaultSpecArtifactPolicy.queryHintPatterns,
    jsonMarkers: Array.isArray(rawPolicy.json_markers)
      ? rawPolicy.json_markers.map((value) => String(value ?? "").trim()).filter(Boolean)
      : defaultSpecArtifactPolicy.jsonMarkers,
    yamlMarkers: Array.isArray(rawPolicy.yaml_markers)
      ? rawPolicy.yaml_markers.map((value) => String(value ?? "").trim()).filter(Boolean)
      : defaultSpecArtifactPolicy.yamlMarkers,
    yamlTextMarkers: Array.isArray(rawPolicy.yaml_text_markers)
      ? rawPolicy.yaml_text_markers.map((value) => String(value ?? "").trim().toLowerCase()).filter(Boolean)
      : defaultSpecArtifactPolicy.yamlTextMarkers,
  };
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
    return "Unsupported";
  }

  const normalizedValue = String(value ?? "").trim().toLowerCase();

  if (normalizedValue === "supported") {
    return "Supported";
  }

  if (normalizedValue === "not supported" || normalizedValue === "un-supported" || normalizedValue === "unsupported") {
    return "Unsupported";
  }

  if (normalizedValue === "n/a" || normalizedValue === "na") {
    return "Unsupported";
  }

  return null;
}

function normalizeUrl(value) {
  const normalizedValue = String(value ?? "").trim();

  if (!normalizedValue || !isHttpUrl(normalizedValue)) {
    return "";
  }

  return normalizedValue;
}

function normalizeUrlForComparison(value) {
  if (!value) {
    return "";
  }

  try {
    const parsedUrl = new URL(value);
    const normalizedPath = parsedUrl.pathname.replace(/\/+$/, "") || "/";
    return `${parsedUrl.origin.toLowerCase()}${normalizedPath}${parsedUrl.search}`;
  } catch {
    return String(value).trim().replace(/\/+$/, "").toLowerCase();
  }
}

function isExactSpecArtifactUrl(value) {
  const normalizedValue = normalizeUrl(value);

  if (!normalizedValue) {
    return false;
  }

  try {
    const parsedUrl = new URL(normalizedValue);
    const lowerPath = parsedUrl.pathname.toLowerCase();
    if (specArtifactPolicy.exactArtifactExtensions.some((extension) => lowerPath.endsWith(extension))) {
      return true;
    }

    const lowerSearch = parsedUrl.search.toLowerCase();
    const lowerPathAndQuery = `${lowerPath}${lowerSearch}`;
    const hasPolicyHint = specArtifactPolicy.endpointHintPatterns.some((pattern) => lowerPathAndQuery.includes(pattern))
      || specArtifactPolicy.queryHintPatterns.some((pattern) => lowerSearch.includes(pattern));

    if (!hasPolicyHint) {
      return false;
    }

    if (lowerPath.startsWith("/docs/") || lowerPath.endsWith(".html") || lowerPath.includes("/swagger/ui/") || lowerPath.includes("/swagger/index.html")) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function sanitizeSpecArtifactUrl(specUrl, documentationUrl) {
  const normalizedSpecUrl = normalizeUrl(specUrl);

  if (!normalizedSpecUrl || !isExactSpecArtifactUrl(normalizedSpecUrl)) {
    return "";
  }

  const normalizedDocumentationUrl = normalizeUrl(documentationUrl);
  if (normalizedDocumentationUrl && normalizeUrlForComparison(normalizedSpecUrl) === normalizeUrlForComparison(normalizedDocumentationUrl)) {
    return "";
  }

  return normalizedSpecUrl;
}

function textContainsGenericDetailPhrase(value) {
  const normalizedValue = String(value ?? "").trim().toLowerCase();
  return genericDetailPhrases.some((phrase) => normalizedValue.includes(phrase));
}

function availableDataLooksSubstantive(availableData) {
  if (!Array.isArray(availableData) || availableData.length === 0) {
    return false;
  }

  return availableData.some((section) => {
    const description = String(section?.description ?? "").trim();
    const dataPoints = Array.isArray(section?.data_points)
      ? section.data_points.map((item) => String(item ?? "").trim()).filter(Boolean)
      : [];
    const relevantOperations = Array.isArray(section?.relevant_operations)
      ? section.relevant_operations.map((item) => String(item ?? "").trim()).filter(Boolean)
      : [];

    if (!description || textContainsGenericDetailPhrase(description)) {
      return false;
    }

    if (dataPoints.length === 0) {
      return false;
    }

    const substantiveDataPoints = dataPoints.filter((item) => !textContainsGenericDetailPhrase(item));
    return substantiveDataPoints.length > 0 || relevantOperations.length > 0;
  });
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

function buildMissingDetailPath(record) {
  return `/integration-details/${record.vendor_slug}/${toDetailFileName(record.product_slug)}.json`;
}

function buildManufacturedSpecPath(detailRecord) {
  return `/manufactured-openapi/${detailRecord.vendor_slug}/${toDetailFileName(detailRecord.product_slug)}.openapi.json`;
}

function toAbsolutePublicUrl(relativePath) {
  const normalizedPath = String(relativePath ?? "").trim();

  if (!normalizedPath) {
    return "";
  }

  if (normalizedPath.startsWith("http://") || normalizedPath.startsWith("https://")) {
    return normalizedPath;
  }

  return `${publicSiteBaseUrl}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
}

function slugifyText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function createOperationSlug(value, fallback) {
  const slug = slugifyText(value);
  return slug || fallback;
}

function toTitleCase(value) {
  return String(value ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildPlaceholderServerUrl() {
  return "{protocol}://{host}{basePath}";
}

function inferOperationMethod(operationText) {
  const explicitStart = String(operationText ?? "").match(/^\s*(GET|POST|PUT|PATCH|DELETE)\b/i);
  if (explicitStart) {
    return explicitStart[1].toLowerCase();
  }

  const explicitEnd = String(operationText ?? "").match(/\b(GET|POST|PUT|PATCH|DELETE)\s*$/i);
  if (explicitEnd) {
    return explicitEnd[1].toLowerCase();
  }

  const normalized = String(operationText ?? "").toLowerCase();
  if (normalized.includes("create") || normalized.includes("submit") || normalized.includes("upload")) {
    return "post";
  }

  if (normalized.includes("update") || normalized.includes("put")) {
    return "put";
  }

  if (normalized.includes("delete") || normalized.includes("remove")) {
    return "delete";
  }

  return "get";
}

function inferOperationPath(operationText, fallbackSlug) {
  const normalizedText = String(operationText ?? "").trim();
  const explicitPath = normalizedText.match(/\/(?:[A-Za-z0-9._~!$&'()*+,;=:@{}-]+|\$)+(?:\/[A-Za-z0-9._~!$&'()*+,;=:@{}-]+|\/\$[A-Za-z0-9._~!$&'()*+,;=:@{}-]+)*/);

  if (explicitPath) {
    return explicitPath[0];
  }

  const cleaned = normalizedText
    .replace(/^\s*(GET|POST|PUT|PATCH|DELETE)\s+/i, "")
    .replace(/\s+(GET|POST|PUT|PATCH|DELETE)\s*$/i, "")
    .replace(/^(read-instance:|search-type:|server-capabilities:)/i, "")
    .trim();

  const slug = createOperationSlug(cleaned, fallbackSlug);
  return `/${slug}`;
}

function buildOperationSchemaName(operationText, fallbackSlug) {
  const slug = createOperationSlug(operationText, fallbackSlug);
  return slug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("") || "GeneratedOperation";
}

function deduplicateOperations(detailRecord) {
  const operations = [];
  const seenKeys = new Set();

  detailRecord.available_data.forEach((section, sectionIndex) => {
    const relevantOperations = Array.isArray(section?.relevant_operations)
      ? section.relevant_operations.map((value) => String(value ?? "").trim()).filter(Boolean)
      : [];

    relevantOperations.forEach((operationText, operationIndex) => {
      const fallbackSlug = `operation-${sectionIndex + 1}-${operationIndex + 1}`;
      const method = inferOperationMethod(operationText);
      const pathName = inferOperationPath(operationText, fallbackSlug);
      const key = `${method}:${pathName}`;

      if (!supportedOpenApiMethods.has(method) || seenKeys.has(key)) {
        return;
      }

      seenKeys.add(key);
      operations.push({
        category: String(section?.category ?? "Integration Operations").trim() || "Integration Operations",
        description: String(section?.description ?? "").trim(),
        method,
        operationText,
        pathName,
        schemaName: buildOperationSchemaName(operationText, fallbackSlug),
      });
    });
  });

  if (operations.length > 0) {
    return operations;
  }

  return detailRecord.key_entities.map((entity, index) => {
    const entityLabel = String(entity ?? "").trim();
    const fallbackSlug = `entity-${index + 1}`;
    const slug = createOperationSlug(entityLabel, fallbackSlug);
    return {
      category: "Available Data",
      description: detailRecord.data_coverage_summary,
      method: "get",
      operationText: `Get ${toTitleCase(entityLabel || fallbackSlug)}`,
      pathName: `/${slug}`,
      schemaName: buildOperationSchemaName(entityLabel, fallbackSlug),
    };
  });
}

function buildManufacturedSpec(detailRecord) {
  const operations = deduplicateOperations(detailRecord);
  const vendorSpecUrl = String(detailRecord.vendor_spec_artifact_url ?? "").trim();
  const documentationUrl = String(detailRecord.source_evidence?.documentation_url || detailRecord.integration_api_url || "").trim();
  const reviewedAt = String(detailRecord.source_evidence?.reviewed_at ?? "").trim() || new Date().toISOString().slice(0, 10);
  const paths = {};
  const schemas = {
    IntegrationProfile: {
      type: "object",
      additionalProperties: false,
      properties: {
        vendor_slug: { type: "string", description: "Vendor slug from the Last Mile catalog." },
        product_slug: { type: "string", description: "Product slug from the Last Mile catalog." },
        product_name: { type: "string" },
        data_coverage_summary: { type: "string" },
        data_domains: { type: "array", items: { type: "string" } },
        key_entities: { type: "array", items: { type: "string" } },
        buyer_guidance: { type: "string" },
        overview: { type: "string" },
        asset_data_available: { type: "string", enum: ["Supported", "Unsupported"] },
        telemetry_data_available: { type: "string", enum: ["Supported", "Unsupported"] },
        writeback_supported: { type: "string", enum: ["Supported", "Unsupported"] },
        documentation_url: { type: "string", format: "uri" },
        vendor_spec_artifact_url: { type: "string", format: "uri" },
      },
      required: [
        "vendor_slug",
        "product_slug",
        "product_name",
        "data_coverage_summary",
        "data_domains",
        "key_entities",
        "overview",
        "asset_data_available",
        "telemetry_data_available",
        "writeback_supported",
      ],
    },
    OperationEnvelope: {
      type: "object",
      additionalProperties: true,
      properties: {
        operation: { type: "string" },
        source: { type: "string" },
        notes: { type: "array", items: { type: "string" } },
        records: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
        },
      },
      required: ["operation", "source"],
    },
    MutationEnvelope: {
      type: "object",
      additionalProperties: true,
      properties: {
        operation: { type: "string" },
        payload: {
          type: "object",
          additionalProperties: true,
          description: "Manufactured placeholder payload derived from curated research. Replace with vendor-confirmed fields during implementation.",
        },
      },
      required: ["operation"],
    },
    StandardError: {
      type: "object",
      properties: {
        message: { type: "string" },
        detail: { type: "string" },
      },
      required: ["message"],
    },
  };

  paths["/integration-profile"] = {
    get: {
      tags: ["Integration Profile"],
      operationId: `${detailRecord.vendor_slug}_${detailRecord.product_slug}_integrationProfile`,
      summary: `Get manufactured profile for ${detailRecord.product_name}`,
      description: "Returns the Last Mile curated integration profile used to synthesize this OpenAPI artifact.",
      responses: {
        200: {
          description: "Curated integration profile.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/IntegrationProfile" },
            },
          },
        },
      },
      "x-lastmile-confidence": "researched",
      "x-lastmile-manufactured": true,
    },
  };

  for (const operation of operations) {
    if (!paths[operation.pathName]) {
      paths[operation.pathName] = {};
    }

    const operationIdBase = `${detailRecord.vendor_slug}_${detailRecord.product_slug}_${createOperationSlug(operation.operationText, operation.schemaName.toLowerCase())}`;
    const nextOperation = {
      tags: [operation.category],
      operationId: `${operationIdBase}_${operation.method}`,
      summary: operation.operationText,
      description: [
        "Manufactured OpenAPI operation synthesized from Last Mile curated research.",
        operation.description,
        `Vendor documentation: ${documentationUrl || "Not provided"}`,
      ]
        .filter(Boolean)
        .join(" "),
      responses: {
        200: {
          description: `Manufactured response envelope for ${operation.operationText}.`,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OperationEnvelope" },
            },
          },
        },
        default: {
          description: "Error response.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/StandardError" },
            },
          },
        },
      },
      "x-lastmile-confidence": "manufactured-from-curated-json",
      "x-lastmile-manufactured": true,
    };

    if (operation.method !== "get") {
      nextOperation.requestBody = {
        required: operation.method === "post" || operation.method === "put" || operation.method === "patch",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/MutationEnvelope" },
          },
        },
      };
      nextOperation.responses[201] = nextOperation.responses[200];
    }

    paths[operation.pathName][operation.method] = nextOperation;
  }

  return {
    openapi: "3.1.0",
    info: {
      title: `${detailRecord.product_name} Manufactured OpenAPI`,
      version: `0.1.0-manufactured-${reviewedAt}`,
      summary: detailRecord.data_coverage_summary,
      description: [
        `Manufactured OpenAPI artifact for ${detailRecord.product_name}.`,
        "This file was synthesized by Last Mile from curated research JSON and is not vendor-certified.",
        "Use it as an agent-consumable starting point, then validate paths, schemas, authentication, and server URLs with the vendor before production use.",
        detailRecord.overview,
      ]
        .filter(Boolean)
        .join(" "),
      contact: {
        name: "Last Mile Catalog Research",
        url: publicSiteBaseUrl,
      },
    },
    servers: [
      {
        url: buildPlaceholderServerUrl(),
        description: "Placeholder server template. Replace with the vendor-confirmed API host and base path before generating production clients.",
        variables: {
          protocol: {
            default: "https",
            enum: ["https"],
          },
          host: {
            default: "replace-with-vendor-host.invalid",
          },
          basePath: {
            default: "/",
          },
        },
      },
    ],
    externalDocs: documentationUrl
      ? {
          description: "Vendor documentation used as the primary public source for this manufactured contract.",
          url: documentationUrl,
        }
      : undefined,
    tags: [
      { name: "Integration Profile", description: "Last Mile manufactured profile and research provenance." },
      ...Array.from(new Set(operations.map((operation) => operation.category))).map((category) => ({
        name: category,
        description: `Manufactured operations grouped under ${category}.`,
      })),
    ],
    paths,
    components: {
      schemas,
    },
    "x-lastmile": {
      api_spec_origin: "manufactured",
      manufactured_from_detail_path: detailRecord.detail_path,
      vendor_documentation_url: documentationUrl,
      vendor_spec_artifact_url: vendorSpecUrl,
      reviewed_at: reviewedAt,
    },
  };
}

function applyManufacturedSpecMetadata(detailRecords) {
  const enrichedDetails = new Map();

  for (const [key, detailRecord] of detailRecords.entries()) {
    const manufacturedSpecPath = buildManufacturedSpecPath(detailRecord);
    const manufacturedSpecUrl = toAbsolutePublicUrl(manufacturedSpecPath);
    const vendorSpecArtifactUrl = String(detailRecord.vendor_spec_artifact_url || detailRecord.spec_artifact_url || "").trim();

    enrichedDetails.set(key, {
      ...detailRecord,
      api_spec_origin: "manufactured",
      manufactured_spec_artifact_url: manufacturedSpecUrl,
      vendor_spec_artifact_url: vendorSpecArtifactUrl,
      spec_artifact_url: manufacturedSpecUrl,
      source_evidence: {
        ...(detailRecord.source_evidence ?? {}),
        vendor_spec_url: vendorSpecArtifactUrl,
        manufactured_spec_url: manufacturedSpecUrl,
        spec_url: manufacturedSpecUrl,
      },
      manufactured_spec_path: manufacturedSpecPath,
    });
  }

  return enrichedDetails;
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

    const normalizedDocumentationUrl = normalizeUrl(rawDetail?.source_evidence?.documentation_url ?? rawDetail.integration_api_url);
    const normalizedSpecUrl = sanitizeSpecArtifactUrl(
      rawDetail?.source_evidence?.spec_url ?? rawDetail.spec_artifact_url,
      normalizedDocumentationUrl,
    );

    const normalizedDetail = {
      vendor_slug: vendorSlug,
      vendor_name: String(rawDetail.vendor_name ?? "").trim(),
      product_slug: productSlug,
      product_name: String(rawDetail.product_name ?? "").trim(),
      product_family: String(rawDetail.product_family ?? "").trim(),
      integration_type: String(rawDetail.integration_type ?? "").trim(),
      integration_api_url: normalizeUrl(rawDetail.integration_api_url),
      spec_artifact_url: normalizedSpecUrl,
      vendor_spec_artifact_url: normalizedSpecUrl,
      detail_completeness: "researched",
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
      source_evidence: {
        ...(rawDetail.source_evidence ?? {}),
        documentation_url: normalizedDocumentationUrl,
        spec_url: normalizedSpecUrl,
      },
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

function buildDetailRecords(records, manualDetailRecords) {
  void records;
  return new Map(manualDetailRecords);
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
    const nextContent = `${JSON.stringify(detailRecord, null, 2)}\n`;
    const existingContent = await readFile(outputPath, "utf8").catch(() => "");

    if (existingContent === nextContent) {
      continue;
    }

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, nextContent, "utf8");
  }
}

async function writeManufacturedSpecs(detailRecords) {
  const existingFiles = await walkJsonFiles(manufacturedSpecOutputDir);
  const nextOutputPaths = new Set(
    Array.from(detailRecords.values()).map((detailRecord) =>
      path.join(repoRoot, "public", detailRecord.manufactured_spec_path.replace(/^\//, "")),
    ),
  );

  for (const existingFile of existingFiles) {
    if (nextOutputPaths.has(existingFile)) {
      continue;
    }

    try {
      await rm(existingFile, { force: true });
    } catch (error) {
      console.warn(`Warning: unable to remove stale manufactured spec file ${existingFile}: ${error}`);
    }
  }

  for (const detailRecord of detailRecords.values()) {
    const outputPath = path.join(repoRoot, "public", detailRecord.manufactured_spec_path.replace(/^\//, ""));
    const nextContent = `${JSON.stringify(buildManufacturedSpec(detailRecord), null, 2)}\n`;
    const existingContent = await readFile(outputPath, "utf8").catch(() => "");

    if (existingContent === nextContent) {
      continue;
    }

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, nextContent, "utf8");
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
  return parseCsvRows(content, {
    bom: true,
    relax_column_count: true,
    skip_empty_lines: true,
  }).filter((row) => Array.isArray(row) && row.some((value) => String(value ?? "").trim() !== ""));
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

    if (blockedIntegrationTypes.has(record.integration_type)) {
      errors.push(`Row ${lineNumber} uses unsupported integration_type '${record.integration_type}'. Remove SDKs and developer portals from the catalog.`);
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
      continue;
    }

    if (detailRecord.detail_completeness !== "researched") {
      errors.push(`Detail metadata for ${key} must use detail_completeness=researched.`);
    }

    for (const fieldName of ["asset_data_available", "telemetry_data_available", "writeback_supported"]) {
      if (!strictCapabilityValues.has(detailRecord[fieldName])) {
        errors.push(`Detail metadata for ${key} must set ${fieldName} to Supported or Unsupported.`);
      }
    }

    if (textContainsGenericDetailPhrase(detailRecord.data_coverage_summary)) {
      errors.push(`Detail metadata for ${key} uses generic data_coverage_summary text and must be replaced with source-backed copy.`);
    }

    if (textContainsGenericDetailPhrase(detailRecord.overview)) {
      errors.push(`Detail metadata for ${key} uses generic overview text and must be replaced with source-backed copy.`);
    }

    if (!availableDataLooksSubstantive(detailRecord.available_data)) {
      errors.push(`Detail metadata for ${key} must provide substantive available_data entries with real data elements or operations.`);
    }

    const documentationUrl = normalizeUrl(detailRecord.source_evidence?.documentation_url || detailRecord.integration_api_url);
    const specUrl = normalizeUrl(detailRecord.source_evidence?.spec_url || detailRecord.spec_artifact_url);

    if (specUrl && !isExactSpecArtifactUrl(specUrl)) {
      errors.push(`Detail metadata for ${key} has spec evidence that is not an exact JSON/YAML artifact URL.`);
    }

    if (
      documentationUrl &&
      specUrl &&
      normalizeUrlForComparison(documentationUrl) === normalizeUrlForComparison(specUrl)
    ) {
      errors.push(`Detail metadata for ${key} uses the same URL for documentation and spec artifact evidence.`);
    }
  }

  for (const record of records.filter((currentRecord) => currentRecord.is_visible)) {
    const key = detailKey(record.vendor_slug, record.product_slug);

    if (!detailRecords.has(key)) {
      errors.push(
        `Visible integration ${key} is missing curated detail metadata. Add ${buildMissingDetailPath(record).replace(/^\//, "data/")} before publishing.`,
      );
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
      spec_artifact_url: detailRecords.get(detailKey(record.vendor_slug, record.product_slug))?.spec_artifact_url ?? "",
      api_spec_origin: detailRecords.get(detailKey(record.vendor_slug, record.product_slug))?.api_spec_origin ?? "vendor",
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
        spec_artifact_url: "Preferred spec artifact URL exposed to AI agents and the public integration detail page.",
        api_spec_origin: "Indicates whether the exposed spec artifact was published by the vendor or manufactured by Last Mile.",
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
  await loadSpecArtifactPolicy();
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
  const detailRecords = applyManufacturedSpecMetadata(
    enrichDetailRecords(generatedAndManualDetailRecords, vendorLookup),
  );

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
  await writeManufacturedSpecs(detailRecords);

  console.log(`Generated ${outputJsonPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});