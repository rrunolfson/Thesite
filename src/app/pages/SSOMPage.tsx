import { SEO } from "@/app/components/SEO";
import { ProductPageLayout } from "@/app/components/ProductPageLayout";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

export function SSOMPage() {
  const description = "Singularity is Last Mile's operational memory product, built on SSOM. It connects assets, signals, issues, work, decisions, and outcomes so operations can improve over time.";

  return (
    <>
      <SEO
        title="Singularity | Operational Memory for Better Operational Action"
        description={description}
        canonicalPath="/singularity"
        jsonLd={[
          createProductSchema("Singularity", "/singularity", `${description} Singularity is built on the SSOM semantic model.`),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Singularity", path: "/singularity" },
          ]),
        ]}
      />
      <ProductPageLayout
        eyebrow="SINGULARITY"
        title="Operational memory that improves every response."
        intro="Singularity connects the history of your assets, signals, issues, work, decisions, and outcomes so teams can understand what happened before and improve what happens next."
        primaryCta={{ label: "Talk through your operating environment", to: "/contact" }}
        secondaryCta={{ label: "Explore Infinit-Signal", to: "/infinit-signal" }}
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
          {
            title: "Built on SSOM",
            copy: "SSOM is the semantic model inside Singularity. It gives Singularity a consistent way to understand assets, relationships, events, issues, quality, timing, evidence, and outcomes across the systems that make up your operating environment.",
          },
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
          heading: "Talk through your operating environment.",
          copy: ["Tell us about the assets, signals, work, decisions, and outcomes your team needs to understand over time."],
          label: "Contact Last Mile",
          to: "/contact",
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
