import { SEO } from "@/app/components/SEO";
import { ProductPageLayout } from "@/app/components/ProductPageLayout";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

export function SSOMPage() {
  const description = "Singularity is the shared operational-memory foundation within the Last Mile Platform. Built on SSOM, it connects assets, signals, issues, workflows, decisions, evidence, and outcomes over time.";

  return (
    <>
      <SEO
        title="Singularity | Operational Memory Within the Last Mile Platform | Last Mile"
        description={description}
        canonicalPath="/singularity"
        jsonLd={[
          createProductSchema("Singularity", "/singularity", `${description} Built on the SSOM semantic model.`),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Singularity", path: "/singularity" },
          ]),
        ]}
      />
      <ProductPageLayout
        eyebrow="PLATFORM FOUNDATION"
        title="Singularity gives your operation a memory."
        intro="Singularity is the shared operational-memory foundation inside the Last Mile Platform. It keeps the history of your assets, signals, issues, work, workflow decisions, evidence, timing, quality, and outcomes connected over time."
        primaryCta={{ label: "Explore the Last Mile Platform", to: "/platform" }}
        secondaryCta={{ label: "See how Infinit-Signal builds the record", to: "/infinit-signal" }}
        overview={{
          heading: "The operating record behind every product.",
          copy: [
            "Infinit-Signal injects operational information into Singularity. Infinit-Control uses Singularity to surface a customer-defined view of the operating estate. Infinit-Flow uses Singularity to trigger, guide, and improve workflows.",
            "As the record grows, teams can identify patterns, tune maintenance, improve workflows, strengthen automation, and give AI a more complete understanding of the specific operating environment.",
          ],
          children: <MemoryVisual />,
        }}
        benefits={[
          { title: "Preserve operational history across shifts, teams, and systems" },
          { title: "Tune preventive-maintenance rules" },
          { title: "Identify recurring issues and failure patterns" },
          { title: "Improve workflow and escalation playbooks" },
          { title: "Give AI recommendations evidence-backed operating context" },
          { title: "Compare outcomes from similar operational responses" },
        ]}
        features={[
          { title: "Organization-specific operational memory" },
          { title: "Asset, relationship, and topology context" },
          { title: "Signals, events, alarms, Conditions, and outcomes" },
          { title: "Quality, timing, source, and evidence history" },
          { title: "Workflow and decision history" },
          { title: "Recurrence and trend analysis" },
          { title: "Maintenance and response tuning" },
          { title: "AI-ready, evidence-backed context" },
          {
            title: "Built on SSOM",
            copy: "SSOM is the semantic model inside Singularity. It gives the platform a consistent way to understand assets, relationships, events, alerts, issues, workflow context, source quality, timing, evidence, actions, and outcomes.",
          },
        ]}
        useCases={[
          "Preserve operational history across shifts, teams, and systems.",
          "Tune preventive-maintenance rules.",
          "Identify recurring issues and failure patterns.",
          "Improve workflow and escalation playbooks.",
          "Give AI recommendations evidence-backed operating context.",
          "Compare outcomes from similar operational responses.",
        ]}
        relatedProducts={[
          { label: "Infinit-Signal", to: "/infinit-signal" },
          { label: "Infinit-Control", to: "/infinit-control" },
          { label: "Infinit-Flow", to: "/infinit-flow" },
          { label: "Last Mile Platform", to: "/platform" },
        ]}
        relatedHeading="Related Products and Platform"
        faqs={[
          {
            question: "Is Singularity a historian replacement?",
            answer: "No. Singularity works above and across existing historians and source systems. It preserves the context, decisions, work, and outcomes that help teams make better operational decisions.",
          },
          {
            question: "What is SSOM?",
            answer: "SSOM is the semantic model inside Singularity. It gives the platform a common way to retain meaning across assets, events, issues, quality, timing, evidence, and outcomes.",
          },
          {
            question: "Is our operating history shared with other customers?",
            answer: "No. Each organization's operational memory remains separate. Any future contribution or shared-learning capability would be optional, governed, and separate from day-to-day customer operations.",
          },
          {
            question: "Does Singularity automatically change maintenance plans?",
            answer: "No. It helps teams identify patterns and improve recommendations, thresholds, and response playbooks. Changes remain under the operating rules and approvals your organization sets.",
          },
        ]}
        resources={[
          { label: "Singularity architecture" },
          { label: "Platform overview", to: "/platform" },
          { label: "Signal 2 Action", to: "/signal-to-action" },
          { label: "News and Updates", to: "/company/newsroom" },
        ]}
        finalCta={{
          heading: "Explore the Last Mile Platform.",
          copy: ["See how the platform turns operating information into shared memory, workflow, visibility, automation, and accountable action."],
          label: "Explore the Last Mile Platform",
          to: "/platform",
        }}
      />
    </>
  );
}

function MemoryVisual() {
  return (
    <div role="img" aria-label="Assets, signals, issues, workflows, decisions, and outcomes create a growing operational record that improves response over time." className="mt-10 rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
      <div className="grid gap-3 md:grid-cols-3">
        {["Your Assets", "Your Signals", "Your Issues", "Your Workflows", "Your Decisions", "Your Outcomes"].map((item) => (
          <div key={item} className="rounded-lg border border-slate-700 bg-slate-950/70 p-4 text-center text-base font-semibold text-white">
            {item}
          </div>
        ))}
      </div>
      <div className="py-3 text-center text-xl text-[#75ADE6]">↓</div>
      <div className="rounded-lg border border-[#217ED9]/50 bg-[#0a1929]/75 p-5 text-center text-lg font-semibold text-white">
        A growing operational record that improves response over time
      </div>
    </div>
  );
}
