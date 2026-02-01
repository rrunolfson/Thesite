import { FileText, BookOpen, Video, TrendingUp, Factory, Hospital, ArrowRight } from "lucide-react";

const resources = [
  {
    icon: FileText,
    type: "Playbook",
    title: "The OT Intelligence Blueprint",
    description: "A step-by-step guide to connecting operational devices to enterprise systems—from discovery to deployment in 90 days.",
    summary: "Learn how leading manufacturers and healthcare systems deploy predictive maintenance and automated workflows without disrupting operations."
  },
  {
    icon: BookOpen,
    type: "Whitepaper",
    title: "Closing the Data-to-Action Gap",
    description: "Why operational signals never reach execution engines—and how to fix it.",
    summary: "Explore the business case for OT intelligence, including ROI models and implementation frameworks for enterprise leaders."
  },
  {
    icon: Factory,
    type: "Industry Guide",
    title: "Predictive Maintenance for Manufacturing",
    description: "How to reduce unplanned downtime by 40% with machine learning and automated workflows.",
    summary: "Real-world examples from automotive, aerospace, and discrete manufacturing showing proven predictive maintenance strategies."
  },
  {
    icon: Hospital,
    type: "Industry Guide",
    title: "Medical Device Intelligence for Healthcare",
    description: "Ensuring uptime, compliance, and capital efficiency for clinical engineering teams.",
    summary: "Best practices for monitoring medical devices, automating maintenance, and maintaining HIPAA compliance with audit-ready trails."
  },
  {
    icon: TrendingUp,
    type: "Thought Leadership",
    title: "The ROI of Operational Intelligence",
    description: "Quantifying the business impact of predictive analytics and automated workflows.",
    summary: "Financial models demonstrating how OT intelligence platforms deliver measurable ROI through reduced downtime, lower maintenance costs, and improved asset utilization."
  },
  {
    icon: Video,
    type: "Webinar Recording",
    title: "ServiceNow + OT: Better Together",
    description: "How operational data activates your ITSM and ITOM investments.",
    summary: "Watch a live demonstration of ServiceNow integration with industrial and clinical devices, including automated work order creation and predictive alerting."
  },
];

export function ResourcesPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-[#217ED9]">Resources</span> & Insights
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Playbooks, guides, and thought leadership to help you transform your operational intelligence
            </p>
          </div>
        </div>
      </header>

      {/* Resources Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div key={index} className="glass-panel p-8 hover:border-[#217ED9]/50 transition-all duration-300 cursor-pointer reveal group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#217ED9]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#217ED9]/30 transition-colors">
                      <Icon className="w-6 h-6 text-[#217ED9]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-mono text-[#217ED9] uppercase tracking-wider mb-2">
                        {resource.type}
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[#217ED9] transition-colors">
                        {resource.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 mb-4">
                    {resource.description}
                  </p>
                  
                  <div className="border-t border-slate-700 pt-4 mt-4">
                    <p className="text-sm text-slate-500 mb-3">
                      {resource.summary}
                    </p>
                    <button className="text-[#217ED9] hover:text-[#75ADE6] font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                      Download <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-br from-[#217ED9]/20 to-slate-900 border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-4 text-center reveal">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-slate-400 mb-8">
            Get the latest insights on operational intelligence, predictive maintenance, and enterprise automation delivered to your inbox.
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#217ED9]"
            />
            <button className="px-6 py-3 rounded-sm bg-[#217ED9] hover:bg-[#1a6bb8] text-white font-semibold transition-all uppercase">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
