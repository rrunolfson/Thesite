import { useEffect, useRef, useState } from "react";
import { Activity, Bot, Building2, Check, Cloud, Eye, GitBranch, LockKeyhole, Network, RefreshCcw, ShieldCheck, X } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import { ProductPageLayout } from "@/app/components/ProductPageLayout";
import { TrackedLink } from "@/app/components/TrackedLink";
import { createBreadcrumbSchema } from "@/app/lib/structuredData";

const platformHotspots = [
  {
    id: "platform",
    title: "Last Mile Platform",
    description:
      "The Last Mile Platform is the cloud-native, AI-native foundation for operational intelligence. It connects operational source systems to the products, workflows, views, automation, and operating history needed to optimize physical operations.",
    bullets: [
      "Built for 24x7 operational data ingestion",
      "Supports Infinit-Signal, Infinit-Control, Infinit-Flow, and Singularity",
      "Turns source data into action, evidence, and continuous improvement",
    ],
    to: "/platform",
    label: "Learn about Last Mile Platform",
    position: { x: "11%", y: "8%", width: "78%", height: "42%" },
  },
  {
    id: "signal",
    title: "Infinit-Signal",
    description:
      "Infinit-Signal connects to source systems, ingests operational data, normalizes it, preserves quality and source context, and injects usable operational information into Singularity.",
    bullets: ["Connects operational source systems", "Preserves quality, freshness, and source context", "Feeds the shared operational record"],
    to: "/infinit-signal",
    label: "Learn about Infinit-Signal",
    position: { x: "17%", y: "17%", width: "20%", height: "25%" },
  },
  {
    id: "control",
    title: "Infinit-Control",
    description:
      "Infinit-Control gives customers a user-defined single pane of glass for their operating estate. It draws from Singularity to surface widgets, alerts, assets, work, trends, source health, evidence, and operational state.",
    bullets: ["Creates customer-defined operational views", "Reduces hunting across systems", "Surfaces alerts, work, assets, evidence, and system health"],
    to: "/infinit-control",
    label: "Learn about Infinit-Control",
    position: { x: "40%", y: "17%", width: "20%", height: "25%" },
  },
  {
    id: "flow",
    title: "Infinit-Flow",
    description:
      "Infinit-Flow lets customers build drag-and-drop workflows that mirror how their operation actually works. It coordinates tasks, approvals, escalation, automation, and authorized remediation.",
    bullets: ["Mirrors real operational processes", "Automates repeatable coordination", "Writes actions, decisions, evidence, and outcomes back into Singularity"],
    to: "/infinit-flow",
    label: "Learn about Infinit-Flow",
    position: { x: "63%", y: "17%", width: "20%", height: "25%" },
  },
  {
    id: "singularity",
    title: "Singularity",
    description:
      "Singularity is the shared operational-memory foundation inside the Last Mile Platform. It connects assets, signals, issues, workflow activity, decisions, evidence, quality, timing, and outcomes so every response can improve the next one.",
    bullets: ["Preserves operational memory", "Connects assets, issues, actions, evidence, and outcomes", "Built on SSOM, the semantic model inside Singularity"],
    to: "/singularity",
    label: "Learn about Singularity",
    position: { x: "17%", y: "42%", width: "66%", height: "11%" },
  },
] as const;

type PlatformHotspot = (typeof platformHotspots)[number];

const coreCapabilities = [
  {
    title: "Cloud-Native SaaS Foundation",
    copy: "Built for secure multi-tenant SaaS, hybrid-capable customer boundaries, managed cloud services, and reliable 24x7 operation.",
    benefits: ["Cloud-native by default", "Hybrid-capable at the boundary", "Built for continuous operations"],
    icon: <Cloud className="h-5 w-5" />,
  },
  {
    title: "24x7 Ingestion At Internet Scale",
    copy: "Designed to handle high-volume operational records and telemetry while preserving source context, freshness, quality, and evidence.",
    benefits: ["High-volume ingestion", "Source health and freshness", "Replay, backfill, quarantine, and recovery"],
    icon: <Activity className="h-5 w-5" />,
  },
  {
    title: "AI-Native Operations",
    copy: "AI agents help monitor, diagnose, recommend, validate, and execute bounded platform remediation under policy, evidence, and audit.",
    benefits: ["Human-directed", "Agent-amplified", "Policy-bound and auditable"],
    icon: <Bot className="h-5 w-5" />,
  },
  {
    title: "SaaS Control Plane",
    copy: "A tenant-scoped management plane for customers, identity, configuration, entitlements, releases, support access, and product lifecycle.",
    benefits: ["Versioned configuration", "Rollback and release controls", "Tenant-aware administration"],
    icon: <Network className="h-5 w-5" />,
  },
  {
    title: "Tenant Isolation And Governance",
    copy: "Tenant context travels with every request, event, workflow, projection, query, export, and agent action.",
    benefits: ["Tenant-aware by design", "Data rights governance", "Purpose, retention, and audit controls"],
    icon: <LockKeyhole className="h-5 w-5" />,
  },
  {
    title: "Governed Source Management",
    copy: "Infinit-Signal is a source acquisition and normalization platform, not a connector pile. Sources, mappings, adapters, and runtime health are governed from onboarding through retirement.",
    benefits: ["Source profiles", "Adapter and mapping lifecycle", "Drift, freshness, quality, replay"],
    icon: <GitBranch className="h-5 w-5" />,
  },
  {
    title: "Hyper-Observable Operations",
    copy: "The platform observes source health, workflow health, view freshness, connector delivery, infrastructure health, cost, security, and AI-agent actions.",
    benefits: ["No silent loss", "Platform Operations Cockpit", "SLO and incident evidence"],
    icon: <Eye className="h-5 w-5" />,
  },
  {
    title: "Security, Safety, And Trust",
    copy: "Identity-first security, least-privilege access, secret management, policy-bound support, break-glass controls, and clear separation between recommendation, action, receipt, and outcome.",
    benefits: ["SSO and workload identity", "Audit and break-glass controls", "No autonomous customer OT control"],
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Safe Change And Contract Discipline",
    copy: "Every material API, event, command, configuration change, workflow action, and agent action is versioned, tested, observable, auditable, and rollback-capable.",
    benefits: ["Contract-governed APIs and events", "Shadow, canary, rollback", "Evidence for every meaningful change"],
    icon: <RefreshCcw className="h-5 w-5" />,
  },
  {
    title: "Repeatable Onboarding And Expansion",
    copy: "Customers, sites, source systems, workflows, views, connectors, policies, and runbooks are added through templates, readiness checks, and repeatable deployment patterns.",
    benefits: ["Template-driven expansion", "Smoke, replay, security, and readiness tests", "Designed to scale without heroics"],
    icon: <Building2 className="h-5 w-5" />,
  },
] as const;

export function PlatformOverviewPage() {
  const description = "Last Mile is a cloud-native, AI-native platform for turning operational data into coordinated action across physical operations.";

  return (
    <>
      <SEO
        title="Last Mile Platform | Operational Intelligence for Enterprise Operations"
        description={description}
        canonicalPath="/platform"
        jsonLd={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Platform Overview", path: "/platform" },
        ])}
      />
      <ProductPageLayout
        eyebrow="LAST MILE PLATFORM"
        title="Raise your operational intelligence."
        intro="Last Mile is a state-of-the-art, cloud-native, AI-native platform built to ingest operational data 24x7 at internet scale and turn it into action across your physical operations."
        heroSecondary="Built from decades of global enterprise platform operations experience, Last Mile brings the technology, operating discipline, and intelligence layer needed to optimize physical operations. Every company. Every industry. Every day."
        heroNote="We work just like YOU: practical, reliable, and focused on getting the work done."
        heroImage={{ src: "/images/worker1.png", alt: "Industrial worker representing the people who keep operations moving." }}
        hideHeroCtas
        primaryCta={{ label: "Talk through your operation", to: "/contact" }}
        secondaryCta={{ label: "Explore the platform", to: "#platform-at-work" }}
        localNavItems={[
          { id: "platform-at-work", label: "The Platform at Work" },
          { id: "platform-core", label: "Inside the Platform Core" },
        ]}
        customSections={
          <>
            <ThePlatformAtWork />
            <InsidePlatformCore />
          </>
        }
        overview={{
          heading: "",
          copy: [],
        }}
        benefits={[]}
        features={[]}
        useCases={[]}
        relatedProducts={[]}
        relatedHeading="Related Products and Capabilities"
        faqs={[]}
        resources={[]}
      />
    </>
  );
}

function ThePlatformAtWork() {
  const [activeId, setActiveId] = useState<PlatformHotspot["id"] | null>(null);
  const activeItem = platformHotspots.find((item) => item.id === activeId) ?? null;
  const frameRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastActiveIdRef = useRef<PlatformHotspot["id"] | null>(null);
  const suppressFocusOpenRef = useRef(false);

  const openHotspot = (id: PlatformHotspot["id"]) => {
    if (suppressFocusOpenRef.current) {
      return;
    }
    lastActiveIdRef.current = id;
    setActiveId(id);
  };

  const closeHotspot = ({ returnFocus = false }: { returnFocus?: boolean } = {}) => {
    const lastId = lastActiveIdRef.current;
    setActiveId(null);
    if (returnFocus && lastId) {
      suppressFocusOpenRef.current = true;
      window.requestAnimationFrame(() => {
        buttonRefs.current[lastId]?.focus();
        window.setTimeout(() => {
          suppressFocusOpenRef.current = false;
        }, 80);
      });
    }
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeHotspot({ returnFocus: true });
      }
    };

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (frameRef.current && !frameRef.current.contains(event.target as Node)) {
        closeHotspot();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  return (
    <section id="platform-at-work" className="scroll-mt-36 border-b border-slate-800 py-16 md:py-20" aria-labelledby="platform-at-work-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#75bda7]">The Platform at Work</p>
          <h3 id="platform-at-work-heading" className="mt-3 text-3xl font-bold leading-tight text-white md:text-4xl">
            One platform foundation. Three product experiences. One operational record.
          </h3>
          <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg md:leading-8">
            The Last Mile Platform brings source-system data, operational memory, customer-defined views, workflow automation, and authorized action into one connected operating layer. Infinit-Signal brings operating information in. Singularity preserves the context and history. Infinit-Control helps teams see what is happening. Infinit-Flow helps them build and automate the response.
          </p>
        </div>

        <p id="platform-image-description" className="sr-only">
          The Last Mile Platform connects operational source systems to Infinit-Signal. Infinit-Signal ingests and normalizes operational data into Singularity. Singularity is the shared operational memory foundation. Infinit-Control and Infinit-Flow use Singularity to support operational views and workflow automation.
        </p>

        <div ref={frameRef} className="platform-image-frame mt-8">
          <div className="platform-image-scroll" aria-describedby="platform-image-description">
            <div className="platform-image-stage">
              <img
                src="/images/last-mile-platform.png"
                alt="Last Mile Platform architecture showing Infinit-Signal, Infinit-Control, Infinit-Flow, and Singularity above common OT platform ecosystems and operational source systems."
                className="platform-image"
              />
              {platformHotspots.map((item) => (
                <button
                  key={item.id}
                  ref={(node) => {
                    buttonRefs.current[item.id] = node;
                  }}
                  type="button"
                  aria-label={item.label}
                  aria-expanded={activeId === item.id}
                  aria-controls={activeId === item.id ? "platform-hotspot-panel" : undefined}
                  className={`platform-hotspot platform-hotspot--${item.id} ${activeId === item.id ? "is-active" : ""}`}
                  style={{
                    left: item.position.x,
                    top: item.position.y,
                    width: item.position.width,
                    height: item.position.height,
                  }}
                  onClick={() => openHotspot(item.id)}
                  onFocus={() => {
                    if (!suppressFocusOpenRef.current) {
                      openHotspot(item.id);
                    }
                  }}
                  onMouseEnter={() => openHotspot(item.id)}
                >
                  <span className="sr-only">{item.label}</span>
                </button>
              ))}
              {activeItem ? <PlatformHotspotPanel item={activeItem} onClose={() => closeHotspot({ returnFocus: true })} /> : null}
            </div>
          </div>

          <div className="platform-mobile-hotspot-list" aria-label="Platform component details">
            {platformHotspots.map((item) => (
              <article key={item.id} className="platform-mobile-hotspot-card">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <ul>
                  {item.bullets.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <TrackedLink to={item.to} eventName="cta_product_click" eventData={{ product: item.title }}>
                  Learn More -&gt;
                </TrackedLink>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlatformHotspotPanel({ item, onClose }: { item: PlatformHotspot; onClose: () => void }) {
  return (
    <aside id="platform-hotspot-panel" className="platform-hotspot-panel" aria-live="polite">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#75bda7]">Platform component</p>
          <h4 className="mt-2 text-2xl font-semibold text-white">{item.title}</h4>
        </div>
        <button type="button" className="platform-hotspot-panel__close" aria-label="Close" onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-4 text-base leading-7 text-slate-300">{item.description}</p>
      <ul className="mt-5 space-y-3">
        {item.bullets.map((benefit) => (
          <li key={benefit} className="flex gap-3 text-sm leading-6 text-slate-200">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#75bda7]" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
      <TrackedLink to={item.to} eventName="cta_product_click" eventData={{ product: item.title }} className="mt-6 inline-flex text-sm font-semibold text-[#75f0ce] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#75bda7]">
        Learn More -&gt;
      </TrackedLink>
    </aside>
  );
}

function InsidePlatformCore() {
  return (
    <section id="platform-core" className="scroll-mt-36 border-b border-slate-800 py-16 md:py-20" aria-labelledby="platform-core-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#75bda7]">Inside the Platform Core</p>
        <h3 id="platform-core-heading" className="mt-3 text-3xl font-bold leading-tight text-white md:text-4xl">
          The operating system behind operational intelligence.
        </h3>
        <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg md:leading-8">
          Behind every Last Mile product is a cloud-native, AI-native platform foundation designed for secure scale, governed automation, tenant isolation, observability, reliability, and continuous operational learning.
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {coreCapabilities.map((capability, index) => (
          <CoreCapabilityCard key={capability.title} capability={capability} featured={index < 2} centeredOnDesktop={index === coreCapabilities.length - 1} />
        ))}
      </div>
      </div>
    </section>
  );
}

function CoreCapabilityCard({ capability, featured = false, centeredOnDesktop = false }: { capability: (typeof coreCapabilities)[number]; featured?: boolean; centeredOnDesktop?: boolean }) {
  return (
    <article className={`platform-core-card rounded-xl border border-slate-700 bg-slate-900/60 p-5 ${featured ? "xl:col-span-1" : ""} ${centeredOnDesktop ? "xl:col-start-2" : ""}`}>
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#217ED9]/40 bg-[#0a1929]/80 text-[#75ADE6]">{capability.icon}</div>
      <h4 className="mt-4 text-center text-xl font-semibold text-white">{capability.title}</h4>
      <p className="mt-3 text-base leading-7 text-slate-300">{capability.copy}</p>
      <ul className="mt-5 space-y-2">
        {capability.benefits.map((benefit) => (
          <li key={benefit} className="flex gap-2 text-sm leading-6 text-slate-200">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#75bda7]" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
