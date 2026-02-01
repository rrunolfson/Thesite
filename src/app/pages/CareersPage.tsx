import { useState } from "react";
import { ChevronDown, Target, Users, Zap, CheckCircle, Award } from "lucide-react";

interface JobPosition {
  title: string;
  badges: string[];
  preview: string;
  fullContent: string;
  emailSubject: string;
}

const jobs: JobPosition[] = [
  {
    title: "Chief Technology Officer (CTO)",
    badges: ["Full-time", "Remote"],
    preview: "Lead Last Mile's technical vision and strategy and manage the full engineering and technical leadership organization (all senior and director roles, excluding other C‑suite). Define architecture principles for scalable, secure, and reproducible ML and data systems; own model governance, platform SLAs, and the roadmap that binds Infiniticode™ and Singularity™...",
    fullContent: `<p><strong>Role Summary:</strong> Lead Last Mile's technical vision and strategy and manage the full engineering and technical leadership organization (all senior and director roles, excluding other C‑suite). Define architecture principles for scalable, secure, and reproducible ML and data systems; own model governance, platform SLAs, and the roadmap that binds Infiniticode™ and Singularity™ to commercial outcomes.</p>
    
<p>The CTO will be the public technical face of that vision, declaring a bold AI and platform strategy while empowering a leadership team to turn technical breakthroughs into defensible products and predictable revenue.</p>

<p><strong>Why This Role Matters:</strong> The CTO turns technical capability into company‑level advantage: setting the standards and operating model that allow Last Mile to scale pilots into internet‑grade, monetizable services without sacrificing reliability, security, or compliance. By combining public technical leadership with deep operational accountability, the CTO attracts partners and customers, accelerates revenue through trusted products, and cements Last Mile's position as the industry authority on AI‑driven device integrations.</p>

<p><strong>Application Method:</strong> Send resume and a short note highlighting two internet‑scale systems, and your role, you helped build to <a href="mailto:contact@lastmileinc.ai?subject=CTO — Last Mile — [Your Name]" class="text-[#217ED9] hover:text-[#75ADE6]">contact@lastmileinc.ai</a> with subject "CTO — Last Mile — [Your Name]".</p>

<p><em>Last Mile is an equal opportunity employer committed to building diverse teams.</em></p>`,
    emailSubject: "CTO — Last Mile — [Your Name]"
  },
  {
    title: "Chief Revenue Officer (CRO)",
    badges: ["Full-time", "Remote"],
    preview: "As Chief Revenue Officer you will convert Last Mile's technical leadership (Infiniticode™ and Singularity™) into predictable, repeatable revenue by building the commercial engines—sales, partnerships, pricing, and customer expansion—that scale OEM adoption and monetize device telemetry. You will translate technical capabilities into go to market offerings, own ARR targets, and align product, engineering, and customer...",
    fullContent: `<p><strong>Role Summary:</strong> As Chief Revenue Officer you will convert Last Mile's technical leadership (Infiniticode™ and Singularity™) into predictable, repeatable revenue by building the commercial engines—sales, partnerships, pricing, and customer expansion—that scale OEM adoption and monetize device telemetry. You will translate technical capabilities into go to market offerings, own ARR targets, and align product, engineering, and customer operations to deliver measurable commercial outcomes. This role is mission critical: you will shape pricing and packaging strategies for data products, run partner GTM motions, and ensure pilots convert to long term revenue at scale.</p>

<p><strong>Why This Role Matters:</strong> Revenue validates product-market fit and funds growth; the CRO converts Last Mile's technical promise into repeatable commercial outcomes. By aligning GTM, pricing, and customer success with technical capabilities, the CRO gives the CTO a clear commercial runway and measurable ARR outcomes to support continued innovation.</p>

<p><strong>Application Method:</strong> Send resume and a short note highlighting your strongest role-specific qualifications to <a href="mailto:contact@lastmile.ai?subject=Chief Revenue Officer — Last Mile — [Your Name]" class="text-[#217ED9] hover:text-[#75ADE6]">contact@lastmile.ai</a> with subject "Chief Revenue Officer — Last Mile — [Your Name]".</p>

<p><em>Last Mile is an equal opportunity employer committed to building diverse teams.</em></p>`,
    emailSubject: "Chief Revenue Officer — Last Mile — [Your Name]"
  },
  {
    title: "Sr Director of Applied AI and Automation",
    badges: ["Full-time", "Remote"],
    preview: "As Sr Director of Applied AI and Automation, you will lead and define how AI and adjacent technologies are applied across Last Mile products to generate high‑quality, production‑ready integration code and to unlock the commercial potential of Singularity™ through tightly integrated ML systems. Own model selection, retrieval‑augmented and knowledge‑grounded workflows, evaluation metrics, and MLOps...",
    fullContent: `<p><strong>Role Summary:</strong> As Sr Director of Applied AI and Automation, you will lead and define how AI and adjacent technologies are applied across Last Mile products to generate high‑quality, production‑ready integration code and to unlock the commercial potential of Singularity™ through tightly integrated ML systems.</p>

<p>Own model selection, retrieval‑augmented and knowledge‑grounded workflows, evaluation metrics, and MLOps for integration code generation and automation across Infiniticode™. Build rigorous validation pipelines, safety guards, test generation, CI/CD hooks, and deployment patterns that ensure generated artifacts meet security, performance, and maintainability standards. Partner closely with the Sr Director of Applied Data Science to align model outputs with productized data offerings from Singularity™—co‑design feature extraction, labeling strategies, confidence scoring, and SLA‑aware serving that tie AI behavior to monetization and billing. Collaborate with Platform, SRE, Product, Security, and Partnerships to operationalize models at scale, instrument commercial impact, and reduce friction from pilot to paid production.</p>

<p><strong>Why This Role Matters:</strong> Infiniticode™'s value hinges on trustworthy, auditable AI that reliably automates integrations without increasing operational risk. This Sr Director role makes automation repeatable and production‑grade, while, in close partnership with Applied Data Science, converting AI outputs into measurable market value from Singularity™—improving developer throughput, increasing partner adoption, and creating defensible differentiation. The result is a scalable automation engine and data‑driven product portfolio the CTO can amplify externally to win customers, reduce costs, and drive recurring revenue.</p>

<p><strong>Application Method:</strong> Send resume and a short note highlighting your strongest role-specific qualifications to <a href="mailto:contact@lastmileinc.ai?subject=Sr Director of Applied AI and Automation — Last Mile — [Your Name]" class="text-[#217ED9] hover:text-[#75ADE6]">contact@lastmileinc.ai</a> with subject "Sr Director of Applied AI and Automation — Last Mile — [Your Name]".</p>

<p><em>Last Mile is an equal opportunity employer committed to building diverse teams.</em></p>`,
    emailSubject: "Sr Director of Applied AI and Automation — Last Mile — [Your Name]"
  },
  {
    title: "Sr Director of Applied Data Science",
    badges: ["Full-time", "Remote"],
    preview: "Define and lead the build of Singularity's canonical data model, storage topology, feature store, and query/serving surfaces from the ground up, ensuring the architecture supports high‑throughput ingestion, low‑latency serving, efficient cold storage, and clear billing primitives. Own model design for forecasting, anomaly detection, survival analysis, and PMaaS use cases while operationalizing labeling...",
    fullContent: `<p><strong>Role Summary:</strong> Define and lead the build of Singularity's canonical data model, storage topology, feature store, and query/serving surfaces from the ground up, ensuring the architecture supports high‑throughput ingestion, low‑latency serving, efficient cold storage, and clear billing primitives. Own model design for forecasting, anomaly detection, survival analysis, and PMaaS use cases while operationalizing labeling pipelines (weak supervision, active learning), drift detection, model registries, and reproducible training/serving pipelines. Partner tightly with the Lead Data Architect, Sr Director of Applied AI, Platform Engineering, and Platform Ops to enforce schema evolution, lineage, data governance, and tenant isolation that meet HIPAA/SOC2 constraints and enable monetization. Translate product and commercial goals into measurable ML SLAs, revenue‑linked metrics, and experiment frameworks that validate business uplift.</p>

<p><strong>Why This Role Matters:</strong> You will define how OT and clinical device data are codified for the market—setting the technical and commercial standard that OEMs, integrators, and customers depend on globally. Building this data architecture is the lever that turns noisy telemetry into auditable, billable products and PMaaS offerings, directly creating new ARR streams and defensible differentiation. The Sr Director of Applied Data Science gives the CTO a leader who can both invent the canonical data story for Singularity™ and operationalize it at internet scale, enabling reproducible science, predictable product delivery, and measurable commercial impact.</p>

<p><strong>Application Method:</strong> Send resume and a short note highlighting your strongest role-specific qualifications to <a href="mailto:contact@lastmile.ai?subject=Sr Director of Applied Data Science — Last Mile — [Your Name]" class="text-[#217ED9] hover:text-[#75ADE6]">contact@lastmile.ai</a> with subject "Sr Director of Applied Data Science — Last Mile — [Your Name]".</p>

<p><em>Last Mile is an equal opportunity employer committed to building diverse teams.</em></p>`,
    emailSubject: "Sr Director of Applied Data Science — Last Mile — [Your Name]"
  },
  {
    title: "Lead Data Architect for Singularity™",
    badges: ["Full-time", "Remote"],
    preview: "Design and govern the Singularity™ data architecture: ingestion pipelines, hot/warm/cold tiering, partitioning and compaction strategies, indexing and query surfaces, and the metadata/pricing primitives that enable paid APIs. Partner with Platform, Applied Data Science, and Applied AI to ensure feature lineage, reproducible pipelines, and efficient access for real‑time...",
    fullContent: `<p><strong>Role Summary:</strong> Design and govern the Singularity™ data architecture: ingestion pipelines, hot/warm/cold tiering, partitioning and compaction strategies, indexing and query surfaces, and the metadata/pricing primitives that enable paid APIs. Partner with Platform, Applied Data Science, and Applied AI to ensure feature lineage, reproducible pipelines, and efficient access for real‑time and batch workloads. Establish schema evolution practices, data governance, and cost models that translate technical tradeoffs into product and commercial decisions.</p>

<p><strong>Why This Role Matters:</strong> Singularity™ is only valuable if it's reliable, auditable, and cost‑effective; the Lead Data Architect is the technical steward who turns raw telemetry into a trusted, product‑grade asset. Their design choices directly affect TCO, query SLAs, and the feasibility of ML/PMaaS products, giving the CTO the technical foundation required to promise—and deliver—customer commitments and revenue.</p>

<p><strong>Application Method:</strong> Send resume and a short note highlighting your strongest role-specific qualifications to <a href="mailto:contact@lastmile.ai?subject=Lead Data Architect for Singularity™ — Last Mile — [Your Name]" class="text-[#217ED9] hover:text-[#75ADE6]">contact@lastmile.ai</a> with subject "Lead Data Architect for Singularity™ — Last Mile — [Your Name]".</p>

<p><em>Last Mile is an equal opportunity employer committed to building diverse teams.</em></p>`,
    emailSubject: "Lead Data Architect for Singularity™ — Last Mile — [Your Name]"
  },
  {
    title: "Sr Director of Platform Engineering",
    badges: ["Full-time", "Remote"],
    preview: "Own and evolve the end‑to‑end platform architecture that binds Infiniticode™, Singularity™, Applied AI, Data, SRE, Partnerships, and Product into a single, performant, and secure technical substrate. Define service boundaries, eventing and streaming topologies, tenancy/isolation models, API versioning and SDK strategy, feature store access patterns, inference hosting, and the CI/CD and release orchestration...",
    fullContent: `<p><strong>Role Summary:</strong> Own and evolve the end‑to‑end platform architecture that binds Infiniticode™, Singularity™, Applied AI, Data, SRE, Partnerships, and Product into a single, performant, and secure technical substrate. Define service boundaries, eventing and streaming topologies, tenancy/isolation models, API versioning and SDK strategy, feature store access patterns, inference hosting, and the CI/CD and release orchestration patterns that safely move artifacts from generated prototype to production. Lead platform teams responsible for public APIs, developer experience, infrastructure, cost and observability engineering, and security primitives; set architectural standards, run architecture reviews, and ensure cross‑domain compatibility, scalability, and operational measurability.</p>

<p>As Sr Director of Platform Engineering you will own the foundational architecture that unifies every technical domain and product at Last Mile—APIs, SDKs, tenancy primitives, data ingress and storage, model serving, observability, and runtime security—so the company can operate reliably and securely at internet scale.</p>

<p><strong>Why This Role Matters:</strong> This role provides the technical foundation without which Last Mile cannot scale: it turns discrete product capabilities into a coherent, reliable platform that meets SLAs, supports monetization, and protects customer trust. The Sr Director of Platform Engineering gives the CTO a single owner for all cross‑cutting platform decisions—trading off latency, cost, security, and developer velocity—so the business can deliver integrations and data products at scale with predictable performance and compliant controls. In short, this leader makes the platform invisible to customers by making it fast, safe, and economically sustainable.</p>

<p><strong>Application Method:</strong> Send resume and a short note highlighting your strongest role-specific qualifications to <a href="mailto:contact@lastmileinc.ai?subject=Sr Director of Platform Engineering — Last Mile — [Your Name]" class="text-[#217ED9] hover:text-[#75ADE6]">contact@lastmileinc.ai</a> with subject "Sr Director of Platform Engineering — Last Mile — [Your Name]".</p>

<p><em>Last Mile is an equal opportunity employer committed to building diverse teams.</em></p>`,
    emailSubject: "Sr Director of Platform Engineering — Last Mile — [Your Name]"
  },
  {
    title: "Director of Platform Ops",
    badges: ["Full-time", "Remote"],
    preview: "Consume and implement the canonical platform architecture across infrastructure, orchestration, observability, and runtime security to support Infiniticode™, Singularity™, Applied AI, and all product domains. Lead Platform Ops engineers responsible for deployment automation, CI/CD pipelines, canarying and rollback strategies, capacity and cost engineering, observability pipelines, synthetic...",
    fullContent: `<p><strong>Role Summary:</strong> Consume and implement the canonical platform architecture across infrastructure, orchestration, observability, and runtime security to support Infiniticode™, Singularity™, Applied AI, and all product domains. Lead Platform Ops engineers responsible for deployment automation, CI/CD pipelines, canarying and rollback strategies, capacity and cost engineering, observability pipelines, synthetic testing, and production security controls. Translate architectural designs into repeatable deployment blueprints, manage day‑to‑day performance and availability, run incident response and escalation, and continuously optimize for scale, cost, and compliance while partnering closely with Platform Engineering, SRE, Security, and Product teams.</p>

<p><strong>Why This Role Matters:</strong> The Director of Platform Ops is the operational bridge between design and reality—without this role the platform architecture cannot reliably serve customers at internet scale. By executing and owning deployments, scalability, performance, and security, this leader ensures SLAs are met, incidents are resolved quickly, and capacity is predictably available, enabling rapid product delivery and monetization. Their work turns architectural vision into dependable production systems customers can trust, directly reducing risk and unlocking the business's ability to scale.</p>

<p><strong>Application Method:</strong> Send resume and a short note highlighting your strongest role-specific qualifications to <a href="mailto:contact@lastmile.ai?subject=Director of Platform Ops — Last Mile — [Your Name]" class="text-[#217ED9] hover:text-[#75ADE6]">contact@lastmile.ai</a> with subject "Director of Platform Ops — Last Mile — [Your Name]".</p>

<p><em>Last Mile is an equal opportunity employer committed to building diverse teams.</em></p>`,
    emailSubject: "Director of Platform Ops — Last Mile — [Your Name]"
  },
  {
    title: "Sr Director of OEM Technical Partnerships",
    badges: ["Full-time", "Remote"],
    preview: "Design and run an end‑to‑end OEM Partnerships function that sources high‑impact partner candidates, scores and prioritizes them against commercial and technical criteria, and executes targeted onboarding plays that demonstrate clear OEM value. Build the research methodology, partner segmentation framework, and outreach motion used to attract OEMs—articulating a concise, industry‑specific...",
    fullContent: `<p><strong>Role Summary:</strong> Design and run an end‑to‑end OEM Partnerships function that sources high‑impact partner candidates, scores and prioritizes them against commercial and technical criteria, and executes targeted onboarding plays that demonstrate clear OEM value. Build the research methodology, partner segmentation framework, and outreach motion used to attract OEMs—articulating a concise, industry‑specific value proposition for why partnering with Last Mile accelerates product velocity, reduces support cost, and opens new revenue channels. Own certification programs, partner SDKs, sandboxes, and co‑engineering GTM plays that convert pilots into production, and lead cross‑functional alignment with Platform, Applied AI, Data, Security, Solutions Engineering, and Sales to operationalize each onboarding. Measure and optimize the funnel from candidate identification to partner‑sourced ARR with rigorous KPIs, playbooks, and a repeatable cadence for partner governance.</p>

<p><strong>Why This Role Matters:</strong> Partners are the fastest path to scale; by systematizing how OEMs are discovered, evaluated, and onboarded, the Sr Director of OEM Technical Partnerships turns sporadic integrations into a predictable channel for ARR and product-market leadership. This leader creates a visible, explainable proposition for OEMs—why Last Mile lowers their integration cost, improves telemetry value, and expands their market reach—while ensuring every partnership is technically sound, certified, and commercially aligned. The result is a scalable partner engine that the CTO and CRO can rely on to accelerate adoption of Infiniticode™ and Singularity™, expand the ecosystem, and deliver sustainable commercial momentum.</p>

<p><strong>Application Method:</strong> Send resume and a short note highlighting your strongest role-specific qualifications to <a href="mailto:contact@lastmile.ai?subject=Sr Director of OEM Technical Partnerships — Last Mile — [Your Name]" class="text-[#217ED9] hover:text-[#75ADE6]">contact@lastmile.ai</a> with subject "Sr Director of OEM Technical Partnerships — Last Mile — [Your Name]".</p>

<p><em>Last Mile is an equal opportunity employer committed to building diverse teams.</em></p>`,
    emailSubject: "Sr Director of OEM Technical Partnerships — Last Mile — [Your Name]"
  },
  {
    title: "Director of Solution Engineering",
    badges: ["Full-time", "Remote"],
    preview: "Own the technical presales and POC lifecycle as Last Mile's primary customer‑facing technical leader: run architecture workshops, scoping, feasibility assessments, and high‑impact pilots that prove ROI and technical fit. Build and scale a Solutions Engineering practice that delivers impeccable customer experiences—fast, transparent, technically rigorous—and produces standardized POC...",
    fullContent: `<p><strong>Role Summary:</strong> Own the technical presales and POC lifecycle as Last Mile's primary customer‑facing technical leader: run architecture workshops, scoping, feasibility assessments, and high‑impact pilots that prove ROI and technical fit. Build and scale a Solutions Engineering practice that delivers impeccable customer experiences—fast, transparent, technically rigorous—and produces standardized POC templates, sandbox orchestration, and production‑readiness handoff artifacts. Be relentlessly data‑driven and hyper‑vocal about product gaps and field realities: maintain continuous, detailed communication with the Director of Product Engineering and Product teams to feed urgent fixes, prioritize roadmap changes, and improve each successive customer engagement.</p>

<p><strong>Why This Role Matters:</strong> This is the face of Last Mile to customers—your team's clarity and responsiveness create the trust that converts pilots into paid production and long‑term partnerships. By combining technical excellence with relentless field intelligence and tight operational handoffs, the Director of Solution Engineering reduces time‑to‑production, prevents costly rework, and ensures customers consistently experience Last Mile as low‑risk and high‑value. Their feedback loop to Product and Deployment is the engine that makes every new customer onboarding smoother, faster, and more scalable.</p>

<p><strong>Application Method:</strong> Send resume and a short note highlighting your strongest role-specific qualifications to <a href="mailto:contact@lastmile.ai?subject=Director of Solution Engineering — Last Mile — [Your Name]" class="text-[#217ED9] hover:text-[#75ADE6]">contact@lastmile.ai</a> with subject "Director of Solution Engineering — Last Mile — [Your Name]".</p>

<p><em>Last Mile is an equal opportunity employer committed to building diverse teams.</em></p>`,
    emailSubject: "Director of Solution Engineering — Last Mile — [Your Name]"
  },
  {
    title: "Director of Product Engineering",
    badges: ["Full-time", "Remote"],
    preview: "Own deployment engineering, L2/L3 technical support, onboarding automation, and the operational playbooks that ensure customers realize value quickly and reliably. Act as the initial escalation partner for Solution Engineering: receive their field reports, reproduce issues, prioritize fixes, and coordinate expedited remediation across Platform, SRE, Applied AI, Data, and...",
    fullContent: `<p><strong>Role Summary:</strong> Own deployment engineering, L2/L3 technical support, onboarding automation, and the operational playbooks that ensure customers realize value quickly and reliably. Act as the initial escalation partner for Solution Engineering: receive their field reports, reproduce issues, prioritize fixes, and coordinate expedited remediation across Platform, SRE, Applied AI, Data, and Security. Design and run the feedback pipelines that feed field intelligence "backward" into product and platform teams—rapid triage channels, hotfix cadences, post‑mortem discipline, and a continuous improvement loop that shortens time‑to‑resolution and improves future deployments. Build tooling, runbooks, training, and self‑service flows that raise first‑time success rates and scale onboarding without linear headcount increases.</p>

<p><strong>Why This Role Matters:</strong> Customer retention and expansion depend on fast, dependable post‑sale execution and an unbroken loop from field observation to product improvement. The Director of Product Engineering ensures Solution Engineering's hard‑won insights become prioritized product changes and rapid fixes, turning every customer interaction into a source of product quality and competitive advantage. By formalizing remediation pathways and reducing operational friction, this role protects revenue, raises CSAT, and enables the CTO and CRO to scale Last Mile's products with confidence.</p>

<p><strong>Application Method:</strong> Send resume and a short note highlighting your strongest role-specific qualifications to <a href="mailto:contact@lastmile.ai?subject=Director of Product Engineering — Last Mile — [Your Name]" class="text-[#217ED9] hover:text-[#75ADE6]">contact@lastmile.ai</a> with subject "Director of Product Engineering — Last Mile — [Your Name]".</p>

<p><em>Last Mile is an equal opportunity employer committed to building diverse teams.</em></p>`,
    emailSubject: "Director of Product Engineering — Last Mile — [Your Name]"
  },
  {
    title: "Director of Engineering PMO and Solution Architecture",
    badges: ["Full-time", "Remote"],
    preview: "Lead a dedicated Engineering PMO and Solution Architecture practice that manages execution of Last Mile product roadmaps with clear ownership of development cadence, release planning, risk management, and delivery assurance. Provide program leads and embedded delivery resources for major integrations and platform initiatives; maintain release trains, dependency maps, capacity planning, and go/no‑go...",
    fullContent: `<p><strong>Role Summary:</strong> Lead a dedicated Engineering PMO and Solution Architecture practice that manages execution of Last Mile product roadmaps with clear ownership of development cadence, release planning, risk management, and delivery assurance. Provide program leads and embedded delivery resources for major integrations and platform initiatives; maintain release trains, dependency maps, capacity planning, and go/no‑go gating. Integrate tightly with Product Engineering and Director of Product Engineering to consume field intelligence from Solution Engineering, translate operational issues into prioritized work streams, and adjust schedules so fixes and enhancements land where they deliver the most customer impact. Own architecture review boards, standardized delivery artifacts (cutover plans, migration playbooks, risk registers), and the mechanisms that ensure cross‑team commitments are met with measurable SLAs.</p>

<p><strong>Why This Role Matters:</strong> Execution-level rigor is the difference between pilot successes and scalable products. This team turns strategy into reliable outcomes: it reduces delivery risk, shortens time‑to‑value for customers, and ensures product improvements driven by field feedback are prioritized and delivered efficiently. By centralizing cadence, dependencies, and solution architecture governance, the Director of Engineering PMO and Solution Architecture gives the CTO, CRO, and product leaders confidence that Last Mile can repeatedly ship high‑quality integrations and data products while continuously improving the customer experience.</p>

<p><strong>Application Method:</strong> Send resume and a short note highlighting your strongest role-specific qualifications to <a href="mailto:contact@lastmile.ai?subject=Director of Engineering PMO and Solution Architecture — Last Mile — [Your Name]" class="text-[#217ED9] hover:text-[#75ADE6]">contact@lastmile.ai</a> with subject "Director of Engineering PMO and Solution Architecture — Last Mile — [Your Name]".</p>

<p><em>Last Mile is an equal opportunity employer committed to building diverse teams.</em></p>`,
    emailSubject: "Director of Engineering PMO and Solution Architecture — Last Mile — [Your Name]"
  },
  {
    title: "Director of Security and Compliance",
    badges: ["Full-time", "Remote"],
    preview: "Own Last Mile's security, privacy, and compliance strategy end‑to‑end—including threat engineering, secure SDLC, incident response, vendor risk, identity and access controls, and evidence collection for audits. Design and launch a formal Data Trust program that codifies anonymization, de‑identification, consent mapping, usage policies, and technical controls for Singularity™, and operationalize...",
    fullContent: `<p><strong>Role Summary:</strong> Own Last Mile's security, privacy, and compliance strategy end‑to‑end—including threat engineering, secure SDLC, incident response, vendor risk, identity and access controls, and evidence collection for audits. Design and launch a formal Data Trust program that codifies anonymization, de‑identification, consent mapping, usage policies, and technical controls for Singularity™, and operationalize regular third‑party audits and certification (SOC2, HIPAA, and data‑anonymity attestation). Build client-facing artifacts and outreach playbooks that explain how data is protected and anonymized, run independent verification processes, and maintain dashboards and SLAs that demonstrate ongoing compliance posture. Partner closely with Product, Platform, Applied AI, Applied Data Science, and OEM Partnerships to bake privacy-by-design into ingestion, feature stores, and model pipelines, and lead remediation and governance for any data or model risk findings.</p>

<p><strong>Why This Role Matters:</strong> Trust is the foundational commercial enabler for Last Mile—customers, OEMs, and regulators will only adopt and pay for Singularity™ if they are confident their telemetry is handled with provable care. The Director of Security and Compliance creates that confidence by delivering measurable, auditable controls and an industry‑grade Data Trust program that demonstrates anonymization quality and security through independent certification. This role minimizes commercial and regulatory risk, accelerates enterprise and regulated‑market wins, and gives the CTO and CRO the credible security narrative they need to scale Last Mile safely and confidently.</p>

<p><strong>Application Method:</strong> Send resume and a short note highlighting your strongest role-specific qualifications to <a href="mailto:contact@lastmile.ai?subject=Director of Security and Compliance — Last Mile — [Your Name]" class="text-[#217ED9] hover:text-[#75ADE6]">contact@lastmile.ai</a> with subject "Director of Security and Compliance — Last Mile — [Your Name]".</p>

<p><em>Last Mile is an equal opportunity employer committed to building diverse teams.</em></p>`,
    emailSubject: "Director of Security and Compliance — Last Mile — [Your Name]"
  }
];

function JobPanel({ job }: { job: JobPosition }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass-panel border border-slate-700/50 rounded-lg overflow-hidden">
      {/* Header - always visible */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-[#217ED9] flex-1">{job.title}</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-4 text-slate-400 hover:text-[#217ED9] transition-colors flex-shrink-0"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <ChevronDown 
              className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
        
        <div className="flex gap-2 mb-4">
          {job.badges.map((badge, idx) => (
            <span 
              key={idx}
              className="px-3 py-1 text-xs font-semibold bg-slate-800/50 border border-slate-700 rounded text-slate-300"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Preview - only show when collapsed */}
        {!isExpanded && (
          <div className="relative">
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
              {job.preview}
            </p>
            <div className="mt-3 text-right">
              <button
                onClick={() => setIsExpanded(true)}
                className="text-[#217ED9] hover:text-[#75ADE6] text-sm font-semibold transition-colors"
              >
                more...
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <style>{`
            .job-content p {
              margin-bottom: 1rem;
            }
            .job-content p:last-child {
              margin-bottom: 0;
            }
            .job-content strong {
              color: white;
            }
          `}</style>
          <div 
            className="job-content prose prose-invert prose-sm max-w-none text-slate-400"
            dangerouslySetInnerHTML={{ __html: job.fullContent }}
            style={{
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}
          />
        </div>
      )}
    </div>
  );
}

export function CareersPage() {
  return (
    <div className="pt-20 relative min-h-screen">
      <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 reveal">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white from-30% to-[#217ED9] bg-clip-text text-transparent">
                Careers
              </h1>
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-xl text-slate-400 leading-relaxed">
                  Last Mile is building infrastructure software for enterprises that operate in the physical world like retail, manufacturing, logistics, healthcare, energy.  We connect operational and asset data to the enterprise systems where work actually happens, starting with ServiceNow. That sounds straightforward. It isn’t.
                </p>
                <p className="text-xl text-slate-400 leading-relaxed">
                  This is early-stage, foundational work. The problems are real, the environments are complex, and the expectations are high. We are building software that will run inside some of the largest, most operationally demanding organizations in the world.
                </p>
                 <p className="text-xl text-slate-400 leading-relaxed">
                  If you are looking for a place to do careful, consequential work with smart people, clear ownership, and very little noise...you may like it here.
                </p>


              </div>
            </div>
          </div>
        </section>

        {/* Why Last Mile Section */}
        <section className="py-16 bg-[#0b1120] border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">
              Why Last Mile?
            </h2>
            <div className="space-y-8">
              <div className="glass-panel p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-[#217ED9]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">The Work Is Real</h3>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  We are not building demos, dashboards, or speculative AI products.
                </p>
                <p className="text-slate-400 leading-relaxed mt-4">
                  Last Mile builds production-grade integration infrastructure that moves operational data into enterprise execution workflows. When our software works, customers prevent downtime, reduce loss, meet compliance obligations, and operate more effectively. When it doesn't, they feel it immediately.
                </p>
                <p className="text-slate-400 leading-relaxed mt-4">
                  That reality shapes how we design, build, and test everything.
                </p>
              </div>
              
              <div className="glass-panel p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[#217ED9]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Built by Operators</h3>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Last Mile was founded by people who have spent their careers inside large enterprises, implementing ServiceNow, integrating complex systems, and dealing with the consequences when things fail in the real world.
                </p>
                <p className="text-slate-400 leading-relaxed mt-4">
                  We know what it means to support global operations, to work with demanding customers, and to build software that has to survive scale, audits, and change.
                </p>
                <p className="text-slate-400 leading-relaxed mt-4">
                  We are opinionated because experience has earned us that right.
                </p>
              </div>
              
              <div className="glass-panel p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-[#217ED9]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Early, Focused, Accountable</h3>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  We are small by design and early by necessity.
                </p>
                <p className="text-slate-400 leading-relaxed mt-4">
                  Everyone here owns meaningful surface area. There is no place to hide behind process, titles, or ambiguity. Work is visible. Decisions matter. Progress compounds quickly.
                </p>
                <p className="text-slate-400 leading-relaxed mt-4">
                  If you need a large organization to feel productive, this is not the right place. If you want to help shape a company while it is still being built...this is exactly that moment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Work & What You Get Section */}
        <section className="py-16 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-panel p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-[#217ED9]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">How We Work</h3>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">We value:</h4>
                  <ul className="space-y-2">
                    <li className="text-slate-400 leading-relaxed flex items-start">
                      <span className="text-[#217ED9] mr-2">•</span>
                      <span>Clear thinking over speed theater</span>
                    </li>
                    <li className="text-slate-400 leading-relaxed flex items-start">
                      <span className="text-[#217ED9] mr-2">•</span>
                      <span>Writing things down and meaning them</span>
                    </li>
                    <li className="text-slate-400 leading-relaxed flex items-start">
                      <span className="text-[#217ED9] mr-2">•</span>
                      <span>Direct communication without ego</span>
                    </li>
                    <li className="text-slate-400 leading-relaxed flex items-start">
                      <span className="text-[#217ED9] mr-2">•</span>
                      <span>Shipping software that holds up under scrutiny</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">We do not value:</h4>
                  <ul className="space-y-2">
                    <li className="text-slate-400 leading-relaxed flex items-start">
                      <span className="text-[#217ED9] mr-2">•</span>
                      <span>Performative urgency</span>
                    </li>
                    <li className="text-slate-400 leading-relaxed flex items-start">
                      <span className="text-[#217ED9] mr-2">•</span>
                      <span>Buzzwords without substance</span>
                    </li>
                    <li className="text-slate-400 leading-relaxed flex items-start">
                      <span className="text-[#217ED9] mr-2">•</span>
                      <span>Chaos disguised as culture</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="glass-panel p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#217ED9]/20 border border-[#217ED9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-[#217ED9]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">What You Get</h3>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">In return, we offer:</h4>
                  <ul className="space-y-2">
                    <li className="text-slate-400 leading-relaxed flex items-start">
                      <span className="text-[#217ED9] mr-2">•</span>
                      <span>Work that matters to real customers</span>
                    </li>
                    <li className="text-slate-400 leading-relaxed flex items-start">
                      <span className="text-[#217ED9] mr-2">•</span>
                      <span>Colleagues who know what they're doing</span>
                    </li>
                    <li className="text-slate-400 leading-relaxed flex items-start">
                      <span className="text-[#217ED9] mr-2">•</span>
                      <span>A chance to build something foundational, not ornamental</span>
                    </li>
                    <li className="text-slate-400 leading-relaxed flex items-start">
                      <span className="text-[#217ED9] mr-2">•</span>
                      <span>Equity in a company being built carefully, not recklessly</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <section className="py-20 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">
              Open Positions
            </h2>
            
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <JobPanel key={index} job={job} />
              ))}
            </div>
          </div>
        </section>

        {/* Don't See Your Role Section */}
        <section className="py-20 bg-[#0b1120] border-t border-slate-800">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Don't See Your <span className="text-[#217ED9]">Role?</span>
            </h2>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              We're always looking for exceptional talent. If you're passionate about defining the future of applied AI and technical innovation, we'd love to hear from you.
            </p>
            <a
              href="mailto:contact@lastmileinc.ai?subject=Last Mile Web Site Inquiry"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-sm bg-[#0a1929]/80 border-2 border-[#217ED9] hover:bg-[#0a1929] text-white font-semibold text-lg transition-all"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}