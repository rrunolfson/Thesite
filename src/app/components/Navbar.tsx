import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, ChevronDown } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  submenu?: Array<{
    to: string;
    label: string;
  }>;
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  const navItems: NavItem[] = [
    { to: "/", label: "Home" },
    { to: "/integrations", label: "Our Integrations" },
    {
      to: "/solutions",
      label: "Solutions",
      submenu: [
        { to: "/solutions", label: "Platform" },
        { to: "/use-cases", label: "Use Cases" },
        { to: "/customers", label: "Customers" },
        { to: "/resources", label: "Resources" },
      ],
    },
    { to: "/industries", label: "Industries" },
    {
      to: "/partners",
      label: "Partners",
      submenu: [
        { to: "/partners", label: "Partner Overview" },
        { to: "/partners/delivery", label: "Delivery Partners" },
        { to: "/partners/oem", label: "OEM Partners" },
        { to: "/oem-portal", label: "OEM Portal" },
      ],
    },
    { to: "/signal-2-action", label: "Signal 2 Action" },
    {
      to: "/company",
      label: "Company",
      submenu: [
        { to: "/company", label: "Company" },
        { to: "/about", label: "About" },
        { to: "/careers", label: "Careers" },
      ],
    },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (item: NavItem) =>
    location.pathname === item.to ||
    (item.to !== "/" && location.pathname.startsWith(`${item.to}/`)) ||
    item.submenu?.some(
      (subItem) =>
        location.pathname === subItem.to || location.pathname.startsWith(`${subItem.to}/`),
    );

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
                  key={link.to}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(link.to)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      isActive(link)
                        ? "text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                    aria-expanded={openDropdown === link.to}
                    aria-haspopup="menu"
                  >
                    {link.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {openDropdown === link.to && (
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
                    isActive(link)
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
            {navItems.map((link) => (
              link.submenu ? (
                <div key={link.to}>
                  <div className="px-3 py-2 text-base font-medium text-white">
                    <Link to={link.to} onClick={() => setMobileMenuOpen(false)}>
                      {link.label}
                    </Link>
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