import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { to: "/", label: "Home" },
    { to: "/integrations", label: "Our Integrations" },
    { to: "/signal-2-action", label: "Signal 2 Action" },
    { to: "/company", label: "Company" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (item: NavItem) =>
    location.pathname === item.to ||
    (item.to !== "/" && location.pathname.startsWith(`${item.to}/`));

  return (
    <nav className="fixed w-full z-50 glass-panel border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
            <img src="/logo.png" alt="Last Mile" className="h-6 w-auto rounded-md" />
            <span className="font-bold text-2xl tracking-tight text-white uppercase">
              Last <span className="text-[#217ED9]">Mile</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link)
                    ? "text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://store.servicenow.com/store/app/f36920a7975043d06878bd3de053af39"
              target="_blank"
              rel="noreferrer"
              className="ml-2 flex-shrink-0"
              aria-label="View Last Mile's ServiceNow partner build listing"
            >
              <img
                src="/servicenow-partner-build-badge.png"
                alt="ServiceNow Partner Build badge"
                className="h-20 w-auto object-contain"
              />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}