import { SEO } from "@/app/components/SEO";
import { ProductPageLayout } from "@/app/components/ProductPageLayout";
import { createBreadcrumbSchema } from "@/app/lib/structuredData";

export function SSOMPage() {
  const description = "Singularity is Last Mile's organization-specific operational memory, built on SSOM, connecting assets, signals, issues, work, decisions, and outcomes.";

  return (
    <>
      <SEO
        title="Singularity / SSOM | Operational Memory"
        description={description}
        canonicalPath="/ssom"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Singularity, built on SSOM", path: "/ssom" },
        ])}
      />
      <ProductPageLayout
        eyebrow="SINGULARITY, BUILT ON SSOM"
        title="Your operation gets smarter when it can remember."
        intro="Singularity is Last Mile's operational memory. It connects the history of your assets, signals, issues, work, decisions, and outcomes so teams can understand what happened before and improve what happens next."
        primaryCta={{ label: "Explore your operational memory", to: "/design-partner?conversation_type=ssom-discussion" }}
        secondaryCta={{ label: "See how Infinit-Signal creates the record", to: "/infinit-signal" }}
        overview={{
          heading: "More than a historian. The memory behind better action.",
          copy: [
            "Historians preserve valuable operational data. Singularity builds on that value by connecting information across systems and keeping the operational story intact: what happened, what it meant, what was affected, what action was taken, and what outcome followed.",
            "The longer that history grows, the more useful it becomes for maintenance, response, automation, and AI-assisted optimization.",
          ],
          children: <MemoryVisual />,
        }}
        features={[
          { title: "Organization-specific operational memory" },
          { title: "Asset, relationship, and topology context" },
          { title: "Signals, events, alarms, Conditions, and outcomes" },
          { title: "Quality, timing, source, and evidence history" },
          { title: "Workflow and decision history" },
          { title: "Recurrence and trend analysis" },
          { title: "Maintenance and response tuning" },
          { title: "AI-ready, evidence-backed context" },
        ]}
        useCases={[
          "Tune preventive-maintenance thresholds.",
          "Identify recurring equipment or process issues.",
          "Compare outcomes from similar response paths.",
          "Improve escalation and workflow playbooks.",
          "Give AI recommendations grounded in the actual operating environment.",
          "Preserve operational knowledge across shifts, teams, and site changes.",
        ]}
        relatedProducts={[
          { label: "Infinit-Signal", to: "/infinit-signal" },
          { label: "Infinit-Flow", to: "/infinit-flow" },
          { label: "Infinit-Control", to: "/infinit-control" },
          { label: "Last Mile Platform", to: "/platform" },
        ]}
        faqs={[
          {
            question: "Is Singularity a historian replacement?",
            answer: "No. Singularity works above and across existing historians and source systems. It preserves the context, decisions, work, and outcomes that help teams make better operational decisions.",
          },
          {
            question: "Is our operational history shared with other customers?",
            answer: "No. Each organization's operational memory remains separate. Any future contribution or shared-learning capability would be optional, governed, and separate from day-to-day customer operations.",
          },
          {
            question: "Does Singularity automatically change our maintenance plans?",
            answer: "No. It helps teams identify patterns and improve recommendations, thresholds, and response playbooks. Changes remain under the operating rules and approvals your organization sets.",
          },
        ]}
        resources={[
          { label: "SSOM overview" },
          { label: "Singularity architecture" },
          { label: "Signal 2 Action episode: operational memory", to: "/signal-to-action" },
          { label: "Explore a design-partner use case", to: "/design-partner?conversation_type=ssom-discussion" },
        ]}
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
