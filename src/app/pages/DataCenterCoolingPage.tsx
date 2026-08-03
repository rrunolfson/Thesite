import { Building2, CheckCircle2, Database, Gauge, HardHat } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import { CtaLink, OperatingLoop, PageHero, Section } from "@/app/components/MarketingComponents";
import { createBreadcrumbSchema } from "@/app/lib/structuredData";

const flow = [
  ["01", "Observe", "Cooling telemetry indicates an excursion."],
  ["02", "Qualify", "Infinit-Signal qualifies the evidence and creates the Condition."],
  ["03", "Understand", "Singularity resolves affected equipment, topology, history, and context."],
  ["04", "See", "Infinit-Control shows the live Condition and response state."],
  ["05", "Coordinate", "Infinit-Flow coordinates the governed response."],
  ["06", "Verify", "Return telemetry verifies recovery—or shows that the intervention failed."],
];
const systems = ["BMS and DCIM", "Cooling equipment telemetry", "Historians and data platforms", "CMMS and facilities work", "Enterprise workflow", "Industrial service providers"];
const people = ["Critical facilities operators", "Site and regional facilities leaders", "Mechanical and controls specialists", "Service providers and dispatch teams", "Operations and reliability leadership"];
const measures = ["Inlet-temperature compliance", "Mean time to recovery", "Cooling response time", "PUE impact", "Condition recurrence"];

export function DataCenterCoolingPage() {
  const description = "The Data Center Cooling reference use case shows how Last Mile connects a thermal excursion to governed response and telemetry-verified physical recovery.";
  return <><SEO title="Data Center Cooling | From Thermal Excursion to Verified Recovery" description={description} canonicalPath="/data-center-cooling" jsonLd={createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Data Center Cooling", path: "/data-center-cooling" }])} />
    <PageHero eyebrow="Data Center Cooling reference use case" title="From thermal excursion to verified recovery." intro="Data centers already have BMS, DCIM, telemetry, alarms, facilities teams, service providers, and work systems. Last Mile connects the complete response above them." supporting="A commercial proof is being developed. This page describes the approved reference use case, not a completed live demonstration." actions={<CtaLink to="/contact?intent=data-center-cooling">Explore a Data Center Cooling Design Partnership</CtaLink>} />
    <Section eyebrow="The complete response" title="Six stages. One accountable Condition." tone="dark"><div className="lm-cooling-flow">{flow.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></Section>
    <Section eyebrow="Systems and operators" title="Connect the response above the existing environment."><div className="lm-two-lists"><ListPanel icon={<Database />} title="Systems involved" items={systems} /><ListPanel icon={<HardHat />} title="Operators involved" items={people} /></div></Section>
    <Section eyebrow="Before and after" title="Replace fragmented handoffs with one governed path." tone="wash"><div className="lm-compare"><article><span>Current fragmented process</span><h3>Alarm, interpretation, handoff, ticket, dispatch, and recovery evidence live in different places.</h3><ul><li>Asset identity differs across systems</li><li>Context is rebuilt manually</li><li>Ownership becomes ambiguous</li><li>Closed work is mistaken for physical recovery</li></ul></article><article><span>Last Mile process</span><h3>One Condition carries identity, evidence, work, decisions, action, and outcome across the response.</h3><ul><li>Topology and impact remain attached</li><li>Approvals and authority stay visible</li><li>Providers share accountable state</li><li>Return telemetry proves recovery or failure</li></ul></article></div></Section>
    <Section eyebrow="Outcome contract" title="Measure the physical result, not only process completion." tone="dark"><div className="lm-measures">{measures.map((measure) => <div key={measure}><Gauge /><strong>{measure}</strong></div>)}</div></Section>
    <Section eyebrow="Proof status" title="Implemented versus simulated."><div className="lm-status-grid"><article className="lm-card"><h3>Being implemented</h3><p>A predefined governed workflow, Condition model, evidence path, role-based command experience, and telemetry-based recovery contract for the cooling reference use case.</p></article><article className="lm-card"><h3>Simulated for validation</h3><p>Representative cooling telemetry, equipment topology, work-system interactions, provider handoffs, and failure or recurrence scenarios until design-partner environments are connected.</p></article><article className="lm-card"><h3>Not yet claimed</h3><p>A production-ready generalized workflow authoring product or a completed executable Data Center Cooling demonstration. Demo claims begin only after acceptance testing.</p></article></div></Section>
    <Section eyebrow="Design partnership" title="A strong design partner has a consequential Condition and the authority to test the complete response." tone="wash"><div className="lm-qualification"><ul>{["Operates mission-critical cooling or facilities infrastructure", "Can provide representative telemetry and topology without exposing sensitive facility details", "Can map current response ownership, approvals, work systems, and providers", "Can define measurable recovery and recurrence criteria", "Can participate in workflow and acceptance-test validation"].map((item) => <li key={item}><CheckCircle2 />{item}</li>)}</ul><div><Building2 /><h3>Start with one site or repeatable operating pattern.</h3><p>The goal is to prove the accountability loop before broad deployment.</p><CtaLink to="/contact?intent=data-center-cooling">Explore a Data Center Cooling Design Partnership</CtaLink></div></div></Section>
    <Section eyebrow="Operating sequence" title="The same platform loop applies beyond cooling." tone="dark"><OperatingLoop /></Section>
  </>;
}

function ListPanel({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) { return <article className="lm-list-panel"><div>{icon}<h3>{title}</h3></div><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>; }
