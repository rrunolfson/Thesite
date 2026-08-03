import { SEO } from "@/app/components/SEO";
import { ContactLastMileForm } from "@/app/components/ContactLastMileForm";
import { CtaLink, PageHero } from "@/app/components/MarketingComponents";
import { createBreadcrumbSchema } from "@/app/lib/structuredData";

export function ContactPage() {
  return <><SEO title="Discuss Your Operation | Last Mile" description="Tell Last Mile about a Condition that crosses systems, teams, sites, or providers—and the evidence that would prove recovery." canonicalPath="/contact" markdownPath="/contact.md" jsonLd={createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
    <PageHero eyebrow="Discuss your operation" title="Where does your operation lose the thread?" intro="Tell us about a Condition that crosses systems, teams, sites, or service providers—and what evidence would prove the operation recovered." />
    <section className="lm-contact"><div className="lm-container"><div className="lm-contact__context"><p className="lm-eyebrow">A useful starting point</p><h2>Bring one consequential Condition.</h2><p>We will look at the evidence, identity, systems, owners, actions, and physical outcome that make the response difficult to manage today.</p><div className="lm-contact__links"><CtaLink to="/platform" variant="text" eventName="cta_explore_platform_click">Explore the Platform</CtaLink><CtaLink to="/data-center-cooling" variant="text" eventName="cta_explore_platform_click">See Data Center Cooling</CtaLink></div></div><div className="lm-form-panel"><ContactLastMileForm /></div></div></section>
  </>;
}
