import { ArrowRight } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import { EditorialHero, EditorialSection, NextStep } from "@/app/components/NarrativeComponents";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

const signalStates = ["Fresh event", "Duplicate", "Retained message", "Replay", "Late arrival", "Bad-quality measurement", "Unknown asset", "Qualified operating issue"] as const;
const pipeline = [
  { title: "Enters", items: ["MQTT and Sparkplug B", "OPC UA", "Approved UNS topics", "Historian or data-platform outputs", "REST APIs and webhooks", "Source-system metadata"] },
  { title: "Checked", items: ["Source identity and authority", "Source time and receipt time", "Freshness and quality", "Duplicate and replay classification", "Mapping version", "Asset and topology resolution", "Policy eligibility"] },
  { title: "Leaves", items: ["SSOM-conformant observations and events", "Qualified issues", "Asset and relationship references", "Quality and confidence", "Provenance and lineage", "Quarantine or rejection evidence", "Replay and forensic references"] },
] as const;

export function InfinitSignalPage() {
  const description = "Infinit-Signal acquires approved operational data, evaluates source time and quality, resolves affected assets, and creates trusted records for the Last Mile Platform.";
  return <><SEO title="Infinit-Signal | Know Which Signals Deserve a Response" description={description} canonicalPath="/infinit-signal" jsonLd={[createProductSchema("Infinit-Signal", "/infinit-signal", description), createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Infinit-Signal", path: "/infinit-signal" }])]} />
    <div className="lm-v2-page">
      <EditorialHero eyebrow="Infinit-Signal · Trust the input" title="Know which signals deserve a response." intro="Infinit-Signal acquires approved outputs from operational systems, preserves source authority, evaluates time and quality, resolves the affected asset, and creates trusted records for the rest of the Last Mile Platform." primary={{ label: "Discuss Your Source Environment", to: "/contact?intent=architecture" }} secondary={{ label: "See the Cooling Use Case", to: "/data-center-cooling" }} />

      <EditorialSection title="Raw telemetry can look authoritative and still be wrong." intro="A measurement may be current, stale, repeated, replayed, delayed, incomplete, or disconnected from the asset it appears to describe." tone="grid">
        <div className="lm-signal-states">{signalStates.map((state, index) => <article key={state}><span>{String(index + 1).padStart(2, "0")}</span><h3>{state}</h3></article>)}</div>
      </EditorialSection>

      <EditorialSection title="What enters. What is checked. What leaves.">
        <div className="lm-pipeline">{pipeline.map((stage) => <article key={stage.title}><h3>{stage.title}</h3><ul className="lm-v2-list">{stage.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
        <p className="lm-v2-caveat">These are supported connection patterns, not a claim that every protocol or customer environment has already been production-validated.</p>
      </EditorialSection>

      <EditorialSection eyebrow="Cooling example" title="The same apparent failure can produce three responsible decisions." tone="dark">
        <div className="lm-example-decision"><article><h3>Reject</h3><p>A known replay duplicates evidence already processed.</p></article><ArrowRight /><article><h3>Quarantine</h3><p>Fresh data names equipment that cannot be resolved confidently.</p></article><ArrowRight /><article><h3>Accept</h3><p>Fresh, good-quality evidence resolves to the approved pump and indicates command ON with run feedback OFF.</p></article></div>
      </EditorialSection>

      <EditorialSection eyebrow="Ecosystem maturity" title="Support labels should say what is actually known.">
        <div className="lm-v2-columns-3">{["Profiled", "Validated", "Reference Architecture", "Partner-Supported", "Customer-Specific"].map((label) => <article key={label}><h3>{label}</h3><p>A precise maturity category—not an implied certification or production claim.</p></article>)}</div>
      </EditorialSection>
      <NextStep title="Bring one consequential signal into focus." copy="Start with the source, its timing and quality, the affected equipment, and the decision your team must make when the evidence arrives." label="Discuss Your Source Environment" to="/contact?intent=architecture" secondary={{ label: "Continue to Singularity", to: "/singularity" }} />
    </div>
  </>;
}
