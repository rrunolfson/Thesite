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
        description="Learn why Last Mile is building an operational intelligence platform that turns operational signals into coordinated work, authorized automation, and visible outcomes."
        canonicalPath="/about"
        markdownPath="/about.md"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About Last Mile", path: "/about" },
        ])}
      />
      <div className="operational-grid relative min-h-screen pt-20">
        <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>
        <div className="relative z-10">
          <header className="border-b border-cyan-400/15 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl">
                <h1 className="hero-title-gradient text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                  Built for the work that sits between systems and outcomes.
                </h1>
                <p className="mt-6 text-xl leading-8 text-slate-300">
                  Last Mile exists because operational teams should not have to reconstruct context, ownership, and response every time a system detects something important. We are building an operations-native platform that helps organizations turn the signals their teams care about into faster decisions, automated workflows, and accountable action.
                </p>
                <TrackedLink to="/contact" eventName="cta_contact_click" className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-7 py-3 font-semibold text-white hover:bg-[#0a1929]">
                  Contact Last Mile <ArrowRight className="h-5 w-5" />
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
              <PrincipleCard title="Separate operational meaning from application behavior" copy="Singularity uses SSOM to preserve meaning across assets, signals, issues, workflows, evidence, and outcomes. The Last Mile Platform provides the secure services, workflow runtime, visibility, tenancy, and controls around it." />
              <PrincipleCard title="Keep humans and policy in the loop where they belong" copy="Automation should be governed, observable, and appropriate to the operational context." />
              <PrincipleCard title="Start narrow and prove value" copy="A credible platform begins with a real operational use case, measurable outcome, and repeatable source-to-response path." />
            </div>
          </Section>

          <Section title="A platform built around useful facts, organized work, and a live operational view.">
            <div className="grid gap-6 md:grid-cols-3">
              <PrincipleCard title="Infinit-Signal" copy="Source information, evidence, and confirmed issues worth acting on." />
              <PrincipleCard title="Infinit-Control" copy="Customer-defined operational views for issues, assets, work, health, and evidence." />
              <PrincipleCard title="Infinit-Flow" copy="Operational work, approvals, escalation, and authorized automation." />
            </div>
            <TrackedLink to="/platform" eventName="cta_explore_platform_click" className="mt-8 inline-flex items-center gap-2 font-semibold text-[#75ADE6] hover:text-white">
              Explore the platform <ArrowRight className="h-5 w-5" />
            </TrackedLink>
          </Section>

          <Section title="The next version of operational intelligence must be built with real operators.">
            <p>Last Mile is built with the realities of real operations in mind: source systems already in place, teams that need clarity, work that must move, and outcomes that need to improve over time.</p>
            <TrackedLink to="/contact" eventName="cta_contact_click" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-7 py-3 font-semibold text-white hover:bg-[#0a1929]">
              Talk to Last Mile <ArrowRight className="h-5 w-5" />
            </TrackedLink>
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-cyan-400/15 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="technical-divider mx-auto max-w-5xl text-center text-4xl font-bold text-white">{title}</h2>
        <div className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">{children}</div>
      </div>
    </section>
  );
}

function PrincipleCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="blueprint-card rounded-lg p-6 text-center">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-4 text-base leading-7 text-slate-300">{copy}</p>
    </div>
  );
}
