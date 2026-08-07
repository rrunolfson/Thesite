import { SEO } from "@/app/components/SEO";
import { ContactLastMileForm } from "@/app/components/ContactLastMileForm";
import { EditorialHero, InlineLink } from "@/app/components/NarrativeComponents";
import { createBreadcrumbSchema } from "@/app/lib/structuredData";

export function ContactPage() {
  const description = "Bring Last Mile one consequential operating issue, the systems and people it crosses, and the measurements that would prove recovery.";
  return <><SEO title="Discuss Your Operation | Last Mile" description={description} canonicalPath="/contact" markdownPath="/contact.md" jsonLd={createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
    <div className="lm-v2-page">
      <EditorialHero eyebrow="Discuss your operation" title="Show us where the response breaks." intro="Bring one consequential operating issue, the systems and people it crosses, and the measurements that would prove recovery." />
      <section className="lm-contact lm-contact-v2"><div className="lm-v2-container"><aside className="lm-contact__context"><p className="lm-eyebrow">A useful starting point</p><h2>You do not need to learn our terminology first.</h2><p>Describe what changes, where the signal and work live, who responds, and what the operation must do after intervention. We will map that response with you.</p><div className="lm-contact__links"><InlineLink to="/platform">Explore the Platform</InlineLink><InlineLink to="/data-center-cooling">See a complete example</InlineLink></div></aside><div className="lm-form-panel"><ContactLastMileForm /></div></div></section>
    </div>
  </>;
}
