import { SEO } from "@/app/components/SEO";
import { EditorialHero, EditorialSection, NextStep } from "@/app/components/NarrativeComponents";
import { ecosystemFamilies } from "@/app/content/siteContent";
import { createBreadcrumbSchema } from "@/app/lib/structuredData";

export function EcosystemPage() {
  const description = "See how the Last Mile Platform is designed to work across existing industrial data, control, history, facilities, enterprise-work, integrator, and provider systems.";
  return <><SEO title="Ecosystem | Work Across the Systems Already in Place" description={description} canonicalPath="/ecosystem" jsonLd={createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Ecosystem", path: "/ecosystem" }])} />
    <div className="lm-v2-page">
      <EditorialHero eyebrow="The existing operational ecosystem" title="Designed to work across the systems already running your operation." intro="Last Mile does not require a single control, data, work, or service vendor. It is designed to preserve each system’s authority while connecting identity, context, ownership, evidence, and result across the response." primary={{ label: "Discuss Your Operational Stack", to: "/contact?intent=architecture" }} secondary={{ label: "Inspect the Platform", to: "/platform" }} />
      <EditorialSection title="Start with system families—not a wall of unqualified logos." intro="Each label describes the current relationship honestly. It does not imply certification, a commercial partnership, or production validation." tone="grid">
        <div className="lm-ecosystem-grid">{ecosystemFamilies.map((family) => <article key={family.title}><h3>{family.title}</h3><p>{family.examples}</p><span className="lm-maturity">{family.maturity}</span></article>)}</div>
      </EditorialSection>
      <EditorialSection title="What the maturity labels mean.">
        <div className="lm-v2-columns-3">{[
          ["Profiled", "A source or action pattern has a documented interface profile."],
          ["Validated", "The defined behavior has passed the stated validation scope."],
          ["Reference Architecture", "The system family is represented in an approved design pattern."],
          ["Partner-Supported", "A documented partner relationship supports the specific capability."],
          ["Customer-Specific", "Connection and behavior depend on the customer environment and acceptance work."],
        ].map(([label, copy]) => <article key={label}><h3>{label}</h3><p>{copy}</p></article>)}</div>
      </EditorialSection>
      <NextStep title="Map the response across your actual ecosystem." copy="Identify the authoritative signal, asset record, work system, approval point, provider channel, and return measurement in your environment." label="Discuss Your Operational Stack" to="/contact?intent=architecture" secondary={{ label: "Review the Platform", to: "/platform" }} />
    </div>
  </>;
}
