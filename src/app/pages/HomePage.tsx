import type { ReactElement, ReactNode } from "react";
import { ArrowRight, Layers3, Repeat2, Workflow } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import { TrackedLink } from "@/app/components/TrackedLink";
import { createOrganizationSchema, createWebsiteSchema } from "@/app/lib/structuredData";

export function HomePage() {
  return (
    <>
      <SEO
        title="Last Mile | Operational Intelligence for Enterprise Operations"
        description="Last Mile turns operational signals into coordinated work, authorized automation, and visible operational outcomes."
        canonicalPath="/"
        markdownPath="/index.md"
        jsonLd={[createOrganizationSchema(), createWebsiteSchema()]}
      />
      <div className="operational-grid relative min-h-screen">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 data-grid-bg opacity-20"></div>
        </div>

        <header className="relative z-10 overflow-hidden border-b border-cyan-400/15 pb-14 pt-24 lg:pb-16 lg:pt-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:px-8">
            <div>
              <h1 className="hero-title-gradient max-w-4xl text-[1.8rem] font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                <span className="block whitespace-nowrap">Raise your</span>
                <span className="block whitespace-nowrap">operational intelligence</span>
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
                Last Mile turns the signals coming from your operation into coordinated work, authorized automation, and a clear view of what happens next. It helps teams understand the issue, move the right response, and improve how operations run over time.
              </p>
            </div>

            <figure className="blueprint-panel relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#00C2FF]/18 via-transparent to-[#37F0C2]/16"></div>
              <div className="relative min-h-[320px]">
                <img
                  src="/images/Chuck1.png"
                  alt="Operations professional representing the people who keep enterprise operations moving"
                  className="h-full min-h-[320px] w-full object-cover"
                />
                <div className="absolute left-1/2 top-5 z-20 w-[88%] -translate-x-1/2 text-center font-['Arial_Black',Arial,Helvetica,sans-serif] text-2xl font-black uppercase leading-none tracking-[0.08em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-3xl">
                  Meet Chuck
                </div>
                <div className="absolute bottom-6 left-1/2 z-20 w-[92%] -translate-x-1/2 rounded border border-cyan-400/25 bg-[#030816]/60 px-2 py-2 text-center font-['Arial_Black',Arial,Helvetica,sans-serif] text-[12px] font-black leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-base lg:text-lg whitespace-nowrap">
                  Last Mile Is His Platform To Do Work
                </div>
              </div>
            </figure>
          </div>
        </header>

        <HomeSection title="Action is the new operational intelligence." centered>
          <p>Operations already have data, alarms, dashboards, and alerts. The problem is what happens next.</p>
          <p>When an issue appears, someone still has to understand what it affects, decide whether it matters, find the right owner, start the right work, manage approvals, follow the response, and prove it was resolved.</p>
          <p>Last Mile brings that work together.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <OutcomeCard title="Understand What Matters" copy="Connect the signal to the equipment, location, operating history, urgency, data quality, and evidence needed to understand the issue." icon={<Layers3 />} />
            <OutcomeCard title="Move Work Faster" copy="Turn confirmed issues into coordinated work, automated handoffs, escalations, approvals, and authorized actions across the systems your organization already uses." icon={<Workflow />} />
            <OutcomeCard title="Learn From Every Outcome" copy="Build an operating history that helps teams tune maintenance, improve response playbooks, identify recurring issues, and automate safely over time." icon={<Repeat2 />} />
          </div>
        </HomeSection>

        <HomeSection
          title={
            <>
              Machine-speed coordination.
              <br />
              Human judgment where it matters.
            </>
          }
          centered
        >
          <p>Last Mile automates the repetitive scramble that slows operations down: gathering context, identifying affected assets, creating work, routing approvals, notifying the right people, applying response playbooks, and keeping a complete record of what happened.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <SmallCard title="Automated Workflow" copy="Turn confirmed issues into assigned, visible, trackable work." />
            <SmallCard title="Smart Escalation" copy="Route the issue based on asset, location, urgency, team, and operating rules." />
            <SmallCard title="Authorized Remediation" copy="Trigger authorized response steps through the enterprise systems already in place." />
            <SmallCard title="AI-Assisted Optimization" copy="Find patterns, prioritize attention, and recommend stronger response paths over time." />
          </div>
          <p className="blueprint-panel mt-8 rounded-lg p-5 text-base font-semibold text-slate-200">
            Automation is visible, policy-bound, and reversible. People remain in control when judgment, approval, or operating authority is required.
          </p>
        </HomeSection>

        <section className="relative z-10 border-t border-cyan-400/15 py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">Improve how your operation responds.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">Talk with Last Mile about the systems, operational challenges, workflow bottlenecks, and automation opportunities that matter to your organization.</p>
            <TrackedLink to="/contact" eventName="cta_contact_click" className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-8 py-3 text-base font-semibold text-white hover:bg-[#0a1929]">
              Contact Last Mile <ArrowRight className="h-5 w-5" />
            </TrackedLink>
          </div>
        </section>
      </div>
    </>
  );
}

function HomeSection({ id, title, centered = false, children }: { id?: string; title: ReactNode; centered?: boolean; children: ReactNode }) {
  return (
    <section id={id} className="relative z-10 scroll-mt-28 border-t border-cyan-400/15 py-16 md:py-20">
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${centered ? "text-center" : ""}`}>
        <h2 className="technical-divider mx-auto max-w-5xl text-center text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h2>
        <div className={`mt-6 space-y-5 text-lg leading-8 text-slate-300 ${centered ? "mx-auto max-w-4xl" : "max-w-4xl"}`}>{children}</div>
      </div>
    </section>
  );
}

function OutcomeCard({ title, copy, icon }: { title: string; copy: string; icon: ReactElement }) {
  return (
    <article className="blueprint-card rounded-lg p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-[#00C2FF]/40 bg-[#071426]/70 text-[#00C2FF]">{icon}</div>
      <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-base leading-7 text-slate-300">{copy}</p>
    </article>
  );
}

function SmallCard({ title, copy }: { title: string; copy: string }) {
  return (
    <article className="blueprint-card rounded-lg p-5 text-center">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-base leading-7 text-slate-300">{copy}</p>
    </article>
  );
}
