import { ArrowRight, ShoppingCart, Factory, Zap, Heart, Truck, Building2, Warehouse, Droplet } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function IndustriesPage() {
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
                  Operational Reality by Industry
                </h1>
                <p className="text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
                  Real-world operational breakdowns, the OT-to-workflow gap, and measurable outcomes
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </section>

        {/* Retail & Grocery */}
        <IndustrySection
          icon={<ShoppingCart className="w-8 h-8 text-white" />}
          title="Retail & Grocery"
          operationalReality={[
            "Refrigeration failures lead to spoiled inventory and compliance risk",
            "Store teams discover issues after customers do",
            "Field service coordination is manual and delayed"
          ]}
          whatLastMileEnables={[
            "Temperature excursions trigger ServiceNow incidents automatically",
            "Field service is dispatched before inventory loss occurs",
            "Asset performance data informs procurement decisions"
          ]}
          outcomes="Reduced shrink, improved uptime, faster response, data-driven vendor negotiations"
          imageUrl="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        />

        {/* Manufacturing */}
        <IndustrySection
          icon={<Factory className="w-8 h-8 text-white" />}
          title="Manufacturing"
          operationalReality={[
            "Downtime is detected locally, escalated manually",
            "Root cause lives in tribal knowledge",
            "Maintenance is reactive"
          ]}
          whatLastMileEnables={[
            "Machine events generate work orders automatically",
            "Patterns across plants identify systemic issues",
            "Maintenance becomes predictive, not reactive"
          ]}
          outcomes="Higher uptime, lower maintenance cost, improved yield"
          imageUrl="https://images.unsplash.com/photo-1581091870628-8045a1ccc4b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          reverse
        />

        {/* Energy & Utilities */}
        <IndustrySection
          icon={<Zap className="w-8 h-8 text-white" />}
          title="Energy & Utilities"
          operationalReality={[
            "Distributed assets with limited visibility",
            "Regulatory compliance is manual",
            "Outages escalate slowly"
          ]}
          whatLastMileEnables={[
            "Asset alerts trigger regulated workflows",
            "Compliance actions are tracked centrally",
            "Faster outage response and documentation"
          ]}
          outcomes="Improved reliability, audit readiness, reduced penalties"
          imageUrl="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        />

        {/* Healthcare */}
        <IndustrySection
          icon={<Heart className="w-8 h-8 text-white" />}
          title="Healthcare"
          operationalReality={[
            "Medical equipment downtime impacts patient care",
            "Facilities and IT operate separately",
            "Compliance is fragmented"
          ]}
          whatLastMileEnables={[
            "Equipment issues routed into clinical workflows",
            "Unified visibility across biomedical and facilities teams",
            "Automated compliance tracking"
          ]}
          outcomes="Improved patient safety, reduced downtime, audit confidence"
          imageUrl="https://images.unsplash.com/photo-1579684385127-1ef15d508118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          reverse
        />

        {/* Logistics & Transportation */}
        <IndustrySection
          icon={<Truck className="w-8 h-8 text-white" />}
          title="Logistics & Transportation"
          operationalReality={[
            "Fleet issues detected late",
            "Cold chain failures surface after delivery",
            "SLA breaches are disputed"
          ]}
          whatLastMileEnables={[
            "Vehicle and cargo telemetry drives real-time workflows",
            "Exceptions handled before failure",
            "SLA performance becomes objective"
          ]}
          outcomes="Reduced loss, improved SLA adherence, stronger customer trust"
          imageUrl="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        />

        {/* Building Management */}
        <IndustrySection
          icon={<Building2 className="w-8 h-8 text-white" />}
          title="Building Management"
          operationalReality={[
            "HVAC and facilities issues are tenant-reported",
            "Preventive maintenance is inconsistent"
          ]}
          whatLastMileEnables={[
            "Asset alerts drive automated maintenance",
            "Facilities teams operate proactively"
          ]}
          outcomes="Lower energy cost, improved tenant experience"
          imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          reverse
        />

        {/* Warehouse Management */}
        <IndustrySection
          icon={<Warehouse className="w-8 h-8 text-white" />}
          title="Warehouse Management"
          operationalReality={[
            "Conveyor and automation failures halt throughput",
            "Downtime is escalated informally"
          ]}
          whatLastMileEnables={[
            "Equipment events trigger prioritized workflows",
            "Maintenance aligns with fulfillment impact"
          ]}
          outcomes="Higher throughput, reduced downtime"
          imageUrl="https://images.unsplash.com/photo-1553413077-190dd305871c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        />

        {/* Oil & Gas */}
        <IndustrySection
          icon={<Droplet className="w-8 h-8 text-white" />}
          title="Oil & Gas"
          operationalReality={[
            "Remote assets with delayed visibility",
            "Safety and compliance risks"
          ]}
          whatLastMileEnables={[
            "OT events routed into regulated workflows",
            "Automated escalation and documentation"
          ]}
          outcomes="Improved safety, reduced downtime, regulatory confidence"
          imageUrl="https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          reverse
        />

        {/* CTA Section */}
        <section className="py-20 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <FadeInOnScroll>
              <h2 className="text-3xl font-bold mb-6">See How Last Mile Fits Your Operations</h2>
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

// Industry Section Component
interface IndustrySectionProps {
  icon: React.ReactNode;
  title: string;
  operationalReality: string[];
  whatLastMileEnables: string[];
  outcomes: string;
  imageUrl: string;
  reverse?: boolean;
}

function IndustrySection({
  icon,
  title,
  operationalReality,
  whatLastMileEnables,
  outcomes,
  imageUrl,
  reverse = false
}: IndustrySectionProps) {
  return (
    <section className="py-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <div className={`grid lg:grid-cols-2 gap-12 items-stretch ${reverse ? 'lg:flex-row-reverse' : ''}`}>
            {/* Content */}
            <div className={`flex flex-col ${reverse ? 'lg:order-2' : ''}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-[#217ED9]/20 border border-white rounded-lg flex items-center justify-center">
                  {icon}
                </div>
                <h2 className="text-4xl font-bold">{title}</h2>
              </div>

              <div className="space-y-4 flex-1 flex flex-col">
                {/* Operational Reality */}
                <div className="p-4 bg-[rgba(30,41,59,0.7)] backdrop-blur-xl rounded-lg border-2 border-[#217ED9]">
                  <h3 className="text-xl font-bold mb-3 text-[#217ED9]">Operational Reality</h3>
                  <ul className="space-y-2">
                    {operationalReality.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <span className="text-slate-500 mt-1">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What Last Mile Enables */}
                <div className="p-4 bg-slate-800/60 border-2 border-slate-600 rounded-lg">
                  <h3 className="text-xl font-bold mb-3">
                    <span className="text-slate-400">What </span>
                    <span className="text-white">Last </span>
                    <span className="text-[#217ED9]">Mile </span>
                    <span className="text-slate-400">Enables</span>
                  </h3>
                  <ul className="space-y-2">
                    {whatLastMileEnables.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <span className="text-[#217ED9] mt-1">→</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcomes */}
                <div className="p-4 bg-green-950/60 border-2 border-green-500 rounded-lg mt-auto">
                  <h3 className="text-lg font-bold mb-2 text-green-500">Outcomes</h3>
                  <p className="text-slate-300">{outcomes}</p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className={`h-full ${reverse ? 'lg:order-1' : ''}`}>
              <SlideInImage reverse={reverse}>
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover rounded-lg border border-slate-700 shadow-xl"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </SlideInImage>
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
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

function SlideInImage({ children, reverse }: { children: React.ReactNode; reverse: boolean }) {
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
      initial={{ opacity: 0, x: reverse ? 50 : -50 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: reverse ? 50 : -50 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}