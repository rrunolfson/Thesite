import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { Link, type LinkProps } from "react-router";
import { trackEvent, type AnalyticsEventName } from "@/app/lib/analytics";

interface TrackedLinkProps extends LinkProps {
  eventName?: AnalyticsEventName;
  eventData?: Record<string, unknown>;
}

export function TrackedLink({ eventName, eventData, onClick, ...props }: TrackedLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (eventName) {
      trackEvent(eventName, eventData);
    }

    onClick?.(event);
  };

  return <Link {...props} onClick={handleClick} />;
}

interface TrackedAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  eventName?: AnalyticsEventName;
  eventData?: Record<string, unknown>;
}

export function TrackedAnchor({ eventName, eventData, onClick, ...props }: TrackedAnchorProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (eventName) {
      trackEvent(eventName, eventData);
    }

    onClick?.(event);
  };

  return <a {...props} onClick={handleClick} />;
}