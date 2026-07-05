import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { TrackedLink } from "@/app/components/TrackedLink";

export interface ProductPageLayoutProps {
  eyebrow: string;
  title: string;
  intro: string;
  heroSecondary?: string;
  heroNote?: string;
  heroImage?: { src: string; alt: string };
  hideHeroCtas?: boolean;
  primaryCta: { label: string; to: string };
  secondaryCta: { label: string; to: string };
  overview: { heading: string; copy: string[]; children?: ReactNode };
  benefits: Array<{ title: string; copy?: string }>;
  features: Array<{ title: string; copy?: string }>;
  useCases: string[];
  relatedProducts: Array<{ label: string; to: string; copy?: string }>;
  relatedHeading?: string;
  faqs: Array<{ question: string; answer: string }>;
  resources: Array<{ label: string; to?: string }>;
  finalCta?: { heading: string; copy: string[]; label: string; to: string };
  localNavItems?: Array<{ id: string; label: string }>;
  customSections?: ReactNode;
}

const localNav = [
  { id: "overview", label: "Overview" },
  { id: "benefits", label: "Benefits" },
  { id: "features", label: "Features" },
  { id: "use-cases", label: "Use Cases" },
  { id: "related-products", label: "Related Products" },
  { id: "faqs", label: "FAQs" },
  { id: "resources", label: "Resources" },
];

export function ProductPageLayout({
  eyebrow,
  title,
  intro,
  heroSecondary,
  heroNote,
  heroImage,
  hideHeroCtas = false,
  primaryCta,
  secondaryCta,
  overview,
  benefits,
  features,
  useCases,
  relatedProducts,
  relatedHeading = "Related Products",
  faqs,
  resources,
  finalCta = {
    heading: "Tell us what you are working to improve.",
    copy: [
      "Talk with Last Mile about the systems, operational challenges, workflow bottlenecks, and automation opportunities that matter to your organization.",
    ],
    label: "Contact Last Mile",
    to: "/contact",
  },
  localNavItems,
  customSections,
}: ProductPageLayoutProps) {
  const navItems = localNavItems ?? localNav;
  const hasCustomNav = Boolean(localNavItems);

  return (
    <div className="relative min-h-screen pt-20">
      <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>
      <div className="relative z-10">
        <section className="border-b border-slate-800 py-16 md:py-20">
          <div className={`mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:px-8 ${heroImage ? "lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center" : ""}`}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#75ADE6]">{eyebrow}</p>
              <h1 className="hero-title-gradient mt-6 max-w-5xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300 md:text-xl">{intro}</p>
              {heroSecondary ? <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">{heroSecondary}</p> : null}
              {heroNote ? <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#75bda7]">{heroNote}</p> : null}
              {!hideHeroCtas ? (
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <TrackedLink
                    to={primaryCta.to}
                    eventName="cta_contact_click"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-7 py-3 text-base font-semibold text-white hover:bg-[#0a1929] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75bda7]"
                  >
                    {primaryCta.label} <ArrowRight className="h-5 w-5" />
                  </TrackedLink>
                  <TrackedLink
                    to={secondaryCta.to}
                    eventName={secondaryCta.to === "/singularity" ? "cta_product_click" : "cta_product_click"}
                    className="inline-flex min-h-11 items-center justify-center rounded-sm border border-slate-600 bg-slate-900/60 px-7 py-3 text-base font-semibold text-white hover:border-[#217ED9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75bda7]"
                  >
                    {secondaryCta.label}
                  </TrackedLink>
                </div>
              ) : null}
            </div>
            {heroImage ? (
              <figure className="product-hero-image-frame">
                <img src={heroImage.src} alt={heroImage.alt} className="product-hero-image" />
              </figure>
            ) : null}
          </div>
        </section>

        <nav
          className={`sticky top-20 z-30 border-b backdrop-blur ${
            hasCustomNav
              ? "border-[#1d7cd8]/30 bg-[#082334]/95 shadow-lg shadow-[#1d7cd8]/10"
              : "border-slate-800 bg-[#0b1120]/95"
          }`}
          aria-label="Product page sections"
        >
          <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
            <div className="flex min-h-12 gap-2 whitespace-nowrap py-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`inline-flex min-h-11 items-center rounded-sm border px-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75bda7] ${
                    hasCustomNav
                      ? "border-transparent text-[#75bda7] hover:border-[#75bda7]/35 hover:bg-[#0a1929]/90 hover:text-white"
                      : "border-transparent text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {customSections ? (
          customSections
        ) : (
          <>
            <PageSection id="overview" title={overview.heading}>
              {overview.copy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {overview.children}
            </PageSection>

        <PageSection id="benefits" title="Benefits">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map((benefit) => (
              <ArticleCard key={benefit.title} title={benefit.title} copy={benefit.copy} />
            ))}
          </div>
        </PageSection>

        <PageSection id="features" title="Features">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <ArticleCard key={feature.title} title={feature.title} copy={feature.copy} />
            ))}
          </div>
        </PageSection>

        <PageSection id="use-cases" title="Use Cases">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {useCases.map((useCase) => (
              <div key={useCase} className="rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-center text-base leading-7 text-slate-200">
                {useCase}
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection id="related-products" title={relatedHeading}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((product) => (
              <TrackedLink
                key={product.to}
                to={product.to}
                eventName="cta_product_click"
                eventData={{ product: product.label }}
                className="rounded-lg border border-slate-700 bg-slate-900/60 p-5 text-center transition-colors hover:border-[#217ED9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75bda7]"
              >
                <span className="block text-lg font-semibold text-white">{product.label}</span>
                {product.copy ? <span className="mt-3 block text-base font-normal leading-7 text-slate-300">{product.copy}</span> : null}
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
                  className="rounded-lg border border-slate-700 bg-slate-900/60 p-5 text-center text-base font-semibold text-[#75ADE6] hover:border-[#217ED9] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75bda7]"
                >
                  {resource.label}
                </TrackedLink>
              ) : (
                <div key={resource.label} className="rounded-lg border border-slate-700 bg-slate-900/60 p-5 text-center text-base font-semibold text-slate-200">
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
                  eventName="cta_contact_click"
                  className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-8 py-3 text-base font-semibold text-white hover:bg-[#0a1929] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75bda7]"
                >
                  {finalCta.label} <ArrowRight className="h-5 w-5" />
                </TrackedLink>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function PageSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-36 border-b border-slate-800 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-5xl text-center text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h2>
        <div className="mt-6 space-y-5 text-lg leading-8 text-slate-300">{children}</div>
      </div>
    </section>
  );
}

function ArticleCard({ title, copy }: { title: string; copy?: string }) {
  return (
    <article className="glass-panel h-full rounded-lg p-5 text-center">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      {copy ? <p className="mt-3 text-base leading-7 text-slate-300">{copy}</p> : null}
    </article>
  );
}
