import { SEO } from "@/app/components/SEO";
import { ProductPageLayout } from "@/app/components/ProductPageLayout";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

export function InfinitSignalPage() {
  const description = "Infinit-Signal brings together data, source history, quality, and asset context so teams can identify confirmed issues worth acting on.";

  return (
    <>
      <SEO
        title="Infinit-Signal | Operational Signals to Actionable Facts"
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
        intro="Infinit-Signal brings together the data, source history, quality, and asset context around an event so your team can tell the difference between a raw alert and a real issue worth acting on."
        primaryCta={{ label: "Discuss your source environment", to: "/design-partner?conversation_type=source-profile-discussion" }}
        secondaryCta={{ label: "See how Singularity remembers the response", to: "/ssom" }}
        overview={{
          heading: "A signal is not automatically a problem.",
          copy: [
            "A temperature spike, alarm, robot exception, quality event, or performance change may be important. Or it may be stale, duplicated, incomplete, expected, or unrelated to the work your team needs to do.",
            "Infinit-Signal helps determine what happened, what it affects, whether the information can be trusted, and whether the issue should trigger a response.",
          ],
        }}
        features={[
          { title: "Source profiles", copy: "Repeatable integration patterns for approved source environments." },
          { title: "Source and event history" },
          { title: "Data quality and freshness checks" },
          { title: "Asset and location context" },
          { title: "Duplicate, replay, and late-data classification" },
          { title: "Confirmed operational issues", copy: "Technically called Conditions." },
          { title: "Evidence and lineage" },
          { title: "Source-health visibility" },
        ]}
        useCases={[
          "Qualify cooling-performance degradation.",
          "Identify robot or fleet exception patterns.",
          "Correlate quality alarms with affected equipment.",
          "Detect energy anomalies worth investigating.",
          "Route meaningful source-health issues.",
        ]}
        relatedProducts={[
          { label: "Singularity", to: "/ssom" },
          { label: "Infinit-Flow", to: "/infinit-flow" },
          { label: "Infinit-Control", to: "/infinit-control" },
        ]}
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
            answer: "Yes. Infinit-Signal is intended to work across source systems while preserving where information came from and how trustworthy it is.",
          },
        ]}
        resources={[
          { label: "Source profile overview" },
          { label: "Infinit-Signal architecture" },
          { label: "ServiceNow Integration Library", to: "/integrations" },
          { label: "Discuss your source environment", to: "/design-partner?conversation_type=source-profile-discussion" },
        ]}
      />
    </>
  );
}
