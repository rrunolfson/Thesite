import { SEO } from "@/app/components/SEO";
import { EditorialHero, EditorialSection, NextStep } from "@/app/components/NarrativeComponents";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

export function InfinitFlowPage() {
  const description = "Infinit-Flow coordinates ownership, approvals, escalation, enterprise-system actions, provider participation, and return measurements across an operational response.";
  return <><SEO title="Infinit-Flow | Keep the Response Moving" description={description} canonicalPath="/infinit-flow" jsonLd={[createProductSchema("Infinit-Flow", "/infinit-flow", description), createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Infinit-Flow", path: "/infinit-flow" }])]} />
    <div className="lm-v2-page">
      <EditorialHero eyebrow="Infinit-Flow · Move the response" title="Keep work moving across teams, systems, and service providers." intro="Infinit-Flow connects the operating issue to ownership, assignments, approvals, escalation, enterprise-system actions, provider participation, and the measurements required to determine whether the intervention worked." primary={{ label: "Discuss Your Response Path", to: "/contact?intent=operation" }} secondary={{ label: "See the Cooling Use Case", to: "/data-center-cooling" }} />

      <EditorialSection title="From fragmented handoffs to one response." tone="grid">
        <div className="lm-before-after"><article><span>Before</span><h3>Alarm → manual interpretation → chat message → ticket → phone call → provider dispatch → ticket closure</h3></article><article><span>With Infinit-Flow</span><h3>Qualified issue → response plan → owner acknowledgement → policy gate → coordinated work → return measurements → proven result</h3></article></div>
      </EditorialSection>

      <EditorialSection eyebrow="Human and machine authority" title="The response advances only as far as customer policy allows.">
        <div className="lm-authority-modes"><article><span>01</span><h3>Assist</h3><p>Prepare information and recommended actions; a person executes.</p></article><article><span>02</span><h3>Approve</h3><p>Automation pauses at a defined authority gate.</p></article><article><span>03</span><h3>Execute</h3><p>A previously authorized enterprise-system action runs with idempotency, audit, and failure handling.</p></article></div>
        <p className="lm-v2-caveat">Baseline operation does not imply direct control of PLC, SCADA, SIS, or BMS environments.</p>
      </EditorialSection>

      <EditorialSection eyebrow="Current proof scope" title="A predefined governed response comes first." tone="dark">
        <p className="lm-v2-large-copy lm-v2-large-copy--dark">The Data Center Cooling reference implementation uses a predefined governed response. General visual authoring, reusable workflow objects, and broader workflow-building capabilities follow customer validation.</p>
      </EditorialSection>

      <EditorialSection eyebrow="Planned authoring experience" title="Build only from approved operational objects." tone="grid">
        <div className="lm-planned"><span className="lm-planned__label">Planned · not presented as currently available</span><ul className="lm-v2-list lm-planned-grid">{["Asset-aware drag-and-drop canvas", "Approved operational object packs", "Valid asset selection based on SSOM", "Condition triggers", "Human tasks", "Timers and escalation", "Policy gates", "Evidence checkpoints", "Return-telemetry checks", "Simulation before publication"].map((item) => <li key={item}>{item}</li>)}</ul></div>
      </EditorialSection>
      <NextStep title="Map one response that keeps breaking at the handoffs." copy="Start with the trigger, accountable owner, approval boundaries, systems of work, provider participation, and measurements required after intervention." label="Discuss Your Response Path" to="/contact?intent=operation" secondary={{ label: "Continue to Infinit-Control", to: "/infinit-control" }} />
    </div>
  </>;
}
