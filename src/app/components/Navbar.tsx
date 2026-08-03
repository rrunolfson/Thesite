import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";

const products = [
  ["/infinit-signal", "Infinit-Signal"],
  ["/singularity", "Singularity"],
  ["/infinit-flow", "Infinit-Flow"],
  ["/infinit-control", "Infinit-Control"],
] as const;
const resources = [["/signal-to-action", "Signal 2 Action"], ["/company/newsroom", "News and Updates"]] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();
  const active = (to: string) => location.pathname === to || (to !== "/" && location.pathname.startsWith(`${to}/`));

  useEffect(() => { setMobileOpen(false); setOpenMenu(null); }, [location.pathname]);

  return (
    <nav className="lm-nav" aria-label="Primary navigation" onMouseLeave={() => setOpenMenu(null)}>
      <div className="lm-nav__inner">
        <Link to="/" className="lm-nav__brand"><img src="/logo.png" width="64" height="41" alt="" /><strong><span>Last</span> <span>Mile</span></strong></Link>
        <div className="lm-nav__links">
          <NavLink to="/" label="Home" active={active("/")} />
          <NavLink to="/platform" label="Platform" active={active("/platform")} />
          <Dropdown label="Products" active={products.some(([to]) => active(to))} open={openMenu === "products"} onOpen={() => setOpenMenu("products")} items={products} isActive={active} />
          <Dropdown label="Use Case" active={active("/data-center-cooling")} open={openMenu === "use-case"} onOpen={() => setOpenMenu("use-case")} items={[["/data-center-cooling", "Data Center Cooling"]]} isActive={active} />
          <Dropdown label="Resources" active={resources.some(([to]) => active(to))} open={openMenu === "resources"} onOpen={() => setOpenMenu("resources")} items={resources} isActive={active} />
          <NavLink to="/about" label="About" active={active("/about")} />
        </div>
        <Link to="/contact?intent=operation" className="lm-nav__cta">Discuss Your Operation</Link>
        <button type="button" className="lm-nav__toggle" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)}>{mobileOpen ? <X /> : <Menu />}</button>
        {mobileOpen ? <div className="lm-nav__mobile">
          <NavLink to="/" label="Home" active={active("/")} /><NavLink to="/platform" label="Platform" active={active("/platform")} />
          <strong>Products</strong>{products.map(([to,label]) => <NavLink key={to} to={to} label={label} active={active(to)} />)}
          <strong>Use Case</strong><NavLink to="/data-center-cooling" label="Data Center Cooling" active={active("/data-center-cooling")} />
          <strong>Resources</strong>{resources.map(([to,label]) => <NavLink key={to} to={to} label={label} active={active(to)} />)}
          <NavLink to="/about" label="About" active={active("/about")} /><NavLink to="/contact?intent=operation" label="Discuss Your Operation" active={active("/contact")} />
        </div> : null}
      </div>
    </nav>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) { return <div className="lm-nav__item"><Link to={to} className={active ? "is-active" : ""}>{label}</Link></div>; }
function Dropdown({ label, items, open, onOpen, active, isActive }: { label: string; items: readonly (readonly [string,string])[]; open: boolean; onOpen: () => void; active: boolean; isActive: (to:string)=>boolean }) {
  return <div className="lm-nav__item" onMouseEnter={onOpen}><button type="button" className={active ? "is-active" : ""} aria-expanded={open} onClick={onOpen}>{label}<ChevronDown /></button>{open ? <div className="lm-nav__dropdown">{items.map(([to,item]) => <Link key={to} to={to} className={isActive(to) ? "is-active" : ""}>{item}</Link>)}</div> : null}</div>;
}
