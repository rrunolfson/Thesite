import { SEO } from "@/app/components/SEO";
import { ProductPageLayout } from "@/app/components/ProductPageLayout";
import { createBreadcrumbSchema } from "@/app/lib/structuredData";

export function PlatformOverviewPage() {
  const description = "Last Mile connects operational signals to coordinated work, authorized automation, and visible operational outcomes.";

  return (
    <>
      <SEO
        title="Last Mile Platform | Operational Intelligence for Enterprise Operations"
        description={description}
        canonicalPath="/platform"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Platform Overview", path: "/platform" },
        ])}
      />
      <ProductPageLayout
        eyebrow="LAST MILE PLATFORM"
        title="Raise your operational intelligence from signal to action."
        intro="Last Mile connects the signals already coming from your operation to the people, workflow, automation, and evidence needed to respond. It works above the systems you already use, helping them move from detection to action together."
        primaryCta={{ label: "Talk through your operation", to: "/contact" }}
        secondaryCta={{ label: "See the platform architecture", to: "#overview" }}
        overview={{
          heading: "One platform for what happens after a system detects a problem.",
          copy: [
            "Most operational systems are good at seeing alarms, events, exceptions, and performance changes. The harder problem is deciding what matters, understanding what is affected, getting the right work moving, and knowing whether the response worked.",
            "Last Mile closes that gap.",
          ],
          children: <PlatformArchitecture />,
        }}
        benefits={[
          { title: "Coordinate response faster", copy: "Move from detection to assigned work, approvals, automation, and evidence without rebuilding every handoff by hand." },
          { title: "Keep existing systems in place", copy: "Work above SCADA, BMS, historians, MES, fleet, quality, and enterprise workflow systems." },
          { title: "Improve with operational history", copy: "Use Singularity to retain the context, actions, evidence, and outcomes that make each response more useful than the last." },
          { title: "Give teams a clear operating view", copy: "Help operations, maintenance, reliability, and leaders see what is happening and what is being done." },
          { title: "Use automation with control", copy: "Keep automation visible, policy-bound, reversible, and connected to human judgment where it matters." },
        ]}
        features={[
          { title: "Shared platform services", copy: "Cloud-native stack, secure tenancy, identity and access, APIs, observability, policy controls, workflow runtime, shared data services, auditability, and destination connectivity." },
          { title: "Infinit-Signal", copy: "Turn operational data into facts and issues worth acting on." },
          { title: "Infinit-Control", copy: "Give teams a live view of the issue, work, system health, and evidence." },
          { title: "Infinit-Flow", copy: "Coordinate people, workflows, escalations, approvals, and automation." },
          { title: "Singularity", copy: "Shared operational memory and data foundation used across the product family." },
          { title: "Authorized response", copy: "Trigger actions through existing enterprise systems." },
          { title: "AI-assisted optimization", copy: "Identify patterns and recommend stronger responses over time." },
        ]}
        useCases={[
          "Cooling-performance degradation.",
          "Robot or fleet exception.",
          "Quality event.",
          "Energy anomaly.",
          "Cross-system incident response.",
          "Distributed facilities escalation.",
        ]}
        relatedProducts={[
          { label: "Infinit-Signal", to: "/infinit-signal" },
          { label: "Infinit-Control", to: "/infinit-control" },
          { label: "Infinit-Flow", to: "/infinit-flow" },
        ]}
        faqs={[
          {
            question: "Does Last Mile replace SCADA, BMS, historians, or MES?",
            answer: "No. Last Mile works above those systems, using the signals and context they already provide to coordinate response across people, workflows, and enterprise systems.",
          },
          {
            question: "Does Last Mile perform direct device or PLC control?",
            answer: "Not in the baseline platform. Last Mile coordinates authorized operational workflows and enterprise actions above the device and process-control layers.",
          },
          {
            question: "Can Last Mile begin with a narrow operational use case?",
            answer: "Yes. Last Mile can start with one operational challenge, one source environment, and one response outcome that matters.",
          },
        ]}
        resources={[
          { label: "Platform architecture" },
          { label: "Signal 2 Action", to: "/signal-to-action" },
          { label: "ServiceNow Integration Library", to: "/integrations" },
          { label: "News and Updates", to: "/company/newsroom" },
        ]}
        finalCta={{
          heading: "Talk through your operation.",
          copy: ["Tell us what you are trying to improve across operational response, workflow, automation, visibility, and operating history."],
          label: "Contact Last Mile",
          to: "/contact",
        }}
      />
    </>
  );
}

function PlatformArchitecture() {
  return (
    <div role="img" aria-label="Last Mile platform architecture from operational source systems through Infinit-Signal into Singularity, where Infinit-Control and Infinit-Flow operate in parallel before actions, outcomes, and evidence return to Singularity." className="mt-10 rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
      <div className="grid gap-4">
        <FlowBlock title="Your Operational Source Systems" copy="SCADA | BMS | Historians | MES | Fleet | Quality | Enterprise Systems" />
        <FlowArrow />
        <FlowBlock title="Infinit-Signal" copy="Ingests, normalizes, and contextualizes operating information" accent />
        <FlowArrow />
        <FlowBlock title="Singularity" copy="Shared operational memory, built on SSOM semantic structure" accent />
        <div className="grid gap-4 lg:grid-cols-2">
          <FlowBlock title="Infinit-Control" copy="Customer-defined views: alerts, widgets, trends, work, assets, evidence, state, and health" accent />
          <FlowBlock title="Infinit-Flow" copy="Customer-defined workflows: drag-and-drop automation, tasks, escalation, approvals, and authorized remediation" accent />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <FlowBlock title="Operations users" copy="Teams see current state, issues, evidence, and response progress" />
          <FlowBlock title="Enterprise destinations" copy="Enterprise systems, operational users, actions, workflow outcomes, and evidence" />
        </div>
        <FlowArrow />
        <FlowBlock title="Actions, decisions, evidence, and outcomes" copy="Work is assigned, approved when needed, completed, and recorded" />
        <div className="py-2 text-center text-xl text-[#75ADE6]">returns to</div>
        <FlowBlock title="Singularity retains the resulting operational history" copy="Every response can improve the next one" accent />
      </div>
    </div>
  );
}

function FlowBlock({ title, copy, accent = false }: { title: string; copy: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-5 ${accent ? "border-[#217ED9]/50 bg-[#0a1929]/75" : "border-slate-700 bg-slate-950/70"}`}>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-base leading-7 text-slate-300">{copy}</p>
    </div>
  );
}

function FlowArrow() {
  return <div className="py-2 text-center text-xl text-[#75ADE6]">↓</div>;
}
