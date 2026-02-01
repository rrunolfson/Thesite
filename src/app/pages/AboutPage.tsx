import { Target, Users, Award, TrendingUp, Mail, MapPin, Linkedin } from "lucide-react";
import { Link } from "react-router";

export function AboutPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="text-[#217ED9]">Last Mile</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              We connect operational data to enterprise action—so businesses can move from reactive to proactive
            </p>
          </div>
        </div>
      </header>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-12 mb-16 reveal">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-16 h-16 bg-[#217ED9]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-8 h-8 text-[#217ED9]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-xl text-slate-400 mb-6">
                  Operational systems generate billions of signals every day—temperature readings, vibration patterns, runtime data, utilization metrics. But those signals rarely reach the teams that need to act on them. The gap between data and execution costs enterprises millions in downtime, inefficiency, and missed opportunities.
                </p>
                <p className="text-xl text-slate-400">
                  Last Mile exists to close that gap. We connect operational devices to enterprise systems, transform signals into intelligence, and trigger workflows automatically. Our platform helps manufacturers, healthcare systems, and facility operators move from reactive firefighting to proactive execution.
                </p>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="glass-panel p-12 mb-16 reveal">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-16 h-16 bg-[#217ED9]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-[#217ED9]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-xl text-slate-400 mb-6">
                  We envision a world where operational intelligence is as fundamental to business success as financial intelligence. Where equipment failures are predicted and prevented. Where maintenance teams act on data, not guesswork. Where compliance is automatic, not painful.
                </p>
                <p className="text-xl text-slate-400">
                  The enterprises that thrive in the next decade won't be the ones with the most data—they'll be the ones that turn data into action fastest. Last Mile is building the infrastructure to make that possible.
                </p>
              </div>
            </div>
          </div>

          {/* What Sets Us Apart */}
          <div className="mb-20 reveal">
            <h2 className="text-3xl font-bold mb-12 text-center">What Sets Us Apart</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass-panel p-8">
                <div className="w-12 h-12 bg-[#217ED9]/20 rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-[#217ED9]" />
                </div>
                <h3 className="text-xl font-bold mb-4">OT-First Approach</h3>
                <p className="text-slate-400">
                  We're not an IT platform adapted for OT. We're built from the ground up for industrial and clinical environments.
                </p>
              </div>

              <div className="glass-panel p-8">
                <div className="w-12 h-12 bg-[#217ED9]/20 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-[#217ED9]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Enterprise Expertise</h3>
                <p className="text-slate-400">
                  Our team has deployed operational technology solutions for Fortune 500 companies across manufacturing, healthcare, and facilities.
                </p>
              </div>

              <div className="glass-panel p-8">
                <div className="w-12 h-12 bg-[#217ED9]/20 rounded-lg flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-[#217ED9]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Proven Outcomes</h3>
                <p className="text-slate-400">
                  Our customers see measurable ROI within 90 days—not 12 months. We deliver results, not promises.
                </p>
              </div>

              <div className="glass-panel p-8">
                <div className="w-12 h-12 bg-[#217ED9]/20 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-[#217ED9]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Outcome-Focused</h3>
                <p className="text-slate-400">
                  We don't sell dashboards. We deliver reduced downtime, lower costs, and improved efficiency.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="glass-panel p-12 reveal">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-[#217ED9] mb-3">Outcomes Over Activity</h3>
                <p className="text-slate-400">
                  We measure success by customer results, not features shipped. If it doesn't drive measurable business impact, we don't build it.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#217ED9] mb-3">Clarity Over Complexity</h3>
                <p className="text-slate-400">
                  Enterprise technology is complicated enough. We communicate clearly, design simply, and deliver solutions that people actually use.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#217ED9] mb-3">Partnership Over Transactions</h3>
                <p className="text-slate-400">
                  We're not here for one-time deals. We succeed when our customers succeed—and we build relationships accordingly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-[#0b1120] border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center reveal">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 reveal">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-[#217ED9]" />
                <h3 className="text-xl font-bold">Email Us</h3>
              </div>
              <p className="text-slate-400 mb-2">General Inquiries:</p>
              <a href="mailto:info@lastmileinc.ai" className="text-[#217ED9] hover:text-[#75ADE6] font-medium">
                info@lastmileinc.ai
              </a>
              <p className="text-slate-400 mt-4 mb-2">Partnership Opportunities:</p>
              <a href="mailto:partners@lastmileinc.ai" className="text-[#217ED9] hover:text-[#75ADE6] font-medium">
                partners@lastmileinc.ai
              </a>
            </div>

            <div className="glass-panel p-8 reveal">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-[#217ED9]" />
                <h3 className="text-xl font-bold">Headquarters</h3>
              </div>
              <p className="text-slate-400">
                Last Mile Inc.<br />
                Enterprise Operations Division<br />
                United States
              </p>
              <div className="mt-6">
                <a href="https://linkedin.com/company/lastmileinc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#217ED9] hover:text-[#75ADE6] font-medium">
                  <Linkedin className="w-5 h-5" />
                  Follow us on LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 reveal">
            <Link
              to="/contact"
              className="inline-block px-8 py-4 rounded-sm bg-[#217ED9] hover:bg-[#1a6bb8] text-white font-semibold transition-all shadow-lg hover:shadow-[#217ED9]/25 uppercase"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
