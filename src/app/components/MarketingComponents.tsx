import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  Expand,
  Gauge,
  Layers3,
  Network,
  Radio,
  Route,
  ShieldCheck,
  X,
} from "lucide-react";
import { TrackedLink } from "./TrackedLink";

const operatingStages = [
  { name: "Observe", copy: "Acquire and qualify operational evidence." },
  { name: "Understand", copy: "Resolve identity, topology, context, and meaning." },
  { name: "Coordinate", copy: "Connect the Condition to people, platforms, providers, and work." },
  { name: "Act", copy: "Execute policy-governed human and machine actions." },
  { name: "Verify", copy: "Use return telemetry to prove physical recovery." },
  { name: "Learn", copy: "Retain the outcome and improve future response." },
] as const;

const platformProducts = [
  { name: "Infinit-Signal", role: "Observe and qualify", to: "/infinit-signal", copy: "Turns source-system events into trusted operational facts and accountable Conditions." },
  { name: "Singularity", role: "Understand and remember", to: "/singularity", copy: "Creates shared identity, topology, context, evidence, and operational memory through SSOM." },
  { name: "Infinit-Flow", role: "Coordinate and act", to: "/infinit-flow", copy: "Connects the Condition to governed work, approvals, escalation, providers, and authorized action." },
  { name: "Infinit-Control", role: "See and verify", to: "/infinit-control", copy: "Gives operators a live command surface for Conditions, work, evidence, state, and verified outcomes." },
] as const;

const lastMileAdvances = [
  { title: "One operational identity and topology", copy: "Unifies asset names, relationships, ownership, and context across sites so every team and system acts on the same operational truth." },
  { title: "One accountable Condition", copy: "Converts noisy events into a qualified, owned operational issue, focusing response on what can affect safety, uptime, cost, or service." },
  { title: "Condition-to-work orchestration", copy: "Carries evidence and context into the right workflow, team, and provider, eliminating manual handoffs and shortening time to action." },
  { title: "Policy-governed command and action", copy: "Makes authority, approvals, and execution boundaries explicit so customers can automate confidently without sacrificing control or auditability." },
  { title: "Telemetry-verified physical recovery", copy: "Confirms the asset or process actually recovered using live return telemetry, replacing ticket-closure assumptions with proof of outcome." },
  { title: "A time-correct evidence chain", copy: "Preserves what happened, when it happened, what changed, and who acted, providing a defensible record for analysis, compliance, and improvement." },
  { title: "Outcome learning across sites", copy: "Retains proven responses and results so every site benefits from prior experience, improving consistency and preventing repeated failures." },
] as const;

type CtaEvent = "cta_contact_click" | "cta_explore_platform_click" | "cta_product_click";

export function CtaLink({ to, children, variant = "primary", eventName = "cta_contact_click" }: { to: string; children: ReactNode; variant?: "primary" | "secondary" | "text"; eventName?: CtaEvent }) {
  return (
    <TrackedLink to={to} eventName={eventName} className={`lm-button lm-button--${variant}`}>
      <span>{children}</span><ArrowRight aria-hidden="true" />
    </TrackedLink>
  );
}

export function PageHero({ eyebrow, title, intro, supporting, actions, children, className = "" }: { eyebrow: string; title: ReactNode; intro: string; supporting?: ReactNode; actions?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <header className={`lm-hero ${children ? "lm-hero--split" : ""} ${className}`}>
      <div className="lm-hero__copy">
        <p className="lm-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lm-hero__intro">{intro}</p>
        {supporting ? <p className="lm-hero__support">{supporting}</p> : null}
        {actions ? <div className="lm-actions">{actions}</div> : null}
      </div>
      {children ? <div className="lm-hero__visual">{children}</div> : null}
    </header>
  );
}

export function Section({ eyebrow, title, intro, tone = "light", children, id }: { eyebrow?: string; title: ReactNode; intro?: string; tone?: "light" | "wash" | "dark"; children: ReactNode; id?: string }) {
  return (
    <section id={id} className={`lm-section lm-section--${tone}`}>
      <div className="lm-container">
        <div className="lm-section__head">
          {eyebrow ? <p className="lm-eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
          {intro ? <p>{intro}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function OperatingLoop({ compact = false }: { compact?: boolean }) {
  return (
    <ol className={`lm-loop ${compact ? "lm-loop--compact" : ""}`} aria-label="Last Mile operating sequence">
      {operatingStages.map((stage, index) => (
        <li key={stage.name}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div><strong>{stage.name}</strong>{compact ? null : <p>{stage.copy}</p>}</div>
        </li>
      ))}
    </ol>
  );
}

export function ProductGrid() {
  return (
    <div className="lm-product-grid">
      {platformProducts.map((product, index) => (
        <TrackedLink key={product.name} to={product.to} eventName="cta_product_click" eventData={{ product: product.name }} className="lm-product-card">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>{product.role}</p>
          <h3>{product.name}</h3>
          <strong>{product.copy}</strong>
          <ArrowRight aria-hidden="true" />
        </TrackedLink>
      ))}
    </div>
  );
}

export function AdvancesGrid() {
  const icons = [Network, Radio, Route, ShieldCheck, Gauge, Layers3, Check];
  return (
    <ol className="lm-advances">
      {lastMileAdvances.map((advance, index) => {
        const Icon = icons[index];
        return <li key={advance.title}><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" /><div><strong>{advance.title}</strong><p>{advance.copy}</p></div></li>;
      })}
    </ol>
  );
}

export function ArchitectureNarrative({ compact = false }: { compact?: boolean }) {
  const systems = ["OT + controls", "Historians + data", "Work systems", "Service providers"];
  return (
    <div className={`lm-architecture ${compact ? "lm-architecture--compact" : ""}`} role="img" aria-label="Last Mile sits above existing operational systems and closes the accountability gap from a qualified Condition to governed work and verified physical recovery.">
      <div className="lm-architecture__platform">
        <span>Last Mile Platform</span>
        <div>{platformProducts.map((product) => <strong key={product.name}>{product.name}</strong>)}</div>
      </div>
      <div className="lm-architecture__path" aria-hidden="true"><i /><b>Condition</b><i /><b>Governed work</b><i /><b>Verified outcome</b></div>
      <div className="lm-architecture__systems">{systems.map((system) => <span key={system}>{system}</span>)}</div>
      <p className="lm-architecture__base">Plant / site / OT environment</p>
    </div>
  );
}

export function GoverningDiagram({ type, mobileFallback }: { type: "physical" | "operating"; mobileFallback: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const file = type === "physical" ? "last-mile-physical-operations-platform-pale-blue-v1" : "last-mile-operating-layer-pale-4k";
  const title = type === "physical" ? "The Last Mile Physical Operations Platform" : "The Last Mile Platform Across Existing Operational Systems";
  const imageVersion = "";

  useEffect(() => {
    if (!expanded) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [expanded]);

  const picture = (
    <picture>
      <source type="image/avif" srcSet={`/images/platform/${file}-960.avif${imageVersion} 960w, /images/platform/${file}-1440.avif${imageVersion} 1440w`} sizes="(min-width: 1200px) 1120px, 92vw" />
      <source type="image/webp" srcSet={`/images/platform/${file}-960.webp${imageVersion} 960w, /images/platform/${file}-1440.webp${imageVersion} 1440w`} sizes="(min-width: 1200px) 1120px, 92vw" />
      <img src={`/images/platform/${file}.png${imageVersion}`} width="3840" height="2160" alt={title} loading="lazy" />
    </picture>
  );

  return (
    <>
      <figure className={`lm-diagram lm-diagram--${type}`}>
        <div className="lm-diagram__desktop">{picture}<button type="button" onClick={() => setExpanded(true)} aria-label={`Expand ${title}`}><Expand aria-hidden="true" /></button></div>
        <div className="lm-diagram__mobile">{mobileFallback}</div>
        <figcaption>{title}. A complete HTML explanation follows the visual.</figcaption>
      </figure>
      {expanded ? <div className="lm-lightbox" role="dialog" aria-modal="true" aria-label={title} onClick={() => setExpanded(false)}><button type="button" aria-label="Close expanded diagram" onClick={() => setExpanded(false)}><X /></button><div onClick={(event) => event.stopPropagation()}>{picture}</div></div> : null}
    </>
  );
}
