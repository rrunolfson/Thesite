import { Link } from "react-router";
import { Linkedin } from "lucide-react";

const footerNavItems = [
  { to: "/", label: "Home" },
  { to: "/integrations", label: "Our Integrations" },
  { to: "/signal-2-action", label: "Signal 2 Action" },
  { to: "/company", label: "Company" },
  { to: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-[#0b1120] border-t border-slate-800 pt-8 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
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
              <p className="text-slate-600 text-sm whitespace-nowrap">
                © 2026 Last Mile Inc. All rights reserved.
              </p>
            </div>
          </div>

          <div>
            <ul className="space-y-3 text-sm text-slate-400 text-left md:text-right">
              {footerNavItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-[#217ED9] transition-colors">
                    {item.label}
                  </Link>
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