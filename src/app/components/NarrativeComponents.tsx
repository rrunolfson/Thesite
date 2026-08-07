import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, CheckCircle2, CircleDot, RefreshCw } from "lucide-react";
import { Link } from "react-router";
import { products } from "@/app/content/siteContent";
import { CtaLink } from "./MarketingComponents";
import { TrackedLink } from "./TrackedLink";

export function EditorialHero({ eyebrow, title, intro, support, primary, secondary, visual }: {
  eyebrow: string;
  title: string;
  intro: string;
  support?: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
  visual?: ReactNode;
}) {
  return <header className={`lm-v2-hero${visual ? " lm-v2-hero--split" : ""}`}>
    <div className="lm-v2-hero__copy">
      <p className="lm-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="lm-v2-hero__intro">{intro}</p>
      {support ? <p className="lm-v2-hero__support">{support}</p> : null}
      {primary || secondary ? <div className="lm-actions">
        {primary ? <CtaLink to={primary.to}>{primary.label}</CtaLink> : null}
        {secondary ? <CtaLink to={secondary.to} variant="secondary" eventName="cta_explore_platform_click">{secondary.label}</CtaLink> : null}
      </div> : null}
    </div>
    {visual ? <div className="lm-v2-hero__visual">{visual}</div> : null}
  </header>;
}

export function EditorialSection({ eyebrow, title, intro, tone = "white", id, children, className = "" }: {
  eyebrow?: string;
  title: string;
  intro?: string;
  tone?: "white" | "grid" | "dark";
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return <section id={id} className={`lm-v2-section lm-v2-section--${tone} ${className}`}>
    <div className="lm-v2-container">
      <header className="lm-v2-section__head">
        {eyebrow ? <p className="lm-eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {intro ? <p>{intro}</p> : null}
      </header>
      {children}
    </div>
  </section>;
}

export function NextStep({ eyebrow = "Next logical step", title, copy, label, to, secondary }: {
  eyebrow?: string;
  title: string;
  copy: string;
  label: string;
  to: string;
  secondary?: { label: string; to: string };
}) {
  return <section className="lm-v2-next"><div className="lm-v2-container"><div>
    <p className="lm-eyebrow">{eyebrow}</p><h2>{title}</h2><p>{copy}</p>
  </div><div className="lm-actions"><CtaLink to={to}>{label}</CtaLink>{secondary ? <CtaLink to={secondary.to} variant="secondary">{secondary.label}</CtaLink> : null}</div></div></section>;
}

export function StatusPanel({ items }: { items: ReadonlyArray<{ title: string; items: readonly string[] }> }) {
  return <div className="lm-v2-status">{items.map((group, index) => <article key={group.title}>
    <span>{String(index + 1).padStart(2, "0")}</span><h3>{group.title}</h3>
    <ul>{group.items.map((item) => <li key={item}><CircleDot aria-hidden="true" />{item}</li>)}</ul>
  </article>)}</div>;
}

const coolingThread = [
  "Pump command ON; run feedback OFF",
  "Source time, freshness, quality, and equipment identity checked",
  "Pump, Loop B, protected hall, redundancy role, and history resolved",
  "Facilities assigned; escalation, approval, and provider response coordinated",
  "Loop B shown operating on reduced protection",
  "Run state, amperage, differential pressure, and temperature stability evaluated",
  "Recovery verified",
] as const;

export function ProductThread({ expanded = false }: { expanded?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const [activeProduct, setActiveProduct] = useState(0);
  const [threadStep, setThreadStep] = useState(-1);
  const [complete, setComplete] = useState(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const play = useCallback(() => {
    clearTimers();
    setThreadStep(-1);
    setActiveProduct(0);
    setComplete(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setThreadStep(coolingThread.length - 1);
      setActiveProduct(products.length - 1);
      setComplete(true);
      return;
    }
    coolingThread.forEach((_, index) => timersRef.current.push(window.setTimeout(() => {
      setThreadStep(index);
      setActiveProduct(index < 2 ? 0 : index === 2 ? 1 : index < 5 ? 2 : 3);
    }, 420 + index * 920)));
    timersRef.current.push(window.setTimeout(() => setComplete(true), 420 + coolingThread.length * 920));
  }, [clearTimers]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!("IntersectionObserver" in window)) { play(); return clearTimers; }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      play(); observer.disconnect();
    }, { rootMargin: "0px 0px -12%", threshold: .08 });
    observer.observe(root);
    return () => { observer.disconnect(); clearTimers(); };
  }, [clearTimers, play]);

  const selected = products[activeProduct];
  return <div ref={rootRef} className={`lm-product-thread${expanded ? " lm-product-thread--expanded" : ""}${complete ? " is-complete" : ""}`}>
    <div className="lm-product-thread__event"><span>Live operating example</span><strong>Chilled-water pump status mismatch · Cooling Loop B</strong></div>
    <ol className="lm-product-thread__products" aria-label="Four connected Last Mile products">
      {products.map((product, index) => <li key={product.name} className={index === activeProduct ? "is-active" : index < activeProduct || complete ? "is-complete" : ""}>
        <button type="button" onClick={() => setActiveProduct(index)} onFocus={() => setActiveProduct(index)} aria-pressed={index === activeProduct}>
          <span>{product.number}</span><strong>{product.name}</strong><em>{product.shortTitle}</em><p>{product.copy}</p>
        </button>{index < products.length - 1 ? <ArrowRight aria-hidden="true" /> : null}
      </li>)}
    </ol>
    <div className="lm-product-thread__detail" aria-live="polite">
      <div><span>{selected.name}</span><h3>{selected.shortTitle}</h3><p>{selected.responsibility}.</p></div>
      {expanded ? <dl><div><dt>Input</dt><dd>{selected.input}</dd></div><div><dt>Output</dt><dd>{selected.output}</dd></div><div><dt>Does not replace</dt><dd>{selected.doesNotReplace}</dd></div></dl> : null}
      <TrackedLink to={selected.route} eventName="cta_product_click" eventData={{ product: selected.name }}>Explore {selected.name}<ArrowRight aria-hidden="true" /></TrackedLink>
    </div>
    <ol className="lm-product-thread__timeline" aria-label="Cooling response progression">
      {coolingThread.map((item, index) => <li key={item} className={index <= threadStep ? "is-active" : ""}><i aria-hidden="true" /><span>{item}</span></li>)}
    </ol>
    <div className="lm-product-thread__result" aria-live="polite"><CheckCircle2 aria-hidden="true" /><span>{complete ? "Recovery verified" : threadStep < 0 ? "Awaiting source evidence" : coolingThread[threadStep]}</span></div>
    <button type="button" className="lm-product-thread__replay" onClick={play}><RefreshCw aria-hidden="true" />Replay response</button>
  </div>;
}

export function BlueprintCard({ title, eyebrow, children }: { title: string; eyebrow?: string; children: ReactNode }) {
  return <article className="lm-v2-blueprint-card">{eyebrow ? <span>{eyebrow}</span> : null}<h3>{title}</h3>{children}</article>;
}

export function InlineLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link className="lm-v2-inline-link" to={to}>{children}<ArrowRight aria-hidden="true" /></Link>;
}
