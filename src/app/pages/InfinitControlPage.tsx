import { SEO } from "@/app/components/SEO";
import { ProductPageLayout } from "@/app/components/ProductPageLayout";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

export function InfinitControlPage() {
  const description = "Infinit-Control gives operations teams a live view of issues, affected assets, active work, system health, data quality, and evidence.";

  return (
    <>
      <SEO
        title="Infinit-Control | Live Operational Context"
        description={description}
        canonicalPath="/infinit-control"
        jsonLd={[
          createProductSchema("Infinit-Control", "/infinit-control", description),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Infinit-Control", path: "/infinit-control" },
          ]),
        ]}
      />
      <ProductPageLayout
        eyebrow="INFINIT-CONTROL"
        title="See what is happening, what is moving, and what still needs attention."
        intro="Infinit-Control gives operations teams a live view of issues, affected assets, active work, system health, data quality, and evidence. It is built for the people who need to understand the operation and move the response forward."
        primaryCta={{ label: "Design an operational view", to: "/design-partner?conversation_type=technical-collaboration" }}
        secondaryCta={{ label: "See the platform overview", to: "/platform" }}
        overview={{
          heading: "Stop hunting for the right dashboard.",
          copy: [
            "An alarm may be visible in one system, work in another, source health in a third, and the evidence somewhere else entirely. Infinit-Control brings the current operational picture together without pretending to replace the systems that own it.",
          ],
        }}
        features={[
          { title: "User-configured operational views" },
          { title: "Active issue and Condition tracking" },
          { title: "Asset and location context" },
          { title: "Workflow and work-queue visibility" },
          { title: "Source-health and quality indicators" },
          { title: "Evidence timelines" },
          { title: "Historical trends where needed" },
          { title: "Role-based views", copy: "Operators, supervisors, reliability teams, and leaders can see the context they need." },
        ]}
        useCases={[
          "Site operations command center.",
          "Maintenance supervisor workboard.",
          "Shift handoff.",
          "Asset-health and reliability view.",
          "Cooling-response room.",
          "Source-health and data-quality monitoring.",
        ]}
        relatedProducts={[
          { label: "Infinit-Signal", to: "/infinit-signal" },
          { label: "Singularity", to: "/ssom" },
          { label: "Infinit-Flow", to: "/infinit-flow" },
        ]}
        faqs={[
          {
            question: "Is Infinit-Control a generic dashboard product?",
            answer: "No. It is designed around live operational context: issues, assets, work, source health, quality, evidence, and response progress.",
          },
          {
            question: "Does it replace an HMI or SCADA screen?",
            answer: "No. It works above those tools to help teams manage the cross-system operational response.",
          },
          {
            question: "Can different teams create different views?",
            answer: "Yes. Authorized users can build role-specific views around the assets, workflows, and operational situations they need to manage.",
          },
        ]}
        resources={[
          { label: "Control-view overview" },
          { label: "Operational response pattern" },
          { label: "Signal 2 Action episode: beyond dashboards", to: "/signal-to-action" },
          { label: "Design an operational view", to: "/design-partner?conversation_type=technical-collaboration" },
        ]}
      />
    </>
  );
}
