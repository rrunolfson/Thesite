import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { CtaLink, ProductGrid, Section } from "./MarketingComponents";
import { TrackedLink } from "./TrackedLink";

export interface ProductPageLayoutProps {
  eyebrow: string; title: ReactNode; intro: string; heroSecondary?: string; heroNote?: string;
  blueprintImage?: { src: string; alt: string }; hideHeroCtas?: boolean;
  primaryCta: { label: string; to: string }; secondaryCta: { label: string; to: string };
  overview: { heading: string; copy: string[]; children?: ReactNode };
  benefits: Array<{ title: string; copy?: string }>; features: Array<{ title: string; copy?: string }>;
  useCases: string[]; relatedProducts: Array<{ label: string; to: string; copy?: string }>;
  relatedHeading?: string; faqs: Array<{ question: string; answer: string }>;
  resources: Array<{ label: string; to?: string }>; finalCta?: { heading: string; copy: string[]; label: string; to: string };
  localNavItems?: Array<{ id: string; label: string }>; customSections?: ReactNode;
}

export function ProductPageLayout({ eyebrow,title,intro,heroSecondary,heroNote,primaryCta,secondaryCta,overview,benefits,features,useCases,relatedProducts,relatedHeading="Related capabilities",faqs,resources,finalCta,customSections }: ProductPageLayoutProps) {
  return <>
    <header className="lm-product-hero"><div className="lm-container"><p className="lm-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lm-product-hero__intro">{intro}</p>{heroSecondary?<p className="lm-product-hero__support">{heroSecondary}</p>:null}{heroNote?<p className="lm-product-hero__note">{heroNote}</p>:null}<div className="lm-actions"><CtaLink to={primaryCta.to}>{primaryCta.label}</CtaLink><CtaLink to={secondaryCta.to} variant="secondary" eventName="cta_product_click">{secondaryCta.label}</CtaLink></div></div></header>
    {customSections ?? <>
      <Section eyebrow="Role in the platform" title={overview.heading}>{<div className="lm-copy-stack">{overview.copy.map((copy)=><p key={copy}>{copy}</p>)}</div>}{overview.children}</Section>
      <Section eyebrow="Operational value" title="What this capability changes." tone="wash"><CardGrid items={benefits} /></Section>
      <Section eyebrow="Capability" title="What it is designed to provide."><CardGrid items={features} /></Section>
      <Section eyebrow="Where it applies" title="Operational use cases." tone="dark"><ul className="lm-use-list">{useCases.map((item)=><li key={item}>{item}</li>)}</ul></Section>
      <Section eyebrow="Connected platform" title={relatedHeading}><div className="lm-related-grid">{relatedProducts.map((item)=><TrackedLink to={item.to} key={item.to} eventName="cta_product_click" eventData={{product:item.label}}><strong>{item.label}</strong>{item.copy?<span>{item.copy}</span>:null}<ArrowRight /></TrackedLink>)}</div></Section>
      {faqs.length ? <Section eyebrow="Questions" title="Common questions." tone="wash"><div className="lm-faqs">{faqs.map((faq)=><details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></Section>:null}
      {resources.some((resource)=>resource.to) ? <Section eyebrow="Resources" title="Continue exploring."><div className="lm-related-grid">{resources.filter((resource)=>resource.to).map((resource)=><TrackedLink key={resource.label} to={resource.to!} eventName="cta_explore_platform_click"><strong>{resource.label}</strong><ArrowRight /></TrackedLink>)}</div></Section>:null}
    </>}
    <section className="lm-closing"><div><p className="lm-eyebrow">Start with your operation</p><h2>{finalCta?.heading ?? "Discuss the Condition your team needs to make accountable."}</h2>{finalCta?.copy.map((copy)=><p className="lm-closing__copy" key={copy}>{copy}</p>)}<div className="lm-actions"><CtaLink to={finalCta?.to ?? "/contact?intent=operation"}>{finalCta?.label ?? "Discuss Your Operation"}</CtaLink></div></div></section>
  </>;
}
function CardGrid({items}:{items:Array<{title:string;copy?:string}>}) { return <div className="lm-card-grid">{items.map((item)=><article className="lm-card" key={item.title}><h3>{item.title}</h3>{item.copy?<p>{item.copy}</p>:null}</article>)}</div>; }

export function PlatformConnection() { return <ProductGrid />; }
