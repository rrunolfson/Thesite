import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowUpRight, BadgeCheck, Database, Radio, RefreshCcw } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";

interface IntegrationDetailCategory {
  category: string;
  description: string;
  data_points: string[];
  relevant_operations: string[];
}

interface IntegrationDetailRecord {
  vendor_slug: string;
  vendor_name: string;
  vendor_domain: string;
  vendor_logo_src: string;
  product_slug: string;
  product_name: string;
  product_family: string;
  integration_type: string;
  integration_api_url: string;
  spec_artifact_url: string;
  detail_path: string;
  detail_completeness: "researched" | "generated-summary";
  data_coverage_summary: string;
  data_domains: string[];
  asset_data_available: "Supported" | "Not Supported" | "N/A" | null;
  telemetry_data_available: "Supported" | "Not Supported" | "N/A" | null;
  writeback_supported: "Supported" | "Not Supported" | "N/A" | null;
  key_entities: string[];
  buyer_guidance: string;
  overview: string;
  available_data: IntegrationDetailCategory[];
  ingest_considerations: string[];
  source_evidence: {
    documentation_url?: string;
    spec_url?: string;
    reviewed_at?: string;
    evidence_notes?: string;
  };
}

interface IntegrationCatalogLookup {
  industries: Array<{
    vendors: Array<{
      vendor_slug: string;
      products: Array<{
        product_slug: string;
        detail_path: string;
      }>;
    }>;
  }>;
}

export function IntegrationDetailPage() {
  const { vendorSlug = "", productSlug = "" } = useParams();
  const [detail, setDetail] = useState<IntegrationDetailRecord | null>(null);
  const [detailState, setDetailState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let isMounted = true;

    const loadDetail = async () => {
      try {
        const catalogResponse = await fetch("/integrations.json");

        if (!catalogResponse.ok) {
          throw new Error(`Unable to load integrations catalog: ${catalogResponse.status}`);
        }

        const catalog = (await catalogResponse.json()) as IntegrationCatalogLookup;
        const detailPath =
          catalog.industries
            .flatMap((industry) => industry.vendors)
            .find((vendor) => vendor.vendor_slug === vendorSlug)
            ?.products.find((product) => product.product_slug === productSlug)
            ?.detail_path || `/integration-details/${vendorSlug}/${productSlug}.json`;

        const response = await fetch(detailPath);

        if (!response.ok) {
          throw new Error(`Unable to load detail metadata: ${response.status}`);
        }

        const nextDetail = (await response.json()) as IntegrationDetailRecord;

        if (!isMounted) {
          return;
        }

        setDetail(nextDetail);
        setDetailState("ready");
      } catch {
        if (isMounted) {
          setDetailState("error");
        }
      }
    };

    void loadDetail();

    return () => {
      isMounted = false;
    };
  }, [productSlug, vendorSlug]);

  const pageTitle = detail ? `${detail.product_name} Integration Data Coverage` : "Integration Detail";
  const pageDescription = detail
    ? detail.data_coverage_summary || detail.overview
    : "Detailed integration metadata for OEM product APIs and accessible data coverage.";

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonicalPath={`/integrations/${vendorSlug}/${productSlug}`}
      />

      <div className="relative min-h-screen overflow-hidden pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 data-grid-bg opacity-20"></div>
          <div className="absolute -top-28 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#217ED9]/15 blur-3xl"></div>
          <div className="absolute right-0 top-80 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 pb-24">
          <section className="py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link
                to="/integrations"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back To Integrations
              </Link>

              {detailState === "loading" && (
                <div className="mt-8 rounded-3xl border border-slate-700/60 bg-slate-950/50 p-8 text-white">
                  Loading integration detail metadata.
                </div>
              )}

              {detailState === "error" && (
                <div className="mt-8 rounded-3xl border border-rose-500/40 bg-rose-500/10 p-8 text-white">
                  This product does not yet have published detail metadata.
                </div>
              )}

              {detailState === "ready" && detail && (
                <div className="mt-8 grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#217ED9]/30 bg-[#217ED9]/10 px-4 py-2">
                      <BadgeCheck className="h-4 w-4 text-[#217ED9]" />
                      <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#75ADE6]">
                        {detail.detail_completeness === "researched" ? "Researched Detail" : "Catalog Detail"}
                      </span>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-slate-500">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[#217ED9]/40 bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.2)]">
                          {detail.vendor_logo_src ? (
                            <img
                              src={detail.vendor_logo_src}
                              alt={`${detail.vendor_name} logo`}
                              className="h-full w-full object-contain"
                              referrerPolicy="origin"
                            />
                          ) : (
                            <div className="text-xs font-semibold tracking-[0.16em] text-slate-600">
                              {getVendorMonogram(detail.vendor_name)}
                            </div>
                          )}
                        </div>
                        <div>{detail.vendor_name}</div>
                      </div>
                      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
                        {detail.product_name}
                      </h1>
                      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
                        {detail.data_coverage_summary}
                      </p>
                      <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-400">{detail.overview}</p>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                      <CapabilityCard
                        icon={Database}
                        label="Asset Data"
                        value={formatCapabilityValue(detail.asset_data_available)}
                      />
                      <CapabilityCard
                        icon={Radio}
                        label="Telemetry"
                        value={formatCapabilityValue(detail.telemetry_data_available)}
                      />
                      <CapabilityCard
                        icon={RefreshCcw}
                        label="Writeback"
                        value={formatCapabilityValue(detail.writeback_supported)}
                      />
                    </div>

                    <div className="mt-10 rounded-3xl border border-slate-700/60 bg-slate-950/45 p-6">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Data Element Specifics</div>
                      <Accordion type="multiple" className="mt-4">
                        {detail.available_data.map((section) => (
                          <AccordionItem key={section.category} value={section.category} className="border-slate-800/80">
                            <AccordionTrigger className="text-base font-semibold text-white hover:no-underline">
                              <div>
                                <div>{section.category}</div>
                                <div className="mt-2 text-sm font-normal leading-relaxed text-slate-400">
                                  {section.description}
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-5 text-slate-300">
                              <div>
                                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Data Points</div>
                                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
                                  {section.data_points.map((dataPoint) => (
                                    <li key={dataPoint} className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3">
                                      {dataPoint}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {section.relevant_operations.length > 0 && (
                                <div>
                                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Relevant Operations</div>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {section.relevant_operations.map((operation) => (
                                      <span
                                        key={operation}
                                        className="rounded-full border border-slate-700/70 px-3 py-2 text-xs text-slate-300"
                                      >
                                        {operation}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>

                  <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
                    <SidePanel title="Buyer Guidance" body={detail.buyer_guidance} />

                    <SidePanel title="Source Evidence">
                      <div className="space-y-3 text-sm text-slate-300">
                        <EvidenceLink label="Documentation" href={detail.source_evidence.documentation_url || detail.integration_api_url} />
                        <EvidenceLink label="Spec Artifact" href={detail.source_evidence.spec_url || detail.spec_artifact_url} />
                        {detail.source_evidence.reviewed_at && (
                          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Reviewed</div>
                            <div className="mt-1 text-slate-200">{detail.source_evidence.reviewed_at}</div>
                          </div>
                        )}
                      </div>
                    </SidePanel>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function getVendorMonogram(vendorName: string) {
  const words = vendorName
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase() ?? "").join("") || "LM";
}

function CapabilityCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-700/60 bg-slate-950/45 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-3 text-[#75ADE6]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
          <div className="mt-1 text-lg font-semibold text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}

function formatCapabilityValue(value: "Supported" | "Not Supported" | "N/A" | null) {
  if (value) {
    return value;
  }

  return "Undetermined";
}

function SidePanel({
  title,
  body,
  children,
}: {
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-700/60 bg-slate-950/45 p-6">
      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{title}</div>
      {body ? <p className="mt-4 text-sm leading-relaxed text-slate-300">{body}</p> : null}
      {children ? <div className={body ? "mt-4" : "mt-5"}>{children}</div> : null}
    </div>
  );
}

function EvidenceLink({ label, href }: { label: string; href: string }) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 transition-colors hover:border-slate-600 hover:text-white"
    >
      <div>
        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
        <div className="mt-1 break-all text-sm text-slate-300">{href}</div>
      </div>
      <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-[#75ADE6]" />
    </a>
  );
}

