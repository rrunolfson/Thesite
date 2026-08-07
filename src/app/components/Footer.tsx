import { Linkedin } from "lucide-react";
import { Link } from "react-router";

const products = [["/infinit-signal","Infinit-Signal"],["/singularity","Singularity"],["/infinit-flow","Infinit-Flow"],["/infinit-control","Infinit-Control"]] as const;
const company = [["/about","About"],["/company/newsroom","News and Updates"],["/contact","Contact"]] as const;
const resources = [["/platform","Platform"],["/data-center-cooling","Data Center Cooling"],["/ecosystem","Ecosystem"],["/resources","Resources"],["/signal-to-action","Signal 2 Action"]] as const;

export function Footer() {
  return <footer className="lm-footer">
    <div className="lm-footer__grid">
      <div className="lm-footer__identity"><Link to="/" className="lm-footer__brand"><img src="/logo.png" width="64" height="41" alt="" /><strong><span>Last</span> <span>Mile</span></strong></Link><p>Keep the response connected across the systems you already run—and use live operating data to establish the result.</p><a href="https://www.linkedin.com/company/lastmile-inc/" target="_blank" rel="noreferrer" aria-label="Last Mile on LinkedIn"><Linkedin /></a></div>
      <FooterGroup title="Products" links={products} /><FooterGroup title="Company" links={company} /><FooterGroup title="Explore" links={resources} />
    </div>
    <div className="lm-footer__legal"><span>© 2026 Last Mile Inc.</span><span><Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link></span></div>
  </footer>;
}
function FooterGroup({title,links}:{title:string;links:readonly (readonly [string,string])[]}) { return <div className="lm-footer__group"><span>{title}</span>{links.map(([to,label])=><Link key={to} to={to}>{label}</Link>)}</div>; }
