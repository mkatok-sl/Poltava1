import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { consumeClickNavigation, scrollToRoute } from "@/lib/routes";

/** Scrolls to the section named by the route on first load (deep links, 404 fallback) and on back/forward. */
export function RouteEffects() {
  const [location] = useLocation();
  const first = useRef(true);
  useEffect(() => {
    const isFirst = first.current;
    first.current = false;
    if (consumeClickNavigation(location)) return;
    if (isFirst && location === "/") return;
    const timer = window.setTimeout(() => scrollToRoute(location, { instant: isFirst }), isFirst ? 150 : 0);
    return () => window.clearTimeout(timer);
  }, [location]);
  return null;
}
