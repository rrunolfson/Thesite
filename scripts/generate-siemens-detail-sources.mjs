import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const csvPath = path.join(repoRoot, "data", "integrations.csv");
const detailRoot = path.join(repoRoot, "data", "integration-details", "siemens");

const reviewDate = "2026-04-18";

const profileDefinitions = [
  {
    id: "comos",
    slugs: ["comos-web-rest-api"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["plant-engineering-data", "documents", "specifications", "project-objects"],
    keyEntities: ["engineering objects", "documents", "specifications", "project records"],
    overviewNote:
      "This surface is oriented around engineering and project records rather than live operational telemetry.",
    buyerGuidance:
      "Use this area when the integration needs structured plant engineering records, controlled document access, and object lifecycle updates rather than streaming operational data.",
    category: "Engineering records",
    availableDescription:
      "Published API scope centers on COMOS engineering objects, related documentation, and project-side updates.",
  },
  {
    id: "nurse-call",
    slugs: ["nurse-call-system-api"],
    asset: "Un-Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["nurse-call-events", "patient-staff-communication", "alert-management"],
    keyEntities: ["nurse calls", "emergency alerts", "restroom assistance calls", "standard calls"],
    overviewNote:
      "The official overview is centered on call types and their visibility in Ward Manager, so the value is event and workflow exchange rather than equipment master data.",
    buyerGuidance:
      "Use this API when the customer needs healthcare call events and response workflows reflected into Ward Manager or connected care operations. It is not a device inventory API.",
    category: "Call workflows",
    availableDescription:
      "Published API scope focuses on healthcare communication events and their handling in Ward Manager.",
  },
  {
    id: "building-operations",
    slugs: ["building-operations-api"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["devices", "points", "point-values", "faults", "workorders", "teams"],
    keyEntities: ["devices", "points", "point values", "faults", "workorders", "teams"],
    overviewNote:
      "The Building Operations overview explicitly covers reading point data and issuing commands to actuator points, alongside faults, workorders, and team assignment workflows.",
    buyerGuidance:
      "Use this API when the integration needs both live building telemetry and operational writeback, including point commands and work execution context.",
    category: "Building operations",
    availableDescription:
      "Published API scope combines device and point context, time-series point values, and operational maintenance workflows.",
  },
  {
    id: "building-structure",
    slugs: ["building-structure-api", "building-geometry-api"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["building-structure", "locations", "spatial-modeling"],
    keyEntities: ["campuses", "buildings", "floors", "rooms", "locations", "geometry"],
    overviewNote:
      "These APIs are used to build and manage the spatial model of the site, not to expose live operational readings.",
    buyerGuidance:
      "Use these APIs to establish or synchronize structural and floorplan metadata in Building X. They are layout and topology services, not telemetry feeds.",
    category: "Building topology",
    availableDescription:
      "Published API scope is centered on building hierarchy, room structure, and 2D layout records.",
  },
  {
    id: "accounts",
    slugs: ["accounts-api"],
    asset: "Un-Supported",
    telemetry: "Un-Supported",
    writeback: "N/A",
    dataDomains: ["tenant-access-discovery", "partitions", "roles"],
    keyEntities: ["customers", "partitions", "roles", "user groups"],
    overviewNote:
      "The official overview positions this API as access-scope discovery for the calling machine user.",
    buyerGuidance:
      "Use this surface to discover tenant and partition access boundaries. It does not deliver operational asset or telemetry payloads.",
    category: "Access discovery",
    availableDescription:
      "Published API scope is limited to customer, partition, role, and user-group access context.",
  },
  {
    id: "building-read-events",
    slugs: ["fire-api", "activities-api", "security-monitoring-api"],
    asset: "Un-Supported",
    telemetry: "Supported",
    writeback: "Un-Supported",
    dataDomains: ["events", "alarms", "security-monitoring"],
    keyEntities: ["events", "alarms", "activities", "security monitoring records"],
    overviewNote:
      "These APIs are framed as event and monitoring retrieval surfaces for fire, access, and security operations.",
    buyerGuidance:
      "Use these APIs when the integration needs read-only safety or security event streams for dashboards, incident creation, or analytics.",
    category: "Operational events",
    availableDescription:
      "Published API scope is focused on retrieving event, alarm, and activity records from connected systems.",
  },
  {
    id: "security-write-admin",
    slugs: ["security-identities-and-privileges-api", "security-workflow-api", "visitor-manager-api"],
    asset: "N/A",
    telemetry: "N/A",
    writeback: "Supported",
    dataDomains: ["identity-and-access", "workflow-orchestration", "visitor-management"],
    keyEntities: ["identities", "privileges", "workflow instances", "visitors", "visits"],
    overviewNote:
      "These surfaces are administrative or workflow APIs rather than asset or telemetry feeds, but they do support authoritative record updates.",
    buyerGuidance:
      "Use these APIs for access, visitor, or workflow administration in Building X. They are operational write surfaces rather than monitoring feeds.",
    category: "Administrative workflows",
    availableDescription:
      "Published API scope centers on administrative records and workflow lifecycle operations.",
  },
  {
    id: "security-intrusion",
    slugs: ["security-intrusion-api"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Un-Supported",
    dataDomains: ["intrusion-systems", "device-status", "security-context"],
    keyEntities: ["intrusion systems", "control panels", "field devices", "security states"],
    overviewNote:
      "The published overview is about information on connected intrusion systems and their operational context, without mutation workflows.",
    buyerGuidance:
      "Use this API when the integration needs cloud-enabled intrusion system context and monitoring data but not writeback control.",
    category: "Intrusion monitoring",
    availableDescription:
      "Published API scope combines intrusion-system inventory context with monitoring-oriented retrieval.",
  },
  {
    id: "point-ingest",
    slugs: ["point-value-ingest-api"],
    asset: "Un-Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["point-value-ingestion", "set-points", "external-measurements"],
    keyEntities: ["points", "point values", "set values", "ingested measurements"],
    overviewNote:
      "This API is dedicated to setting values on points, so the payload domain is telemetry-like even though the main interaction is write-oriented.",
    buyerGuidance:
      "Use this API when Last Mile needs to push external measured values or set-point updates into Building X rather than read point histories out of it.",
    category: "Telemetry ingest",
    availableDescription:
      "Published API scope is centered on writing point values and set values into Building X.",
  },
  {
    id: "energy-read",
    slugs: ["energy-api", "sustainability-api"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Un-Supported",
    dataDomains: ["energy-consumption", "emissions", "cost-reporting"],
    keyEntities: ["locations", "meters", "consumption records", "emissions", "cost records"],
    overviewNote:
      "The official descriptions are read-focused and centered on energy, emissions, and cost retrieval by customer, location, or meter.",
    buyerGuidance:
      "Use these APIs for energy and ESG reporting use cases where the integration consumes aggregated readings and calculated metrics from Building X.",
    category: "Energy analytics",
    availableDescription:
      "Published API scope focuses on retrieving energy, emissions, and cost metrics for reporting and analytics.",
  },
  {
    id: "lifecycle-twin",
    slugs: ["lifecycle-twin-api"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["digital-twin-records", "documents", "tasks", "inspections"],
    keyEntities: ["sites", "buildings", "assets", "documents", "tasks", "surveys"],
    overviewNote:
      "Lifecycle Twin is positioned as a digital twin and lifecycle management surface rather than a live telemetry feed.",
    buyerGuidance:
      "Use this API when the integration needs digital twin records, documents, and lifecycle workflow objects in Building X.",
    category: "Lifecycle records",
    availableDescription:
      "Published API scope focuses on twin objects, attached records, and lifecycle workflow artifacts.",
  },
  {
    id: "streaming",
    slugs: ["streaming-api"],
    asset: "Un-Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["stream-subscriptions", "real-time-point-data", "webhook-delivery"],
    keyEntities: ["stream subscriptions", "point events", "delivery endpoints"],
    overviewNote:
      "The Streaming API is about configuring and consuming real-time data delivery from Building X points.",
    buyerGuidance:
      "Use this API when the integration needs low-latency point data delivery and can manage subscription configuration and webhook endpoints.",
    category: "Realtime streaming",
    availableDescription:
      "Published API scope combines subscription management with real-time point-data delivery.",
  },
  {
    id: "depot-status",
    slugs: ["charger-status-api"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Un-Supported",
    dataDomains: ["charger-status", "charging-operations", "depot-monitoring"],
    keyEntities: ["chargers", "status records", "charging operations", "depot metrics"],
    overviewNote:
      "This API is positioned as the monitoring and reporting surface for depot charger operations.",
    buyerGuidance:
      "Use this API for read-only charger and depot monitoring scenarios where status and operational metrics are required but control remains elsewhere.",
    category: "Depot monitoring",
    availableDescription:
      "Published API scope focuses on charger status and depot charging operation monitoring.",
  },
  {
    id: "depot-control",
    slugs: ["charger-control-api", "remote-command-api"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["charger-control", "remote-commands", "depot-execution"],
    keyEntities: ["chargers", "control commands", "remote instructions", "scheduled actions"],
    overviewNote:
      "These DepotFinity APIs are used to push operational control or command actions into the charging environment.",
    buyerGuidance:
      "Use these APIs when the integration needs to trigger charging behavior or issue remote execution commands instead of only reading status.",
    category: "Operational control",
    availableDescription:
      "Published API scope is centered on command and control workflows for depot charging assets.",
  },
  {
    id: "depot-record-write",
    slugs: ["reservations-api", "rfid-management-api"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["reservations", "rfid-credentials", "operational-records"],
    keyEntities: ["reservations", "RFID cards", "RFID credentials", "resource assignments"],
    overviewNote:
      "These surfaces manage scheduling and credential-like records that support charging operations rather than live telemetry feeds.",
    buyerGuidance:
      "Use these APIs when the integration needs to manage reservations or RFID-linked operational records in DepotFinity.",
    category: "Operational records",
    availableDescription:
      "Published API scope focuses on managing reservation and RFID-related records.",
  },
  {
    id: "depot-transaction",
    slugs: ["transaction-management-api"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["charging-transactions", "audit-trails", "operational-history"],
    keyEntities: ["transactions", "transaction history", "operational events", "settlement records"],
    overviewNote:
      "Transaction management blends historical operational records with transaction lifecycle updates.",
    buyerGuidance:
      "Use this API when the integration needs to move beyond charger status into the history and management of charging transactions.",
    category: "Transaction history",
    availableDescription:
      "Published API scope combines transaction retrieval with transaction lifecycle handling.",
  },
  {
    id: "vdv-261",
    slugs: ["vdv-261-api"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Un-Supported",
    dataDomains: ["transport-data-exchange", "vehicle-operations", "status-reporting"],
    keyEntities: ["vehicles", "status exchanges", "schedule-related records", "operational messages"],
    overviewNote:
      "The VDV-261 surface is positioned as a standards-based transport data exchange interface, which is primarily read and synchronization oriented.",
    buyerGuidance:
      "Use this API when the integration needs operational transport data in a standards-aligned exchange format rather than control workflows.",
    category: "Transport exchange",
    availableDescription:
      "Published API scope focuses on standards-based exchange of transport and vehicle operation data.",
  },
  {
    id: "electrification-x",
    slugs: ["electrification-x-api"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["electrification-assets", "energy-operations", "control-actions"],
    keyEntities: ["devices", "energy measurements", "configuration records", "control actions"],
    overviewNote:
      "Electrification X is described as a combined electrification and automation SaaS platform, so the published API surface spans both monitoring and control use cases.",
    buyerGuidance:
      "Use this API when the integration needs a broad electrification platform surface with asset context, measurement data, and actionable writes.",
    category: "Electrification operations",
    availableDescription:
      "Published API scope combines electrification asset context, operational measurements, and platform-side updates.",
  },
  {
    id: "enlighted-occupancy",
    slugs: ["occupancy-apis"],
    asset: "Un-Supported",
    telemetry: "Supported",
    writeback: "Un-Supported",
    dataDomains: ["occupancy-readings", "space-utilization"],
    keyEntities: ["occupancy readings", "space metrics", "sensor outputs"],
    overviewNote:
      "The Enlighted occupancy surface is specifically about sensor-derived occupancy data and utilization analytics.",
    buyerGuidance:
      "Use this API for read-only occupancy and utilization analytics; it is not the place for operational record writes.",
    category: "Occupancy telemetry",
    availableDescription:
      "Published API scope focuses on occupancy and utilization readings from Enlighted sensors.",
  },
  {
    id: "enlighted-location",
    slugs: ["location-services-rtls-apis"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Un-Supported",
    dataDomains: ["rtls-location", "asset-tracking", "position-history"],
    keyEntities: ["tracked assets", "location fixes", "position histories"],
    overviewNote:
      "The RTLS surface combines tracked-asset context with real-time location and movement data.",
    buyerGuidance:
      "Use this API when the integration needs indoor location and movement visibility for tracked assets or badges.",
    category: "RTLS telemetry",
    availableDescription:
      "Published API scope combines tracked-object context with real-time location services.",
  },
  {
    id: "enlighted-energy",
    slugs: ["energy-and-environment-apis"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Un-Supported",
    dataDomains: ["energy-metrics", "environmental-readings"],
    keyEntities: ["energy records", "environmental readings", "facility context"],
    overviewNote:
      "The API family is framed around read access to energy and environmental metrics rather than actuation.",
    buyerGuidance:
      "Use this API when the integration needs facility energy and environment telemetry from Enlighted for reporting or optimization.",
    category: "Facility telemetry",
    availableDescription:
      "Published API scope is centered on energy and environmental measurements.",
  },
  {
    id: "industrial-ai-suite",
    slugs: [
      "ai-asset-manager-aws-cloud-package-delivery-api",
      "ai-asset-manager-azure-cloud-package-delivery-api",
      "ai-asset-manager-cloud-api",
    ],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["ai-model-deployments", "edge-ai-monitoring", "cloud-delivery"],
    keyEntities: ["AI model deployments", "delivery packages", "monitoring data", "edge assets"],
    overviewNote:
      "Industrial AI Suite is explicitly described as handling model packaging, deployment, and monitoring across edge environments.",
    buyerGuidance:
      "Use these APIs when the integration needs to manage AI model deployment packages and monitor AI execution outcomes at the shop floor edge.",
    category: "AI deployment lifecycle",
    availableDescription:
      "Published API scope combines deployment package handling with model deployment monitoring.",
  },
  {
    id: "industrial-edge-admin",
    slugs: [
      "portal-api-1-9-0",
      "industrial-edge-management-apis",
      "industrial-edge-management-v2-apis",
      "flow-creator-configurator-apis",
    ],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["edge-application-management", "device-management", "configuration"],
    keyEntities: ["edge devices", "apps", "deployments", "configurations", "flows"],
    overviewNote:
      "These APIs are administrative and configuration-oriented surfaces for apps, devices, and low-code flow setup across Industrial Edge.",
    buyerGuidance:
      "Use these APIs when the integration needs to provision, deploy, or configure Industrial Edge devices and apps rather than consume plant telemetry.",
    category: "Edge management",
    availableDescription:
      "Published API scope centers on provisioning, configuration, and lifecycle management for Industrial Edge assets and apps.",
  },
  {
    id: "industrial-edge-device",
    slugs: ["ie-device-apis"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["edge-device-management", "device-status", "runtime-control"],
    keyEntities: ["edge devices", "device status", "runtime services", "configuration records"],
    overviewNote:
      "The Industrial Edge platform combines device context with runtime control and status monitoring for edge installations.",
    buyerGuidance:
      "Use this API when the integration needs the operational view of edge devices, including their managed state and runtime-side actions.",
    category: "Edge devices",
    availableDescription:
      "Published API scope combines edge-device inventory, operational status, and device-side management actions.",
  },
  {
    id: "industrial-edge-databus",
    slugs: ["external-databus-apis"],
    asset: "Un-Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["databus-streams", "event-messaging", "edge-integration"],
    keyEntities: ["messages", "topics", "events", "stream subscribers"],
    overviewNote:
      "The external databus surface is about event and message exchange on Industrial Edge rather than master data.",
    buyerGuidance:
      "Use this API when the integration needs message-based exchange with Industrial Edge applications through the external databus.",
    category: "Edge messaging",
    availableDescription:
      "Published API scope is centered on subscribing to or publishing event and message streams.",
  },
  {
    id: "industrial-edge-payload-format",
    slugs: ["industrial-edge-common-databus-payload-format"],
    asset: "N/A",
    telemetry: "Supported",
    writeback: "N/A",
    dataDomains: ["message-schema", "telemetry-payload-format"],
    keyEntities: ["payload schemas", "telemetry messages", "common databus structures"],
    overviewNote:
      "This artifact is a message-format specification used for telemetry exchange rather than a business CRUD API.",
    buyerGuidance:
      "Use this specification when the integration needs to understand or validate Industrial Edge databus payloads rather than manage source records.",
    category: "Message schema",
    availableDescription:
      "Published specification defines the structure of telemetry payloads on the Industrial Edge databus.",
  },
  {
    id: "iih",
    slugs: ["iih-essentials-apis", "iih-semantics-apis"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["asset-models", "time-series-data", "alarms", "semantic-access"],
    keyEntities: ["asset models", "time-series data", "alarms", "knowledge graph", "OPC UA records"],
    overviewNote:
      "The IIH overview explicitly states that Essentials exposes configuration, asset model, time-series data, and alarms, while Semantics offers GraphQL and OPC UA read/write access.",
    buyerGuidance:
      "Use IIH when the integration needs structured industrial models and telemetry flowing from shop floor sources up to IT and cloud systems.",
    category: "Industrial data integration",
    availableDescription:
      "Published API scope combines industrial models, historical data, alarms, and semantic access interfaces.",
  },
  {
    id: "industrial-iot-open-source",
    slugs: ["mindconnect-nodejs", "mindconnect-node-red-node-overview"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["sdk-connectivity", "data-ingestion", "edge-flows"],
    keyEntities: ["assets", "time-series payloads", "events", "Node-RED flows"],
    overviewNote:
      "These open-source tools and libraries exist to push industrial data into Siemens IoT platforms and wire connectivity into Node.js or Node-RED flows.",
    buyerGuidance:
      "Use these SDK and flow-node surfaces when the integration needs developer-side ingestion or orchestration tooling rather than a turnkey business API.",
    category: "Connectivity tooling",
    availableDescription:
      "Published API scope is centered on SDK-driven ingestion and low-code data flow integration.",
  },
  {
    id: "insights-platform-core",
    slugs: [
      "identity-management",
      "resource-access-management",
      "message-broker-developer-documentation",
      "oauth-authorization-server-api",
      "tenant-management-service",
      "token-management-service",
      "usage-transparency-service",
      "agent-management-service",
      "notification-service",
      "visual-flow-creator-service",
      "rules-management-service",
      "job-manager-service",
      "model-management-service",
    ],
    asset: "N/A",
    telemetry: "N/A",
    writeback: "N/A",
    dataDomains: ["platform-governance", "identity", "administration"],
    keyEntities: ["users", "policies", "tenants", "tokens", "jobs", "models"],
    overviewNote:
      "These Insights Hub services are platform infrastructure or governance surfaces rather than product data, telemetry, or operational writeback APIs.",
    buyerGuidance:
      "Use these services for platform administration and governance. They are necessary platform plumbing in some solutions but not delivery surfaces for asset or telemetry data.",
    category: "Platform services",
    availableDescription:
      "Published API scope is focused on platform administration, identity, policy, and orchestration support.",
  },
  {
    id: "insights-files",
    slugs: ["iot-file-service"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["file-storage", "asset-linked-documents"],
    keyEntities: ["files", "file metadata", "asset-linked artifacts"],
    overviewNote:
      "The IoT File Service is for file and artifact storage, not timeseries telemetry.",
    buyerGuidance:
      "Use this API when the integration needs asset-adjacent files, uploads, or binary artifacts in Insights Hub.",
    category: "File storage",
    availableDescription:
      "Published API scope focuses on storing and retrieving asset-linked files and metadata.",
  },
  {
    id: "insights-timeseries",
    slugs: ["iot-time-series-service", "iot-time-series-bulk-service"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["time-series-data", "bulk-ingest", "historical-queries"],
    keyEntities: ["timeseries records", "aspects", "variables", "bulk payloads"],
    overviewNote:
      "These are the core Insights Hub services for telemetry persistence, query, and bulk ingest/backfill.",
    buyerGuidance:
      "Use these APIs when the integration needs authoritative telemetry storage or historical readback inside Insights Hub.",
    category: "Telemetry storage",
    availableDescription:
      "Published API scope combines timeseries ingest, retrieval, and bulk history handling.",
  },
  {
    id: "insights-timeseries-notification",
    slugs: ["notification-for-new-arrival-of-timeseries-data"],
    asset: "Un-Supported",
    telemetry: "Supported",
    writeback: "Un-Supported",
    dataDomains: ["telemetry-events", "subscription-notifications"],
    keyEntities: ["timeseries arrival events", "subscriptions", "notification payloads"],
    overviewNote:
      "This surface exists to notify downstream consumers about newly arrived telemetry rather than to manage the source records themselves.",
    buyerGuidance:
      "Use this API when the integration needs event-driven awareness that new telemetry has landed in Insights Hub.",
    category: "Telemetry notifications",
    availableDescription:
      "Published API scope is limited to event notifications about telemetry arrival.",
  },
  {
    id: "insights-data-lake",
    slugs: ["integrated-data-lake-service"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["data-lake-storage", "telemetry-export", "analytics-files"],
    keyEntities: ["objects", "signed URLs", "dataset records", "telemetry exports"],
    overviewNote:
      "The integrated data lake is positioned as analytics-grade storage for both telemetry and related artifacts, with upload and download workflows.",
    buyerGuidance:
      "Use this API when the integration needs durable analytical storage beyond the core time-series service.",
    category: "Analytical storage",
    availableDescription:
      "Published API scope combines analytical object storage with upload and retrieval workflows.",
  },
  {
    id: "insights-mindconnect",
    slugs: ["mindconnect-api", "mindconnect-mqtt-api"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["device-connectivity", "ingestion", "event-and-file-push"],
    keyEntities: ["agents", "assets", "timeseries payloads", "events", "files"],
    overviewNote:
      "MindConnect is the primary connectivity surface for pushing asset context and telemetry into Insights Hub using REST or MQTT.",
    buyerGuidance:
      "Use these APIs when the integration is acting as an ingestion client into Insights Hub rather than only consuming stored data out of it.",
    category: "Connectivity ingest",
    availableDescription:
      "Published API scope combines asset onboarding with telemetry, event, and file ingestion.",
  },
  {
    id: "insights-asset-mgmt",
    slugs: ["asset-management-service"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["asset-modeling", "aspects", "hierarchies"],
    keyEntities: ["assets", "asset types", "aspects", "hierarchies"],
    overviewNote:
      "This service is about digital twin and asset-model management, not telemetry itself.",
    buyerGuidance:
      "Use this API when the integration needs to define or maintain the asset model that telemetry attaches to inside Insights Hub.",
    category: "Asset modeling",
    availableDescription:
      "Published API scope focuses on asset models, types, aspects, and hierarchy administration.",
  },
  {
    id: "insights-event-mgmt",
    slugs: ["event-management"],
    asset: "Un-Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["event-records", "incident-history"],
    keyEntities: ["events", "event types", "event histories"],
    overviewNote:
      "Event Management handles event records and their lifecycle, which is operational telemetry plus event write workflows.",
    buyerGuidance:
      "Use this API when the integration needs to create or read operational event records in Insights Hub.",
    category: "Event records",
    availableDescription:
      "Published API scope combines event retrieval with event creation and lifecycle updates.",
  },
  {
    id: "insights-case-mgmt",
    slugs: ["case-management-service"],
    asset: "Un-Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["cases", "workflow-triage", "attachments"],
    keyEntities: ["cases", "assignments", "attachments", "linked events"],
    overviewNote:
      "Case Management is a workflow surface for handling issues and related records rather than a telemetry or asset API.",
    buyerGuidance:
      "Use this API when the integration needs workflow and triage records in Insights Hub rather than raw asset or measurement data.",
    category: "Case workflows",
    availableDescription:
      "Published API scope is centered on case records, assignments, and linked workflow artifacts.",
  },
  {
    id: "insights-data-exchange",
    slugs: ["data-exchange-service"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Un-Supported",
    dataDomains: ["analytics-exchange", "dataset-sharing"],
    keyEntities: ["datasets", "exchange payloads", "analytics outputs"],
    overviewNote:
      "Data Exchange is positioned as a way to distribute processed data for analytics and sharing, not as a system-of-record writeback API.",
    buyerGuidance:
      "Use this API when the integration needs packaged analytical data out of Insights Hub for downstream use.",
    category: "Analytics exchange",
    availableDescription:
      "Published API scope focuses on exporting and sharing analytical data sets.",
  },
  {
    id: "insights-opcenter",
    slugs: ["opcenter-intelligence-service"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Un-Supported",
    dataDomains: ["manufacturing-analytics", "plant-intelligence"],
    keyEntities: ["plant records", "KPI outputs", "analytical results"],
    overviewNote:
      "Opcenter Intelligence is an analytics and intelligence surface that consumes plant data to produce insights.",
    buyerGuidance:
      "Use this API when the integration needs manufacturing intelligence outputs rather than operational command workflows.",
    category: "Manufacturing intelligence",
    availableDescription:
      "Published API scope focuses on analytical and intelligence outputs derived from plant data.",
  },
  {
    id: "optimize-my-plant",
    slugs: ["optimize-my-plant"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Un-Supported",
    dataDomains: ["plant-optimization", "analytics", "recommendations"],
    keyEntities: ["plant assets", "optimization metrics", "recommendations"],
    overviewNote:
      "The product is presented as an optimization application and collection for plant analysis and recommendations rather than control.",
    buyerGuidance:
      "Use this API when the integration needs optimization and recommendation outputs connected to plant context and analytics.",
    category: "Optimization analytics",
    availableDescription:
      "Published API scope focuses on plant optimization metrics and recommendation-oriented outputs.",
  },
  {
    id: "ot-companion-asset",
    slugs: ["ot-companion-asset-management-api"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["ot-asset-inventory", "vulnerability-monitoring", "baseline-management"],
    keyEntities: ["OT assets", "components", "baselines", "vulnerability records"],
    overviewNote:
      "OT Companion is explicitly described as continuous OT asset inventory monitoring with baseline and vulnerability context, and its APIs are positioned as open integration surfaces.",
    buyerGuidance:
      "Use this API when the integration needs OT asset inventory plus security/vulnerability monitoring context from substations and related environments.",
    category: "OT asset inventory",
    availableDescription:
      "Published API scope combines OT asset inventory, vulnerability context, and managed baseline records.",
  },
  {
    id: "ot-companion-protection",
    slugs: ["ot-companion-protection-settings-api"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["protection-settings", "ot-configuration"],
    keyEntities: ["protection settings", "configuration records", "OT assets"],
    overviewNote:
      "Protection settings are configuration-state records associated with OT assets rather than live telemetry feeds.",
    buyerGuidance:
      "Use this API when the integration needs to synchronize or govern OT protection-setting records.",
    category: "OT configuration",
    availableDescription:
      "Published API scope is centered on protection-setting and related OT configuration records.",
  },
  {
    id: "polarion",
    slugs: ["polarion-rest-api"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["alm-records", "work-items", "documents", "traceability"],
    keyEntities: ["work items", "documents", "attachments", "projects", "links"],
    overviewNote:
      "Polarion is an ALM integration layer for work items, documents, and related lifecycle records, not a telemetry API.",
    buyerGuidance:
      "Use this API when the integration needs application lifecycle and requirements records synchronized with external systems.",
    category: "ALM records",
    availableDescription:
      "Published API scope focuses on work-item, document, and project lifecycle records.",
  },
  {
    id: "train-api",
    slugs: ["train-api"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Un-Supported",
    dataDomains: ["rail-assets", "train-operations", "rail-telemetry"],
    keyEntities: ["trains", "rail assets", "operational data", "analytical insights"],
    overviewNote:
      "Railigent X is described as combining asset data, insights, prediction models, and recommendations for rail systems.",
    buyerGuidance:
      "Use this API when the integration needs rail asset and operational visibility rather than control over rolling stock behavior.",
    category: "Rail operations",
    availableDescription:
      "Published API scope combines rail asset context with operational and analytical data for rail systems.",
  },
  {
    id: "sigreen-procurement",
    slugs: ["sigreen-procurement-api"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["supplier-master-data", "components", "procurement-records"],
    keyEntities: ["suppliers", "components", "material categories", "supplier links", "PCF requests"],
    overviewNote:
      "The SiGREEN overview explicitly shows supplier, component, and procurement CRUD APIs and PCF request workflows.",
    buyerGuidance:
      "Use this API when the integration needs supplier and component master data plus procurement-side PCF request workflows in SiGREEN.",
    category: "Procurement master data",
    availableDescription:
      "Published API scope focuses on supplier, component, and procurement-side master data plus request workflows.",
  },
  {
    id: "sigreen-product",
    slugs: ["sigreen-product-api"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["product-master-data", "bom-management", "factory-records"],
    keyEntities: ["products", "BOM versions", "factories", "product identifiers"],
    overviewNote:
      "The SiGREEN overview publishes GET/POST/PATCH/DELETE product and BOM-related methods, making this a master-data and lifecycle API rather than telemetry.",
    buyerGuidance:
      "Use this API when the integration needs to synchronize product structures and related lifecycle records into SiGREEN.",
    category: "Product master data",
    availableDescription:
      "Published API scope focuses on products, BOMs, factories, and related master data in SiGREEN.",
  },
  {
    id: "sigreen-tasks",
    slugs: ["sigreen-my-tasks-api"],
    asset: "N/A",
    telemetry: "N/A",
    writeback: "Supported",
    dataDomains: ["task-workflows", "pcf-requests", "comments"],
    keyEntities: ["tasks", "task comments", "PCF requests", "task-product links"],
    overviewNote:
      "The My Tasks APIs are workflow endpoints for inbound and outbound PCF request handling rather than asset or telemetry payloads.",
    buyerGuidance:
      "Use this API when the integration needs to manage PCF request workflows and task collaboration inside SiGREEN.",
    category: "Task workflows",
    availableDescription:
      "Published API scope centers on task, request, and comment workflows in SiGREEN.",
  },
  {
    id: "sigreen-pcf",
    slugs: ["sigreen-pcf-api"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["product-carbon-footprints", "credentials", "emissions-records"],
    keyEntities: ["PCF records", "credentials", "factory emissions", "job status"],
    overviewNote:
      "The PCF APIs cover product carbon-footprint data and credential-generation workflows, which are structured business data rather than live telemetry.",
    buyerGuidance:
      "Use this API when the integration needs PCF export, credential creation, or emissions record handling in SiGREEN.",
    category: "Carbon footprint records",
    availableDescription:
      "Published API scope focuses on PCF records, credentials, and emissions-related product data.",
  },
  {
    id: "sitrans-hub-iq",
    slugs: ["external-apis"],
    asset: "Supported",
    telemetry: "Supported",
    writeback: "Supported",
    dataDomains: ["sensor-hub-data", "external-integrations", "device-context"],
    keyEntities: ["devices", "sensor data", "external integration records"],
    overviewNote:
      "The published surface is positioned as the external API layer for SITRANS hub IQ integrations, which combines hub context with operational data exchange.",
    buyerGuidance:
      "Use this API when the integration needs SITRANS hub IQ device context and data exchange with external systems.",
    category: "Hub integrations",
    availableDescription:
      "Published API scope combines hub-side device context with external data exchange workflows.",
  },
  {
    id: "teamcenter-cost",
    slugs: ["teamcenter-x-product-cost-management-rest-api"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["product-cost-records", "bom-costing", "plm-integration"],
    keyEntities: ["cost models", "products", "BOM cost records", "cost scenarios"],
    overviewNote:
      "This API is a product-cost and lifecycle business-data surface, not an operational telemetry feed.",
    buyerGuidance:
      "Use this API when the integration needs cost-management records synchronized between PLM and downstream workflows.",
    category: "Cost management",
    availableDescription:
      "Published API scope focuses on product cost-management records and lifecycle updates.",
  },
  {
    id: "walkinside",
    slugs: ["walkinside"],
    asset: "Supported",
    telemetry: "Un-Supported",
    writeback: "Supported",
    dataDomains: ["3d-asset-visualization", "digital-twin-navigation", "spatial-records"],
    keyEntities: ["3D models", "spatial records", "navigation artifacts", "asset-linked visualization data"],
    overviewNote:
      "Walkinside is presented as a 3D visualization and navigation platform for digital twin interaction, which is asset-context heavy rather than telemetry-driven.",
    buyerGuidance:
      "Use this API when the integration needs spatial or digital-twin visualization records tied to industrial assets.",
    category: "3D twin records",
    availableDescription:
      "Published API scope focuses on 3D visualization and asset-linked spatial records.",
  },
];

const profileBySlug = new Map();
for (const profile of profileDefinitions) {
  for (const slug of profile.slugs) {
    profileBySlug.set(slug, profile);
  }
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  values.push(current);
  return values;
}

async function loadRows() {
  const content = await fs.readFile(csvPath, "utf8");
  const lines = content.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function extractInternalNoteValue(internalNotes, key) {
  const pattern = new RegExp(`${key}=([^;]+)`);
  const match = String(internalNotes ?? "").match(pattern);
  return match ? match[1].trim() : "";
}

function cleanSummary(summary) {
  return String(summary ?? "").replace(/\s+/g, " ").trim();
}

function inferIntegrationType(rawType) {
  const value = String(rawType ?? "").trim();
  return value || "OpenAPI";
}

function normalizeFileSlug(productSlug) {
  return `${productSlug}.json`;
}

function parseJsonOperations(text) {
  try {
    const parsed = JSON.parse(text);
    if (!parsed.paths || typeof parsed.paths !== "object") {
      return [];
    }

    const operations = [];
    for (const [routePath, methods] of Object.entries(parsed.paths)) {
      if (!methods || typeof methods !== "object") {
        continue;
      }
      for (const method of ["get", "post", "put", "patch", "delete"]) {
        if (methods[method]) {
          operations.push(`${method.toUpperCase()} ${routePath}`);
        }
      }
    }
    return operations;
  } catch {
    return [];
  }
}

function parseYamlOperations(text) {
  const lines = text.split(/\r?\n/);
  const operations = [];
  let inPaths = false;
  let inChannels = false;
  let currentPath = "";
  let currentChannel = "";

  for (const line of lines) {
    if (/^paths:\s*$/.test(line)) {
      inPaths = true;
      inChannels = false;
      currentPath = "";
      continue;
    }

    if (/^channels:\s*$/.test(line)) {
      inChannels = true;
      inPaths = false;
      currentChannel = "";
      continue;
    }

    if (inPaths) {
      if (/^[A-Za-z]/.test(line) && !/^paths:\s*$/.test(line)) {
        inPaths = false;
        currentPath = "";
      }
      const pathMatch = line.match(/^\s{2}(\/[^:]+):\s*$/);
      if (pathMatch) {
        currentPath = pathMatch[1];
        continue;
      }
      const methodMatch = line.match(/^\s{4}(get|post|put|patch|delete):\s*$/i);
      if (methodMatch && currentPath) {
        operations.push(`${methodMatch[1].toUpperCase()} ${currentPath}`);
      }
      continue;
    }

    if (inChannels) {
      if (/^[A-Za-z]/.test(line) && !/^channels:\s*$/.test(line)) {
        inChannels = false;
        currentChannel = "";
      }
      const channelMatch = line.match(/^\s{2}([^:]+):\s*$/);
      if (channelMatch) {
        currentChannel = channelMatch[1].trim();
        continue;
      }
      const actionMatch = line.match(/^\s{4}(publish|subscribe):\s*$/i);
      if (actionMatch && currentChannel) {
        operations.push(`${actionMatch[1].toUpperCase()} ${currentChannel}`);
      }
    }
  }

  return operations;
}

async function fetchOperations(specUrl) {
  if (!specUrl) {
    return [];
  }

  try {
    const response = await fetch(specUrl, {
      headers: {
        "user-agent": "LastMileCatalogResearch/1.0",
      },
    });

    if (!response.ok) {
      return [];
    }

    const text = await response.text();
    const operations = parseJsonOperations(text);
    if (operations.length > 0) {
      return operations.slice(0, 8);
    }
    return parseYamlOperations(text).slice(0, 8);
  } catch {
    return [];
  }
}

function renderCapabilitySentence(profile) {
  const parts = [];
  parts.push(`Asset data is ${profile.asset}.`);
  parts.push(`Telemetry data is ${profile.telemetry}.`);
  parts.push(`Writeback is ${profile.writeback}.`);
  return parts.join(" ");
}

function buildBuyerGuidance(profile) {
  return profile.buyerGuidance;
}

function buildIngestConsiderations(profile, operations) {
  const notes = [];

  if (profile.telemetry === "Supported") {
    notes.push("This surface includes telemetry or event-oriented payloads that should be modeled for time-based ingestion or monitoring workflows.");
  }

  if (profile.writeback === "Supported") {
    notes.push("The published surface includes mutation or submission capabilities, so integrations should enforce explicit governance around which upstream systems are allowed to write.");
  }

  if (profile.writeback === "Un-Supported") {
    notes.push("The published surface is read-oriented for the covered domain and should not be advertised as a command or writeback API.");
  }

  if (operations.length === 0) {
    notes.push("The evidence for this record comes from the published Siemens overview and product summary; the public artifact did not expose a simple path list during generation.");
  } else {
    notes.push("Representative operations were pulled from the published spec artifact to keep the capability classification tied to the documented surface.");
  }

  return notes;
}

async function main() {
  await fs.mkdir(detailRoot, { recursive: true });
  const rows = await loadRows();
  const siemensRows = rows.filter((row) => row.vendor_slug === "siemens");
  const missingRows = siemensRows.filter((row) => row.product_slug !== "battery-passport-rest-api");
  const uncovered = missingRows.filter((row) => !profileBySlug.has(row.product_slug));

  if (uncovered.length > 0) {
    throw new Error(`Uncovered Siemens products: ${uncovered.map((row) => row.product_slug).join(", ")}`);
  }

  let writtenCount = 0;

  for (const row of missingRows) {
    const profile = profileBySlug.get(row.product_slug);
    const detailPath = path.join(detailRoot, normalizeFileSlug(row.product_slug));
    const documentationUrl = extractInternalNoteValue(row.internal_notes, "scraped_source") || row.integration_api_url;
    const specUrl = row.integration_api_url;
    const operations = await fetchOperations(specUrl);
    const productSummary = cleanSummary(row.product_summary);
    const overview = `${productSummary} ${profile.overviewNote} ${renderCapabilitySentence(profile)}`.trim();
    const coverageSummary = `${productSummary} ${profile.availableDescription}`.trim();

    const detailRecord = {
      vendor_slug: row.vendor_slug,
      vendor_name: row.vendor_name,
      product_slug: row.product_slug,
      product_name: row.product_name,
      product_family: row.product_family,
      integration_type: inferIntegrationType(row.integration_type),
      integration_api_url: row.integration_api_url,
      spec_artifact_url: row.integration_api_url,
      detail_completeness: "researched",
      data_coverage_summary: coverageSummary,
      data_domains: profile.dataDomains,
      asset_data_available: profile.asset,
      telemetry_data_available: profile.telemetry,
      writeback_supported: profile.writeback,
      key_entities: profile.keyEntities,
      buyer_guidance: buildBuyerGuidance(profile),
      overview,
      available_data: [
        {
          category: profile.category,
          description: profile.availableDescription,
          data_points: profile.keyEntities,
          relevant_operations: operations,
        },
      ],
      ingest_considerations: buildIngestConsiderations(profile, operations),
      source_evidence: {
        documentation_url: documentationUrl,
        spec_url: specUrl,
        reviewed_at: reviewDate,
        evidence_notes: `Classification is based on the official Siemens product overview and the published spec artifact for ${row.product_name}.`,
      },
    };

    await fs.writeFile(detailPath, `${JSON.stringify(detailRecord, null, 2)}\n`, "utf8");
    writtenCount += 1;
  }

  console.log(`Generated ${writtenCount} Siemens detail source files.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});