import { OEMForm } from "@/app/components/OEMForm";

export function OEMPortalPage() {
  return (
    <div className="pt-20 relative min-h-screen">
      <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 reveal">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white from-30% to-[#217ED9] bg-clip-text text-transparent">
                OEM Technical Data
              </h1>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Please share the specifics of your technology with us or your interest in becoming a Last Mile technology collaboration partner.
              </p>
            </div>
          </div>
        </section>

        {/* OEM Form */}
        <section className="py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel p-10 reveal">
              <OEMForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}