import { useEffect, useRef, useState } from "react";
import { Activity, ArrowRight, Eye, Expand, Gauge, History, Network, Radio, Route, ShieldCheck, Users, Workflow, X, type LucideIcon } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import { TrackedLink } from "@/app/components/TrackedLink";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

const platformCapabilities: ReadonlyArray<{ name: string; role: string; icon: LucideIcon }> = [
  { name: "Infinit-Signal", role: "Operational data plane", icon: Radio },
  { name: "Singularity", role: "Shared semantics", icon: Network },
  { name: "Infinit-Flow", role: "Durable coordination", icon: Route },
  { name: "Infinit-Control", role: "Role-based visibility", icon: Gauge },
];

const productionStackGroups: ReadonlyArray<{ title: string; systems: string; icon: LucideIcon }> = [
  { title: "Physical control", systems: "Sensors, PLCs, SCADA, SIS, BMS, DCIM, MES", icon: Activity },
  { title: "Operational data", systems: "Brokers, UNS, historians, time-series and data platforms", icon: Radio },
  { title: "Enterprise work", systems: "CMMS, EAM, ERP and enterprise workflow", icon: Workflow },
  { title: "People and providers", systems: "Operators, integrators and industrial service providers", icon: Users },
];

const operationalResultStates: ReadonlyArray<{ label: string; icon: LucideIcon }> = [
  { label: "Shared operational awareness", icon: Eye },
  { label: "Coordinated work and escalation", icon: Workflow },
  { label: "Policy-governed action", icon: ShieldCheck },
  { label: "Visible operational status", icon: Activity },
  { label: "Measurable results and history", icon: History },
];

const responsibilityRows = [
  ["Last Mile Platform", "Tenancy, identity, security, policy, shared services, integration governance, observability, administration, and lifecycle management", "The customer’s operational and enterprise ecosystem"],
  ["Infinit-Signal", "Operational acquisition, protection, qualification, normalization, lineage, replay, and source health", "Brokers, historians, SCADA, BMS, MES, or source platforms"],
  ["Singularity", "Shared semantic model, asset identity, topology, operational context, current state, and governed history", "Source-system authority or customer operational systems"],
  ["Infinit-Flow", "Workflow modeling, durable execution, human work, approvals, escalation, and governed destination actions", "PLC, SIS, SCADA, or direct process control"],
  ["Infinit-Control", "Role-based operational views, command experiences, response status, and result visibility", "SCADA, BMS, DCIM, or the underlying system of record"],
] as const;

const platformPrinciples = [
  "Keep the systems customers already trust.",
  "Create operational records once and reuse them through governed contracts.",
  "Preserve source, timing, quality, provenance, and uncertainty.",
  "Keep human authority and customer policy explicit around consequential action.",
] as const;

const sharedPlatformServices = [
  "Tenancy",
  "Identity",
  "Security",
  "Policy",
  "Administration",
  "Observability",
  "Lifecycle",
] as const;

const sharedPlatformContracts = [
  "Canonical operational records",
  "Shared asset and topology context",
  "Qualified operational issues",
  "Workflow lifecycle and work status",
  "Role-based projections",
  "Return telemetry and observed results",
] as const;

export function PlatformOverviewPage() {
  const description = "The Last Mile Platform connects cross-vendor operational data, shared context, coordinated workflows, and role-based command visibility without replacing existing systems.";
  return <>
    <SEO title="Last Mile Platform | Enterprise Operational Intelligence" description={description} canonicalPath="/platform" jsonLd={[createProductSchema("Last Mile Platform", "/platform", description), createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Platform", path: "/platform" }])]} />
    <div className="lm-platform-page">
      <header className="lm-platform-hero">
        <div className="lm-platform-hero__copy">
          <p className="lm-eyebrow">The Last Mile Platform</p>
          <h1>One platform for enterprise operational intelligence.</h1>
          <p className="lm-platform-lede">Last Mile sits above the production systems you already trust. It improves your command, control, and visibility by collecting all the cross-vendor operational data into a shared context, coordinated workflows, and role-based action, <b><i>without</i></b> replacing the systems that operate the plant, facility, infrastructure, or equipment.</p>
        </div>
        <HeroPlatformVisual />
      </header>

      <PlatformSection id="where-last-mile-fits" eyebrow="Where Last Mile fits" title="Above the operational stack. Across the enterprise." intro="Control systems, industrial platforms, historians, brokers, work systems, and service providers each perform essential jobs. The problem appears when an enterprise response must cross their boundaries. Last Mile provides the common platform services, operational context, workflows, and visibility required to carry that response across the estate." tone="wash" card>
        <OperationalResultsEngine />
        <ProductRelationship />
      </PlatformSection>

      <PlatformSection eyebrow="Clear product boundaries" title="Every capability has a defined job." tone="wash" card>
        <div className="lm-platform-table-wrap"><table className="lm-platform-table"><thead><tr><th>Capability</th><th>Primary responsibility</th><th>Does not replace</th></tr></thead><tbody>{responsibilityRows.map(([capability, role, boundary]) => <tr key={capability}><th scope="row">{capability}</th><td data-label="Primary responsibility">{role}</td><td data-label="Does not replace">{boundary}</td></tr>)}</tbody></table></div>
      </PlatformSection>

      <PlatformSection title="Designed for the realities of physical operations.">
        <ol className="lm-platform-principles">{platformPrinciples.map((principle, index) => <li key={principle}><span>{String(index + 1).padStart(2, "0")}</span><strong>{principle}</strong></li>)}</ol>
      </PlatformSection>
    </div>
  </>;
}

function PlatformSection({ eyebrow, title, intro, tone = "white", id, card = false, children }: { eyebrow?: string; title: string; intro?: string; tone?: "white" | "wash"; id?: string; card?: boolean; children: React.ReactNode }) {
  return <section id={id} className={`lm-platform-section lm-platform-section--${tone}`}><div className={`lm-platform-container${card ? " lm-platform-container--card" : ""}`}><header className="lm-platform-section__head">{eyebrow ? <p className="lm-eyebrow">{eyebrow}</p> : null}<h2>{title}</h2>{intro ? <p>{intro}</p> : null}</header>{children}</div></section>;
}

function OperationalResultsEngine() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || revealed) return;
    if (!("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setRevealed(true);
      observer.disconnect();
    }, { threshold: 0.2 });
    observer.observe(root);
    return () => observer.disconnect();
  }, [revealed]);

  return <div ref={rootRef} className={`lm-platform-layers${revealed ? " is-revealed" : ""}`} role="group" aria-describedby="lm-platform-layers-description">
    <p id="lm-platform-layers-description" className="lm-platform-layers__sr-only">The Last Mile Platform sits above and works with the customer’s existing production technology stack. The two layers combine cross-system context, coordination, visibility, and retained production capabilities to create coordinated, visible, and measurable operational results.</p>
    <div className="lm-platform-layers__architecture">
      <section className="lm-platform-layers__platform" aria-label="Last Mile Platform">
        <header className="lm-platform-layers__tier-head"><div><span>Last Mile Platform</span><p>Cross-system context · coordination · visibility</p></div></header>
        <div className="lm-platform-layers__shared-band"><strong>Shared Platform Services</strong><span>Identity · security · policy · administration · observability</span></div>
        <div className="lm-platform-layers__products">{platformCapabilities.map(({ name, role, icon: Icon }) => <article key={name}><Icon aria-hidden="true" /><div><strong>{name}</strong><span>{role}</span></div></article>)}</div>
      </section>

      <div className="lm-platform-layers__seam">
        <svg viewBox="0 0 600 54" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {[50, 150, 250, 350, 450, 550].map((x, index) => <g key={x} className={index % 2 ? "is-teal" : "is-blue"}><path pathLength="1" d={`M ${x} 54 V 0`} /><circle cx={x} cy="27" r="2.5" /></g>)}
        </svg>
        <span>Last Mile works with these systems—it does not replace them.</span>
      </div>

      <section className="lm-platform-layers__stack" aria-label="Existing Production Tech Stack">
        <header className="lm-platform-layers__tier-head"><div><span>Existing Production Tech Stack</span><p>Systems that operate, record, and support the physical environment</p></div></header>
        <div className="lm-platform-layers__stack-groups">{productionStackGroups.map(({ title, systems, icon: Icon }) => <article key={title}><Icon aria-hidden="true" /><div><strong>{title}</strong><span>{systems}</span></div><i aria-hidden="true" /></article>)}</div>
      </section>
    </div>

    <div className="lm-platform-layers__vector" aria-label="Together create">
      <span>Together create</span>
      <svg viewBox="0 0 100 420" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs><linearGradient id="lm-result-vector" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1d7cd8" /><stop offset="1" stopColor="#3a8f98" /></linearGradient></defs>
        <path pathLength="1" d="M 0 82 C 46 82 52 204 94 210" />
        <path pathLength="1" d="M 0 338 C 46 338 52 216 94 210" />
        <path className="is-result" pathLength="1" d="M 44 210 H 100" />
      </svg>
    </div>

    <aside className="lm-platform-layers__results" aria-label="Operational Results">
      <header><span>Operational Results</span><p>A connected response with measurable status</p></header>
      <div>{operationalResultStates.map(({ label, icon: Icon }, index) => <article key={label} style={{ "--lm-result-order": index } as React.CSSProperties}><Icon aria-hidden="true" /><span>{label}</span><i aria-hidden="true" /></article>)}</div>
    </aside>
    <i className="lm-platform-layers__sweep" aria-hidden="true" />
  </div>;
}

function HeroPlatformVisual() {
  const [expanded, setExpanded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!expanded) return;
    const expandButton = expandButtonRef.current;
    closeButtonRef.current?.focus();
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", close);
    return () => { window.removeEventListener("keydown", close); expandButton?.focus(); };
  }, [expanded]);
  return <>
    <figure className="lm-platform-hero__visual">
      <div className="lm-platform-hero__image">
        <picture>
          <source type="image/avif" srcSet="/images/platform/last-mile-physical-operations-platform-pale-blue-v1-960.avif 960w, /images/platform/last-mile-physical-operations-platform-pale-blue-v1-1440.avif 1440w" sizes="(min-width: 1024px) 820px, calc(100vw - 88px)" />
          <source type="image/webp" srcSet="/images/platform/last-mile-physical-operations-platform-pale-blue-v1-960.webp 960w, /images/platform/last-mile-physical-operations-platform-pale-blue-v1-1440.webp 1440w" sizes="(min-width: 1024px) 820px, calc(100vw - 88px)" />
          <img src="/images/platform/last-mile-physical-operations-platform-pale-blue-v1.png" width="3840" height="2160" fetchPriority="high" alt="The Last Mile Physical Operations Platform connecting existing operational systems to enterprise action" />
        </picture>
        <button ref={expandButtonRef} type="button" onClick={() => setExpanded(true)} aria-label="Select expand to inspect the platform details" data-tooltip="Select expand to inspect the platform details"><Expand aria-hidden="true" /></button>
      </div>
      <figcaption className="lm-platform-support">Connect the operational estate. Preserve source authority. Coordinate action across the enterprise.</figcaption>
    </figure>
    {expanded ? <div className="lm-platform-lightbox" role="dialog" aria-modal="true" aria-label="Expanded Last Mile Physical Operations Platform" onClick={() => setExpanded(false)}><button ref={closeButtonRef} type="button" onClick={() => setExpanded(false)} aria-label="Close expanded platform image"><X aria-hidden="true" /></button><div onClick={(event) => event.stopPropagation()}><img src="/images/platform/last-mile-physical-operations-platform-pale-blue-v1.png" width="3840" height="2160" alt="Full-resolution Last Mile Physical Operations Platform connecting existing operational systems to enterprise action" /></div></div> : null}
  </>;
}

function ProductRelationship() {
  return <div id="product-relationship" className="lm-product-relationship" aria-label="Four Last Mile products connected by shared platform services and one semantic foundation">
    <div className="lm-product-relationship__label">The Last Mile Platform &amp; Product Portfolio</div>
    <div className="lm-product-relationship__body">
      <article className="lm-product-relationship__signal"><span>Operational data plane</span><h3>Infinit-Signal</h3><strong>Acquire, protect, and qualify operational data.</strong><p>Infinit-Signal connects to approved operational sources, preserves source authority, evaluates timing and quality, normalizes records to SSOM, resolves asset context, and makes duplicates, replay, delay, or rejection visible.</p><TrackedLink to="/infinit-signal" eventName="cta_product_click" eventData={{ product: "Infinit-Signal" }}>Explore Infinit-Signal <ArrowRight aria-hidden="true" /></TrackedLink></article>
      <article className="lm-product-relationship__flow"><span>Durable coordination</span><h3>Infinit-Flow</h3><strong>Coordinate work across operational boundaries.</strong><p>Infinit-Flow turns qualified operational issues into durable workflows involving people, approvals, enterprise systems, service providers, timers, escalation, and policy-governed actions.</p><TrackedLink to="/infinit-flow" eventName="cta_product_click" eventData={{ product: "Infinit-Flow" }}>Explore Infinit-Flow <ArrowRight aria-hidden="true" /></TrackedLink></article>
      <article className="lm-product-relationship__control"><span>Role-based visibility</span><h3>Infinit-Control</h3><strong>Make the complete response visible.</strong><p>Infinit-Control gives operators and leaders role-based views of current operating state, affected assets, ownership, active work, source quality, decisions, and observed results.</p><TrackedLink to="/infinit-control" eventName="cta_product_click" eventData={{ product: "Infinit-Control" }}>Explore Infinit-Control <ArrowRight aria-hidden="true" /></TrackedLink></article>
    </div>
    <article className="lm-product-relationship__singularity"><div><span>Standardized Data Semantics</span><h3>Singularity</h3><strong>Create shared operational meaning.</strong></div><div><p>Singularity provides the governed semantic foundation for assets, relationships, events, work, evidence, and results. SSOM defines the common contract; current-state and historical services make that context reusable across the platform.</p><TrackedLink to="/singularity" eventName="cta_product_click" eventData={{ product: "Singularity" }}>Explore Singularity <ArrowRight aria-hidden="true" /></TrackedLink></div></article>
    <div className="lm-product-relationship__platform-services"><strong>Shared Platform Services &amp; Contracts</strong><div className="lm-product-relationship__platform-items"><div>{sharedPlatformServices.map((service) => <span key={service}>{service}</span>)}</div><div>{sharedPlatformContracts.map((contract) => <span key={contract}>{contract}</span>)}</div></div></div>
  </div>;
}
