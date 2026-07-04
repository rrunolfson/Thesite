import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import { TrackedLink } from "@/app/components/TrackedLink";
import { createBreadcrumbSchema } from "@/app/lib/structuredData";

export function AboutPage() {
  return (
    <>
      <SEO
        title="About Last Mile | Building Operational Intelligence That Reaches Action"
        description="Learn why Last Mile is building an operational intelligence platform that turns trusted signals into governed, accountable action across existing operational systems."
        canonicalPath="/about"
        markdownPath="/about.md"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About Last Mile", path: "/about" },
        ])}
      />
      <div className="relative min-h-screen pt-20">
        <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>
        <div className="relative z-10">
          <header className="border-b border-slate-800 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl">
                <h1 className="hero-title-gradient text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                  Built for the work that sits between systems and outcomes.
                </h1>
                <p className="mt-6 text-xl leading-8 text-slate-300">
                  Last Mile exists because operational teams should not have to reconstruct context, ownership, and response every time a system detects something important. We are building an operations-native platform that helps organizations turn the signals their teams care about into faster decisions, automated workflows, and accountable action.
                </p>
                <TrackedLink to="/design-partner" eventName="cta_design_partner_click" className="mt-10 inline-flex items-center gap-2 rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-7 py-3 font-semibold text-white hover:bg-[#0a1929]">
                  Request a design-partner conversation <ArrowRight className="h-5 w-5" />
                </TrackedLink>
              </div>
            </div>
          </header>

          <Section title="The last mile in operations is response.">
            <p>Most organizations do not lack operational tools. They have systems for control, monitoring, telemetry, equipment management, work, enterprise workflow, analytics, and communication. The problem is the operational distance between a detected signal and a coordinated response. That distance is where context is lost, ownership becomes unclear, work is delayed, and evidence becomes difficult to reconstruct.</p>
            <p className="mt-4">Last Mile is focused on closing that distance.</p>
          </Section>

          <Section title="Operationally grounded by design.">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              <PrincipleCard title="Respect the systems already operating the environment" copy="We work from authorized source data and do not begin with a replacement agenda." />
              <PrincipleCard title="Preserve trust, context, and uncertainty" copy="Source authority, evidence, quality, timing, and provenance matter when operational decisions carry consequences." />
              <PrincipleCard title="Separate operational meaning from application behavior" copy="SSOM provides shared semantics; the Last Mile Platform provides workflow, control, tenant, security, and SaaS capabilities." />
              <PrincipleCard title="Keep humans and policy in the loop where they belong" copy="Automation should be governed, observable, and appropriate to the operational context." />
              <PrincipleCard title="Start narrow and prove value" copy="A credible platform begins with a real operational use case, measurable outcome, and repeatable source-to-response path." />
            </div>
          </Section>

          <Section title="A platform built around useful facts, organized work, and visible operational state.">
            <div className="grid gap-6 md:grid-cols-3">
              <PrincipleCard title="Infinit-Signal" copy="Records, evidence, and confirmed issues worth acting on." />
              <PrincipleCard title="Infinit-Flow" copy="Operational work, approvals, escalation, and authorized automation." />
              <PrincipleCard title="Infinit-Control" copy="Operational management and visibility." />
            </div>
            <TrackedLink to="/platform" eventName="cta_explore_platform_click" className="mt-8 inline-flex items-center gap-2 font-semibold text-[#75ADE6] hover:text-white">
              Explore the platform <ArrowRight className="h-5 w-5" />
            </TrackedLink>
          </Section>

          <Section title="The next version of operational intelligence must be built with real operators.">
            <p>Last Mile is engaging design partners that can bring a meaningful operational challenge, a realistic source environment, and a clear owner for the response outcome. The objective is not a broad transformation program. It is a focused, evidence-based partnership around one operational gap worth solving.</p>
            <TrackedLink to="/design-partner" eventName="cta_design_partner_click" className="mt-8 inline-flex items-center gap-2 rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-7 py-3 font-semibold text-white hover:bg-[#0a1929]">
              Become a design partner <ArrowRight className="h-5 w-5" />
            </TrackedLink>
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-slate-800 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white">{title}</h2>
        <div className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">{children}</div>
      </div>
    </section>
  );
}

function PrincipleCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="glass-panel p-6">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-4 text-base leading-7 text-slate-300">{copy}</p>
    </div>
  );
}
