import { SEO } from "@/app/components/SEO";
import { EditorialHero, EditorialSection, NextStep, ProductThread, StatusPanel } from "@/app/components/NarrativeComponents";
import { coolingProofStatus } from "@/app/content/siteContent";
import { createBreadcrumbSchema } from "@/app/lib/structuredData";

const operatingSequence = [
  { title: "Detect", items: ["Pump command ON", "Run feedback OFF", "Amperage near zero", "Loop differential pressure declining", "Rack inlet temperatures currently within band"] },
  { title: "Qualify", items: ["Confirm source freshness", "Reject duplicate or replayed events", "Resolve equipment identity", "Check for an expected maintenance state", "Establish the accountable issue"] },
  { title: "Understand impact", items: ["Identify the pump and chilled-water loop", "Resolve the protected hall", "Show current redundancy posture", "Retrieve recent service and recurrence history"] },
  { title: "Coordinate response", items: ["Assign facilities ownership", "Start acknowledgement timer", "Notify the appropriate provider", "Apply escalation and approval rules", "Record enterprise-system actions"] },
  { title: "Verify recovery", items: ["Pump run confirmation", "Stable amperage", "Restored differential pressure", "Rack inlet temperatures within band", "Stability for the agreed period", "No recurrence during the defined window"] },
  { title: "Record the result", items: ["Verified recovery", "Partial recovery", "Failed intervention", "Recurrence", "Insufficient evidence"] },
] as const;

const systems = ["BMS", "DCIM", "Equipment telemetry", "Historian or data platform", "Facilities work management", "Enterprise workflow", "Provider systems"] as const;
const people = ["Critical-facilities operator", "Site facilities lead", "Mechanical or controls specialist", "Regional operations leader", "Service-provider dispatcher", "Field technician"] as const;
const measurements = ["Evidence-to-qualification time", "Qualification-to-acknowledgement time", "Acknowledgement-to-dispatch time", "Total time on reduced protection", "Recovery-band criteria", "Stability duration", "Recurrence window", "Energy impact where applicable"] as const;

export function DataCenterCoolingPage() {
  const description = "A Data Center Cooling reference use case showing how Last Mile connects equipment evidence, facilities work, approvals, provider response, and return measurements to prove restored redundancy.";
  return <><SEO title="Data Center Cooling | Prove Redundancy Was Restored" description={description} canonicalPath="/data-center-cooling" jsonLd={[createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Data Center Cooling", path: "/data-center-cooling" }])]} />
    <div className="lm-v2-page">
      <EditorialHero eyebrow="Data Center Cooling · Reference use case" title="Prove cooling redundancy was restored—not just that the work was closed." intro="Data centers already operate BMS, DCIM, equipment telemetry, facilities work systems, specialist providers, and operating procedures. Last Mile connects the response above them and retains the measurements that establish whether the required protection returned." primary={{ label: "Explore a Design Partnership", to: "/contact?intent=design-partnership" }} secondary={{ label: "Inspect the Platform", to: "/platform" }} visual={<div className="lm-cooling-status-banner"><span>Proof status</span><strong>Reference design with implemented demonstration and simulated operating components</strong><p>Production validation is not yet claimed.</p></div>} />

      <EditorialSection eyebrow="The scenario" title="A credible response starts with a specific operating state." tone="grid">
        <div className="lm-scenario-banner"><strong>A secondary chilled-water pump receives a run command, but run feedback and amperage do not confirm operation. Loop differential pressure falls, leaving the protected hall on reduced cooling redundancy.</strong><span>Representative scenario</span></div>
      </EditorialSection>

      <EditorialSection title="Follow the complete operating sequence." tone="dark">
        <ol className="lm-cooling-sequence">{operatingSequence.map((stage, index) => <li key={stage.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{stage.title}</h3><ul>{stage.items.map((item) => <li key={item}>{item}</li>)}</ul></li>)}</ol>
      </EditorialSection>

      <EditorialSection eyebrow="Interactive response" title="See the four products carry the same cooling issue.">
        <ProductThread expanded />
      </EditorialSection>

      <EditorialSection title="The real response crosses systems and people." tone="grid">
        <div className="lm-v2-columns-2"><article className="lm-v2-note"><span>Systems</span><h3>Records, controls, and work</h3><ul className="lm-v2-list">{systems.map((system) => <li key={system}>{system}</li>)}</ul></article><article className="lm-v2-note"><span>People</span><h3>Authority, execution, and accountability</h3><ul className="lm-v2-list">{people.map((person) => <li key={person}>{person}</li>)}</ul></article></div>
      </EditorialSection>

      <EditorialSection eyebrow="Measurement contract" title="Define what the design partner will measure." intro="The use case does not invent target values. The operating team defines the acceptable bands, timing thresholds, and observation windows.">
        <div className="lm-measure-contract">{measurements.map((measurement) => <div key={measurement}>{measurement}</div>)}</div>
      </EditorialSection>

      <EditorialSection eyebrow="Proof status" title="What can be tested—and what cannot yet be claimed." tone="grid">
        <StatusPanel items={coolingProofStatus} />
      </EditorialSection>

      <NextStep title="Help prove the complete response in a real operating environment." copy="Define the equipment, systems, authority boundaries, and return measurements with us, then evaluate the response against an agreed acceptance path." label="Explore a Data Center Cooling Design Partnership" to="/contact?intent=design-partnership" secondary={{ label: "Review the Platform", to: "/platform" }} />
    </div>
  </>;
}
