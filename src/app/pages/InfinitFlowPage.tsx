import { SEO } from "@/app/components/SEO";
import { ProductPageLayout } from "@/app/components/ProductPageLayout";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

export function InfinitFlowPage() {
  const description = "Infinit-Flow coordinates people, work, approvals, escalation, and authorized automation from one connected response path.";

  return (
    <>
      <SEO
        title="Infinit-Flow | Organized Operational Response"
        description={description}
        canonicalPath="/infinit-flow"
        jsonLd={[
          createProductSchema("Infinit-Flow", "/infinit-flow", description),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Infinit-Flow", path: "/infinit-flow" },
          ]),
        ]}
      />
      <ProductPageLayout
        eyebrow="INFINIT-FLOW"
        title="Turn known problems into organized response."
        intro="Infinit-Flow helps teams design the workflows they need around the signals, assets, and issues that matter to their operation. It coordinates people, work, approvals, escalation, and authorized automation from one connected response path."
        primaryCta={{ label: "Map a response path", to: "/design-partner?conversation_type=technical-collaboration" }}
        secondaryCta={{ label: "See how Infinit-Signal identifies the issue", to: "/infinit-signal" }}
        overview={{
          heading: "Let software handle the scramble.",
          copy: [
            "When an issue is confirmed, operations teams should not have to hunt through dashboards, build a ticket by hand, find the right owner, chase approvals, and reconstruct what happened later.",
            "Infinit-Flow helps the organization move from issue to action with a response path your team designs.",
          ],
        }}
        features={[
          { title: "Visual workflow design" },
          { title: "Asset-aware triggers" },
          { title: "Condition-based response paths" },
          { title: "Human tasks and assignment" },
          { title: "Timers, escalations, and service-level rules" },
          { title: "Approval steps" },
          { title: "Authorized outbound actions" },
          { title: "Simulation, versioning, and rollback" },
          { title: "Full evidence trail" },
        ]}
        useCases={[
          "Cooling response workflow.",
          "Robot downtime escalation.",
          "Quality hold and review.",
          "Energy anomaly investigation.",
          "Facilities incident coordination.",
          "Cross-system maintenance response.",
        ]}
        relatedProducts={[
          { label: "Infinit-Signal", to: "/infinit-signal" },
          { label: "Singularity", to: "/ssom" },
          { label: "Infinit-Control", to: "/infinit-control" },
        ]}
        faqs={[
          {
            question: "Who designs the workflows?",
            answer: "Your team does. Infinit-Flow provides the visual model, approved building blocks, policy controls, and operational context needed to design and run workflows that match your environment.",
          },
          {
            question: "Can Infinit-Flow automate remediation?",
            answer: "It can coordinate authorized response steps through the systems your organization already uses. Direct device and process control are outside the baseline platform.",
          },
          {
            question: "Can a person stay in the loop?",
            answer: "Yes. Human review, approval, assignment, exception handling, and escalation are core parts of the product.",
          },
        ]}
        resources={[
          { label: "Workflow design overview" },
          { label: "Cooling-response pattern" },
          { label: "Signal 2 Action episode: machine-speed coordination", to: "/signal-to-action" },
          { label: "Map a response path", to: "/design-partner?conversation_type=technical-collaboration" },
        ]}
      />
    </>
  );
}
