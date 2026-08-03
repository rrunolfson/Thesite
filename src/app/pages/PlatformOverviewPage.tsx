import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import { AdvancesGrid, ArchitectureNarrative, CtaLink, GoverningDiagram, OperatingLoop, PageHero, ProductGrid, Section } from "@/app/components/MarketingComponents";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

const layers = [
  { title: "Plant, site, and OT environment", copy: "Sensors, controllers, operator interfaces, SCADA, safety systems, MES, historians, equipment, and site teams remain the systems closest to the process." },
  { title: "Existing OT, data, work, and service ecosystem", copy: "Brokers, control platforms, historians, CMMS and facilities systems, enterprise workflows, and industrial providers continue doing the jobs they were built to do." },
  { title: "Condition-to-outcome accountability layer", copy: "Last Mile closes the gap where identity fragments, signals remain alarms, handoffs lose context, ticket status substitutes for recovery, and evidence disappears." },
  { title: "Last Mile Platform", copy: "Infinit-Signal, Singularity, Infinit-Flow, and Infinit-Control carry one accountable Condition from trusted evidence to governed response and verified physical outcome." },
];

const principles = [
  ["Vendor-independent by design", "Works above existing OT, data, work, and service systems without making any one vendor mandatory."],
  ["One shared operational identity", "Connects assets, topology, Conditions, work, decisions, evidence, time, and outcomes through SSOM."],
  ["Policy-governed action", "Authority, approvals, modes, and audit evidence remain explicit across human and enterprise-system actions."],
  ["Time-correct evidence and lineage", "Preserves source time, receipt time, semantic version, decisions, work, and outcome evidence."],
  ["No silent loss", "Designed for observable recovery behavior when data, integrations, or workflows are delayed or interrupted."],
];

export function PlatformOverviewPage() {
  const [trustOpen, setTrustOpen] = useState(false);
  const description = "The Last Mile Platform is the independent operational accountability layer above existing OT, data, work, and service systems—from Condition to verified physical outcome.";
  return <>
    <SEO title="Last Mile Platform | Physical Operations Accountability" description={description} canonicalPath="/platform" jsonLd={[createProductSchema("Last Mile Platform", "/platform", description), createBreadcrumbSchema([{name:"Home",path:"/"},{name:"Platform",path:"/platform"}])]} />
    <PageHero eyebrow="Last Mile Platform" title="Command physical operations as one connected system." intro="Last Mile is the independent operational accountability layer above your OT, data, work, and service ecosystem—from Condition to work to verified physical outcome." supporting="It does not replace control systems, brokers, historians, CMMS platforms, enterprise workflows, or service providers. It gives them one shared operational identity, one governed response path, and one evidence chain." actions={<><CtaLink to="/contact?intent=architecture">Discuss Your Operational Stack</CtaLink><CtaLink to="/data-center-cooling" variant="secondary" eventName="cta_explore_platform_click">Explore Data Center Cooling</CtaLink></>} />

    <Section eyebrow="Platform architecture" title="Where Last Mile sits." intro="The supplied architecture is shown at full resolution on desktop. On mobile, the same narrative is rendered as readable HTML rather than reduced text.">
      <GoverningDiagram type="physical" mobileFallback={<ArchitectureNarrative />} />
      <div className="lm-layer-grid">{layers.map((layer,index)=><article className="lm-layer" key={layer.title}><span>{String(index+1).padStart(2,"0")}</span><h3>{layer.title}</h3><p>{layer.copy}</p></article>)}</div>
    </Section>

    <Section eyebrow="The operating loop" title="How Last Mile closes the loop." tone="dark"><OperatingLoop /></Section>

    <Section eyebrow="The operating layer" title="Seven advances missing from fragmented operations." intro="These advances establish accountability across systems without displacing the systems that sense, control, store, manage, or execute work.">
      <GoverningDiagram type="operating" mobileFallback={<AdvancesGrid />} />
      <div className="lm-diagram-explanation"><AdvancesGrid /></div>
    </Section>

    <Section eyebrow="The platform" title="One platform. Four integrated capabilities." intro="Each capability carries the same Condition and evidence chain forward. Together they create one connected operating layer." tone="wash"><ProductGrid /></Section>

    <Section eyebrow="Trust principles" title="Architecture buyers can evaluate.">
      <div className="lm-principles">{principles.map(([title,copy])=><article className="lm-card" key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      <div className="lm-disclosure"><button type="button" aria-expanded={trustOpen} onClick={()=>setTrustOpen((value)=>!value)}><span>Trust and Architecture</span><ChevronDown className={trustOpen ? "is-open" : ""} /></button>{trustOpen ? <div><p>Detailed tenancy, control-plane, replay, rollback, source-profile, and infrastructure capabilities are architectural areas designed for progressive validation with customers. Production claims will follow acceptance evidence.</p><ul><li>Tenant-isolated customer operational memory</li><li>Observable integration health and replay behavior</li><li>Versioned semantics, workflow policy, and evidence lineage</li><li>Recovery paths designed to avoid silent data or action loss</li><li>Permission boundaries for enterprise-system actions</li></ul></div> : null}</div>
    </Section>

    <section className="lm-closing"><div><p className="lm-eyebrow">Start with a consequential Condition</p><h2>Map your path from evidence to verified recovery.</h2><div className="lm-actions"><CtaLink to="/contact?intent=architecture">Discuss Your Operational Stack</CtaLink><CtaLink to="/data-center-cooling" variant="secondary" eventName="cta_explore_platform_click">Explore the Reference Use Case</CtaLink></div></div></section>
  </>;
}
