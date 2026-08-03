import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import { AdvancesGrid, CtaLink, PageHero, Section } from "@/app/components/MarketingComponents";
import { TrackedLink } from "@/app/components/TrackedLink";
import { createOrganizationSchema, createWebsiteSchema } from "@/app/lib/structuredData";

const gapCards = [
  { title: "What exists", copy: "Excellent systems for sensing, control, data, work, and service." },
  { title: "What is missing", copy: "Shared identity, coordinated response, complete evidence, and verified recovery." },
  { title: "What Last Mile adds", copy: "Vendor-independent operational accountability across the entire response." },
];

const operatingStages = [
  { name: "Observe", copy: "Acquire and qualify operational evidence." },
  { name: "Understand", copy: "Resolve identity, topology, context, and meaning." },
  { name: "Coordinate", copy: "Connect the Condition to people, platforms, providers, and work." },
  { name: "Act", copy: "Execute policy-governed human and machine actions." },
  { name: "Verify", copy: "Use return telemetry to prove physical recovery." },
  { name: "Learn", copy: "Retain the outcome and improve future response." },
] as const;

export function HomePage() {
  const description = "Last Mile is the Physical Operations Platform: the independent operating layer above existing systems that turns trusted Conditions into governed action and verifies physical outcomes.";
  return <>
    <SEO title="Last Mile | The Physical Operations Platform" description={description} canonicalPath="/" markdownPath="/index.md" jsonLd={[createOrganizationSchema(), createWebsiteSchema()]} />
    <PageHero
      className="lm-home-hero"
      eyebrow="The Physical Operations Platform"
      title={<><span>The Operating</span><span>layer industry</span><span>has been waiting for.</span></>}
      intro="In a word: context.  Industrial systems can detect, control, store, and manage individual pieces of the operation. Last Mile sits above all of them, creating one vendor-independent layer to understand what matters, coordinate what happens next, govern action, and verify the physical outcome."
      supporting={<><span>So keep the systems you've invested in and already trust.</span><span>Let Last Mile make them operate as one.</span></>}
      actions={<CtaLink to="/platform" eventName="cta_explore_platform_click">Explore the Platform</CtaLink>}
    >
      <figure className="lm-home-blueprint">
        <img src="/images/blueprint/platform-core-blueprint.png" width="1672" height="941" fetchPriority="high" alt="Blueprint of the Last Mile platform core connecting signals, operational memory, coordinated flow, and operator control" />
      </figure>
    </PageHero>

    <AnimatedOperatingLoop />

    <Section eyebrow="The market gap" title="Industry does not need another dashboard. It needs the layer that closes the loop." intro="Existing platforms are strong at the jobs they were built to perform. Control systems operate equipment. Brokers move events. Historians preserve telemetry. Work systems manage tasks. Service providers execute in the field. But no single layer makes the complete physical operation accountable across all of them.">
      <p className="lm-lead-line">Last Mile creates that layer—from first evidence to verified recovery.</p>
      <div className="lm-card-grid lm-market-gap-grid">{gapCards.map((card) => <article className="lm-card" key={card.title}><h3>{card.title}</h3><p>{card.copy}</p></article>)}</div>
    </Section>

    <Section eyebrow="What Last Mile adds" title="Seven advances that make the complete response accountable." tone="wash"><AdvancesGrid /></Section>

    <Section eyebrow="The operator" title="Built for the people accountable for the physical result.">
      <div className="lm-operator">
        <figure><picture><source type="image/avif" srcSet="/images/chuck-720.avif" /><source type="image/webp" srcSet="/images/chuck-720.webp" /><img src="/images/chuck.png" width="971" height="1098" loading="lazy" alt="Experienced industrial operator working near production equipment" /></picture></figure>
        <div><p>Chuck does not need another alert.  He has to be at his sons football game.  What he needs is context.  He needs to know what happened, what it affects, who owns the response, what action is authorized, and whether the operation actually recovered after attempts to fix it.  Now!</p><div className="lm-operator__learn">Learn <TrackedLink to="/about" eventName="cta_explore_platform_click" className="lm-text-link">why Last Mile was built <ArrowRight /></TrackedLink></div></div>
      </div>
    </Section>
  </>;
}

function AnimatedOperatingLoop() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const delay = visibleCount === 0 ? 650 : visibleCount === operatingStages.length ? 3250 : 1250;
    const timer = window.setTimeout(() => {
      setVisibleCount((count) => count === operatingStages.length ? 0 : count + 1);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [visibleCount]);

  return (
    <section className="lm-home-sequence" aria-label="Observe, Understand, Coordinate, Act, Verify, Learn">
      <ol>
        {operatingStages.map((stage, index) => (
          <li key={stage.name} className={index < visibleCount ? "is-visible" : ""}>
            <div>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{stage.name}</strong>
              <p>{stage.copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
