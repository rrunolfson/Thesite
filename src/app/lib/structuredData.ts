import type { PodcastEpisode } from "./podcast";

const siteUrl = "https://lastmileinc.ai";

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Last Mile",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: ["https://www.linkedin.com/company/lastmile-inc/"],
    description:
      "Last Mile turns operational signals into coordinated work, authorized automation, and visible operational outcomes.",
  };
}

export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Last Mile",
    url: siteUrl,
    description:
      "Last Mile turns operational signals into coordinated work, authorized automation, and visible operational outcomes.",
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function createProductSchema(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url: `${siteUrl}${path}`,
    brand: {
      "@type": "Organization",
      name: "Last Mile",
    },
    category: "Operational intelligence platform",
  };
}

export function createPodcastSeriesSchema(episodes: PodcastEpisode[]) {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: "Signal 2 Action",
    url: `${siteUrl}/signal-to-action`,
    description:
      "Signal 2 Action is the Last Mile podcast about operational intelligence, semantic context, trustworthy automation, and the path from signal to accountable action.",
    publisher: {
      "@type": "Organization",
      name: "Last Mile",
      url: siteUrl,
    },
    hasPart: episodes.map((episode) => ({
      "@type": "PodcastEpisode",
      name: episode.title,
      description: episode.description,
      datePublished: episode.date ? new Date(episode.date).toISOString() : undefined,
      duration: episode.duration,
      associatedMedia: episode.audioUrl
        ? {
            "@type": "MediaObject",
            contentUrl: episode.audioUrl,
          }
        : undefined,
    })),
  };
}
