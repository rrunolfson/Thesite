import { SEO } from "@/app/components/SEO";
import { EditorialHero, EditorialSection, NextStep } from "@/app/components/NarrativeComponents";
import { createBreadcrumbSchema, createProductSchema } from "@/app/lib/structuredData";

const roleViews = ["Facilities operator", "Maintenance or reliability leader", "Regional operations leader", "Service provider", "Platform administrator"] as const;
const resultStates = ["Recovery verified", "Partially recovered", "Intervention unsuccessful", "Recurrence detected", "Verification unavailable because data is stale or missing"] as const;

export function InfinitControlPage() {
  const description = "Infinit-Control gives authorized roles a live view of affected equipment, ownership, work, source quality, return telemetry, and recovery status.";
  return <><SEO title="Infinit-Control | See Whether the Operation Recovered" description={description} canonicalPath="/infinit-control" jsonLd={[createProductSchema("Infinit-Control", "/infinit-control", description), createBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Infinit-Control", path: "/infinit-control" }])]} />
    <div className="lm-v2-page">
      <EditorialHero eyebrow="Infinit-Control · See the result" title="See whether the operation actually recovered." intro="Infinit-Control gives each authorized role a live view of the affected equipment, current operating state, ownership, work, decisions, source quality, return telemetry, and recovery status." primary={{ label: "Discuss Your Command Experience", to: "/contact?intent=operation" }} secondary={{ label: "See the Cooling Use Case", to: "/data-center-cooling" }} />

      <EditorialSection title="A command experience, not dashboard wallpaper." tone="dark">
        <div className="lm-command-surface"><div className="lm-command-surface__bar"><strong>Cooling Loop B · Active response</strong><span>Operating on reduced protection</span></div><div className="lm-command-surface__grid"><article><span>Affected topology</span><strong>CHWP-02 · Loop B · Hall 04</strong><p>Command ON · run feedback OFF<br />Source fresh · identity resolved</p></article><article><span>Ownership</span><strong>Facilities</strong><p>Provider acknowledged · approval granted</p></article><article><span>Return telemetry</span><strong>ΔP · 11.8 psi</strong><p>Amperage rising · run state changing</p></article><article><span>Protected environment</span><strong>Rack inlet · 23.4°C</strong><p>Within approved band</p></article><article><span>Recovery contract</span><strong>Evaluating</strong><p>Stability and recurrence window active</p></article></div></div>
      </EditorialSection>

      <EditorialSection title="The same issue appears differently to each authorized role." intro="Permissions and data scope remain visible; a provider does not receive the same view or authority as a platform administrator.">
        <div className="lm-role-views">{roleViews.map((role) => <article key={role}><h3>{role}</h3><p>Role-specific operating context, actions, evidence, and scope.</p></article>)}</div>
      </EditorialSection>

      <EditorialSection eyebrow="Result states" title="Work completion does not determine the operating result." tone="grid">
        <div className="lm-result-states">{resultStates.map((state, index) => <article key={state}><span>{String(index + 1).padStart(2, "0")}</span><h3>{state}</h3></article>)}</div>
        <p className="lm-v2-caveat">A green completion state appears only when the recovery contract has sufficient, current evidence—not because a task or ticket was closed.</p>
      </EditorialSection>
      <NextStep title="See the result model in a complete operating scenario." copy="The Data Center Cooling use case applies source evidence, shared equipment context, governed work, and a telemetry-based recovery contract to one response." label="Review the Cooling Use Case" to="/data-center-cooling" secondary={{ label: "Discuss Your Command Experience", to: "/contact?intent=operation" }} />
    </div>
  </>;
}
