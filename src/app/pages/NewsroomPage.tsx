import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { SEO } from "@/app/components/SEO";
import { CtaLink, PageHero, Section } from "@/app/components/MarketingComponents";
import { pressReleasesByNewest } from "@/app/content/newsroom";

function formatDate(date: string) { return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00`)); }
export function NewsroomPage() { return <><SEO title="News and Updates | Last Mile" description="Company news, platform milestones, partnerships, and progress toward a vendor-independent Physical Operations Platform." canonicalPath="/company/newsroom" />
  <PageHero eyebrow="News and updates" title="Progress toward the Physical Operations Platform." intro="Company news, platform milestones, partnerships, and progress toward a vendor-independent Physical Operations Platform." />
  <Section eyebrow="Pinned company update" title="Last Mile is connecting the complete operational response." tone="wash"><article className="lm-pinned-update"><span>Current company direction · August 2026</span><h3>An independent platform for cross-system response and measurable recovery.</h3><p>The Last Mile Platform brings together Infinit-Signal, Singularity, Infinit-Flow, and Infinit-Control. Data Center Cooling is the first approved reference use case and a commercial proof is being developed.</p><div><CtaLink to="/platform" eventName="cta_explore_platform_click">Explore the Platform</CtaLink><CtaLink to="/data-center-cooling" variant="secondary" eventName="cta_explore_platform_click">View the Reference Use Case</CtaLink></div></article></Section>
  <Section eyebrow="Company archive" title="Company Archive — Prior Strategic Chapter" intro="The releases below document an earlier ServiceNow-focused chapter of Last Mile. They are preserved as historical records and have not been silently rewritten to match the company’s current independent-platform direction."><div className="lm-news-list">{pressReleasesByNewest.map((release) => <article key={release.slug}><time>{formatDate(release.date)}</time><div><Link to={`/company/newsroom/${release.slug}`}><h3>{release.title}</h3><ArrowRight /></Link><p>{release.summary}</p></div></article>)}</div></Section>
  <section className="lm-closing"><div><p className="lm-eyebrow">Media and company inquiries</p><h2>Talk with Last Mile.</h2><div className="lm-actions"><CtaLink to="/contact?intent=media">Contact the Company</CtaLink></div></div></section>
  </>; }
