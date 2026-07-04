export type AnalyticsEventName =
  | "cta_contact_click"
  | "cta_explore_platform_click"
  | "cta_product_click"
  | "cta_ssom_click"
  | "cta_podcast_click"
  | "form_contact_start"
  | "form_contact_submit"
  | "form_conversation_type_selected"
  | "podcast_episode_play"
  | "podcast_subscribe_click"
  | "technical_collaboration_cta_click";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: string, eventName: string, payload?: Record<string, unknown>) => void;
  }
}

function getUtmParams() {
  if (typeof window === "undefined") {
    return {};
  }

  const searchParams = new URLSearchParams(window.location.search);

  return {
    utm_source: searchParams.get("utm_source") ?? undefined,
    utm_medium: searchParams.get("utm_medium") ?? undefined,
    utm_campaign: searchParams.get("utm_campaign") ?? undefined,
    utm_term: searchParams.get("utm_term") ?? undefined,
    utm_content: searchParams.get("utm_content") ?? undefined,
  };
}

export function trackEvent(
  eventName: AnalyticsEventName,
  payload: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  const eventPayload = {
    event: eventName,
    page_path: window.location.pathname,
    page_url: window.location.href,
    ...getUtmParams(),
    ...payload,
  };

  window.dataLayer?.push(eventPayload);
  window.gtag?.("event", eventName, eventPayload);
  window.dispatchEvent(new CustomEvent("lastmile:analytics", { detail: eventPayload }));
}
