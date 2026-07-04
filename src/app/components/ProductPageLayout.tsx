import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { TrackedLink } from "@/app/components/TrackedLink";

export interface ProductPageLayoutProps {
  eyebrow: string;
  title: string;
  intro: string;
  primaryCta: { label: string; to: string };
  secondaryCta: { label: string; to: string };
  overview: { heading: string; copy: string[]; children?: ReactNode };
  features: Array<{ title: string; copy?: string }>;
  useCases: string[];
  relatedProducts: Array<{ label: string; to: string }>;
  faqs: Array<{ question: string; answer: string }>;
  resources: Array<{ label: string; to?: string }>;
  finalCta?: { heading: string; copy: string[]; label: string; to: string };
}

const localNav = [
  { id: "overview", label: "Overview" },
  { id: "features-benefits", label: "Features & Benefits" },
  { id: "use-cases", label: "Use Cases" },
  { id: "related-products", label: "Related Products" },
  { id: "faqs", label: "FAQs" },
  { id: "resources", label: "Resources" },
];

export function ProductPageLayout({
  eyebrow,
  title,
  intro,
  primaryCta,
  secondaryCta,
  overview,
  features,
  useCases,
  relatedProducts,
  faqs,
  resources,
  finalCta = {
    heading: "Bring one operational gap. Leave with a path to action.",
    copy: [
      "Start with one real problem, one source environment, and one response outcome worth improving.",
    ],
    label: "Request a design-partner conversation",
    to: "/design-partner",
  },
}: ProductPageLayoutProps) {
  return (
    <div className="relative min-h-screen pt-20">
      <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>
      <div className="relative z-10">
        <section className="border-b border-slate-800 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#75ADE6]">{eyebrow}</p>
            <h1 className="hero-title-gradient mt-6 max-w-5xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300 md:text-xl">{intro}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <TrackedLink
                to={primaryCta.to}
                eventName="cta_design_partner_click"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-7 py-3 text-base font-semibold text-white hover:bg-[#0a1929] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75bda7]"
              >
                {primaryCta.label} <ArrowRight className="h-5 w-5" />
              </TrackedLink>
              <TrackedLink
                to={secondaryCta.to}
                eventName={secondaryCta.to === "/ssom" ? "cta_ssom_click" : "cta_product_click"}
                className="inline-flex min-h-11 items-center justify-center rounded-sm border border-slate-600 bg-slate-900/60 px-7 py-3 text-base font-semibold text-white hover:border-[#217ED9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75bda7]"
              >
                {secondaryCta.label}
              </TrackedLink>
            </div>
          </div>
        </section>

        <nav className="sticky top-20 z-30 border-b border-slate-800 bg-[#0b1120]/95 backdrop-blur" aria-label="Product page sections">
          <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
            <div className="flex min-h-12 gap-2 whitespace-nowrap py-2">
              {localNav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="inline-flex min-h-11 items-center rounded-sm px-3 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75bda7]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <PageSection id="overview" title={overview.heading}>
          {overview.copy.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {overview.children}
        </PageSection>

        <PageSection id="features-benefits" title="Features & Benefits">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <ArticleCard key={feature.title} title={feature.title} copy={feature.copy} />
            ))}
          </div>
        </PageSection>

        <PageSection id="use-cases" title="Use Cases">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((useCase) => (
              <div key={useCase} className="rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-base leading-7 text-slate-200">
                {useCase}
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection id="related-products" title="Related Products">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((product) => (
              <TrackedLink
                key={product.to}
                to={product.to}
                eventName={product.to === "/ssom" ? "cta_ssom_click" : "cta_product_click"}
                eventData={{ product: product.label }}
                className="rounded-lg border border-slate-700 bg-slate-900/60 p-5 text-lg font-semibold text-white transition-colors hover:border-[#217ED9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75bda7]"
              >
                {product.label}
              </TrackedLink>
            ))}
          </div>
        </PageSection>

        <PageSection id="faqs" title="FAQs">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-lg border border-slate-700 bg-slate-900/60 p-5">
                <summary className="cursor-pointer text-lg font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#75bda7]">
                  {faq.question}
                </summary>
                <p className="mt-4 text-base leading-7 text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </PageSection>

        <PageSection id="resources" title="Resources">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {resources.map((resource) =>
              resource.to ? (
                <TrackedLink
                  key={resource.label}
                  to={resource.to}
                  eventName={resource.to === "/signal-to-action" ? "cta_podcast_click" : "cta_explore_platform_click"}
                  className="rounded-lg border border-slate-700 bg-slate-900/60 p-5 text-base font-semibold text-[#75ADE6] hover:border-[#217ED9] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75bda7]"
                >
                  {resource.label}
                </TrackedLink>
              ) : (
                <div key={resource.label} className="rounded-lg border border-slate-700 bg-slate-900/60 p-5 text-base font-semibold text-slate-200">
                  {resource.label}
                </div>
              ),
            )}
          </div>
        </PageSection>

        <section className="border-t border-slate-800 py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">{finalCta.heading}</h2>
            {finalCta.copy.map((paragraph) => (
              <p key={paragraph} className="mt-6 text-lg leading-8 text-slate-300">
                {paragraph}
              </p>
            ))}
            <TrackedLink
              to={finalCta.to}
              eventName="cta_design_partner_click"
              className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-8 py-3 text-base font-semibold text-white hover:bg-[#0a1929] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75bda7]"
            >
              {finalCta.label} <ArrowRight className="h-5 w-5" />
            </TrackedLink>
          </div>
        </section>
      </div>
    </div>
  );
}

function PageSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-36 border-b border-slate-800 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h2>
        <div className="mt-6 space-y-5 text-lg leading-8 text-slate-300">{children}</div>
      </div>
    </section>
  );
}

function ArticleCard({ title, copy }: { title: string; copy?: string }) {
  return (
    <article className="glass-panel h-full rounded-lg p-5">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      {copy ? <p className="mt-3 text-base leading-7 text-slate-300">{copy}</p> : null}
    </article>
  );
}
