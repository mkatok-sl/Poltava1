import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { Link } from "wouter";
import { markClickNavigation, scrollToRoute } from "@/lib/routes";

/** Every outbound link goes through here: new tab, no opener, no referrer. */
export function ExternalLink({ href, children, ...props }: Omit<ComponentProps<"a">, "target" | "rel"> & { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

type SectionLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  /** Called before scrolling, e.g. to close a menu */
  onNavigate?: () => void;
  /** Wait for an overlay to unmount before scrolling */
  delayScroll?: boolean;
  /** Update the route without moving the page (e.g. expanding a section in place) */
  noScroll?: boolean;
};

/**
 * In-page navigation. Renders a real link to the section route (/vorskla, /persha-liha…)
 * through wouter, so it works with the detected base path and is crawlable, then scrolls
 * to the matching anchor without leaving the page.
 */
export function SectionLink({ href, onNavigate, delayScroll, noScroll, onClick, children, ...props }: SectionLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    onNavigate?.();
    markClickNavigation(href);
    if (noScroll) return;
    if (delayScroll) window.setTimeout(() => scrollToRoute(href), 60);
    else scrollToRoute(href);
  };
  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
