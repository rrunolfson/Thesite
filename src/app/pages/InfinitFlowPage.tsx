import { SEO } from "@/app/components/SEO";
import { ProductPageLayout } from "@/app/components/ProductPageLayout";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

export function InfinitFlowPage() {
  const description = "Infinit-Flow coordinates people, work, approvals, escalation, and authorized automation from one connected response path.";

  return (
    <>
      <SEO
        title="Infinit-Flow | Drag-and-Drop Operational Workflow Automation | Last Mile"
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
        title="Build workflows that mirror how your operation actually works."
        intro="Infinit-Flow gives customers a modern, intuitive drag-and-drop experience for building workflows around the signals, assets, alerts, and issues that matter to their operation. It combines human work, automation, approvals, escalation, and authorized remediation in one response path."
        primaryCta={{ label: "Talk through your workflow", to: "/contact" }}
        secondaryCta={{ label: "Explore Singularity", to: "/singularity" }}
        overview={{
          heading: "Let software handle the scramble.",
          copy: [
            "When an issue is confirmed, operations teams should not have to hunt through dashboards, build a ticket by hand, find the right owner, chase approvals, and reconstruct what happened later.",
            "Infinit-Flow lets customers create workflows that match their own operating processes and use the shared context already available in Singularity.",
          ],
        }}
        benefits={[
          { title: "Mirror real operational processes" },
          { title: "Reduce manual handoffs" },
          { title: "Create consistent response paths" },
          { title: "Keep people involved when judgment matters" },
          { title: "Automate repetitive coordination" },
          { title: "Retain workflow outcomes for future improvement" },
        ]}
        features={[
          { title: "Modern drag-and-drop workflow canvas" },
          { title: "Customer-defined workflow building blocks" },
          { title: "Signal and issue triggers from Singularity" },
          { title: "Human tasks and assignment" },
          { title: "Timers, escalations, and service-level rules" },
          { title: "Approval steps" },
          { title: "Notifications and communication actions" },
          { title: "Authorized enterprise-system actions" },
          { title: "Automation and remediation steps" },
          { title: "Versioning and rollback" },
          { title: "Workflow simulation or testing where already supported" },
          { title: "Full workflow evidence trail" },
          { title: "Outcome and decision write-back into Singularity" },
          { title: "Every workflow makes the operation smarter", copy: "Infinit-Flow uses the operational history in Singularity to guide response. It also writes workflow actions, decisions, evidence, and outcomes back into Singularity. Over time, that record helps teams improve workflows, tune escalation paths, and automate more safely." },
        ]}
        useCases={[
          "Cooling response workflow.",
          "Robot downtime escalation.",
          "Quality hold and review.",
          "Energy anomaly investigation.",
          "Facilities incident coordination.",
          "Cross-system maintenance response.",
          "Shift escalation workflow.",
        ]}
        relatedProducts={[
          { label: "Infinit-Signal", to: "/infinit-signal" },
          { label: "Infinit-Control", to: "/infinit-control" },
          { label: "Operational Memory: Singularity", to: "/singularity" },
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
            question: "Can people remain in the loop?",
            answer: "Yes. Human review, approval, assignment, exception handling, and escalation are core parts of the product.",
          },
        ]}
        resources={[
          { label: "Workflow architecture" },
          { label: "Cooling-response pattern" },
          { label: "Signal 2 Action", to: "/signal-to-action" },
          { label: "Platform overview", to: "/platform" },
        ]}
        finalCta={{
          heading: "Talk through your workflow.",
          copy: ["Tell us about the issue, handoff, approval, escalation, or response path your team wants to make clearer and faster."],
          label: "Talk through your workflow",
          to: "/contact",
        }}
      />
    </>
  );
}
