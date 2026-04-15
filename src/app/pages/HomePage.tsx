import { Link } from "react-router";
import { ArrowRight, Download, Link2, BarChart3 } from "lucide-react";
import { SEO } from "@/app/components/SEO";

export function HomePage() {
  return (
    <>
      <SEO
        title="Last Mile Inc. - Operational Data Integration for ServiceNow"
        description="Last Mile brings operational technology (OT) asset and performance data into ServiceNow so enterprises can run operations, workforce, and vendors from a single system of execution."
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
                Last Mile brings operational technology (OT) asset and performance data into ServiceNow so enterprises can run operations, workforce, and vendors from a single system of execution.
              </p>
            </div>

            {/* Architecture Diagram */}
            <div className="relative">
              <img
                src="/images/chuck.png"
                alt="Last Mile Architecture"
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </header>

      {/* What Last Mile Does Section */}
      <section className="py-20 pb-12 relative z-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Last <span className="bg-gradient-to-r from-white via-[#217ED9]/60 to-[#217ED9] text-transparent bg-clip-text">Mile Does</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Operational data is not useful until it drives work. Last Mile builds the connections between OT, assets, work execution, and enterprise outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Operational Data Ingestion */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 text-center">
              <div className="w-14 h-14 border-2 border-[#217ED9] rounded-lg flex items-center justify-center mb-6 mx-auto">
                <Download className="w-7 h-7 text-[#217ED9]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Operational Data Ingestion
              </h3>
              <p className="text-slate-400 leading-relaxed">
                We take every relevant data signal (machine, sensor, controller, fleet, or device) and make it usable.
              </p>
            </div>

            {/* Card 2: Enterprise Workflow Activation */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 text-center">
              <div className="w-14 h-14 border-2 border-[#217ED9] rounded-lg flex items-center justify-center mb-6 mx-auto">
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
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 text-center">
              <div className="w-14 h-14 border-2 border-[#217ED9] rounded-lg flex items-center justify-center mb-6 mx-auto">
                <BarChart3 className="w-7 h-7 text-[#217ED9]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Weaponize The Asset Truth Layer
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Asset data and operating signals gives procurement and leadership objective insight.
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