import { SEO } from "@/app/components/SEO";
import { EditorialHero, EditorialSection, InlineLink, NextStep } from "@/app/components/NarrativeComponents";
import { createBreadcrumbSchema } from "@/app/lib/structuredData";

const resourceGroups = [
  { title: "Build and Proof", copy: "Demonstration milestones, architecture briefs, reference-use-case updates, and product progress.", link: ["Review the cooling proof", "/data-center-cooling"] },
  { title: "Perspectives", copy: "Operational intelligence, OT semantics, cross-vendor coordination, and governed AI in industry.", link: ["Explore the platform point of view", "/platform"] },
  { title: "Signal 2 Action", copy: "Current episodes, the editorial thesis, and an invitation for practitioners with a useful operating perspective.", link: ["Visit Signal 2 Action", "/signal-to-action"] },
  { title: "Company News", copy: "Current milestones, partnerships, corporate updates, and a clearly labeled historical record.", link: ["Read News and Updates", "/company/newsroom"] },
] as const;

export function ResourcesPage() {
  const description = "Explore Last Mile architecture, product progress, cooling proof, operational perspectives, Signal 2 Action, and current company news.";
  return <><SEO title="Resources | Last Mile Build, Proof, and Perspectives" description={description} canonicalPath="/resources" jsonLd={createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Resources", path: "/resources" }])} />
    <div className="lm-v2-page">
      <EditorialHero eyebrow="Resources" title="Follow the build. Inspect the reasoning. Evaluate the proof." intro="The current Last Mile Platform, its reference proof, and its operating point of view come first. Historical material remains available as corporate context, not current product evidence." primary={{ label: "Inspect the Platform", to: "/platform" }} secondary={{ label: "Discuss Your Operation", to: "/contact?intent=operation" }} />
      <EditorialSection title="Choose the kind of evidence you need." tone="grid">
        <div className="lm-resource-grid">{resourceGroups.map((group) => <article key={group.title}><h3>{group.title}</h3><p>{group.copy}</p><InlineLink to={group.link[1]}>{group.link[0]}</InlineLink></article>)}</div>
      </EditorialSection>
      <EditorialSection eyebrow="Historical context" title="Prior strategic chapter.">
        <p className="lm-v2-large-copy">Older releases and episodes that foreground the company’s former ServiceNow chapter remain part of the public record. They are not presented as proof of the independent Last Mile Platform.</p>
        <InlineLink to="/company/newsroom">Open the company news archive</InlineLink>
      </EditorialSection>
      <NextStep title="Move from the point of view to the architecture." copy="The Platform page shows what remains in the existing stack, what Last Mile contributes, and which claims are demonstrable today." label="Explore the Platform" to="/platform" secondary={{ label: "Discuss Your Operation", to: "/contact?intent=operation" }} />
    </div>
  </>;
}
