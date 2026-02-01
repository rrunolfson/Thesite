import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, ChevronDown } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [partnerDropdownOpen, setPartnerDropdownOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/industries", label: "Industries" },
    { to: "/partners", label: "Partners" },
    { to: "/company", label: "Company" },
    { to: "/contact", label: "Contact" },
  ];

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
            {navItems.map((link, index) => (
              link.submenu ? (
                <div 
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setPartnerDropdownOpen(true)}
                  onMouseLeave={() => setPartnerDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    {link.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {partnerDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 glass-panel border border-slate-700/50 rounded shadow-lg">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.to}
                          to={sublink.to}
                          className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-[#217ED9]/10 transition-colors first:rounded-t last:rounded-b"
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
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
            {navItems.map((link, index) => (
              link.submenu ? (
                <div key={index}>
                  <div className="px-3 py-2 text-base font-medium text-slate-300">
                    {link.label}
                  </div>
                  <div className="ml-4 space-y-1">
                    {link.submenu.map((sublink) => (
                      <Link
                        key={sublink.to}
                        to={sublink.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-slate-400 hover:text-white"
                      >
                        {sublink.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}