import { Handshake, DollarSign, Users, Target, Award, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

export function SIPartnershipsPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Systems Integrator <span className="text-[#217ED9]">Partnerships</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Expand your service offerings with enterprise OT intelligence—without building the platform yourself
            </p>
          </div>

          {/* Value Proposition */}
          <div className="glass-panel p-12 mb-16 reveal">
            <h2 className="text-3xl font-bold mb-6 text-center">Why Partner with Last Mile</h2>
            <p className="text-xl text-slate-400 text-center mb-10 max-w-3xl mx-auto">
              Your clients are asking for predictive maintenance, ServiceNow integration, and operational intelligence. Last Mile gives you the platform to deliver—so you can focus on implementation and customer success.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-[#217ED9]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-7 h-7 text-[#217ED9]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Expand Revenue Streams</h3>
                <p className="text-slate-400">
                  Win larger deals by offering operational intelligence alongside traditional integration work. Increase project values by 40-60%.
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 bg-[#217ED9]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-7 h-7 text-[#217ED9]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Accelerate Delivery</h3>
                <p className="text-slate-400">
                  Pre-built connectors and workflows mean faster implementations. Reduce project timelines by 50% and increase margins.
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 bg-[#217ED9]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-[#217ED9]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Create Recurring Revenue</h3>
                <p className="text-slate-400">
                  Platform subscriptions and managed services create annuity revenue beyond one-time project fees.
                </p>
              </div>
            </div>
          </div>

          {/* What We Provide */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="glass-panel p-10 reveal">
              <div className="flex items-center gap-3 mb-6">
                <Handshake className="w-8 h-8 text-[#217ED9]" />
                <h3 className="text-2xl font-bold">Partner Program Benefits</h3>
              </div>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Tiered pricing:</strong> Volume discounts that improve as you grow</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Deal registration:</strong> Protected accounts and margin protection</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Co-selling:</strong> Joint customer engagements with Last Mile team</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Marketing support:</strong> Co-branded materials and demand generation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Referral fees:</strong> Earn commission on leads you pass to us</span>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-10 reveal">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-[#217ED9]" />
                <h3 className="text-2xl font-bold">Training & Enablement</h3>
              </div>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Technical certification:</strong> Platform training for your engineers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Sales enablement:</strong> Positioning, demos, and objection handling</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Implementation playbooks:</strong> Proven methodologies for faster delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Dedicated support:</strong> Partner success manager and technical resources</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-white">Partner portal:</strong> Access to documentation, tools, and resources</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Ideal Partner Profile */}
          <div className="glass-panel p-12 mb-16 reveal">
            <h2 className="text-3xl font-bold mb-8">Who We Partner With</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-[#217ED9] mb-4">Systems Integrators</h3>
                <p className="text-slate-400 mb-4">
                  You specialize in industrial automation, SCADA, MES, or building management systems. You have clients asking for predictive analytics and enterprise integration but don't want to build a platform from scratch.
                </p>
                <p className="text-slate-300">
                  <strong>Example:</strong> A ServiceNow partner who wants to expand into OT/IoT integration for manufacturing clients.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#217ED9] mb-4">Managed Service Providers</h3>
                <p className="text-slate-400 mb-4">
                  You manage IT/OT infrastructure for clients and want to offer proactive monitoring and maintenance as a recurring service. You need a platform that scales across multiple customers.
                </p>
                <p className="text-slate-300">
                  <strong>Example:</strong> An MSP serving healthcare systems who wants to offer medical device monitoring as a service.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#217ED9] mb-4">Consulting Firms</h3>
                <p className="text-slate-400 mb-4">
                  You advise enterprises on digital transformation and operational excellence. You need a proven platform to recommend and implement for clients pursuing Industry 4.0 initiatives.
                </p>
                <p className="text-slate-300">
                  <strong>Example:</strong> A boutique consulting firm focused on manufacturing optimization.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#217ED9] mb-4">Technology Resellers</h3>
                <p className="text-slate-400 mb-4">
                  You resell enterprise software and hardware but want to differentiate with value-added services. Last Mile enables you to bundle intelligent operations with your core offerings.
                </p>
                <p className="text-slate-300">
                  <strong>Example:</strong> A ServiceNow reseller expanding into operational technology domains.
                </p>
              </div>
            </div>
          </div>

          {/* Success Story */}
          <div className="glass-panel p-12 reveal">
            <h2 className="text-3xl font-bold mb-6">Partner Success Story</h2>
            <div className="border-l-4 border-[#217ED9] pl-8">
              <h3 className="text-2xl font-semibold mb-4">Regional Systems Integrator</h3>
              <p className="text-slate-400 mb-4">
                A mid-sized SI specializing in industrial automation had clients requesting predictive maintenance and ServiceNow integration. Building a platform would take 18 months and $2M in development costs. Instead, they partnered with Last Mile.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="bg-slate-800/30 p-6 rounded">
                  <div className="text-3xl font-bold text-[#10b981] mb-2">$4.2M</div>
                  <div className="text-slate-400">New revenue in Year 1 from Last Mile projects</div>
                </div>
                <div className="bg-slate-800/30 p-6 rounded">
                  <div className="text-3xl font-bold text-[#10b981] mb-2">7</div>
                  <div className="text-slate-400">New enterprise clients won with Last Mile positioning</div>
                </div>
                <div className="bg-slate-800/30 p-6 rounded">
                  <div className="text-3xl font-bold text-[#10b981] mb-2">45%</div>
                  <div className="text-slate-400">Project margin improvement vs. traditional integration</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16 reveal">
            <h2 className="text-3xl font-bold mb-6">Ready to Become a Partner?</h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Let's discuss how Last Mile can help you expand your service offerings and grow your business.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 rounded-sm bg-[#217ED9] hover:bg-[#1a6bb8] text-white font-semibold transition-all shadow-lg hover:shadow-[#217ED9]/25 uppercase"
            >
              Apply to Become a Partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
