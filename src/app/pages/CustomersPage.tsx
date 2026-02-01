import { Quote, TrendingUp, Award, CheckCircle2, Factory, Hospital, Building2 } from "lucide-react";
import { Link } from "react-router";

export function CustomersPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Customer <span className="text-[#217ED9]">Success Stories</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Real customers. Real challenges. Real results.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 reveal">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#217ED9] mb-2">42%</div>
              <div className="text-slate-400">Average reduction in unplanned downtime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#217ED9] mb-2">$2.8M</div>
              <div className="text-slate-400">Average annual savings per customer</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#217ED9] mb-2">90 Days</div>
              <div className="text-slate-400">Average time to measurable ROI</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#217ED9] mb-2">98%</div>
              <div className="text-slate-400">Customer satisfaction rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center reveal">Featured Success Stories</h2>

          {/* Story 1: Manufacturing */}
          <div className="glass-panel p-10 mb-12 reveal">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-14 h-14 bg-[#217ED9]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Factory className="w-7 h-7 text-[#217ED9]" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Global Automotive Tier 1 Supplier</h3>
                    <p className="text-slate-500">Manufacturing | 4,500 Employees | 12 Facilities</p>
                  </div>
                  <Quote className="w-8 h-8 text-[#217ED9]/30" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-red-400 mb-2">The Challenge</h4>
                    <p className="text-slate-400">
                      Frequent unplanned downtime on CNC machines and robotic welding cells was costing $18K per hour in lost production. Maintenance was reactive—technicians only learned about issues after equipment failed. Parts inventory was excessive because they couldn't predict which components would fail next.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[#217ED9] mb-2">The Solution</h4>
                    <p className="text-slate-400">
                      Deployed Last Mile 360 across 200+ pieces of production equipment in three pilot facilities. Vibration sensors, temperature monitors, and runtime data fed predictive models that identified early failure indicators. ServiceNow work orders were created automatically when anomalies exceeded thresholds.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[#10b981] mb-3">The Results</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-slate-800/30 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                          <span className="text-2xl font-bold text-white">42%</span>
                        </div>
                        <p className="text-slate-400">Reduction in unplanned downtime within 6 months</p>
                      </div>
                      <div className="bg-slate-800/30 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                          <span className="text-2xl font-bold text-white">$1.2M</span>
                        </div>
                        <p className="text-slate-400">Annual savings in emergency repairs and lost production</p>
                      </div>
                      <div className="bg-slate-800/30 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                          <span className="text-2xl font-bold text-white">28%</span>
                        </div>
                        <p className="text-slate-400">Reduction in spare parts inventory costs</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-[#217ED9] pl-6 py-2 mt-6">
                    <p className="text-lg text-slate-300 italic">
                      "Last Mile gave us visibility we never had before. We're catching problems weeks before they impact production. Our maintenance team went from firefighting to strategic planning."
                    </p>
                    <p className="text-sm text-slate-500 mt-2">— VP of Operations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story 2: Healthcare */}
          <div className="glass-panel p-10 mb-12 reveal">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-14 h-14 bg-[#217ED9]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Hospital className="w-7 h-7 text-[#217ED9]" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Regional Health System</h3>
                    <p className="text-slate-500">Healthcare | 500 Beds | 5 Campuses</p>
                  </div>
                  <Quote className="w-8 h-8 text-[#217ED9]/30" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-red-400 mb-2">The Challenge</h4>
                    <p className="text-slate-400">
                      Medical equipment was underutilized—some MRI machines sat idle while others were overbooked. Device failures during procedures created patient safety concerns. Manual tracking of device maintenance and compliance consumed hundreds of clinical engineering hours annually. FDA audits required weeks of data compilation.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[#217ED9] mb-2">The Solution</h4>
                    <p className="text-slate-400">
                      Integrated Last Mile with 200+ medical devices including imaging systems, infusion pumps, ventilators, and patient monitors. Real-time utilization data informed scheduling and transfer decisions. Predictive alerts triggered preventive maintenance. All device interactions were logged for HIPAA-compliant audit trails.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[#10b981] mb-3">The Results</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-slate-800/30 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                          <span className="text-2xl font-bold text-white">28%</span>
                        </div>
                        <p className="text-slate-400">Increase in medical device utilization across network</p>
                      </div>
                      <div className="bg-slate-800/30 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                          <span className="text-2xl font-bold text-white">$3.4M</span>
                        </div>
                        <p className="text-slate-400">Avoided in unnecessary capital equipment purchases</p>
                      </div>
                      <div className="bg-slate-800/30 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                          <span className="text-2xl font-bold text-white">90%</span>
                        </div>
                        <p className="text-slate-400">Reduction in audit preparation time with automated trails</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-[#217ED9] pl-6 py-2 mt-6">
                    <p className="text-lg text-slate-300 italic">
                      "Last Mile transformed how we manage our medical device fleet. We've avoided millions in capital spending while improving patient access to critical equipment."
                    </p>
                    <p className="text-sm text-slate-500 mt-2">— Director of Clinical Engineering</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story 3: Real Estate */}
          <div className="glass-panel p-10 mb-12 reveal">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-14 h-14 bg-[#217ED9]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-7 h-7 text-[#217ED9]" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Commercial Real Estate Portfolio</h3>
                    <p className="text-slate-500">Real Estate | 75 Buildings | 8M Sq Ft</p>
                  </div>
                  <Quote className="w-8 h-8 text-[#217ED9]/30" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-red-400 mb-2">The Challenge</h4>
                    <p className="text-slate-400">
                      Aging HVAC systems across the portfolio were driving tenant complaints and energy waste. Building engineers spent their days responding to comfort issues instead of preventive maintenance. Energy costs were 22% above industry benchmarks. Building automation systems generated alerts that nobody saw until tenants called.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[#217ED9] mb-2">The Solution</h4>
                    <p className="text-slate-400">
                      Connected Last Mile to existing BACnet BMS systems across 75 properties. Real-time analytics identified equipment inefficiencies and predicted failures days before impact. ServiceNow work orders routed to building engineers automatically. Energy consumption dashboards informed capital planning decisions.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[#10b981] mb-3">The Results</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-slate-800/30 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                          <span className="text-2xl font-bold text-white">18%</span>
                        </div>
                        <p className="text-slate-400">Reduction in annual energy costs across portfolio</p>
                      </div>
                      <div className="bg-slate-800/30 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                          <span className="text-2xl font-bold text-white">63%</span>
                        </div>
                        <p className="text-slate-400">Decrease in tenant comfort complaints within 90 days</p>
                      </div>
                      <div className="bg-slate-800/30 p-4 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                          <span className="text-2xl font-bold text-white">50%</span>
                        </div>
                        <p className="text-slate-400">Faster response time to HVAC issues with automation</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-[#217ED9] pl-6 py-2 mt-6">
                    <p className="text-lg text-slate-300 italic">
                      "The ROI was obvious within the first quarter. Lower energy bills, happier tenants, and our engineers actually have time for strategic work."
                    </p>
                    <p className="text-sm text-slate-500 mt-2">— Portfolio Director of Engineering</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#217ED9]/20 to-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center reveal">
          <h2 className="text-3xl font-bold mb-6">Ready to Write Your Success Story?</h2>
          <p className="text-xl text-slate-400 mb-8">
            Join the growing number of enterprises transforming their operations with Last Mile 360.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 rounded-sm bg-[#217ED9] hover:bg-[#1a6bb8] text-white font-semibold transition-all shadow-lg hover:shadow-[#217ED9]/25 uppercase"
          >
            Request a Demo
          </Link>
        </div>
      </section>
    </div>
  );
}
