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
        features={[
          { title: "Infinit-Signal", copy: "Turn operational data into facts and issues worth acting on." },
          { title: "Singularity", copy: "Preserve the operational memory needed to improve every response." },
          { title: "Infinit-Flow", copy: "Coordinate people, workflows, escalations, approvals, and automation." },
          { title: "Infinit-Control", copy: "Give teams a live view of the issue, work, system health, and evidence." },
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
          { label: "Singularity", to: "/singularity" },
          { label: "Infinit-Flow", to: "/infinit-flow" },
          { label: "Infinit-Control", to: "/infinit-control" },
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
  const blocks = [
    {
      title: "Your Operational Systems",
      copy: "SCADA | BMS | Historians | Brokers | Fleet Systems | Quality Systems | Enterprise Applications",
    },
    {
      title: "Infinit-Signal",
      copy: "Operational facts, evidence, quality, and issues worth acting on",
      accent: true,
    },
    {
      title: "Singularity",
      copy: "Operational memory, built on SSOM",
      accent: true,
    },
    {
      title: "Infinit-Flow and Infinit-Control",
      copy: "Infinit-Flow: Workflow, human work, approvals, assignments, escalations, and authorized action. Infinit-Control: A live view of issues, affected assets, work progress, system health, quality, and evidence",
      accent: true,
    },
    {
      title: "Your Enterprise Systems",
      copy: "CMMS | EAM | ERP | ITSM | collaboration tools | other authorized destinations",
    },
  ];

  return (
    <div role="img" aria-label="Last Mile platform architecture from operational systems through Infinit-Signal, Singularity, Infinit-Flow, Infinit-Control, and enterprise systems." className="mt-10 rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
      <div className="grid gap-4">
        {blocks.map((block, index) => (
          <div key={block.title}>
            <div className={`rounded-lg border p-5 ${block.accent ? "border-[#217ED9]/50 bg-[#0a1929]/75" : "border-slate-700 bg-slate-950/70"}`}>
              <h3 className="text-lg font-semibold text-white">{block.title}</h3>
              <p className="mt-2 text-base leading-7 text-slate-300">{block.copy}</p>
            </div>
            {index < blocks.length - 1 ? <div className="py-2 text-center text-xl text-[#75ADE6]">↓</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
