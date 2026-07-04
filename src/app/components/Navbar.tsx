import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { TrackedLink } from "@/app/components/TrackedLink";

interface NavItem {
  to: string;
  label: string;
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { to: "/platform", label: "Platform" },
    { to: "/ssom", label: "SSOM" },
    { to: "/signal-to-action", label: "Signal 2 Action" },
    { to: "/about", label: "About" },
  ];

  const productItems: NavItem[] = [
    { to: "/infinit-signal", label: "Infinit-Signal" },
    { to: "/infinit-flow", label: "Infinit-Flow" },
    { to: "/infinit-control", label: "Infinit-Control" },
  ];

  const isActive = (item: NavItem) =>
    location.pathname === item.to ||
    (item.to !== "/" && location.pathname.startsWith(`${item.to}/`));

  const isProductsActive = productItems.some((item) => isActive(item));

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
            <div className="relative group">
              <button
                type="button"
                className={`text-sm font-medium transition-colors ${
                  isProductsActive ? "text-white" : "text-slate-300 group-hover:text-white"
                }`}
              >
                Products
              </button>
              <div className="pointer-events-none absolute left-0 top-full pt-4 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                <div className="min-w-[220px] rounded-xl border border-slate-700 bg-slate-950/95 p-3 shadow-2xl">
                  {productItems.map((item) => (
                    <TrackedLink
                      key={item.to}
                      to={item.to}
                      eventName="cta_product_click"
                      eventData={{ product: item.label }}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
                    >
                      {item.label}
                    </TrackedLink>
                  ))}
                </div>
              </div>
            </div>
            <TrackedLink
              to="/design-partner"
              eventName="cta_design_partner_click"
              className="ml-2 inline-flex items-center rounded-sm border-2 border-[#217ED9] bg-[#0a1929]/80 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0a1929]"
            >
              Request a design-partner conversation
            </TrackedLink>
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
            <div className="px-3 pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Products
            </div>
            {productItems.map((link) => (
              <TrackedLink
                key={link.to}
                to={link.to}
                eventName="cta_product_click"
                eventData={{ product: link.label }}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white"
              >
                {link.label}
              </TrackedLink>
            ))}
            <TrackedLink
              to="/design-partner"
              eventName="cta_design_partner_click"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 block rounded-sm border border-[#217ED9] px-3 py-2 text-base font-semibold text-white"
            >
              Request a design-partner conversation
            </TrackedLink>
          </div>
        </div>
      )}
    </nav>
  );
}