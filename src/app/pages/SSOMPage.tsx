import { ArrowRight } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import { EditorialHero, EditorialSection, NextStep } from "@/app/components/NarrativeComponents";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

const memoryObjects = ["Asset identity", "Relationships and topology", "Time and quality", "Response history", "Observed result and recurrence"] as const;

export function SSOMPage() {
  const description = "Singularity gives assets, events, evidence, decisions, work, and results a governed operational meaning through the SSOM semantic contract.";
  return <><SEO title="Singularity | Governed Operational Context" description={description} canonicalPath="/singularity" jsonLd={[createProductSchema("Singularity", "/singularity", description), createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Singularity", path: "/singularity" }])]} />
    <div className="lm-v2-page">
      <EditorialHero eyebrow="Singularity · Keep the context" title="Give every asset, event, and response the same operational meaning." intro="Singularity is the governed operational memory inside the Last Mile Platform. Its SSOM semantic contract connects identity, topology, time, evidence, decisions, work, and results without replacing the systems that originally created them." primary={{ label: "Discuss Your Operational Model", to: "/contact?intent=architecture" }} secondary={{ label: "Explore the Platform", to: "/platform" }} />

      <EditorialSection title="One pump. Five names. One shared operational identity." tone="grid">
        <div className="lm-identity-map"><div className="lm-identity-map__sources">{["BMS · CHWP-02", "Historian · P_204_RUN", "CMMS · Asset 11872", "Provider · Loop B secondary pump"].map((name) => <span key={name}>{name}</span>)}</div><ArrowRight /><div className="lm-identity-map__resolved"><span>Last Mile identity</span><strong>Cooling Loop B · Chilled-water Pump 02</strong><p>Every source reference remains preserved.</p></div></div>
      </EditorialSection>

      <EditorialSection title="What Singularity remembers." tone="dark">
        <div className="lm-memory-grid">{memoryObjects.map((object, index) => <article key={object}><span>{String(index + 1).padStart(2, "0")}</span><h3>{object}</h3></article>)}</div>
      </EditorialSection>

      <EditorialSection title="Current operating state and governed history have different jobs.">
        <div className="lm-v2-columns-3"><article><h3>PostgreSQL</h3><p>Serves transactional records and projections used in current operating views.</p></article><article><h3>BigQuery</h3><p>Preserves governed semantic history for analysis.</p></article><article><h3>Cloud Storage</h3><p>Retains raw evidence and replay artifacts.</p></article></div>
        <p className="lm-v2-caveat">Singularity does not turn disagreement into false certainty. Identity confidence, time confidence, source quality, freshness, and unresolved states remain visible.</p>
      </EditorialSection>

      <EditorialSection eyebrow="Context for responsible AI" title="AI cannot reason safely from ambiguous operational history." tone="grid">
        <p className="lm-v2-large-copy">AI cannot reason safely about physical operations if asset identity, timing, source authority, and result history are ambiguous. Singularity is intended to provide the governed context required for explainable recommendations and future automation.</p>
      </EditorialSection>

      <EditorialSection title="Customer memory remains separate from optional learning.">
        <div className="lm-v2-columns-2"><article className="lm-v2-note"><span>Customer operational memory</span><h3>Tenant-isolated by default.</h3><p>Customer identity, topology, evidence, work, decisions, and results support that customer’s operation.</p></article><article className="lm-v2-note"><span>Optional Data Trust contribution</span><h3>Separate permission, separate path.</h3><p>Any contribution is policy-approved, minimized and privacy-transformed, asynchronous, and never required to use the platform. There is no automatic pooling.</p></article></div>
      </EditorialSection>
      <NextStep title="Resolve the operational meaning before coordinating the response." copy="Bring the asset names, relationships, source references, and history that currently disagree across your systems." label="Discuss Your Operational Model" to="/contact?intent=architecture" secondary={{ label: "Continue to Infinit-Flow", to: "/infinit-flow" }} />
    </div>
  </>;
}
