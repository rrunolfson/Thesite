import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router";
import { SEO } from "@/app/components/SEO";

export function NotFound() {
  return <><SEO title="404 | Page Not Found" description="The requested Last Mile page does not exist or has moved." canonicalPath="/404" robots="noindex, follow" />
    <section className="lm-not-found"><div><span>404</span><p className="lm-eyebrow">Route not found</p><h1>This path does not connect to an active page.</h1><p>Return to the Physical Operations Platform or go back to the previous page.</p><div className="lm-actions"><Link to="/" className="lm-button lm-button--primary"><Home />Go Home</Link><button type="button" className="lm-button lm-button--secondary" onClick={() => window.history.back()}><ArrowLeft />Go Back</button></div></div></section>
  </>;
}
