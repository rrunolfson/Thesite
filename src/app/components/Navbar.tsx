import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

interface NavItem {
  to: string;
  label: string;
}

const productItems: NavItem[] = [
  { to: "/infinit-signal", label: "Infinit-Signal" },
  { to: "/infinit-control", label: "Infinit-Control" },
  { to: "/infinit-flow", label: "Infinit-Flow" },
];

const resourceItems: NavItem[] = [
  { to: "/signal-to-action", label: "Signal 2 Action" },
  { to: "/integrations", label: "ServiceNow Integration Library" },
  { to: "/company/newsroom", label: "News and Updates" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (item: NavItem) =>
    location.pathname === item.to ||
    (item.to !== "/" && location.pathname.startsWith(`${item.to}/`));

  const isProductsActive = productItems.some((item) => isActive(item));
  const isResourcesActive = resourceItems.some((item) => isActive(item));

  return (
    <nav className="site-navbar fixed w-full z-[100] overflow-visible glass-panel border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
            <img src="/logo.png" alt="Last Mile" className="h-6 w-auto rounded-md" />
            <span className="font-bold text-2xl tracking-tight text-white uppercase">
              Last <span className="text-[#217ED9]">Mile</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === "/" ? "text-white" : "text-slate-300 hover:text-white"}`}>
              Home
            </Link>
            <Link to="/platform" className={`text-sm font-medium transition-colors ${location.pathname === "/platform" ? "text-white" : "text-slate-300 hover:text-white"}`}>
              Platform
            </Link>
            <Dropdown label="Products" active={isProductsActive} items={productItems} />
            <Dropdown label="Resources" active={isResourcesActive} items={resourceItems} />
            <Link to="/about" className={`text-sm font-medium transition-colors ${location.pathname === "/about" ? "text-white" : "text-slate-300 hover:text-white"}`}>
              About
            </Link>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-11 min-w-11 text-slate-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute z-[110] w-full border-b border-slate-800 bg-slate-900">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <MobileLink to="/" label="Home" onClick={() => setMobileMenuOpen(false)} />
            <MobileLink to="/platform" label="Platform" onClick={() => setMobileMenuOpen(false)} />
            <MobileGroup label="Products" items={productItems} onClick={() => setMobileMenuOpen(false)} />
            <MobileGroup label="Resources" items={resourceItems} onClick={() => setMobileMenuOpen(false)} />
            <MobileLink to="/about" label="About" onClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}

function Dropdown({ label, active, items }: { label: string; active: boolean; items: NavItem[] }) {
  return (
    <div className="relative z-[110] group">
      <button type="button" className={`text-sm font-medium transition-colors ${active ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
        {label}
      </button>
      <div className="nav-dropdown-panel pointer-events-none absolute left-0 top-full z-[120] pt-4 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="min-w-[250px] rounded-xl border border-cyan-400/25 bg-[#071426]/98 p-3 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
          {items.map((item) => (
            <Link key={item.to} to={item.to} className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-900 hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileGroup({ label, items, onClick }: { label: string; items: NavItem[]; onClick: () => void }) {
  return (
    <>
      <div className="px-3 pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      {items.map((link) => (
        <Link key={link.to} to={link.to} onClick={onClick} className="flex min-h-11 items-center px-3 py-2 text-base font-medium text-slate-300 hover:text-white">
          {link.label}
        </Link>
      ))}
    </>
  );
}

function MobileLink({ to, label, onClick }: NavItem & { onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="flex min-h-11 items-center px-3 py-2 text-base font-medium text-slate-300 hover:text-white">
      {label}
    </Link>
  );
}
