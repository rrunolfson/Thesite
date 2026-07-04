import { SEO } from "@/app/components/SEO";
import { ContactLastMileForm } from "@/app/components/ContactLastMileForm";
import { TrackedLink } from "@/app/components/TrackedLink";
import { createBreadcrumbSchema } from "@/app/lib/structuredData";

const fitPoints = [
  "Operational response that depends on manual coordination",
  "Alarms, events, or exceptions that cross systems and teams",
  "Workflow bottlenecks around approvals, escalation, or handoff",
  "Operational visibility gaps across assets, work, quality, or evidence",
  "Automation opportunities that need clear policy and human oversight",
];

export function ContactPage() {
  return (
    <>
      <SEO
        title="Contact Last Mile | Operational Intelligence for Enterprise Operations"
        description="Tell Last Mile what you are trying to improve across operational response, workflow, automation, visibility, and operational intelligence."
        canonicalPath="/contact"
        markdownPath="/contact.md"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact Last Mile", path: "/contact" },
        ])}
      />
      <div className="relative min-h-screen pt-20">
        <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>
        <div className="relative z-10">
          <section className="border-b border-slate-800 py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl">
                <h1 className="hero-title-gradient text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                  Let's talk about your operation.
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-300 md:text-xl">
                  Tell us what you are trying to improve. Last Mile works with organizations that want to make operational response faster, clearer, more coordinated, and easier to improve over time.
                </p>
              </div>
            </div>
          </section>

          <section className="border-b border-slate-800 py-16 md:py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:px-8">
              <div>
                <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">Tell us what you are working to improve.</h2>
                <ul className="mt-8 space-y-4 text-lg leading-8 text-slate-300">
                  {fitPoints.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 h-2 w-2 rounded-full bg-[#75ADE6]"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 rounded-lg border border-slate-700 bg-slate-900/60 p-5">
                  <h3 className="text-xl font-semibold text-white">Prefer to explore first?</h3>
                  <div className="mt-4 flex flex-col gap-3 text-base font-semibold text-[#75ADE6]">
                    <TrackedLink to="/platform" eventName="cta_explore_platform_click">Explore the platform</TrackedLink>
                    <TrackedLink to="/signal-to-action" eventName="cta_podcast_click">Listen to Signal 2 Action</TrackedLink>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-lg p-6 md:p-8">
                <ContactLastMileForm />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
