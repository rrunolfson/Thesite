import { Zap, TrendingUp, Award, Code, Users, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

export function OEMPartnershipsPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              OEM <span className="text-[#217ED9]">Partnerships</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Embed enterprise-grade intelligence into your equipment and differentiate your value proposition
            </p>
          </div>

          {/* Value Proposition */}
          <div className="glass-panel p-12 mb-16 reveal">
            <h2 className="text-3xl font-bold mb-6 text-center">Why Partner with Last Mile</h2>
            <p className="text-xl text-slate-400 text-center mb-10 max-w-3xl mx-auto">
              Your customers don't just buy equipment—they buy uptime, efficiency, and peace of mind. Last Mile enables you to deliver outcomes, not just machines.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-[#217ED9]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-[#217ED9]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Increase Equipment Value</h3>
                <p className="text-slate-400">
                  Differentiate your equipment with predictive maintenance, remote monitoring, and automated service dispatch—features enterprise buyers demand.
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 bg-[#217ED9]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-7 h-7 text-[#217ED9]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Create Recurring Revenue</h3>
                <p className="text-slate-400">
                  Transform one-time equipment sales into ongoing service contracts. Predictive insights and uptime guarantees become revenue streams.
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 bg-[#217ED9]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-[#217ED9]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Strengthen Customer Loyalty</h3>
                <p className="text-slate-400">
                  Equipment that "talks" to enterprise systems creates stickiness. Your customers won't switch vendors when you're embedded in their operations.
                </p>
              </div>
            </div>
          </div>

          {/* What We Provide */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="glass-panel p-10 reveal">
              <div className="flex items-center gap-3 mb-6">
                <Code className="w-8 h-8 text-[#217ED9]" />
                <h3 className="text-2xl font-bold">White-Label Technology</h3>
              </div>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Embed Last Mile intelligence into your equipment under your brand</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Pre-built connectors for common industrial protocols (Modbus, OPC-UA, BACnet)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Edge computing modules for low-latency applications</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>APIs for seamless integration with your existing software stack</span>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-10 reveal">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-[#217ED9]" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Go-to-Market Support</h3>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Joint customer presentations and proof-of-concept support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Co-branded marketing materials and case studies</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Sales enablement training for your field teams</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Revenue sharing models aligned with your business goals</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Use Cases */}
          <div className="glass-panel p-12 reveal">
            <h2 className="text-3xl font-bold mb-8">OEM Partnership Examples</h2>
            <div className="space-y-8">
              <div className="border-l-4 border-[#217ED9] pl-6">
                <h3 className="text-xl font-semibold mb-2">Industrial Equipment Manufacturer</h3>
                <p className="text-slate-400 mb-3">
                  A leading CNC machine manufacturer embedded Last Mile sensors and analytics into their new product line. Customers now receive predictive maintenance alerts 48 hours before failures, with automatic parts ordering and service scheduling.
                </p>
                <p className="text-[#10b981]">
                  <strong>Result:</strong> 30% higher close rate on enterprise deals. Service contract attachment rate increased from 45% to 78%.
                </p>
              </div>

              <div className="border-l-4 border-[#217ED9] pl-6">
                <h3 className="text-xl font-semibold mb-2">Medical Device OEM</h3>
                <p className="text-slate-400 mb-3">
                  A diagnostic imaging company integrated Last Mile telemetry into their MRI and CT systems. Hospital customers gained real-time utilization tracking and predictive service needs—while the OEM gained visibility into fleet performance across 500+ installations.
                </p>
                <p className="text-[#10b981]">
                  <strong>Result:</strong> $12M in new service revenue. Customer churn reduced by 60% due to proactive support.
                </p>
              </div>

              <div className="border-l-4 border-[#217ED9] pl-6">
                <h3 className="text-xl font-semibold mb-2">HVAC Systems Provider</h3>
                <p className="text-slate-400 mb-3">
                  A commercial HVAC manufacturer partnered with Last Mile to offer "Uptime as a Service" contracts. Building owners receive guaranteed comfort and energy efficiency, backed by automated diagnostics and dispatch.
                </p>
                <p className="text-[#10b981]">
                  <strong>Result:</strong> Recurring revenue model generating 35% margins. Contract renewals at 92%.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16 reveal">
            <h2 className="text-3xl font-bold mb-6">Let's Build Something Together</h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Whether you're launching a new product line or enhancing existing equipment, Last Mile can help you deliver outcomes your customers will pay for.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 rounded-sm bg-[#217ED9] hover:bg-[#1a6bb8] text-white font-semibold transition-all shadow-lg hover:shadow-[#217ED9]/25 uppercase"
            >
              Discuss Partnership Opportunities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
