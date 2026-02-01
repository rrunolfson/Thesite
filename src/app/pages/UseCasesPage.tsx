import { Factory, Hospital, Building2, Warehouse, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function UseCasesPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Use Cases by <span className="text-[#217ED9]">Industry</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Real problems. Real solutions. Real outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Manufacturing */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#217ED9]/20 rounded-lg flex items-center justify-center">
                  <Factory className="w-6 h-6 text-[#217ED9]" />
                </div>
                <h2 className="text-3xl font-bold">Manufacturing & Industrial</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-red-400 mb-2">The Problem</h3>
                  <p className="text-slate-400">
                    A Tier 1 automotive supplier experienced frequent unplanned downtime on critical CNC machines. Production stops meant missing customer commitments and scrambling to reschedule labor. Maintenance teams only learned about failures after equipment went offline—costing thousands per hour in lost production.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#217ED9] mb-2">The Solution</h3>
                  <p className="text-slate-400">
                    Last Mile 360 ingested vibration, temperature, and runtime data from 40+ CNC machines across three facilities. Predictive models identified early signs of bearing wear and tool degradation. When anomalies were detected, ServiceNow work orders were created automatically, assigning maintenance tasks before failures occurred.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#10b981] mb-2">The Outcome</h3>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-white">42% reduction</strong> in unplanned downtime within 6 months</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-white">$1.2M annual savings</strong> in production losses and emergency repairs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-white">95% on-time delivery</strong> to customers (up from 78%)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000"
                alt="Manufacturing Floor"
                className="rounded-lg shadow-2xl border border-slate-700 opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare */}
      <section className="py-20 border-b border-slate-800 bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div className="lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#217ED9]/20 rounded-lg flex items-center justify-center">
                  <Hospital className="w-6 h-6 text-[#217ED9]" />
                </div>
                <h2 className="text-3xl font-bold">Healthcare Systems</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-red-400 mb-2">The Problem</h3>
                  <p className="text-slate-400">
                    A 500-bed hospital network struggled with medical device utilization and compliance. High-value imaging equipment sat idle while other units were overbooked. Device maintenance was reactive, leading to unexpected downtime during critical procedures. FDA audit trails were compiled manually, taking weeks of staff time.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#217ED9] mb-2">The Solution</h3>
                  <p className="text-slate-400">
                    Last Mile 360 connected 200+ medical devices across five campuses—imaging systems, infusion pumps, ventilators, and diagnostic equipment. Real-time utilization data informed scheduling and capital planning. Predictive alerts triggered maintenance workflows. All device activity was logged for HIPAA-compliant audit trails.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#10b981] mb-2">The Outcome</h3>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-white">28% increase</strong> in device utilization across the network</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-white">$3.4M avoided</strong> in unnecessary capital equipment purchases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-white">100% audit compliance</strong> with automated documentation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1668600418417-aa0c6ed84e8c?auto=format&fit=crop&q=80&w=1000"
                alt="Hospital Medical Devices"
                className="rounded-lg shadow-2xl border border-slate-700 opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Real Estate */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#217ED9]/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#217ED9]" />
                </div>
                <h2 className="text-3xl font-bold">Commercial Real Estate</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-red-400 mb-2">The Problem</h3>
                  <p className="text-slate-400">
                    A global portfolio manager oversaw 75 office buildings with aging HVAC systems. Energy costs were rising, tenant comfort complaints were increasing, and equipment failures disrupted business operations. Building automation systems existed but weren't connected to maintenance workflows—faults went unnoticed until tenants called.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#217ED9] mb-2">The Solution</h3>
                  <p className="text-slate-400">
                    Last Mile 360 integrated with existing BACnet BMS systems across the portfolio. Real-time monitoring of chillers, boilers, and air handlers identified inefficiencies and predicted failures. ServiceNow tickets were automatically created for building engineers, with severity-based routing. Energy consumption analytics informed capital improvement decisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#10b981] mb-2">The Outcome</h3>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-white">18% reduction</strong> in annual energy costs across the portfolio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-white">63% fewer</strong> tenant comfort complaints within 90 days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-white">50% faster response</strong> to HVAC issues with automated workflows</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000"
                alt="Commercial Building"
                className="rounded-lg shadow-2xl border border-slate-700 opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Logistics & Warehousing */}
      <section className="py-20 bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center reveal">
            <div className="lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#217ED9]/20 rounded-lg flex items-center justify-center">
                  <Warehouse className="w-6 h-6 text-[#217ED9]" />
                </div>
                <h2 className="text-3xl font-bold">Logistics & Warehousing</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-red-400 mb-2">The Problem</h3>
                  <p className="text-slate-400">
                    A national e-commerce fulfillment provider operated 15 automated warehouses with conveyor systems, sortation equipment, and AGVs (automated guided vehicles). Equipment downtime created order fulfillment bottlenecks, missed SLAs, and overtime labor costs. Maintenance was scheduled based on calendar intervals, not actual usage or performance.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#217ED9] mb-2">The Solution</h3>
                  <p className="text-slate-400">
                    Last Mile 360 connected to PLCs and edge devices across all facilities, monitoring conveyor motor health, AGV battery performance, and sortation system throughput. Machine learning models predicted component failures based on usage patterns. Maintenance work orders were created proactively in the company's CMMS, optimizing spare parts inventory and technician schedules.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#10b981] mb-2">The Outcome</h3>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-white">35% reduction</strong> in unplanned equipment downtime</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-white">99.2% SLA achievement</strong> for customer order fulfillment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="text-[#10b981] w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span><strong className="text-white">$850K annual savings</strong> in maintenance and labor costs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1000"
                alt="Warehouse Automation"
                className="rounded-lg shadow-2xl border border-slate-700 opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center reveal">
          <h2 className="text-3xl font-bold mb-6">See How Last Mile Can Transform Your Operations</h2>
          <p className="text-xl text-slate-400 mb-8">
            Every industry has unique challenges. Let's discuss yours.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 rounded-sm bg-[#217ED9] hover:bg-[#1a6bb8] text-white font-semibold transition-all shadow-lg hover:shadow-[#217ED9]/25 uppercase"
          >
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
