import type { ReactElement, ReactNode } from "react";
import { ArrowRight, CheckCircle2, GitBranch, Layers3, Repeat2, ShieldCheck, Workflow } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import { TrackedLink } from "@/app/components/TrackedLink";
import { createOrganizationSchema, createWebsiteSchema } from "@/app/lib/structuredData";

const productCards = [
  {
    title: "Infinit-Signal",
    to: "/infinit-signal",
    lead: "Understand what happened, where it happened, and whether it matters.",
    copy: "Turns source data into trusted operational facts and confirmed issues worth acting on.",
  },
  {
    title: "Singularity",
    to: "/ssom",
    lead: "Give operational data a shared language and a long memory.",
    copy: "Keeps assets, events, issues, quality, time, actions, and outcomes understandable over time.",
  },
  {
    title: "Infinit-Flow",
    to: "/infinit-flow",
    lead: "Turn confirmed problems into organized response.",
    copy: "Coordinates people, workflow, approvals, tasks, escalations, and authorized automation.",
  },
  {
    title: "Infinit-Control",
    to: "/infinit-control",
    lead: "See the work, the problem, and the response in one place.",
    copy: "Gives teams a live operational view of issues, assets, work, system health, quality, and evidence.",
  },
];

export function HomePage() {
  return (
    <>
      <SEO
        title="Last Mile | Raise Your Operational Intelligence"
        description="Last Mile helps operations teams turn the signals they already have into faster decisions, automated workflows, and accountable action."
        canonicalPath="/"
        markdownPath="/index.md"
        jsonLd={[createOrganizationSchema(), createWebsiteSchema()]}
      />
      <div className="relative min-h-screen">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 data-grid-bg opacity-20"></div>
        </div>

        <header className="relative z-10 overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#75ADE6]">
                BUILDING THE GLOBAL LEADER IN OPERATIONAL INTELLIGENCE
              </p>
              <h1 className="hero-title-gradient mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Raise your operational intelligence.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
                Last Mile helps the people who run real operations turn the signals they already have into faster decisions, automated workflows, and action that actually gets done. See the problem. Understand what it affects. Get the right work moving. Know what happened next.
              </p>
              <p className="mt-5 text-base font-semibold text-slate-200">
                From data and alarms to workflow, automated response, and visible operational outcomes.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <TrackedLink to="/design-partner" eventName="cta_design_partner_click" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-7 py-3 text-base font-semibold text-white hover:bg-[#0a1929]">
                  Request a design-partner conversation <ArrowRight className="h-5 w-5" />
                </TrackedLink>
                <a href="#platform-path" className="inline-flex min-h-11 items-center justify-center rounded-sm border border-slate-600 bg-slate-900/60 px-7 py-3 text-base font-semibold text-white hover:border-[#217ED9]">
                  See operational intelligence in action
                </a>
              </div>
            </div>

            <figure className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/80 p-6 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1d7cd8]/20 via-transparent to-[#3a8f98]/20"></div>
              <div className="relative grid min-h-[320px] content-center gap-4">
                {["See the problem", "Understand what it affects", "Get the right work moving", "Know what happened next"].map((item) => (
                  <div key={item} className="rounded-lg border border-slate-700 bg-slate-900/75 p-4 text-lg font-semibold text-white">
                    {item}
                  </div>
                ))}
              </div>
              <figcaption className="relative mt-5 border-t border-slate-700 pt-4 text-sm font-semibold text-slate-200">
                Built for the people who keep operations moving.
              </figcaption>
            </figure>
          </div>
        </header>

        <HomeSection title="Action is the new operational intelligence." centered>
          <p>For years, industrial systems have become better at detecting alarms, events, anomalies, and equipment problems. But seeing a problem is not the same as solving it.</p>
          <p>The real work begins after detection: understanding what happened, what it affects, who owns the response, what action is allowed, and whether the work actually moved forward.</p>
          <p>Last Mile closes that gap.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {["System detects a problem", "Last Mile establishes what matters", "People, workflow, automation, and evidence come together", "The organization responds"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-700 bg-slate-900/60 p-5 text-base font-semibold leading-7 text-white">
                {item}
              </div>
            ))}
          </div>
        </HomeSection>

        <HomeSection title="Raise your operational intelligence where work actually happens.">
          <div className="grid gap-5 md:grid-cols-3">
            <OutcomeCard title="Know what matters" copy="Bring together the equipment, location, history, urgency, quality, and source information needed to understand the problem before work begins." icon={<Layers3 />} />
            <OutcomeCard title="Move work faster" copy="Turn confirmed issues into assigned work, workflow, escalations, notifications, and authorized actions without relying on manual handoffs." icon={<Workflow />} />
            <OutcomeCard title="Improve every response" copy="Make the status, evidence, decisions, and outcome visible so teams can learn from what happened and improve the next response." icon={<Repeat2 />} />
          </div>
        </HomeSection>

        <HomeSection title="Let software handle the scramble.">
          <p>When a problem is confirmed, Last Mile can automate the repeatable steps that slow operations down: gather context, identify affected assets, create work, route approvals, notify the right people, follow response playbooks, and keep a complete record of what happened.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <SmallCard title="Automated workflow" copy="Turn confirmed issues into assigned, tracked work." />
            <SmallCard title="Smart escalation" copy="Get the right people involved based on urgency, asset, location, and the operating rules you set." />
            <SmallCard title="Authorized remediation" copy="Trigger authorized response steps through the enterprise systems your organization already uses." />
            <SmallCard title="AI-assisted optimization" copy="Find patterns, prioritize issues, and recommend better response paths over time." />
          </div>
          <p className="mt-8 rounded-lg border border-slate-700 bg-slate-900/60 p-5 text-base font-semibold text-slate-200">
            Automation is policy-bound, visible, and reversible. People remain in control where judgment or approval is required.
          </p>
        </HomeSection>

        <HomeSection id="platform-path" title="One operational intelligence platform. One path from detection to action.">
          <p>Last Mile sits above the systems your organization already uses. It does not replace them. It helps them work together when an operational issue crosses systems, teams, sites, and workflows.</p>
          <PlatformPath />
        </HomeSection>

        <HomeSection title="Your operation gets smarter when it can remember.">
          <p>Singularity gives Last Mile a clear, organization-specific record of what happens across your operating environment: the asset, event, issue, quality, timing, action, and outcome.</p>
          <p>As that history grows, teams can spot patterns, tune maintenance, improve response playbooks, and automate more safely.</p>
          <p className="font-semibold text-white">Last Mile becomes more useful because it remembers your operation, not because it collects more random data.</p>
          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
            <div className="grid gap-3 md:grid-cols-3">
              {["Your Assets", "Your Signals", "Your Issues", "Your Workflows", "Your Decisions", "Your Outcomes"].map((item) => (
                <div key={item} className="rounded-lg border border-slate-700 bg-slate-950/70 p-4 text-center text-base font-semibold text-white">{item}</div>
              ))}
            </div>
            <div className="py-3 text-center text-xl text-[#75ADE6]">↓</div>
            <div className="rounded-lg border border-[#217ED9]/50 bg-[#0a1929]/75 p-5 text-center text-lg font-semibold text-white">A growing operational record that improves response over time</div>
          </div>
        </HomeSection>

        <HomeSection title="A cooling problem should not depend on someone noticing the right dashboard.">
          <p>A temperature trend, equipment alarm, or performance drop is only the beginning. Last Mile can identify the affected equipment, verify the quality of the signal, determine whether the issue is real, launch the right response, and show the team what is happening until the work is complete.</p>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              "Detect a cooling-performance issue",
              "Confirm the affected equipment and operating context",
              "Confirm the issue is worth acting on",
              "Create or update the right work",
              "Escalate, automate, or route authorized response steps",
              "Show progress, evidence, and outcome",
            ].map((step, index) => (
              <li key={step} className="rounded-lg border border-slate-700 bg-slate-900/60 p-5 text-base leading-7 text-slate-200">
                <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-[#75ADE6]">Step {index + 1}</span>
                <span className="mt-2 block font-semibold text-white">{step}</span>
              </li>
            ))}
          </ol>
        </HomeSection>

        <HomeSection title="The products that make operational intelligence real.">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {productCards.map((product) => (
              <TrackedLink key={product.to} to={product.to} eventName={product.to === "/ssom" ? "cta_ssom_click" : "cta_product_click"} eventData={{ product: product.title }} className="glass-panel flex h-full flex-col rounded-lg p-6 hover:border-[#217ED9]">
                <h3 className="text-2xl font-semibold text-white">{product.title}</h3>
                <p className="mt-4 text-base font-semibold leading-7 text-slate-200">{product.lead}</p>
                <p className="mt-3 flex-1 text-base leading-7 text-slate-300">{product.copy}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-[#75ADE6]">Explore <ArrowRight className="h-4 w-4" /></span>
              </TrackedLink>
            ))}
          </div>
        </HomeSection>

        <section className="relative z-10 border-t border-slate-800 py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">Bring one operational gap. Leave with a path to action.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">Start with one real problem: an alarm nobody owns, work that depends on manual coordination, a response that crosses systems, or an issue that takes too long to understand and resolve.</p>
            <p className="mt-4 text-lg leading-8 text-slate-300">Last Mile works with design partners to prove a better operational response using the systems they already have.</p>
            <TrackedLink to="/design-partner" eventName="cta_design_partner_click" className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-8 py-3 text-base font-semibold text-white hover:bg-[#0a1929]">
              Request a design-partner conversation <ArrowRight className="h-5 w-5" />
            </TrackedLink>
          </div>
        </section>
      </div>
    </>
  );
}

function HomeSection({ id, title, centered = false, children }: { id?: string; title: string; centered?: boolean; children: ReactNode }) {
  return (
    <section id={id} className="relative z-10 scroll-mt-28 border-t border-slate-800 py-16 md:py-20">
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${centered ? "text-center" : ""}`}>
        <h2 className="max-w-5xl text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h2>
        <div className={`mt-6 space-y-5 text-lg leading-8 text-slate-300 ${centered ? "mx-auto max-w-4xl" : "max-w-4xl"}`}>{children}</div>
      </div>
    </section>
  );
}

function OutcomeCard({ title, copy, icon }: { title: string; copy: string; icon: ReactElement }) {
  return (
    <article className="glass-panel rounded-lg p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#217ED9]/40 bg-[#0a1929]/70 text-[#75ADE6]">{icon}</div>
      <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-base leading-7 text-slate-300">{copy}</p>
    </article>
  );
}

function SmallCard({ title, copy }: { title: string; copy: string }) {
  return (
    <article className="rounded-lg border border-slate-700 bg-slate-900/60 p-5">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-base leading-7 text-slate-300">{copy}</p>
    </article>
  );
}

function PlatformPath() {
  const blocks = [
    ["Your Operational Systems", "SCADA | BMS | Historians | Brokers | Fleet Systems | Quality Systems | Enterprise Applications", false],
    ["Infinit-Signal", "Trusted operational facts, source history, evidence, and confirmed issues worth acting on", true],
    ["Singularity, built on SSOM", "Operational memory and shared context", true],
    ["Infinit-Flow and Infinit-Control", "Infinit-Flow: Workflow, human work, approvals, assignments, escalations, and authorized action. Infinit-Control: Current operational state, issues, affected assets, work progress, system health, quality, and evidence", true],
    ["Your Enterprise Systems", "CMMS | EAM | ERP | ITSM | collaboration tools | other authorized destinations", false],
  ] as const;

  return (
    <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
      {blocks.map(([title, copy, accent], index) => (
        <div key={title}>
          <div className={`rounded-lg border p-5 ${accent ? "border-[#217ED9]/50 bg-[#0a1929]/75" : "border-slate-700 bg-slate-950/70"}`}>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-base leading-7 text-slate-300">{copy}</p>
          </div>
          {index < blocks.length - 1 ? <div className="py-2 text-center text-xl text-[#75ADE6]">↓</div> : null}
        </div>
      ))}
      <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-slate-300">
        <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#75ADE6]" /> Machine-speed coordination.</span>
        <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#75ADE6]" /> Human judgment where it matters.</span>
        <span className="inline-flex items-center gap-2"><GitBranch className="h-4 w-4 text-[#75ADE6]" /> Existing systems stay in place.</span>
      </div>
    </div>
  );
}
