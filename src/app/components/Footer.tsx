import { Link } from "react-router";
import { Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0b1120] border-t border-slate-800 pt-8 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          <div className="col-span-1 md:col-span-3 flex flex-col justify-center">
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
                <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#217ED9] transition-colors cursor-default">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
              <p className="text-slate-600 text-sm whitespace-nowrap">
                © 2026 Last Mile Inc. All rights reserved.
              </p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider text-center">
              Industries&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </h4>
            <div className="flex gap-8 justify-center">
              <ul className="space-y-3 text-sm text-slate-400 text-right">
                <li>
                  <Link to="/industries" className="hover:text-[#217ED9] transition-colors">
                    Retail & Grocery
                  </Link>
                </li>
                <li>
                  <Link to="/industries" className="hover:text-[#217ED9] transition-colors">
                    Manufacturing
                  </Link>
                </li>
                <li>
                  <Link to="/industries" className="hover:text-[#217ED9] transition-colors">
                    Energy & Utilities
                  </Link>
                </li>
                <li>
                  <Link to="/industries" className="hover:text-[#217ED9] transition-colors">
                    Healthcare & Labs
                  </Link>
                </li>
              </ul>
              <ul className="space-y-3 text-sm text-slate-400 text-left">
                <li>
                  <Link to="/industries" className="hover:text-[#217ED9] transition-colors">
                    Logistics & Transport
                  </Link>
                </li>
                <li>
                  <Link to="/industries" className="hover:text-[#217ED9] transition-colors">
                    Building Management
                  </Link>
                </li>
                <li>
                  <Link to="/industries" className="hover:text-[#217ED9] transition-colors">
                    Warehouse Management
                  </Link>
                </li>
                <li>
                  <Link to="/industries" className="hover:text-[#217ED9] transition-colors">
                    Oil & Gas
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider">
              Partners
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/partners#delivery" className="hover:text-[#217ED9] transition-colors">
                  Delivery Partners
                </Link>
              </li>
              <li>
                <Link to="/partners#oem" className="hover:text-[#217ED9] transition-colors">
                  OEM Partners
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-wider">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link to="/company" className="hover:text-[#217ED9] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="https://lastmileinc.ai/careers/" className="hover:text-[#217ED9] transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#217ED9] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-8"></div>
    </footer>
  );
}