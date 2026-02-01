import { ContactForm } from "@/app/components/ContactForm";

export function ContactPage() {
  return (
    <div className="pt-20 relative min-h-screen">
      <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 reveal">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white from-30% to-[#217ED9] bg-clip-text text-transparent">
                Let's Talk About Your Operational Reality
              </h1>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                If you operate physical assets, deliver ServiceNow value, or build systems that generate data at scale — let's connect.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="pb-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel p-10 reveal">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Additional Contact Info */}
        <section className="py-20 bg-[#0b1120] border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 reveal">
              <div className="glass-panel p-8 text-center">
                <h3 className="text-xl font-bold mb-3">Enterprise Customers</h3>
                <p className="text-slate-400 mb-4">
                  Discuss how Last Mile can transform your operational workflows.
                </p>
                <a 
                  href="mailto:enterprise@lastmileinc.ai" 
                  className="text-[#217ED9] hover:text-[#75ADE6] font-semibold"
                >
                  contact@lastmileinc.ai
                </a>
              </div>

              <div className="glass-panel p-8 text-center">
                <h3 className="text-xl font-bold mb-3">Partners</h3>
                <p className="text-slate-400 mb-4">
                  Explore partnership opportunities and ecosystem collaboration.
                </p>
                <a 
                  href="mailto:partners@lastmileinc.ai" 
                  className="text-[#217ED9] hover:text-[#75ADE6] font-semibold"
                >
                  partners@lastmileinc.ai
                </a>
              </div>

              <div className="glass-panel p-8 text-center">
                <h3 className="text-xl font-bold mb-3">OEMs</h3>
                <p className="text-slate-400 mb-4">
                  Learn how Last Mile can provide performance insights for your equipment.
                </p>
                <a 
                  href="mailto:oems@lastmileinc.ai" 
                  className="text-[#217ED9] hover:text-[#75ADE6] font-semibold"
                >
                  partners@lastmileinc.ai
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}