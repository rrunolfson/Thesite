import { SEO } from "@/app/components/SEO";
import { ProductPageLayout } from "@/app/components/ProductPageLayout";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

export function InfinitControlPage() {
  const description = "Infinit-Control gives operations teams a live view of issues, affected assets, active work, system health, data quality, and evidence.";

  return (
    <>
      <SEO
        title="Infinit-Control | Customer-Defined Operational Views | Last Mile"
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
        title="Build the operational view your team needs."
        intro="Infinit-Control gives customers a flexible, user-defined single pane of glass for their operating estate. It brings together the widgets, alerts, assets, trends, active work, system health, evidence, and operational context that matter to each team."
        primaryCta={{ label: "Talk through your operational view", to: "/contact" }}
        secondaryCta={{ label: "Explore Singularity", to: "/singularity" }}
        overview={{
          heading: "See the operation without hunting through systems.",
          copy: [
            "Operational information is usually spread across dashboards, historians, SCADA screens, ticket systems, email, spreadsheets, and tribal knowledge. Infinit-Control helps customers create their own view of operations using the shared record in Singularity.",
            "Infinit-Control does not replace HMI, SCADA, historian, BI, or operations-management systems. It works above them to help teams manage cross-system operational response.",
          ],
        }}
        benefits={[
          { title: "Let each team see what matters" },
          { title: "Bring alerts, work, asset context, and evidence together" },
          { title: "Reduce time spent hunting for information" },
          { title: "Surface active work and unresolved issues" },
          { title: "Support faster operational decisions" },
        ]}
        features={[
          { title: "Customer-defined views and layouts" },
          { title: "Configurable widgets" },
          { title: "Alert and issue visibility" },
          { title: "Asset and location views" },
          { title: "Active work and workflow status" },
          { title: "Source-system health" },
          { title: "Data-quality indicators" },
          { title: "Evidence and timeline views" },
          { title: "Historical trends from Singularity" },
          { title: "Role-based experiences", copy: "Operators, supervisors, reliability leaders, and executives can see the context they need." },
          { title: "Built from the operational record in Singularity", copy: "Infinit-Control does not create a separate version of operational truth. It draws from the shared history and context in Singularity so customers can build views around the assets, alerts, work, evidence, and operational conditions that matter to them." },
        ]}
        useCases={[
          "Operations command view.",
          "Maintenance supervisor workboard.",
          "Shift handoff view.",
          "Asset-health visibility.",
          "Cooling-response coordination.",
          "Data-quality and source-health monitoring.",
          "Multi-site operations overview.",
        ]}
        relatedProducts={[
          { label: "Infinit-Signal", to: "/infinit-signal" },
          { label: "Infinit-Flow", to: "/infinit-flow" },
          { label: "Operational Memory: Singularity", to: "/singularity" },
        ]}
        faqs={[
          {
            question: "Is Infinit-Control a generic dashboard product?",
            answer: "No. Infinit-Control is designed around live operational context. It brings together issues, assets, work, source health, quality, evidence, and response progress so customers can build views that reflect how their operation actually runs.",
          },
          {
            question: "Does it replace an HMI or SCADA screen?",
            answer: "No. It works above those tools to help teams manage the cross-system operational response.",
          },
          {
            question: "Can different teams create different operational views?",
            answer: "Yes. Customers can create role-specific views around the assets, workflows, alerts, and operational situations each team needs to manage.",
          },
        ]}
        resources={[
          { label: "Infinit-Control architecture" },
          { label: "Platform overview", to: "/platform" },
          { label: "Signal 2 Action", to: "/signal-to-action" },
          { label: "News and Updates", to: "/company/newsroom" },
        ]}
        finalCta={{
          heading: "Talk through your operational view.",
          copy: ["Tell us what your team needs to see across issues, assets, active work, health, quality, evidence, and response progress."],
          label: "Talk through your operational view",
          to: "/contact",
        }}
      />
    </>
  );
}
