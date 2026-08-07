import { useCallback, useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import { ArrowRight, BrainCircuit, Gauge, Network, Radio, RefreshCw, Route, ShieldCheck } from "lucide-react";
import { SEO } from "@/app/components/SEO";
import { CtaLink, PageHero, Section } from "@/app/components/MarketingComponents";
import { TrackedLink } from "@/app/components/TrackedLink";
import { createOrganizationSchema, createWebsiteSchema } from "@/app/lib/structuredData";

type StageIcon = ComponentType<SVGProps<SVGSVGElement>>;

const outcomeStages: ReadonlyArray<{
  number: string;
  stage: string;
  stageDescription: string;
  innovationTitle: string;
  innovationDescription: string;
  icon: StageIcon;
  accent: string;
  accessibleLabel: string;
}> = [
  {
    number: "01",
    stage: "Observe",
    stageDescription: "Acquire and qualify operational evidence.",
    innovationTitle: "One accountable Condition",
    innovationDescription: "Converts noisy signals, alarms, and events into a qualified, owned operational issue focused on what can affect safety, uptime, cost, quality, or service.",
    icon: Radio,
    accent: "blue",
    accessibleLabel: "Stage 1, Observe: acquire and qualify operational evidence. Last Mile adds one accountable Condition.",
  },
  {
    number: "02",
    stage: "Understand",
    stageDescription: "Resolve identity, topology, context, and meaning.",
    innovationTitle: "One operational identity and topology",
    innovationDescription: "Unifies asset names, relationships, ownership, and context across sites so every authorized team and system operates from the same operational truth.",
    icon: Network,
    accent: "steel",
    accessibleLabel: "Stage 2, Understand: resolve identity, topology, context, and meaning. Last Mile adds one operational identity and topology.",
  },
  {
    number: "03",
    stage: "Coordinate",
    stageDescription: "Connect the Condition to people, platforms, providers, and work.",
    innovationTitle: "Condition-to-work orchestration",
    innovationDescription: "Carries evidence and context into the right workflow, team, platform, and provider, reducing manual handoffs and shortening the path from qualification to response.",
    icon: Route,
    accent: "teal",
    accessibleLabel: "Stage 3, Coordinate: connect the Condition to people, platforms, providers, and work. Last Mile adds Condition-to-work orchestration.",
  },
  {
    number: "04",
    stage: "Act",
    stageDescription: "Execute policy-governed human and machine actions.",
    innovationTitle: "Policy-governed command and action",
    innovationDescription: "Makes authority, approvals, automation boundaries, and execution rules explicit so customers can act confidently without sacrificing control or auditability.",
    icon: ShieldCheck,
    accent: "mint",
    accessibleLabel: "Stage 4, Act: execute policy-governed human and machine actions. Last Mile adds policy-governed command and action.",
  },
  {
    number: "05",
    stage: "Verify",
    stageDescription: "Use return telemetry to prove physical recovery.",
    innovationTitle: "Telemetry-verified physical recovery",
    innovationDescription: "Confirms that the asset or process actually recovered using live return telemetry, replacing ticket-closure assumptions with proof of the physical outcome.",
    icon: Gauge,
    accent: "verify",
    accessibleLabel: "Stage 5, Verify: use return telemetry to prove physical recovery. Last Mile adds telemetry-verified physical recovery.",
  },
  {
    number: "06",
    stage: "Learn",
    stageDescription: "Retain the outcome and improve future response.",
    innovationTitle: "Outcome learning across sites",
    innovationDescription: "Retains proven responses and results so authorized sites can benefit from prior experience, improving consistency, reducing recurrence, and strengthening future response.",
    icon: BrainCircuit,
    accent: "learn",
    accessibleLabel: "Stage 6, Learn: retain the outcome and improve future response. Last Mile adds outcome learning across authorized sites.",
  },
];

export function HomePage() {
  const description = "Last Mile is the Physical Operations Platform: the independent operating layer above existing systems that turns trusted Conditions into governed action and verifies physical outcomes.";
  return <>
    <SEO title="Last Mile | The Physical Operations Platform" description={description} canonicalPath="/" markdownPath="/index.md" jsonLd={[createOrganizationSchema(), createWebsiteSchema()]} />
    <div className="lm-home-page">
    <PageHero
      className="lm-home-hero"
      eyebrow="The Last Mile Physical Operations Platform"
      title={<><span>The operating</span><span>layer industry</span><span>has been waiting for.</span></>}
      intro="Industrial systems can detect, control, store, and manage individual pieces of the operating environment. Last Mile sits above all of them, creating a single system of action to understand what matters, coordinate what happens next, govern action, and verify the physical outcome."
      supporting={<><span>So keep the systems you've invested in and already trust.</span><span>Let Last Mile make them operate as one.</span></>}
      actions={<CtaLink to="/platform" eventName="cta_explore_platform_click">Explore the Platform</CtaLink>}
    >
      <figure className="lm-home-blueprint">
        <img src="/images/blueprint/platform-core-blueprint.png" width="1672" height="941" fetchPriority="high" alt="Blueprint of the Last Mile platform core connecting signals, operational memory, coordinated flow, and operator control" />
      </figure>
    </PageHero>

    <section className="lm-section lm-section--light">
      <div className="lm-container lm-problem-panel">
        <p className="lm-eyebrow">The problem we see everywhere</p>
        <div className="lm-problem-grid">
          <div className="lm-problem-copy">
            <h2>Industry needs orchestration and action.  Not another dashboard.</h2>
            <p>Existing platforms are strong at the jobs they were built to perform. Control systems operate equipment. Brokers move events. Historians preserve telemetry. Work systems manage tasks. Service providers execute in the field. But no single layer makes the complete physical operation accountable across all of them.  End to End.</p>
          </div>
          <p className="lm-lead-line">Last Mile provides that capability from first evidence to verified recovery.</p>
          <figure className="lm-problem-blueprint">
            <img src="/images/blueprint/infinit-control-blueprint.png" width="1672" height="941" loading="lazy" alt="Blueprint of the Infinit-Control command surface for operational accountability" />
          </figure>
        </div>
      </div>
    </section>

    <OutcomeLoop />

    <Section eyebrow="The operator" title="Built for real operators that are accountable for the physical result.">
      <div className="lm-operator">
        <figure><img src="/images/chuck.png" width="971" height="1098" loading="lazy" alt="Experienced industrial operator working near production equipment" /></figure>
        <div className="lm-operator__copy"><p>Chuck does not need another alert.  He wants to be at his sons football game.</p><p>What he needs is context. What happened, what's impacted, who owns the response, what action is authorized, and whether the operation actually recovered after his team attempted to fix it...Now!</p><div className="lm-operator__learn">Learn <TrackedLink to="/about" eventName="cta_explore_platform_click" className="lm-text-link">why Last Mile was built <ArrowRight /></TrackedLink></div></div>
      </div>
    </Section>
    </div>
  </>;
}

function OutcomeLoop() {
  const panelRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const [activeStage, setActiveStage] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const playMethod = useCallback(() => {
    clearTimers();
    setActiveStage(-1);
    setIsComplete(false);

    outcomeStages.forEach((_, index) => {
      timersRef.current.push(window.setTimeout(() => setActiveStage(index), 320 + index * 560));
    });
    timersRef.current.push(window.setTimeout(() => {
      setActiveStage(outcomeStages.length - 1);
      setIsComplete(true);
    }, 320 + outcomeStages.length * 560));
  }, [clearTimers]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (!("IntersectionObserver" in window)) {
      playMethod();
      return clearTimers;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      playMethod();
      observer.disconnect();
    }, { rootMargin: "0px 0px -8%", threshold: 0.04 });

    observer.observe(panel);
    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [clearTimers, playMethod]);

  const progress = isComplete ? 100 : activeStage < 0 ? 0 : ((activeStage + 1) / outcomeStages.length) * 100;

  return (
    <section id="what-last-mile-adds" className="lm-section lm-section--wash lm-outcome-section" aria-labelledby="outcome-loop-title">
      <div className="lm-container lm-outcome-shell">
        <header className="lm-outcome-intro">
          <p className="lm-eyebrow">What Last Mile Adds</p>
          <h2 id="outcome-loop-title">The Last Mile Outcome Loop™</h2>
          <p className="lm-outcome-kicker">Six stages. Seven advances. One accountable physical outcome.</p>
          <p className="lm-outcome-summary">The Last Mile Outcome Loop™ is our proprietary method for carrying a meaningful operational Condition from first evidence through governed action and telemetry-verified recovery. It operates across the control, data, work, and service systems customers already trust—without forcing them into another vendor silo.</p>
          <p className="lm-outcome-definition"><strong>A Condition</strong> is a qualified, owned operational issue—not merely an alarm, event, or raw telemetry point.</p>
          <p className="lm-outcome-promise">From first evidence to verified recovery.</p>
        </header>

        <div ref={panelRef} className={`lm-outcome-panel${isComplete ? " is-complete" : ""}`} style={{ "--loop-progress": `${progress}%` } as React.CSSProperties}>
          <ol className="lm-outcome-stages" aria-label="The six stages of the Last Mile Outcome Loop">
            {outcomeStages.map((stage, index) => {
              const Icon = stage.icon;
              const isReached = isComplete || index <= activeStage;
              return (
                <li
                  key={stage.stage}
                  className={`lm-outcome-stage lm-outcome-stage--${stage.accent}${isReached ? " is-reached" : ""}${index === activeStage && !isComplete ? " is-active" : ""}`}
                  aria-labelledby={`outcome-stage-${stage.number}`}
                  tabIndex={0}
                >
                  <div className="lm-outcome-stage__head">
                    <span className="lm-outcome-stage__number">{stage.number}</span>
                    <Icon aria-hidden="true" />
                  </div>
                  <h3 id={`outcome-stage-${stage.number}`}>{stage.stage}</h3>
                  <p className="lm-outcome-stage__description">{stage.stageDescription}</p>
                  <div className="lm-outcome-stage__innovation">
                    <strong>{stage.innovationTitle}</strong>
                    <p>{stage.innovationDescription}</p>
                  </div>
                  {index < outcomeStages.length - 1 ? <span className="lm-outcome-stage__connector" aria-hidden="true"><ArrowRight /></span> : null}
                </li>
              );
            })}
          </ol>

          <div className="lm-outcome-loopback" aria-label="Learn feeds back into Observe and improves the next response">
            <RefreshCw aria-hidden="true" />
            <span><strong>Learn returns to Observe</strong> · Improves the next response</span>
          </div>

          <button type="button" className="lm-outcome-replay" onClick={playMethod}>
            <RefreshCw aria-hidden="true" /> Replay method
          </button>
        </div>
      </div>
    </section>
  );
}
