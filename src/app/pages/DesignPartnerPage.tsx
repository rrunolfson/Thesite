import { SEO } from "@/app/components/SEO";
import { DesignPartnerForm } from "@/app/components/DesignPartnerForm";
import { TrackedLink } from "@/app/components/TrackedLink";
import { createBreadcrumbSchema } from "@/app/lib/structuredData";

const fitPoints = [
  "A meaningful operational environment, such as facilities, manufacturing, infrastructure, fleets, utilities, or a distributed asset portfolio",
  "An existing source system that identifies signals, alarms, events, exceptions, or performance changes",
  "A response path that currently depends on manual coordination, disconnected systems, or uncertain ownership",
  "An operational, technical, or enterprise stakeholder who can help define the current state and desired outcome",
  "A willingness to explore a narrow, measurable first use case",
];

const discussionPoints = [
  "The operational signal or Condition that matters",
  "The affected assets, people, systems, and current response path",
  "Available source context and customer boundary constraints",
  "The workflow or action outcome that should be governed",
  "What evidence would make a design-partner engagement worthwhile",
];

export function DesignPartnerPage() {
  return (
    <>
      <SEO
        title="Become a Last Mile Design Partner | Operational Intelligence Collaboration"
        description="Start a focused conversation with Last Mile about a real operational action gap, source environment, and measurable response outcome."
        canonicalPath="/design-partner"
        markdownPath="/design-partner.md"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Design Partner", path: "/design-partner" },
        ])}
      />
      <div className="relative min-h-screen pt-20">
        <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>
        <div className="relative z-10">
          <section className="border-b border-slate-800 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl">
                <h1 className="hero-title-gradient text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                  Bring one operational gap. Leave with a more grounded path forward.
                </h1>
                <p className="mt-6 text-xl leading-8 text-slate-300">
                  A Last Mile design-partner conversation starts with a real operational challenge: a source system that detects something important, a response that is too manual or fragmented, and an outcome that matters enough to improve. We begin narrow, learn from evidence, and build from the systems already in use.
                </p>
              </div>
            </div>
          </section>

          <section className="border-b border-slate-800 py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
              <div>
                <h2 className="text-4xl font-bold text-white">A productive design-partner conversation usually includes:</h2>
                <ul className="mt-8 space-y-4 text-lg leading-8 text-slate-300">
                  {fitPoints.map((item) => (
                    <li key={item} className="flex gap-3"><span className="mt-3 h-2 w-2 rounded-full bg-[#75ADE6]"></span><span>{item}</span></li>
                  ))}
                </ul>

                <h2 className="mt-16 text-4xl font-bold text-white">What we will discuss</h2>
                <ul className="mt-8 space-y-4 text-lg leading-8 text-slate-300">
                  {discussionPoints.map((item) => (
                    <li key={item} className="flex gap-3"><span className="mt-3 h-2 w-2 rounded-full bg-[#75ADE6]"></span><span>{item}</span></li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <div className="glass-panel p-8">
                  <DesignPartnerForm />
                </div>
                <div className="glass-panel p-8">
                  <h2 className="text-2xl font-semibold text-white">Not ready for a design-partner discussion?</h2>
                  <p className="mt-4 text-base leading-7 text-slate-300">
                    Explore the Last Mile Platform or listen to Signal 2 Action to understand the operational action-gap thesis first.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 text-sm font-semibold text-[#75ADE6]">
                    <TrackedLink to="/platform" eventName="cta_explore_platform_click">Explore the platform</TrackedLink>
                    <TrackedLink to="/signal-to-action" eventName="cta_podcast_click">Listen to Signal 2 Action</TrackedLink>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
