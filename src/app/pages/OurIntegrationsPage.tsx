import { useDeferredValue, useEffect, useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  Factory,
  HeartPulse,
  Search,
  ShoppingCart,
  Sparkles,
  Truck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { SEO } from "@/app/components/SEO";

interface IntegrationProduct {
  product_slug: string;
  product_name: string;
  industry_function_slug: string;
  industry_function_name: string;
  industry_function_description: string;
  industry_function_sort_order: number;
  product_family: string;
  integration_status: string;
  integration_type: string;
  integration_api_url: string;
  product_summary: string;
  is_visible: boolean;
  has_detail: boolean;
  detail_path: string;
  data_domains: string[];
  data_coverage_summary: string;
  asset_data_available: "Supported" | "Not Supported" | "N/A" | null;
  telemetry_data_available: "Supported" | "Not Supported" | "N/A" | null;
  writeback_supported: "Supported" | "Not Supported" | "N/A" | null;
  key_entities: string[];
}

interface IntegrationVendor {
  vendor_slug: string;
  vendor_name: string;
  vendor_domain: string;
  vendor_logo_url: string;
  vendor_logo_asset: string;
  vendor_logo_src: string;
  vendor_summary: string;
  products: IntegrationProduct[];
}

interface IntegrationIndustry {
  industry_slug: string;
  industry_name: string;
  industry_description: string;
  functions: IntegrationFunctionSummary[];
  vendors: IntegrationVendor[];
}

interface IntegrationFunctionSummary {
  industry_function_slug: string;
  industry_function_name: string;
  industry_function_description: string;
  industry_function_sort_order: number;
  vendor_count: number;
  product_count: number;
}

interface IntegrationCatalog {
  meta: {
    generated_at: string;
    source_csv: string;
    source_mode: string;
    public_json_path: string;
    public_json_url: string;
    record_count: number;
    industry_count: number;
    function_count: number;
    discovery: {
      html_meta_name: string;
      html_meta_content: string;
      html_link_rel: string;
      html_link_type: string;
      api_docs_field: string;
    };
    machine_readable_fields: Record<string, string>;
  };
  industries: IntegrationIndustry[];
}

interface SearchableVendor {
  industry_slug: string;
  industry_name: string;
  vendor: IntegrationVendor;
  functions: string[];
  match_products: IntegrationProduct[];
}

const integrationsDataUrl = "https://lastmileinc.ai/integrations.json";

const industryIcons: Record<string, typeof Factory> = {
  manufacturing: Factory,
  healthcare: HeartPulse,
  retail: ShoppingCart,
  logistics: Truck,
  "service-providers": Users,
  energy: Zap,
};

const industryLabels: Record<string, string> = {
  manufacturing: "OEM Vendors",
  healthcare: "Medical Device Vendors",
  retail: "Store Equipment Vendors",
  logistics: "Fleet & Automation Vendors",
  "service-providers": "Service Providers",
  energy: "Infrastructure Vendors",
};

const vendorAccentClasses = [
  "from-[#217ED9] to-cyan-300",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-400",
  "from-rose-400 to-pink-500",
  "from-sky-400 to-blue-500",
  "from-violet-400 to-fuchsia-500",
  "from-lime-300 to-emerald-500",
  "from-yellow-300 to-amber-500",
];

function buildNoStoreUrl(path: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}ts=${Date.now()}`;
}

export function OurIntegrationsPage() {
  const [catalog, setCatalog] = useState<IntegrationCatalog | null>(null);
  const [catalogState, setCatalogState] = useState<"loading" | "ready" | "error">("loading");
  const [selectedIndustryId, setSelectedIndustryId] = useState("");
  const [selectedFunctionId, setSelectedFunctionId] = useState("");
  const [openVendorSlugs, setOpenVendorSlugs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      try {
        const response = await fetch(buildNoStoreUrl("/integrations.json"), {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`Unable to load integrations catalog: ${response.status}`);
        }

        const nextCatalog = (await response.json()) as IntegrationCatalog;

        if (!isMounted) {
          return;
        }

        setCatalog(nextCatalog);
        setSelectedIndustryId((currentIndustryId) => currentIndustryId || nextCatalog.industries[0]?.industry_slug || "");
        setCatalogState("ready");
      } catch {
        if (isMounted) {
          setCatalogState("error");
        }
      }
    };

    void loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  const integrationGroups = [...(catalog?.industries ?? [])]
    .map((group) => ({
      ...group,
      vendors: [...group.vendors].sort((left, right) => left.vendor_name.localeCompare(right.vendor_name)),
    }));
  const selectedIndustry =
    integrationGroups.find((group) => group.industry_slug === selectedIndustryId) ?? integrationGroups[0] ?? null;
  const selectedFunction =
    selectedIndustry?.functions.find((entry) => entry.industry_function_slug === selectedFunctionId) ?? null;
  const filteredIndustryVendors = selectedIndustry
    ? selectedIndustry.vendors
        .map((vendor) => ({
          ...vendor,
          products: selectedFunctionId
            ? vendor.products.filter((product) => getProductFunctionSlug(product) === selectedFunctionId)
            : vendor.products,
        }))
        .filter((vendor) => vendor.products.length > 0)
    : [];
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const searchableVendors: SearchableVendor[] = integrationGroups.flatMap((group) =>
    group.vendors.map((vendor) => ({
      industry_slug: group.industry_slug,
      industry_name: group.industry_name,
      vendor,
      functions: Array.from(
        new Set(vendor.products.map((product) => getProductFunctionName(product)).filter(Boolean)),
      ),
      match_products: vendor.products,
    })),
  );
  const vendorSearchResults = normalizedSearchQuery
    ? searchableVendors
        .map((entry) => {
          const vendorName = entry.vendor.vendor_name.toLowerCase();
          const vendorSummary = entry.vendor.vendor_summary.toLowerCase();
          const matchingProducts = entry.vendor.products.filter((product) => {
            const haystack = [
              product.product_name,
              product.product_family,
              product.industry_function_name,
              product.industry_function_description,
              product.integration_type,
              product.data_coverage_summary,
            ]
              .join(" ")
              .toLowerCase();

            return haystack.includes(normalizedSearchQuery);
          });
          const vendorMatches =
            vendorName.includes(normalizedSearchQuery) ||
            vendorSummary.includes(normalizedSearchQuery) ||
            entry.industry_name.toLowerCase().includes(normalizedSearchQuery) ||
            entry.functions.some((functionName) => functionName.toLowerCase().includes(normalizedSearchQuery));

          if (!vendorMatches && matchingProducts.length === 0) {
            return null;
          }

          return {
            ...entry,
            match_products: matchingProducts,
            primary_product: matchingProducts[0] ?? entry.vendor.products[0] ?? null,
            relevanceScore: vendorMatches ? 2 : 1,
          };
        })
        .filter((entry): entry is SearchableVendor & { relevanceScore: number; primary_product: IntegrationProduct | null } => Boolean(entry))
        .sort((left, right) => {
          const vendorNameCompare = left.vendor.vendor_name.localeCompare(right.vendor.vendor_name, undefined, {
            sensitivity: "base",
          });

          if (vendorNameCompare !== 0) {
            return vendorNameCompare;
          }

          return (left.primary_product?.product_name ?? "").localeCompare(
            right.primary_product?.product_name ?? "",
            undefined,
            { sensitivity: "base" },
          );
        })
    : [];
  const searchResultCount = vendorSearchResults.length;

  const vendorCount = filteredIndustryVendors.length;
  const totalVendors = new Set(
    integrationGroups.flatMap((group) => group.vendors.map((vendor) => vendor.vendor_slug)),
  ).size;
  const totalProducts = integrationGroups.reduce(
    (total, group) => total + group.vendors.reduce((groupTotal, vendor) => groupTotal + vendor.products.length, 0),
    0,
  );
  const totalDetailedProducts = integrationGroups.reduce(
    (total, group) =>
      total +
      group.vendors.reduce(
        (groupTotal, vendor) => groupTotal + vendor.products.filter((product) => product.has_detail).length,
        0,
      ),
    0,
  );
  const totalRepresentedFunctions = integrationGroups.reduce(
    (total, group) => total + group.functions.filter((entry) => entry.product_count > 0).length,
    0,
  );
  const discoveredIntegrationsDataUrl = catalog?.meta.public_json_url ?? integrationsDataUrl;
  const lastUpdatedLabel = catalog ? formatLastUpdated(catalog.meta.generated_at) : "";

  const toggleVendor = (vendorSlug: string) => {
    setOpenVendorSlugs((currentOpenVendors) =>
      currentOpenVendors.includes(vendorSlug)
        ? currentOpenVendors.filter((slug) => slug !== vendorSlug)
        : [...currentOpenVendors, vendorSlug],
    );
  };

  const handleIndustryChange = (industryId: string) => {
    setSelectedIndustryId(industryId);
    setSelectedFunctionId("");
    setOpenVendorSlugs([]);
  };

  const handleFunctionChange = (functionId: string) => {
    setSelectedFunctionId(functionId);
    setOpenVendorSlugs([]);
  };

  const currentIndustryLabel = selectedIndustry ? getIndustryLabel(selectedIndustry.industry_slug) : "OEM Vendors";
  const currentHeading = selectedFunction?.industry_function_name || selectedIndustry?.industry_name || "Integrations";
  const currentDescription = selectedFunction?.industry_function_description || selectedIndustry?.industry_description || "";
  const currentContextLabel = selectedFunction
    ? `${selectedIndustry?.industry_name ?? "Industry"} Function`
    : currentIndustryLabel;

  return (
    <>
      <SEO
        title="Our Integrations"
        description="Explore Last Mile integrations by industry, OEM vendor, and supported product families in a machine-readable catalog built for both buyers and AI-driven implementation workflows."
        keywords="integrations, OEM integrations, manufacturing integrations, healthcare integrations, logistics integrations, ServiceNow"
        canonicalPath="/integrations"
        markdownPath="/integrations.md"
      />
      <Helmet>
        <link rel="alternate" type="application/json" href={discoveredIntegrationsDataUrl} title="Last Mile Integrations Catalog Data" />
        <meta name="lastmile:integrations-data" content={discoveredIntegrationsDataUrl} />
      </Helmet>

      <div className="pt-20 relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 data-grid-bg opacity-20"></div>
          <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#217ED9]/20 blur-3xl"></div>
          <div className="absolute top-96 -right-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"></div>
          <div className="absolute bottom-16 -left-16 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <section className="relative py-14 lg:py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
                    Our <span className="bg-gradient-to-r from-white via-[#75ADE6] to-[#217ED9] text-transparent bg-clip-text">Integrations</span>
                  </h1>

                  <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl">
                    We work where you are, supporting the vendors you count on every day to do business with a practical integration catalog built for real operations, faster decisions, and dependable execution. From industrial platforms and fleet systems to healthcare and building technologies, this catalog is designed to help teams see what is already available, understand where coverage is strongest, and move forward with greater confidence.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="scoreboard-shell glass-panel border border-[#75ADE6]/60 p-3 lg:p-3.5"
                >
                  <div className="scoreboard-header mb-2.5 flex items-center justify-center rounded-2xl px-4 py-2">
                    <h2 className="text-lg font-semibold tracking-[0.08em] text-white sm:text-xl">Integration Scoreboard</h2>
                  </div>

                  <div className="scoreboard-display rounded-[1.4rem] px-4 py-2.5 sm:px-5">
                    <div className="space-y-1.5">
                      <ScoreboardMetric value={String(totalProducts).padStart(2, "0")} label="Integrations Available" />
                      <ScoreboardMetric value={String(integrationGroups.length).padStart(2, "0")} label="Industries Covered" />
                      <ScoreboardMetric value={String(totalVendors).padStart(2, "0")} label="Vendors Available" />
                      <ScoreboardMetric value={String(totalRepresentedFunctions).padStart(2, "0")} label="Functions Represented" />
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
                className="mt-8 rounded-[1.75rem] border border-[#75ADE6]/35 bg-slate-950/55 p-2.5 shadow-[0_24px_90px_rgba(15,23,42,0.28)] backdrop-blur-xl"
              >
                <div className="flex flex-col gap-2 rounded-[1.25rem] border border-white/5 bg-[linear-gradient(135deg,rgba(33,126,217,0.14),rgba(15,23,42,0.12))] px-4 py-3 sm:px-5 sm:py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#9cc6ef]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Vendor Search
                    </div>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-700/70 bg-slate-950/50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                        Clear
                      </button>
                    )}
                  </div>

                  <label className="group relative block">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-[#75ADE6]" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search vendor name, industry, function, or product family"
                      className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/75 py-3 pl-12 pr-4 text-base text-white outline-none transition-all placeholder:text-slate-500 focus:border-[#75ADE6]/70 focus:bg-slate-950"
                    />
                  </label>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid xl:grid-cols-[300px_1fr] gap-8 items-start">
                <div className="xl:sticky xl:top-28">
                  {lastUpdatedLabel && (
                    <div className="mb-3 flex items-center justify-center px-1 text-center">
                      <div className="whitespace-nowrap text-sm font-medium text-slate-200">
                        <span className="uppercase tracking-[0.22em] text-slate-500">Last Updated:</span>{" "}
                        <span>{lastUpdatedLabel}</span>
                      </div>
                    </div>
                  )}

                  <motion.aside
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="glass-panel border border-slate-700/60 p-4"
                  >
                    <div className="px-3 pt-2 pb-4 border-b border-slate-800 text-center">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Browse By Industry
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {integrationGroups.map((group) => {
                        const Icon = getIndustryIcon(group.industry_slug);
                        const isActive = group.industry_slug === selectedIndustryId;

                        return (
                          <div
                            key={group.industry_slug}
                            className={`overflow-hidden rounded-2xl border transition-all ${
                              isActive
                                ? "border-[#217ED9]/60 bg-[#217ED9]/12 shadow-[0_0_0_1px_rgba(33,126,217,0.15)]"
                                : "border-slate-800 bg-slate-900/40"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleIndustryChange(group.industry_slug)}
                              className="w-full px-4 py-4 text-left transition-colors hover:bg-slate-900/40"
                            >
                              <div className="flex items-start gap-3">
                                <div className="rounded-xl border border-slate-700/60 bg-slate-950/60 p-3">
                                  <Icon className={`w-5 h-5 ${isActive ? "text-[#75ADE6]" : "text-slate-400"}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-base font-semibold text-white">{group.industry_name}</h3>
                                    <div className="flex items-center gap-3">
                                      <span className="text-lg font-semibold text-slate-300 leading-none">
                                        {String(group.vendors.length).padStart(2, "0")}
                                      </span>
                                      <motion.div
                                        animate={{ rotate: isActive ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-slate-400"
                                      >
                                        <ChevronDown className="h-4 w-4" />
                                      </motion.div>
                                    </div>
                                  </div>
                                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{group.industry_description}</p>
                                </div>
                              </div>
                            </button>

                            <AnimatePresence initial={false}>
                              {isActive && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: "easeOut" }}
                                  className="overflow-hidden border-t border-slate-800/80"
                                >
                                  <div className="space-y-2 px-3 py-3">
                                    <button
                                      type="button"
                                      onClick={() => handleFunctionChange("")}
                                      className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                                        !selectedFunctionId
                                          ? "bg-slate-950/70 text-white"
                                          : "bg-slate-950/30 text-slate-300 hover:bg-slate-950/50"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between gap-3">
                                        <span className="font-medium">All {group.industry_name}</span>
                                        <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                                          {String(group.vendors.length).padStart(2, "0")}
                                        </span>
                                      </div>
                                    </button>

                                    {group.functions.map((functionEntry) => {
                                      const isFunctionActive = functionEntry.industry_function_slug === selectedFunctionId;

                                      return (
                                        <button
                                          key={`${group.industry_slug}-${functionEntry.industry_function_slug}`}
                                          type="button"
                                          onClick={() => handleFunctionChange(functionEntry.industry_function_slug)}
                                          className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                                            isFunctionActive
                                              ? "bg-slate-950/80 text-white"
                                              : "bg-slate-950/30 text-slate-300 hover:bg-slate-950/50"
                                          }`}
                                        >
                                          <div className="flex items-start justify-between gap-3">
                                            <div>
                                              <div className="font-medium">{functionEntry.industry_function_name}</div>
                                              <div className="mt-1 text-xs leading-relaxed text-slate-500">
                                                {functionEntry.industry_function_description}
                                              </div>
                                            </div>
                                            <span className="rounded-full border border-slate-700/70 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                                              {String(functionEntry.vendor_count).padStart(2, "0")}
                                            </span>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.aside>
                </div>

                <div>
                  {catalogState === "loading" && (
                    <div className="glass-panel border border-slate-700/60 p-8">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-3">Loading Catalog</div>
                      <h2 className="text-3xl font-bold text-white">Preparing generated integrations data</h2>
                      <p className="mt-3 max-w-2xl text-lg text-slate-400 leading-relaxed">
                        The page is loading the same machine-readable JSON that AI agents will use for integration discovery.
                      </p>
                    </div>
                  )}

                  {catalogState === "error" && (
                    <div className="glass-panel border border-rose-500/40 bg-rose-500/10 p-8">
                      <div className="text-xs uppercase tracking-[0.24em] text-rose-300 mb-3">Catalog Unavailable</div>
                      <h2 className="text-3xl font-bold text-white">The integrations dataset did not load.</h2>
                      <p className="mt-3 max-w-2xl text-lg text-slate-200 leading-relaxed">
                        Regenerate `public/integrations.json` and reload the page. The public UI depends on that generated file.
                      </p>
                    </div>
                  )}

                  {catalogState === "ready" && normalizedSearchQuery && (
                    <div className="mb-8 rounded-[1.8rem] border border-[#75ADE6]/25 bg-[linear-gradient(180deg,rgba(15,23,42,0.76),rgba(2,6,23,0.88))] p-4 shadow-[0_24px_80px_rgba(2,6,23,0.3)] sm:p-5">
                      <div className="border-b border-slate-800/80 pb-4">
                        <div>
                          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Search Results</h2>
                          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base">
                            {searchResultCount > 0
                              ? `Showing vendors and related products that match “${searchQuery.trim()}”.`
                              : `No vendors or products matched “${searchQuery.trim()}”. Try a broader vendor name, industry, function, or product family.`}
                          </p>
                        </div>
                      </div>

                      {searchResultCount > 0 ? (
                        <div className="mt-5 grid gap-4 xl:grid-cols-2">
                          {vendorSearchResults.map((result, index) => {
                            const accentClass = getVendorAccentClass(result.vendor.vendor_slug);
                            const logoMonogram = getVendorMonogram(result.vendor.vendor_name);

                            return (
                              <motion.div
                                key={`${result.industry_slug}-${result.vendor.vendor_slug}`}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.24, delay: index * 0.04, ease: "easeOut" }}
                                className="overflow-hidden rounded-[1.6rem] border border-slate-700/60 bg-slate-950/55"
                              >
                                <div className="border-b border-slate-800/80 px-5 py-5">
                                  <div className="flex items-start gap-4">
                                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${accentClass} p-[1px] shadow-[0_10px_24px_rgba(15,23,42,0.22)]`}>
                                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[15px] bg-white">
                                        {result.vendor.vendor_logo_src ? (
                                          <img
                                            src={result.vendor.vendor_logo_src}
                                            alt={`${result.vendor.vendor_name} logo`}
                                            className="h-full w-full object-contain p-2.5"
                                            referrerPolicy="origin"
                                          />
                                        ) : (
                                          <div className="text-sm font-bold tracking-[0.16em] text-slate-700">{logoMonogram}</div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-xl font-semibold text-white">{result.vendor.vendor_name}</h3>
                                        <span className="rounded-full border border-[#217ED9]/30 bg-[#217ED9]/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#9cc6ef]">
                                          {result.industry_name}
                                        </span>
                                        {result.functions[0] && (
                                          <span className="rounded-full border border-slate-700/70 bg-slate-950/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                                            {result.functions[0]}
                                          </span>
                                        )}
                                      </div>
                                      <p className="mt-2 text-sm leading-relaxed text-slate-400">{result.vendor.vendor_summary}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="px-5 py-4">
                                  {result.primary_product && (
                                    <div>
                                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">View In Catalog</div>
                                      <div className="mt-3 flex flex-wrap gap-2">
                                        <Link
                                          to={`/integrations/${result.vendor.vendor_slug}/${result.primary_product.product_slug}`}
                                          className="rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 transition-colors hover:border-[#75ADE6]/50 hover:text-white"
                                        >
                                          {result.primary_product.product_name}
                                        </Link>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="mt-5 rounded-[1.4rem] border border-dashed border-slate-700/70 bg-slate-950/40 px-5 py-8 text-center">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/60 text-slate-400">
                            <Search className="h-6 w-6" />
                          </div>
                          <h3 className="mt-4 text-xl font-semibold text-white">No vendor matches yet</h3>
                          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
                              Search by vendor name, industry, function, or product family. Example queries: Siemens, Zebra RFID, transportation, fleet, or telehealth.
                          </p>
                        </div>
                      )}

                    </div>
                  )}

                  {catalogState === "ready" && selectedIndustry && (
                    <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedIndustry.industry_slug}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-3">
                            {currentContextLabel}
                          </div>
                          <h2 className="text-4xl font-bold text-white">{currentHeading}</h2>
                          <p className="mt-3 text-lg text-slate-400 max-w-3xl leading-relaxed">
                            {currentDescription}
                          </p>
                        </div>

                        <MetricsPanel
                          vendorCount={String(vendorCount).padStart(2, "0")}
                          vendorLabel="Vendors"
                        />
                      </div>

                      {selectedFunction && filteredIndustryVendors.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-700/70 bg-slate-950/30 px-6 py-10 text-center">
                          <h3 className="text-2xl font-semibold text-white">No integrations classified to this function yet</h3>
                          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
                            The function taxonomy is now wired into the catalog and UI, but this function has not been populated with researched rows yet. Legacy rows remain available through the industry view or the Unclassified bucket until phase 4 research is complete.
                          </p>
                        </div>
                      ) : (
                      <div className="space-y-4">
                        {filteredIndustryVendors.map((vendor, index) => {
                          const isOpen = openVendorSlugs.includes(vendor.vendor_slug);
                          const accentClass = getVendorAccentClass(vendor.vendor_slug);
                          const logoMonogram = getVendorMonogram(vendor.vendor_name);

                          return (
                            <motion.div
                              key={vendor.vendor_slug}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
                              className="glass-panel border border-slate-700/60 overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={() => toggleVendor(vendor.vendor_slug)}
                                className="w-full px-6 py-6 text-left hover:bg-white/[0.02] transition-colors"
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${accentClass} p-[1px] flex-shrink-0 shadow-[0_10px_30px_rgba(15,23,42,0.28)]`}>
                                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[15px] bg-white">
                                      {vendor.vendor_logo_src ? (
                                        <img
                                          src={vendor.vendor_logo_src}
                                          alt={`${vendor.vendor_name} logo`}
                                          className="h-full w-full object-contain p-2.5"
                                          referrerPolicy="origin"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-700 font-bold tracking-[0.16em] text-sm">
                                          {logoMonogram}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                                      <div>
                                        <h3 className="text-2xl font-semibold text-white">{vendor.vendor_name}</h3>
                                        <p className="text-slate-400 mt-1 leading-relaxed">{vendor.vendor_summary}</p>
                                        {!selectedFunctionId && (
                                          <div className="mt-3 flex flex-wrap gap-2">
                                            {Array.from(new Set(vendor.products.map((product) => getProductFunctionName(product)))).map((functionName) => (
                                              <span
                                                key={`${vendor.vendor_slug}-${functionName}`}
                                                className="rounded-full border border-slate-700/70 bg-slate-950/50 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300"
                                              >
                                                {functionName}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-4">
                                        <div className="rounded-2xl border border-slate-700/70 bg-slate-950/50 px-4 py-2 min-w-[72px] text-center">
                                          <div className="text-2xl font-bold text-white leading-none">
                                            {String(vendor.products.length).padStart(2, "0")}
                                          </div>
                                        </div>
                                        <motion.div
                                          animate={{ rotate: isOpen ? 180 : 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="rounded-full border border-slate-700/70 p-2 text-slate-400"
                                        >
                                          <ChevronDown className="w-5 h-5" />
                                        </motion.div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </button>

                              <AnimatePresence initial={false}>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.28, ease: "easeOut" }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-6 pb-6 pt-1 border-t border-slate-800/80 bg-slate-950/20">
                                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mt-5">
                                        {vendor.products.map((product) => (
                                          <div
                                            key={product.product_slug}
                                            className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-4 text-slate-200"
                                          >
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                                {getStatusLabel(product.integration_status)}
                                              </div>
                                              <span className="rounded-full border border-slate-700/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-300">
                                                {product.integration_type || "Integration"}
                                              </span>
                                            </div>
                                            <div className="font-medium leading-relaxed text-white">{product.product_name}</div>
                                            {product.product_family && (
                                              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-[#75ADE6]">
                                                {product.product_family}
                                              </div>
                                            )}
                                            <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                                              {getProductFunctionName(product)}
                                            </div>
                                            {product.product_summary && !product.has_detail && (
                                              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                                                {product.product_summary}
                                              </p>
                                            )}
                                            {product.data_coverage_summary && (
                                              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                                                {product.data_coverage_summary}
                                              </p>
                                            )}
                                            {product.has_detail && (
                                              <div className="mt-auto border-t border-slate-800/80 pt-4 text-center">
                                                <Link
                                                  to={`/integrations/${vendor.vendor_slug}/${product.product_slug}`}
                                                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#217ED9]/50 bg-[#217ED9]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#75ADE6] transition-colors hover:bg-[#217ED9]/20"
                                                >
                                                  Accessible Data -&gt;
                                                </Link>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                      )}
                    </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}

function getIndustryIcon(industrySlug: string) {
  return industryIcons[industrySlug] ?? Factory;
}

function getIndustryLabel(industrySlug: string) {
  return industryLabels[industrySlug] ?? "OEM Vendors";
}

function getVendorAccentClass(vendorSlug: string) {
  const hash = vendorSlug.split("").reduce((total, character) => total + character.charCodeAt(0), 0);
  return vendorAccentClasses[hash % vendorAccentClasses.length];
}

function getVendorMonogram(vendorName: string) {
  const letters = vendorName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return letters || vendorName.slice(0, 2).toUpperCase();
}

function getStatusLabel(status: string) {
  switch (status.toLowerCase()) {
    case "planned":
      return "Planned Integration";
    case "in-progress":
      return "In Progress";
    case "built":
      return "Available Now";
    case "deprecated":
      return "Deprecated";
    default:
      return "Integration";
  }
}

function formatLastUpdated(isoTimestamp: string) {
  const parsedDate = new Date(isoTimestamp);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function MetricsPanel({
  vendorCount,
  vendorLabel,
}: {
  vendorCount: string;
  vendorLabel: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/50 min-w-[160px]">
      <div className="flex flex-col items-center justify-center px-6 py-5 text-center">
        <div className="text-3xl font-bold text-white">{vendorCount}</div>
        <div className="mt-1 whitespace-nowrap text-xs uppercase tracking-[0.18em] text-slate-500">{vendorLabel}</div>
      </div>
    </div>
  );
}

function getProductFunctionSlug(product: IntegrationProduct) {
  return product.industry_function_slug || "unclassified";
}

function getProductFunctionName(product: IntegrationProduct) {
  return product.industry_function_name || "Unclassified";
}

function ScoreboardMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="scoreboard-row rounded-2xl border border-[#75ADE6]/35 bg-slate-950/55 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="scoreboard-row__label text-xs uppercase tracking-[0.18em] text-[#9cc6ef]">{label}</div>
      <div className="flip-scoreboard" aria-label={`${label}: ${value}`}>
        <span className="flip-scoreboard__digit">{value}</span>
      </div>
    </div>
  );
}