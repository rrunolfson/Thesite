import { TrackedLink } from "@/app/components/TrackedLink";
import { Linkedin } from "lucide-react";

const platformLinks = [
  { to: "/platform", label: "Platform Overview", eventName: "cta_explore_platform_click" as const },
  { to: "/infinit-signal", label: "Infinit-Signal", eventName: "cta_product_click" as const },
  { to: "/infinit-flow", label: "Infinit-Flow", eventName: "cta_product_click" as const },
  { to: "/infinit-control", label: "Infinit-Control", eventName: "cta_product_click" as const },
  { to: "/ssom", label: "SSOM", eventName: "cta_ssom_click" as const },
];

const companyLinks = [
  { to: "/about", label: "About Last Mile", eventName: "cta_explore_platform_click" as const },
  { to: "/signal-to-action", label: "Signal 2 Action", eventName: "cta_podcast_click" as const },
  { to: "/design-partner", label: "Request a design-partner conversation", eventName: "cta_design_partner_click" as const },
];

const referenceLinks = [
  { to: "/integrations", label: "Existing ServiceNow Integrations", eventName: "cta_explore_platform_click" as const },
  { to: "/company/newsroom", label: "News and Updates", eventName: "cta_explore_platform_click" as const },
];

export function Footer() {
  return (
    <footer className="bg-[#0b1120] border-t border-slate-800 pt-8 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:items-start">
          <div className="flex flex-col justify-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Last Mile" className="h-6 w-auto rounded-md" />
                <span className="font-bold text-2xl tracking-tight text-white uppercase">
                  Last <span className="text-[#217ED9]">Mile</span>
                </span>
              </div>
              <div className="flex space-x-4 text-slate-600 justify-start mb-3">
                <a href="https://www.linkedin.com/company/lastmile-inc/" target="_blank" rel="noopener noreferrer" className="hover:text-[#217ED9] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <p className="text-slate-400 text-sm mb-3">
                Operational intelligence that reaches action.
              </p>
              <p className="text-slate-600 text-sm whitespace-nowrap">
                © 2026 Last Mile Inc. All rights reserved.
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 text-left md:text-right mb-3">
              Platform
            </p>
            <ul className="space-y-3 text-sm text-slate-400 text-left md:text-right">
              {platformLinks.map((item) => (
                <li key={item.to}>
                  <TrackedLink to={item.to} eventName={item.eventName} eventData={{ product: item.label }} className="hover:text-[#217ED9] transition-colors">
                    {item.label}
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 text-left md:text-right mb-3">
              Company
            </p>
            <ul className="space-y-3 text-sm text-slate-400 text-left md:text-right">
              {companyLinks.map((item) => (
                <li key={item.to}>
                  <TrackedLink to={item.to} eventName={item.eventName} className="hover:text-[#217ED9] transition-colors">
                    {item.label}
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 text-left md:text-right mb-3">
              Reference
            </p>
            <ul className="space-y-3 text-sm text-slate-400 text-left md:text-right">
              {referenceLinks.map((item) => (
                <li key={item.to}>
                  <TrackedLink to={item.to} eventName={item.eventName} className="hover:text-[#217ED9] transition-colors">
                    {item.label}
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-8"></div>
    </footer>
  );
}
