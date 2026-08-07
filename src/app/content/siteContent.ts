export const products = [
  {
    number: "01",
    name: "Infinit-Signal",
    route: "/infinit-signal",
    shortTitle: "Trust the input.",
    copy: "Acquires approved source data, evaluates timing and quality, resolves source context, and turns relevant operating evidence into trusted records.",
    input: "Approved telemetry, events, alarms, equipment state, and source metadata",
    responsibility: "Source authority, time, freshness, quality, duplication, replay, and asset resolution",
    output: "Trusted observations, qualified issues, provenance, and source references",
    doesNotReplace: "Brokers, OPC UA servers, historians, SCADA, BMS, MES, or DCIM",
  },
  {
    number: "02",
    name: "Singularity",
    route: "/singularity",
    shortTitle: "Keep the context.",
    copy: "Maintains shared asset identity, topology, history, and operating memory through the SSOM semantic contract.",
    input: "Trusted records with source identity, timing, quality, and asset references",
    responsibility: "Identity, relationships, topology, operating history, uncertainty, and semantic lineage",
    output: "Shared operational context for the active response and historical analysis",
    doesNotReplace: "Source systems, historians, CMMS, data warehouses, or customer records",
  },
  {
    number: "03",
    name: "Infinit-Flow",
    route: "/infinit-flow",
    shortTitle: "Move the response.",
    copy: "Coordinates ownership, work, approvals, escalation, enterprise-system actions, and service-provider participation.",
    input: "Qualified issue, affected assets, response context, customer policy, and required result",
    responsibility: "Assignments, acknowledgement, authority gates, timers, escalation, and handoffs",
    output: "Coordinated work, decisions, authorized actions, and return-measurement requests",
    doesNotReplace: "CMMS, EAM, ITSM, provider systems, PLCs, SCADA, SIS, or BMS",
  },
  {
    number: "04",
    name: "Infinit-Control",
    route: "/infinit-control",
    shortTitle: "See the result.",
    copy: "Shows the live operating state, affected assets, current ownership, active work, return telemetry, and recovery status.",
    input: "Current context, active work, decisions, source health, and return measurements",
    responsibility: "Role-based visibility, recovery-contract evaluation, status, and recurrence monitoring",
    output: "Recovery verified, partially recovered, intervention unsuccessful, recurrence, or insufficient evidence",
    doesNotReplace: "HMI, SCADA, BMS, DCIM, historian, or native work-system interfaces",
  },
] as const;

export const platformStatus = [
  {
    title: "Implemented and demonstrable",
    items: [
      "The authoritative four-product platform architecture",
      "An interactive operating-thread walkthrough using the cooling scenario",
      "Structured response, status, and measurement-contract models",
    ],
  },
  {
    title: "In the approved reference build",
    items: [
      "A predefined governed Data Center Cooling response",
      "Issue qualification, shared equipment context, ownership, and evidence path",
      "A role-based command experience and telemetry-based recovery contract",
    ],
  },
  {
    title: "Planned after customer validation",
    items: [
      "General visual workflow authoring and reusable operational object packs",
      "Broader production integrations and customer-specific response patterns",
      "Production-scale performance, savings, and deployment claims",
    ],
  },
] as const;

export const coolingProofStatus = [
  {
    title: "Implemented and testable",
    items: [
      "Interactive scenario and acceptance-path walkthrough",
      "Defined equipment, response, result-state, and measurement models",
      "Failure, partial-recovery, recurrence, and insufficient-evidence outcomes",
    ],
  },
  {
    title: "Simulated for validation",
    items: [
      "Representative pump, amperage, pressure, and temperature telemetry",
      "Equipment topology, work-system actions, approvals, and provider handoffs",
      "Recovery stability and recurrence observation windows",
    ],
  },
  {
    title: "Not yet claimed",
    items: [
      "Production deployment in a customer data center",
      "Production-scale performance, availability, savings, or ROI",
      "Generalized workflow authoring validated across industries",
    ],
  },
] as const;

export const ecosystemFamilies = [
  { title: "Industrial data and brokers", examples: "MQTT, Sparkplug B, OPC UA, approved UNS topics", maturity: "Reference Architecture" },
  { title: "Control and operating platforms", examples: "PLC, SCADA, SIS, BMS, and equipment-control environments", maturity: "Customer-Specific" },
  { title: "Historians and data platforms", examples: "Operational historians, streaming platforms, warehouses, and analytical stores", maturity: "Profiled" },
  { title: "Facilities and production systems", examples: "BMS, DCIM, MES, laboratory, quality, and facilities platforms", maturity: "Reference Architecture" },
  { title: "Enterprise work systems", examples: "CMMS, EAM, ERP, ITSM, enterprise workflow, and collaboration tools", maturity: "Profiled" },
  { title: "Integrators and service providers", examples: "Controls specialists, facilities providers, maintenance partners, and field service networks", maturity: "Customer-Specific" },
] as const;

export const expansionPatterns = [
  {
    title: "Wastewater",
    signal: "Pump, aeration, or dissolved-oxygen problem",
    systems: "SCADA, historian, maintenance, laboratory, and field response",
    proof: "Flow, level, or dissolved oxygen returns to the approved operating range.",
  },
  {
    title: "Cold storage",
    signal: "Refrigeration, defrost, compressor, or evaporator problem",
    systems: "Temperature sensing, equipment data, work systems, and refrigeration providers",
    proof: "Pull-down, suction, and superheat remain stable through the agreed cycle.",
  },
  {
    title: "Manufacturing",
    signal: "Compressed-air pressure or capacity loss",
    systems: "Pressure, flow, compressor state, production demand, maintenance, and utility response",
    proof: "Required pressure and stability return under actual production load.",
  },
] as const;

export const technicalPrinciples = [
  "GCP-native services separate event transport, service runtime, current state, historical analysis, and durable source artifacts.",
  "Operational records are created once and reused through versioned contracts between products.",
  "Current state, analytical history, and raw source material have distinct responsibilities.",
  "Human authority and customer policy remain explicit around consequential enterprise-system actions.",
  "Delayed, duplicated, replayed, quarantined, or rejected data remains visible; the architecture is designed around no silent loss.",
] as const;

export const companyStage = {
  label: "Current company and build stage",
  summary: "Last Mile is developing the independent platform and its first commercial proof with Data Center Cooling as the approved reference use case.",
  evidence: "The platform architecture and interactive response models are demonstrable. The cooling workflow, equipment context, authority path, and recovery contract are being validated through a reference build. Production deployment and production-scale performance are not yet claimed.",
} as const;
