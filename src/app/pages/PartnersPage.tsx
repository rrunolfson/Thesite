import { TrendingUp, Users, Briefcase, Settings, CheckCircle2, ArrowRight, DollarSign, Shield, Zap } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function PartnersPage() {
  return (
    <div className="pt-20 relative min-h-screen">
      <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white from-30% to-[#217ED9] bg-clip-text text-transparent">
                  Built for the Partner Ecosystem
                </h1>
                <p className="text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
                  Last Mile was designed to work with partners, not against them — creating new classes of services work tied to operational data.
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* SECTION 1: Delivery Partners */}
        <section id="delivery" className="py-20 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-6">Delivery Partners</h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                  These are our SI and industry expert partners who have the knowledge and experience to leverage, and expand, the ServiceNow platform across the enterprise as it was always intended.
                </p>
              </div>
            </FadeInOnScroll>

            {/* Main Value Prop - Two Column Layout */}
            <FadeInOnScroll>
              <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
                {/* Left Column: Title */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-center">Last Mile Is Driven by OT, Not IT.</h3>
                  <h3 className="text-3xl font-bold text-center text-[#217ED9]">Createing A Universe of NNACV Opportunities</h3>
                </div>

                {/* Right Column: Glass Panel */}
                <div className="glass-panel p-12 text-center">
                  <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                    <p>
                      ServiceNow partners are measured on increasing the Net New Annual Contract Value (NNACV) with their clients. Yet most partners are constrained to the same IT-centric use cases.
                    </p>
                    
                    <p className="text-xl font-semibold text-[#217ED9]">
                      Operational data changes ALL that.
                    </p>
                    
                    <p>
                      With OT data now available and actionable inside ServiceNow, Last Mile unlocks entirely new use cases across asset management, field service, facilities, compliance, and operations, creating new demand for configuration, workflow design, and managed services.
                    </p>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>

            {/* What This Enables - Two Column Layout */}
            <FadeInOnScroll>
              <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
                {/* Left Column: Title */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-center">What this enables for</h3>
                  <h3 className="text-3xl font-bold text-center text-[#217ED9]">Delivery Partners</h3>
                </div>

                {/* Right Column: 2x2 Grid of Glass Panels */}
                <div className="grid grid-cols-2 gap-6">
                  <SlideUpCard delay={0}>
                    <div className="glass-panel p-8 text-center h-full">
                      <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-6 h-6 text-[#217ED9]" />
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Expansion into asset-heavy lines of business
                      </p>
                    </div>
                  </SlideUpCard>

                  <SlideUpCard delay={0.1}>
                    <div className="glass-panel p-8 text-center h-full">
                      <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-[#217ED9]" />
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        New executive buyers beyond IT
                      </p>
                    </div>
                  </SlideUpCard>

                  <SlideUpCard delay={0.2}>
                    <div className="glass-panel p-8 text-center h-full">
                      <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-6 h-6 text-[#217ED9]" />
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Repeatable, fundable use cases
                      </p>
                    </div>
                  </SlideUpCard>

                  <SlideUpCard delay={0.3}>
                    <div className="glass-panel p-8 text-center h-full">
                      <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-6 h-6 text-[#217ED9]" />
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Larger, stickier ServiceNow footprints
                      </p>
                    </div>
                  </SlideUpCard>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Partner Role vs Last Mile Role - Full Width */}
            <FadeInOnScroll>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Column: Title */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-center">Partner Role vs.</h3>
                  <h3 className="text-3xl font-bold text-center text-[#217ED9]">Last Mile Role</h3>
                </div>

                {/* Right Column: Two Glass Panels */}
                <div className="space-y-6">
                  <SlideUpCard delay={0}>
                    <div className="glass-panel p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-[#217ED9] font-bold text-xl">LM</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold mb-3 text-white">Last Mile</h4>
                          <p className="text-slate-300 text-lg">
                            Integration infrastructure, schemas, supported connectors
                          </p>
                        </div>
                      </div>
                    </div>
                  </SlideUpCard>

                  <SlideUpCard delay={0.1}>
                    <div className="glass-panel p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-[#217ED9]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold mb-3 text-white">Partner</h4>
                          <p className="text-slate-300 text-lg">
                            Workflow configuration, process design, change management, delivery
                          </p>
                        </div>
                      </div>
                    </div>
                  </SlideUpCard>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-slate-800"></div>

        {/* SECTION 2: OEM & Technology Partners */}
        <section id="oem" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-6">OEM & Technology Partners</h2>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                  Equipment manufacturers and technology vendors who want real-world performance insight without customer conflict
                </p>
              </div>
            </FadeInOnScroll>

            {/* Main Value Prop - Two Column Layout */}
            <FadeInOnScroll>
              <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
                {/* Left Column: Title and Text */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-center">From Product Telemetry to</h3>
                  <h3 className="text-3xl font-bold text-center text-[#217ED9]">Product Intelligence</h3>
                  <div className="mt-8 text-center">
                    <Link
                      to="/oem-portal"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-[#0a1929]/80 border-2 border-[#217ED9] hover:bg-[#0a1929] text-white font-semibold text-lg transition-all"
                    >
                      OEM Portal <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Glass Panel */}
                <div className="glass-panel p-12 text-center">
                  <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                    <p>
                      OEMs generate enormous volumes of operational data but, that data rarely reaches the teams that can use it to improve products, protect brand reputation, or influence buying decisions.
                    </p>
                    
                    <p>
                      Last Mile enables OEM data to flow (with customer consent and controls) into enterprise workflows that create structured, anonymized insight into how products perform in the real world.
                    </p>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Value for OEM Partners - Two Column Layout */}
            <FadeInOnScroll>
              <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
                {/* Left Column: Title */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-center">The Value For</h3>
                  <h3 className="text-3xl font-bold text-center text-[#217ED9]">OEM Partners</h3>
                </div>

                {/* Right Column: 2x2 Grid of Glass Panels */}
                <div className="grid grid-cols-2 gap-6">
                  <SlideUpCard delay={0}>
                    <div className="glass-panel p-8 text-center h-full">
                      <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-6 h-6 text-[#217ED9]" />
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Objective performance data across customers and environments
                      </p>
                    </div>
                  </SlideUpCard>

                  <SlideUpCard delay={0.1}>
                    <div className="glass-panel p-8 text-center h-full">
                      <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-6 h-6 text-[#217ED9]" />
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Faster root-cause analysis and product improvement
                      </p>
                    </div>
                  </SlideUpCard>

                  <SlideUpCard delay={0.2}>
                    <div className="glass-panel p-8 text-center h-full">
                      <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-[#217ED9]" />
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Early detection of systemic quality issues
                      </p>
                    </div>
                  </SlideUpCard>

                  <SlideUpCard delay={0.3}>
                    <div className="glass-panel p-8 text-center h-full">
                      <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-6 h-6 text-[#217ED9]" />
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Stronger position with enterprise procurement teams
                      </p>
                    </div>
                  </SlideUpCard>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Critical Positioning - Full Width */}
            <FadeInOnScroll>
              <div>
                <div className="p-8 bg-[#217ED9]/10 border border-[#217ED9] rounded-lg text-center">
                  <p className="text-2xl text-white">
                    Last Mile does not compete with OEM platforms. We extend their value by connecting them to enterprise execution systems.
                  </p>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <FadeInOnScroll>
              <h2 className="text-3xl font-bold mb-6">Ready to Partner with Last Mile?</h2>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-[#0a1929]/80 border-2 border-[#217ED9] hover:bg-[#0a1929] text-white font-semibold text-lg transition-all"
              >
                Talk to Us <ArrowRight className="w-5 h-5" />
              </Link>
            </FadeInOnScroll>
          </div>
        </section>
      </div>
    </div>
  );
}

// Scroll animation components
function FadeInOnScroll({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function SlideUpCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}