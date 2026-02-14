import { Link } from "react-router";
import { ArrowRight, Settings, Database, Download, Link2, BarChart3 } from "lucide-react";
import { SEO } from "@/app/components/SEO";

export function HomePage() {
  return (
    <>
      <SEO
        title="Last Mile Inc. - Operational Data Integration for ServiceNow"
        description="Last Mile brings operational technology (OT) and asset performance data into ServiceNow — so enterprises can run operations, service, workforce, and vendors from a single system of execution."
        canonicalPath="/"
      />
      <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 data-grid-bg opacity-20"></div>
      </div>

      {/* Hero Section */}
      <header className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Text */}
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                Operational Data Belongs in <span className="bg-gradient-to-r from-white via-[#217ED9]/60 to-[#217ED9] text-transparent bg-clip-text">Operational Workflows</span>
              </h1>

              <p className="mt-8 text-lg md:text-xl text-slate-400 leading-relaxed">
                Last Mile brings operational technology (OT) and asset performance data into ServiceNow — so enterprises can run operations, service, workforce, and vendors from a single system of execution.
              </p>
            </div>

            {/* Architecture Diagram */}
            <div className="relative">
              {/* Outer container with border */}
              <div className="border border-slate-700/50 rounded-lg p-8 bg-slate-900/30">
                
                {/* Top: Three Equipment Icons */}
                <div className="grid grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="w-14 h-14 border border-slate-600 rounded bg-slate-800/50 flex items-center justify-center mx-auto mb-3">
                      <Settings className="w-7 h-7 text-slate-400" />
                    </div>
                    <div className="text-sm text-slate-500">Stores</div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 border border-slate-600 rounded bg-slate-800/50 flex items-center justify-center mx-auto mb-3">
                      <Settings className="w-7 h-7 text-slate-400" />
                    </div>
                    <div className="text-sm text-slate-500">Factories</div>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 border border-slate-600 rounded bg-slate-800/50 flex items-center justify-center mx-auto mb-3">
                      <Settings className="w-7 h-7 text-slate-400" />
                    </div>
                    <div className="text-sm text-slate-500">Equipment</div>
                  </div>
                </div>

                {/* Connector Line and Database */}
                <div className="flex justify-center mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-12 bg-slate-700"></div>
                    <Database className="w-14 h-14 text-[#217ED9] my-4" />
                    <div className="text-lg text-[#217ED9] font-mono font-semibold">OT Data Streams</div>
                  </div>
                </div>

                {/* Last Mile Box */}
                <div className="border-2 border-[#217ED9] rounded-lg p-6 mb-8 bg-[#217ED9]/5 shadow-2xl shadow-[#217ED9]/50">
                  <div className="flex items-center justify-center gap-3">
                    <img src="/logo.png" alt="Last Mile" className="h-11 w-auto rounded-md" />
                    <div className="text-3xl font-bold">
                      <span className="text-white">LAST </span>
                      <span className="text-[#217ED9]">MILE</span>
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                <div className="flex justify-center mb-6">
                  <div className="w-px h-8 bg-slate-700"></div>
                </div>

                {/* ServiceNow Section */}
                <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
                  <div className="text-center text-white font-semibold mb-6">ServiceNow</div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 border border-slate-700 rounded px-3 py-2 bg-slate-800/30">
                      <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                      <span className="text-sm text-slate-300">Workflows</span>
                    </div>

                    <div className="flex items-center gap-2 border border-slate-700 rounded px-3 py-2 bg-slate-800/30">
                      <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                      <span className="text-sm text-slate-300">Automated Fixes</span>
                    </div>

                    <div className="flex items-center gap-2 border border-slate-700 rounded px-3 py-2 bg-slate-800/30">
                      <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6m8.66-15.66l-4.24 4.24m-5.66 5.66l-4.24 4.24M23 12h-6m-6 0H1m20.66 8.66l-4.24-4.24m-5.66-5.66l-4.24-4.24"></path>
                      </svg>
                      <span className="text-sm text-slate-300">Service</span>
                    </div>

                    <div className="flex items-center gap-2 border border-slate-700 rounded px-3 py-2 bg-slate-800/30">
                      <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <span className="text-sm text-slate-300">Field Ops</span>
                    </div>

                    <div className="flex items-center gap-2 border border-slate-700 rounded px-3 py-2 bg-slate-800/30">
                      <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      <span className="text-sm text-slate-300">Asset Mgmt</span>
                    </div>

                    <div className="flex items-center gap-2 border border-slate-700 rounded px-3 py-2 bg-slate-800/30">
                      <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                      <span className="text-sm text-slate-300">Procurement</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* What Last Mile Does Section */}
      <section className="py-20 pb-12 relative z-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Last Mile <span className="text-[#217ED9]">Does</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Operational data is not useful until it drives work. Last Mile productizes the connections between OT, assets, work execution, and enterprise outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Operational Data Ingestion */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8">
              <div className="w-14 h-14 border-2 border-[#217ED9] rounded-lg flex items-center justify-center mb-6">
                <Download className="w-7 h-7 text-[#217ED9]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Operational Data Ingestion
              </h3>
              <p className="text-slate-400 leading-relaxed">
                We take every relevant data signal — machine, sensor, controller, fleet, or device — and make it usable.
              </p>
            </div>

            {/* Card 2: Enterprise Workflow Activation */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8">
              <div className="w-14 h-14 border-2 border-[#217ED9] rounded-lg flex items-center justify-center mb-6">
                <Link2 className="w-7 h-7 text-[#217ED9]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Enterprise Workflow Activation
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Data becomes action inside ServiceNow: incidents, work orders, dispatch, alerts, and compliance tracking.
              </p>
            </div>

            {/* Card 3: Asset Truth Layer */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8">
              <div className="w-14 h-14 border-2 border-[#217ED9] rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-[#217ED9]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Asset Truth Layer
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Longitudinal performance data tied to asset records gives procurement and leadership objective insight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Buttons */}
      <section className="py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-sm bg-[#0a1929]/80 border-2 border-[#217ED9] hover:bg-[#0a1929] text-white font-semibold text-lg transition-all"
            >
              Talk to Us <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/industries"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-sm bg-[#0a1929]/80 border-2 border-[#217ED9] hover:bg-[#0a1929] text-white font-semibold text-lg transition-all"
            >
              See Use Cases
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}