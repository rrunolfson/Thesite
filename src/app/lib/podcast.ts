export interface PodcastEpisode {
  guid: string;
  title: string;
  description: string;
  date: string;
  duration: string | null;
  episodeNumber: string | null;
  audioUrl: string | null;
  link: string | null;
  imageUrl: string | null;
}

export interface PodcastFeed {
  title: string;
  description: string;
  link: string | null;
  imageUrl: string | null;
  episodes: PodcastEpisode[];
}

function getText(parent: Element | null, selector: string) {
  return parent?.querySelector(selector)?.textContent?.trim() ?? null;
}

function getAttribute(parent: Element | null, selector: string, attributeName: string) {
  return parent?.querySelector(selector)?.getAttribute(attributeName) ?? null;
}

export async function fetchPodcastFeed(limit?: number) {
  const response = await fetch(`/podcast-feed.xml?ts=${Date.now()}`, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to load podcast feed: ${response.status}`);
  }

  const xml = await response.text();
  const parsed = new DOMParser().parseFromString(xml, "application/xml");
  const parserError = parsed.querySelector("parsererror");

  if (parserError) {
    throw new Error("Podcast feed XML could not be parsed.");
  }

  const channel = parsed.querySelector("channel");
  const items = Array.from(parsed.querySelectorAll("channel > item"));
  const episodes = items
    .map((item) => ({
      guid: getText(item, "guid") ?? getText(item, "title") ?? crypto.randomUUID(),
      title: getText(item, "title") ?? "Untitled episode",
      description:
        getText(item, "description") ??
        getText(item, "content\\:encoded") ??
        "",
      date: getText(item, "pubDate") ?? "",
      duration: getText(item, "itunes\\:duration"),
      episodeNumber: getText(item, "itunes\\:episode"),
      audioUrl: item.querySelector("enclosure")?.getAttribute("url") ?? null,
      link: getText(item, "link"),
      imageUrl: getAttribute(item, "itunes\\:image", "href") ?? getAttribute(channel, "itunes\\:image", "href"),
    }))
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

  return {
    title: getText(channel, "title") ?? "Signal 2 Action",
    description: getText(channel, "description") ?? "",
    link: getText(channel, "link"),
    imageUrl: getAttribute(channel, "itunes\\:image", "href") ?? getText(channel, "image > url"),
    episodes: typeof limit === "number" ? episodes.slice(0, limit) : episodes,
  } satisfies PodcastFeed;
}

export function formatPodcastDate(date: string) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function durationToIso(duration: string | null) {
  if (!duration) {
    return undefined;
  }

  const parts = duration.split(":").map((part) => Number(part));

  if (parts.some((part) => Number.isNaN(part))) {
    return undefined;
  }

  if (parts.length === 2) {
    return `PT${parts[0]}M${parts[1]}S`;
  }

  if (parts.length === 3) {
    return `PT${parts[0]}H${parts[1]}M${parts[2]}S`;
  }

  return undefined;
}