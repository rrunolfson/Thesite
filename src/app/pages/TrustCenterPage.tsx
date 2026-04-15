import { Link } from "react-router";
import {
  ArrowRight,
  Shield,
  Lock,
  Eye,
  BellRing,
  FileCheck,
  Server,
  Users,
} from "lucide-react";
import { SEO } from "@/app/components/SEO";

const trustAreas = [
  {
    icon: Shield,
    title: "Security By Design",
    description:
      "Security requirements are considered early in product, infrastructure, and integration decisions so controls are part of delivery, not an afterthought.",
  },
  {
    icon: Lock,
    title: "Access Control",
    description:
      "Access to systems and data should follow least-privilege principles, defined approval paths, and role-based responsibilities appropriate to the task at hand.",
  },
  {
    icon: Eye,
    title: "Privacy And Data Handling",
    description:
      "Customer data should be handled with clear purpose limitation, controlled access, and retention practices aligned to contractual and operational requirements.",
  },
  {
    icon: BellRing,
    title: "Monitoring And Response",
    description:
      "Operational systems should be monitored for suspicious activity, service issues, and configuration drift, with defined escalation and response procedures.",
  },
  {
    icon: FileCheck,
    title: "Governance And Review",
    description:
      "Policies, standards, and operating procedures should be reviewed regularly so the control environment evolves with the product and customer risk profile.",
  },
  {
    icon: Server,
    title: "Resilience And Reliability",
    description:
      "Platform design should account for availability, change management, backup, recovery, and incident coordination to support dependable service delivery.",
  },
];

const requestItems = [
  "Security questionnaires and customer due diligence support",
  "High-level architecture and control overview discussions",
  "Data handling and access control posture summaries",
  "Operational security and incident response process discussions",
];

export function TrustCenterPage() {
  return (
    <>
      <SEO
        title="Trust Center"
        description="Review Last Mile's trust, security, privacy, and operational resilience approach for customers, partners, and procurement teams."
        keywords="trust center, security, privacy, operational resilience, vendor review, Last Mile"
        canonicalPath="/trust"
      />

      <div className="pt-20 relative min-h-screen">
        <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>

        <div className="relative z-10">
          <section className="relative py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center reveal">
                <div className="inline-flex items-center gap-2 bg-[#217ED9]/10 border border-[#217ED9]/30 rounded-full px-4 py-2 mb-6">
                  <Shield className="w-4 h-4 text-[#217ED9]" />
                  <span className="text-sm text-[#217ED9] font-medium uppercase tracking-wider">
                    Trust Center
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white from-30% to-[#217ED9] bg-clip-text text-transparent">
                  Security, Privacy, and Operational Trust
                </h1>
                <p className="text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
                  Last Mile approaches trust as an operating requirement. Customers should be able to understand how we think about security, data handling, reliability, and accountability before we become part of critical workflows.
                </p>
              </div>
            </div>
          </section>

          <section className="py-20 border-t border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="glass-panel p-12 md:p-16 reveal text-center">
                <h2 className="text-4xl font-bold mb-8">Our Trust Position</h2>
                <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                  <p>
                    Last Mile is built to support enterprise environments where uptime, data stewardship, and clear operating controls matter. We design our trust posture around secure implementation practices, controlled access, operational visibility, and disciplined change management.
                  </p>
                  <p>
                    This Trust Center provides a high-level view of the principles that guide our security and privacy posture. Detailed documentation, customer diligence materials, and review discussions can be coordinated as part of active customer and partner engagements.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 reveal">
                <h2 className="text-4xl font-bold mb-6">Core Trust Areas</h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                  The following areas reflect the baseline topics customers, partners, procurement teams, and security reviewers typically evaluate.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trustAreas.map((area) => {
                  const Icon = area.icon;

                  return (
                    <div key={area.title} className="glass-panel p-8 reveal h-full">
                      <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center mb-5">
                        <Icon className="w-6 h-6 text-[#217ED9]" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{area.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{area.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-20 border-t border-slate-800 bg-[#0b1120]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="glass-panel p-10 reveal">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="w-7 h-7 text-[#217ED9]" />
                    <h2 className="text-3xl font-bold">Customer Review Support</h2>
                  </div>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    For active evaluations, Last Mile can support structured trust and security review conversations appropriate to the stage of engagement and the nature of the deployment.
                  </p>
                  <ul className="space-y-4 text-slate-300">
                    {requestItems.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 text-[#217ED9] mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-10 reveal">
                  <h2 className="text-3xl font-bold mb-6">Important Note</h2>
                  <div className="space-y-5 text-slate-400 leading-relaxed">
                    <p>
                      This page is intended as a high-level overview of Last Mile's trust and security approach. It is not a substitute for customer-specific diligence, contractual review, implementation planning, or legal commitments.
                    </p>
                    <p>
                      Where a customer requires more detailed review artifacts, Last Mile can coordinate those discussions directly as part of procurement, onboarding, or architecture review processes.
                    </p>
                    <p className="text-slate-300 font-medium">
                      Questions about trust, security review, or due diligence requests should be directed through our contact channel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 border-t border-slate-800">
            <div className="max-w-4xl mx-auto px-4 text-center reveal">
              <h2 className="text-3xl font-bold mb-6">Need Documentation or a Review Conversation?</h2>
              <p className="text-xl text-slate-400 mb-8">
                If your team is evaluating Last Mile and needs trust-related materials, start with our contact page and note that your request is for the Trust Center or security review workflow.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-[#0a1929]/80 border-2 border-[#217ED9] hover:bg-[#0a1929] text-white font-semibold text-lg transition-all"
                >
                  Contact Us <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="mailto:contact@lastmileinc.ai?subject=Trust%20Center%20Request"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-transparent border border-slate-600 hover:border-slate-400 text-slate-200 font-semibold transition-all"
                >
                  Email Trust Request
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}