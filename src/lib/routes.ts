import type { TableLeagueId } from "@/types";

/** Anchor ids double as wouter routes: /vorskla scrolls to #vorskla */
export const SECTION = {
  lead: "holovne",
  matchCenter: "match-tsentr",
  standings: "tablytsi",
  cup: "kubok-ukrainy",
  latest: "ostanni-novyny",
  social: "facebook",
  contacts: "kontakty",
} as const;

export const TABLE_ROUTES: Record<TableLeagueId, string> = {
  "premier-liha": "/premier-liha",
  "persha-liha": "/persha-liha",
  "druha-liha": "/druha-liha",
};

export interface ResolvedRoute {
  targetId: string | null;
  table?: TableLeagueId;
}

export function resolveRoute(path: string): ResolvedRoute {
  const slug = path.replace(/^\/+|\/+$/g, "");
  if (!slug) return { targetId: null };
  if (slug in TABLE_ROUTES) return { targetId: SECTION.standings, table: slug as TableLeagueId };
  return { targetId: slug };
}

/** Article permalinks are plain fragments so they never leave the page */
export const articleAnchor = (id: string) => `article-${id}`;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scrolls to a route target. Respects scroll-padding-top from the sticky header. */
export function scrollToRoute(path: string, opts: { instant?: boolean } = {}) {
  if (typeof window === "undefined") return;
  const { targetId } = resolveRoute(path);
  const behavior: ScrollBehavior = opts.instant || prefersReducedMotion() ? "auto" : "smooth";
  if (!targetId) {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const el = document.getElementById(targetId);
  if (el) el.scrollIntoView({ behavior, block: "start" });
}

/** Lets a click handler tell the router effect that the scroll is already under way */
let pendingPath: string | null = null;
export const markClickNavigation = (path: string) => {
  pendingPath = path;
};
export const consumeClickNavigation = (path: string) => {
  const handled = pendingPath === path;
  pendingPath = null;
  return handled;
};
