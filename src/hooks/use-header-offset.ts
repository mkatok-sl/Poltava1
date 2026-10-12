import { useEffect, type RefObject } from "react";

/** Publishes the sticky header height as --header-h so anchors, sticky columns and scroll-spy line up under it. */
export function useHeaderOffset(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => document.documentElement.style.setProperty("--header-h", `${Math.round(el.offsetHeight)}px`);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}
