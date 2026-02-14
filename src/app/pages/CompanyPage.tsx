import { Target, Zap, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SEO } from "@/app/components/SEO";

export function CompanyPage() {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Last Mile's mission to transform operational workflows with integrated data solutions. Discover our vision for bringing operational technology and enterprise systems together."
        keywords="about Last Mile, company mission, operational technology integration, enterprise solutions, company vision"
        canonicalPath="/company"
      />
      <div className="pt-20 relative min-h-screen">
      <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white from-30% to-[#217ED9] bg-clip-text text-transparent">
                  Built for Operations. Proven in the Field. Designed to Scale.
                </h1>
                <p className="text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
                  Last Mile brings OT telemetry and asset data into enterprise execution workflows, turning real-world events into action, accountability, and measurable outcomes.
                </p>
                
                <div className="mt-8 flex justify-center">
                  <Link
                    to="/careers"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[#0a1929]/80 border-2 border-[#217ED9] hover:bg-[#0a1929] text-white font-semibold text-base transition-all"
                  >
                    Careers @ Last Mile
                  </Link>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* Why We Exist */}
        <section className="py-20 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="glass-panel p-12 md:p-16">
                <h2 className="text-4xl font-bold mb-8 text-center">
                  Modern enterprises run on workflows. <br /><span className="text-[#217ED9]">Their operations do not.</span>
                </h2>
                
                <div className="space-y-6 text-lg text-slate-300 leading-relaxed text-center">
                  <p>
                    For the last twenty years, enterprises have invested heavily in systems of record for IT, HR, and Finance. Platforms like ServiceNow have become the backbone of enterprise execution.
                  </p>
                  
                  <p>
                    But the physical world, the assets, equipment, facilities, fleets, cold chains, production lines that business relies on every day, still operates outside those systems.
                  </p>
                  
                  <p>
                    Operational technology generates massive volumes of data, but that data rarely reaches the teams responsible for acting on it. Instead, it lives in vendor dashboards, point solutions, spreadsheets, or inboxes. The result is reactive operations, manual coordination, missed SLAs, and preventable downtime.
                  </p>
                  
                  <p className="text-xl font-semibold text-white pt-4 italic">
                    Last Mile exists to close that gap.
                  </p>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-20 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-6">
                  We connect the physical world to enterprise execution.
                </h2>
              </div>

              <div className="glass-panel p-12 md:p-16 text-center">
                <p className="text-lg text-slate-300 leading-relaxed mb-8">
                  Last Mile builds ServiceNow-native integrations that bring operational and asset data directly into the workflows enterprises already run. We do not create new dashboards. We do not replace OEM platforms. We do not ask teams to learn new tools.
                </p>
                
                <p className="text-xl text-white font-semibold italic">
                  We turn operational signals into incidents, work orders, compliance actions, and automated workflows.  And we do it inside the system of record where accountability already exists.
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* Why We're Different */}
        <section className="py-20 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <h2 className="text-4xl font-bold mb-12 text-center">Why We're Different</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <SlideUpCard delay={0}>
                  <div className="glass-panel p-8 h-full">
                    <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6 text-[#217ED9]" />
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      Built by operators who have implemented ServiceNow at global scale
                    </p>
                  </div>
                </SlideUpCard>

                <SlideUpCard delay={0.1}>
                  <div className="glass-panel p-8 h-full">
                    <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-[#217ED9]" />
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      Designed for production environments, not proofs of concept
                    </p>
                  </div>
                </SlideUpCard>

                <SlideUpCard delay={0.2}>
                  <div className="glass-panel p-8 h-full">
                    <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-[#217ED9]" />
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      Workflow-first, not telemetry-first
                    </p>
                  </div>
                </SlideUpCard>

                <SlideUpCard delay={0.3}>
                  <div className="glass-panel p-8 h-full">
                    <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-[#217ED9]" />
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      Infrastructure software, not services
                    </p>
                  </div>
                </SlideUpCard>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* Our Credibility */}
        <section className="py-20 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInOnScroll>
              <div className="glass-panel p-12 md:p-16 text-center">
                <h2 className="text-4xl font-bold mb-8">
                  We are built by real operators from day one.
                </h2>
                
                <p className="text-lg text-slate-300 leading-relaxed">
                  Last Mile was founded by leaders who have spent decades listening and designing operational solutions inside some of the largest and most complex enterprises in the world, including global retailers, manufacturers, and regulated operators.
                </p>
                
                <p className="text-lg text-slate-300 leading-relaxed mt-6">
                  We have lived the reality of missed inventory, failed equipment, broken cold chains, delayed field service, and disconnected vendors. Last Mile is not a theory. It is a direct response to operational problems that remain unsolved at scale.
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <FadeInOnScroll>
              <h2 className="text-3xl font-bold mb-6">Ready to Talk?</h2>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-[#0a1929]/80 border-2 border-[#217ED9] hover:bg-[#0a1929] text-white font-semibold text-lg transition-all"
              >
                Contact Us <ArrowRight className="w-5 h-5" />
              </Link>
            </FadeInOnScroll>
          </div>
        </section>
      </div>
    </div>
    </>
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