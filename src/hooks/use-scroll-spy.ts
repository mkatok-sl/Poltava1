import { useEffect, useState } from "react";
import type { SectionLinkItem } from "@/types";

interface ScrollSpyState {
  activeId: string;
  /** 0..1 progress through the whole page */
  progress: number;
  /** true once the visitor has scrolled past the masthead */
  scrolled: boolean;
}

/**
 * Highlights the section whose top has crossed a reading line just under the sticky header.
 * Side-column sections are skipped while that column sits beside the main flow,
 * because they are always visible there.
 */
export function useScrollSpy(items: SectionLinkItem[], skipAside: boolean): ScrollSpyState {
  const [state, setState] = useState<ScrollSpyState>({
    activeId: items[0]?.id ?? "",
    progress: 0,
    scrolled: false,
  });

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
      const line = headerH + Math.min(window.innerHeight * 0.3, 260);
      const candidates = items.filter((item) => !(skipAside && item.placement === "aside"));
      let active = candidates[0]?.id ?? "";
      for (const item of candidates) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) active = item.id;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const atBottom = max > 0 && window.scrollY >= max - 4;
      if (atBottom && candidates.length) active = candidates[candidates.length - 1].id;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const scrolled = window.scrollY > 320;
      setState((prev) =>
        prev.activeId === active && Math.abs(prev.progress - progress) < 0.002 && prev.scrolled === scrolled
          ? prev
          : { activeId: active, progress, scrolled },
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items, skipAside]);

  return state;
}
