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
        intro="Singularity is the shared operational-memory foundation inside the Last Mile Platform. It retains the assets, signals, issues, work, workflow activity, decisions, evidence, and outcomes that help every future response improve."
        blueprintImage={{
          src: "/images/blueprint/singularity-blueprint.png",
          alt: "Blueprint-style operational memory hub connecting assets, signals, workflows, decisions, and outcomes.",
        }}
        primaryCta={{ label: "Explore the Last Mile Platform", to: "/platform" }}
        secondaryCta={{ label: "See how Infinit-Signal builds the record", to: "/infinit-signal" }}
        overview={{
          heading: "The operating record behind every product.",
          copy: [
            "The shared operational memory behind every product retains the assets, signals, issues, work, workflow activity, decisions, evidence, and outcomes that help every future response improve.",
            "Infinit-Signal injects operational information into Singularity.",
            "Infinit-Control uses Singularity to surface a customer-defined view of the operating estate. Infinit-Flow uses Singularity to trigger, guide, and improve workflows.",
            "As the record grows, teams can identify patterns, tune maintenance, improve workflows, strengthen automation, and give AI a more complete understanding of the specific operating environment.",
          ],
          children: <OperationalMemorySection />,
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

function OperationalMemorySection() {
  return (
    <div className="mt-10">
      <div className="mx-auto max-w-4xl text-center">
        <h3 className="text-3xl font-semibold leading-tight text-white">Your operation gets smarter when it can remember.</h3>
        <p className="mt-4 text-base leading-7 text-slate-300">
          Singularity records the operational story of your environment: assets, signals, issues, work, decisions, outcomes, quality, timing, and evidence.
        </p>
        <p className="mt-3 text-base leading-7 text-slate-300">
          The longer that history grows, the more useful it becomes. Teams can tune maintenance, strengthen response playbooks, identify recurring problems, improve automation, and give AI better operational context.
        </p>
        <p className="mt-3 text-base font-semibold leading-7 text-white">
          Last Mile becomes more useful because it remembers your operation, not because it collects more random data.
        </p>
        <p className="mt-3 text-base leading-7 text-slate-300">
          SSOM gives Singularity a consistent way to retain operational meaning across the systems your team already uses.
        </p>
      </div>
      <MemoryVisual />
    </div>
  );
}

function MemoryVisual() {
  return (
    <div role="img" aria-label="Assets, signals, issues, workflows, decisions, and outcomes create a growing operational record that improves response over time." className="blueprint-panel mt-10 rounded-2xl p-5">
      <div className="grid gap-3 md:grid-cols-3">
        {["Your Assets", "Your Signals", "Your Issues", "Your Workflows", "Your Decisions", "Your Outcomes"].map((item) => (
          <div key={item} className="blueprint-card rounded-lg p-4 text-center text-base font-semibold text-white">
            {item}
          </div>
        ))}
      </div>
      <div className="py-3 text-center text-xl text-[#37F0C2]">↓</div>
      <div className="rounded-lg border border-[#00C2FF]/50 bg-[#071426]/75 p-5 text-center text-lg font-semibold text-white">
        A growing operational record that improves response over time
      </div>
    </div>
  );
}
