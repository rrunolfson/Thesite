import { SEO } from "@/app/components/SEO";
import { ProductPageLayout } from "@/app/components/ProductPageLayout";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

export function InfinitSignalPage() {
  const description = "Infinit-Signal brings together data, source history, quality, and asset context so teams can identify confirmed issues worth acting on.";

  return (
    <>
      <SEO
        title="Infinit-Signal | Operational Data Ingestion and Context | Last Mile"
        description={description}
        canonicalPath="/infinit-signal"
        jsonLd={[
          createProductSchema("Infinit-Signal", "/infinit-signal", description),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Infinit-Signal", path: "/infinit-signal" },
          ]),
        ]}
      />
      <ProductPageLayout
        eyebrow="INFINIT-SIGNAL"
        title="Turn operational signals into facts your team can act on."
        intro="Bring operational information into action. Infinit-Signal connects to source systems, adds context, and injects the operational information your teams need into Singularity."
        heroImage={{ src: "/images/worker2.png", alt: "Operational worker representing source-system data and field operations." }}
        hideHeroCtas
        primaryCta={{ label: "Talk through your source environment", to: "/contact" }}
        secondaryCta={{ label: "Explore the platform architecture", to: "/platform" }}
        overview={{
          heading: "A signal is not automatically a problem.",
          copy: [
            "A temperature spike, alarm, robot exception, quality event, or performance change may be important. Or it may be stale, duplicated, incomplete, expected, or unrelated to the work your team needs to do.",
            "Infinit-Signal brings together the data, source history, quality, and asset context around an event so your team can tell the difference between a raw alert and a real issue worth acting on.",
            "Infinit-Signal helps determine what happened, what it affects, whether the information is reliable, and whether the issue should trigger a response.",
          ],
        }}
        benefits={[
          { title: "Separate noise from issues", copy: "Help teams understand which signals are real, current, complete, and worth acting on." },
          { title: "Preserve source context", copy: "Keep where information came from, how fresh it is, and what evidence supports it connected to the issue." },
          { title: "Connect signals to assets", copy: "Link source events to the equipment, location, operating history, and urgency needed for response." },
          { title: "Improve downstream response", copy: "Inject normalized, contextualized operational information into Singularity so Infinit-Control and Infinit-Flow can use it in parallel." },
          { title: "Support trusted automation", copy: "Give workflows better inputs before tasks, approvals, escalations, or authorized actions begin." },
        ]}
        features={[
          { title: "Source profiles", copy: "Repeatable integrations." },
          { title: "Source and event history" },
          { title: "Data quality and freshness checks" },
          { title: "Asset and location context" },
          { title: "Duplicate, replay, and late-data classification" },
          { title: "Confirmed issues", copy: "Technically called Conditions." },
          { title: "Evidence and lineage" },
          { title: "Source-health visibility" },
        ]}
        useCases={[
          "Qualify cooling-performance degradation.",
          "Identify robot or fleet exception patterns.",
          "Correlate quality alarms with affected equipment.",
          "Detect energy anomalies worth investigating.",
          "Route important source-health issues.",
        ]}
        relatedProducts={[
          { label: "Infinit-Control", to: "/infinit-control" },
          { label: "Infinit-Flow", to: "/infinit-flow" },
          { label: "Platform Foundation: Singularity", to: "/singularity" },
          { label: "Last Mile Platform", to: "/platform" },
        ]}
        relatedHeading="Related Products and Capabilities"
        faqs={[
          {
            question: "Does Infinit-Signal replace the historian?",
            answer: "No. It works with existing historians and other source systems. Its role is to preserve the operational context needed to understand and act on what those systems detect.",
          },
          {
            question: "What is a Condition?",
            answer: "A Condition is a confirmed operational issue worth acting on. It connects the signal to the affected asset, quality, timing, evidence, urgency, and possible response path.",
          },
          {
            question: "Can Infinit-Signal connect more than one source platform?",
            answer: "Yes. Infinit-Signal is intended to work across source systems while preserving where information came from and how reliable it is.",
          },
        ]}
        resources={[
          { label: "Infinit-Signal architecture" },
          { label: "Platform overview", to: "/platform" },
          { label: "ServiceNow Integration Library", to: "/integrations" },
          { label: "Signal 2 Action", to: "/signal-to-action" },
        ]}
        finalCta={{
          heading: "Talk through your source environment.",
          copy: ["Tell us about the signals, events, source systems, and response gaps your team is working to improve."],
          label: "Talk through your source environment",
          to: "/contact",
        }}
      />
    </>
  );
}
