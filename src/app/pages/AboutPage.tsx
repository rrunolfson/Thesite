import { SEO } from "@/app/components/SEO";
import { EditorialHero, EditorialSection, NextStep } from "@/app/components/NarrativeComponents";
import { companyStage } from "@/app/content/siteContent";
import { createBreadcrumbSchema } from "@/app/lib/structuredData";

const principles = ["Keep source authority visible.", "Create operational records once.", "Preserve uncertainty instead of hiding it.", "Put policy before consequential action.", "Treat work completion and physical recovery as different states.", "Make failure and degraded data visible.", "Earn the right to automate through evidence."] as const;

export function AboutPage() {
  const description = "Last Mile exists to make industrial response visible, coordinated, and measurable across the control, data, work, provider, and evidence systems already in place.";
  return <><SEO title="About Last Mile | Built for the Operational Handoffs" description={description} canonicalPath="/about" markdownPath="/about.md" jsonLd={createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
    <div className="lm-v2-page">
      <EditorialHero eyebrow="About Last Mile" title="We built Last Mile because industrial response still breaks at the handoffs." intro="Enterprise platforms transformed digital work. Physical operations still depend on disconnected control, data, work, provider, and evidence systems. Last Mile exists to make the complete response visible, coordinated, and measurable without forcing customers into another vendor silo." primary={{ label: "Discuss Your Operation", to: "/contact?intent=operation" }} />

      <EditorialSection title="Built from decades of enterprise-platform experience—and its limits." tone="grid">
        <div className="lm-founder-v2"><div className="lm-founder-v2__identity"><span className="lm-v2-card-label">Founder and CEO</span><h3>Rodney Runolfson</h3></div><div className="lm-founder-v2__copy"><p>Rodney Runolfson brings three decades of experience across enterprise platforms, including roles as a customer, ServiceNow employee, and founder of Deloitte’s U.S. ServiceNow practice. That experience demonstrated what shared platforms can accomplish—and where physical operations remain fundamentally different.</p><p>Last Mile applies those lessons without depending on ServiceNow or any other single enterprise vendor. The company is building an operations-native platform on GCP for the cross-system work that established platforms leave unresolved.</p></div></div>
      </EditorialSection>

      <EditorialSection eyebrow="Working principles" title="Evidence earns authority." tone="dark">
        <ul className="lm-principles-v2">{principles.map((principle) => <li key={principle}>{principle}</li>)}</ul>
      </EditorialSection>

      <EditorialSection eyebrow={companyStage.label} title="Clear about the stage. Serious about the proof.">
        <div className="lm-v2-columns-2"><p className="lm-v2-large-copy">{companyStage.summary}</p><p className="lm-v2-large-copy">{companyStage.evidence}</p></div>
      </EditorialSection>
      <NextStep title="Bring the operational handoff your team cannot make accountable." copy="We will start with what happens today, who holds authority, and which live measurements would establish recovery." label="Discuss Your Operation" to="/contact?intent=operation" secondary={{ label: "See What We Are Proving", to: "/data-center-cooling" }} />
    </div>
  </>;
}
