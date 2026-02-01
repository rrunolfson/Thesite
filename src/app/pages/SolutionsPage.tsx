import { Database, Workflow, Layers, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function SolutionsPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-[#217ED9]">Last Mile 360</span> Platform
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Three layers that turn operational data into enterprise outcomes
            </p>
          </div>

          {/* Data Enablement */}
          <div className="glass-panel p-12 mb-12 reveal">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-16 h-16 bg-[#217ED9]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-8 h-8 text-[#217ED9]" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Data Enablement Layer</h2>
                <p className="text-xl text-slate-400 mb-6">
                  Collect and normalize data from any operational device—industrial equipment, medical devices, building systems, IoT sensors—without custom code or complex integrations.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">What You Get</h3>
                    <ul className="space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Pre-built connectors for 200+ device types</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Real-time data streaming with sub-second latency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Support for Modbus, BACnet, HL7, DICOM, and more</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Edge computing for low-latency use cases</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Business Outcomes</h3>
                    <ul className="space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="text-[#217ED9] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Eliminate data silos across facilities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="text-[#217ED9] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Reduce integration costs by 60%</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="text-[#217ED9] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Deploy new devices in hours, not weeks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="text-[#217ED9] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Maintain compliance with audit trails</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Activation */}
          <div className="glass-panel p-12 mb-12 reveal">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-16 h-16 bg-[#217ED9]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Workflow className="w-8 h-8 text-[#217ED9]" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Workflow Activation Layer</h2>
                <p className="text-xl text-slate-400 mb-6">
                  Transform device signals into automated workflows that trigger action in your existing enterprise systems—ServiceNow, ERPs, asset management platforms, and more.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">What You Get</h3>
                    <ul className="space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>No-code workflow builder with pre-built templates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Native ServiceNow integration for ITSM/ITOM</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Automated work order creation and assignment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Alert routing based on business rules</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Business Outcomes</h3>
                    <ul className="space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="text-[#217ED9] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Reduce mean time to repair (MTTR) by 35%</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="text-[#217ED9] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Eliminate manual work order entry</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="text-[#217ED9] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Increase technician productivity by 25%</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="text-[#217ED9] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Act on issues before they impact operations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Truth Layer */}
          <div className="glass-panel p-12 mb-12 reveal">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-16 h-16 bg-[#217ED9]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Layers className="w-8 h-8 text-[#217ED9]" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Enterprise Truth Layer</h2>
                <p className="text-xl text-slate-400 mb-6">
                  A unified view of all operational assets, their performance, and their business impact—accessible to everyone from the C-suite to the frontline technician.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">What You Get</h3>
                    <ul className="space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Single pane of glass dashboard for all assets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>AI-powered predictive analytics and anomaly detection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Custom KPIs and business intelligence reporting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Role-based access with enterprise SSO</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Business Outcomes</h3>
                    <ul className="space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="text-[#217ED9] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Make data-driven decisions across operations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="text-[#217ED9] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Reduce unplanned downtime by 40%</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="text-[#217ED9] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Improve asset utilization by 30%</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="text-[#217ED9] w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>Prove compliance during audits instantly</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16 reveal">
            <h2 className="text-2xl font-bold mb-6">Ready to See Last Mile 360 in Action?</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/contact"
                className="px-8 py-4 rounded-sm bg-[#217ED9] hover:bg-[#1a6bb8] text-white font-semibold transition-all shadow-lg hover:shadow-[#217ED9]/25 uppercase"
              >
                Request a Demo
              </Link>
              <Link
                to="/use-cases"
                className="px-8 py-4 rounded-sm bg-transparent border border-slate-600 hover:border-slate-400 text-slate-200 font-semibold transition-all"
              >
                View Use Cases
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
