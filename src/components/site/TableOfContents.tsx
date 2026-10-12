import { useState } from "react";
import { ChevronUp, ListTree } from "lucide-react";
import type { SectionLinkItem } from "@/types";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SectionLink } from "./Links";

function useToc(items: SectionLinkItem[]) {
  const asideBeside = useMediaQuery("(min-width: 1024px)");
  const spy = useScrollSpy(items, asideBeside);
  const visible = asideBeside ? items.filter((i) => i.placement === "main") : items;
  return { ...spy, visible };
}

/** Desktop: sticky rail in the left column, active section marked with a gold tick on the stone line */
export function TocRail({ items }: { items: SectionLinkItem[] }) {
  const { activeId, progress, visible } = useToc(items);
  return (
    <nav aria-label="Зміст сторінки" className="sticky top-[calc(var(--header-h)+40px)]">
      <p className="mb-4 font-sans text-xs text-lapis-secondary">Зміст</p>
      <div className="relative">
        <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px bg-lapis-border" />
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 w-px origin-top bg-gold/50 transition-transform duration-150"
          style={{ height: "100%", transform: `scaleY(${progress})` }}
        />
        <ul className="space-y-0.5">
          {visible.map((item) => {
            const active = item.id === activeId;
            return (
              <li key={item.id}>
                <SectionLink
                  href={`/${item.id}`}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "relative block py-1.5 pl-4 font-sans text-[13px] leading-snug transition-colors duration-200",
                    active ? "text-ivory-light" : "text-lapis-secondary hover:text-ivory",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1/2 left-0 h-4 w-px -translate-y-1/2 bg-gold transition-opacity duration-200",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item.label}
                </SectionLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/** Below 1280px: a compact pill at the bottom of the screen that opens the full contents list */
export function TocFloating({ items, className }: { items: SectionLinkItem[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const { activeId, progress, scrolled, visible } = useToc(items);
  const current = visible.find((i) => i.id === activeId) ?? visible[0];
  const index = Math.max(0, visible.findIndex((i) => i.id === current?.id));

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] transition-[opacity,transform] duration-200",
        scrolled ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
    >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          tabIndex={scrolled ? 0 : -1}
          aria-hidden={scrolled ? undefined : true}
          className="pointer-events-auto relative flex h-11 max-w-full items-center gap-3 overflow-hidden rounded-full border border-lapis-border bg-lapis-deep/95 pr-4 pl-3.5 font-sans text-[13px] text-ivory backdrop-blur-md"
        >
          <ListTree className="size-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
          <span className="text-lapis-secondary">Зміст</span>
          <span className="truncate font-medium text-ivory-light">{current?.label}</span>
          <span className="tnum text-[11px] text-lapis-muted">
            {index + 1}/{visible.length}
          </span>
          <ChevronUp className="size-4 shrink-0 text-lapis-secondary" strokeWidth={1.5} aria-hidden="true" />
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-px bg-gold/60" style={{ width: `${progress * 100}%` }} />
        </SheetTrigger>
        <SheetContent side="bottom" aria-describedby="toc-desc">
          <div className="px-5 pt-5 pb-3">
            <SheetTitle className="font-display text-xl text-ivory-light">Зміст сторінки</SheetTitle>
            <SheetDescription id="toc-desc" className="mt-1 font-sans text-xs text-lapis-secondary">
              Перейдіть до потрібного розділу
            </SheetDescription>
          </div>
          <nav aria-label="Зміст сторінки" className="scrollbar-thin overflow-y-auto px-3 pb-5">
            <ul className="space-y-0.5">
              {visible.map((item) => {
                const active = item.id === activeId;
                return (
                  <li key={item.id}>
                    <SectionLink
                      href={`/${item.id}`}
                      onNavigate={() => setOpen(false)}
                      delayScroll
                      aria-current={active ? "location" : undefined}
                      className={cn(
                        "flex min-h-11 items-center gap-3 rounded-md px-3 font-sans text-[15px] transition-colors",
                        active ? "bg-lapis-surface text-ivory-light" : "text-ivory/85 hover:bg-lapis-surface",
                      )}
                    >
                      <span aria-hidden="true" className={cn("h-4 w-px", active ? "bg-gold" : "bg-lapis-border")} />
                      {item.label}
                    </SectionLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
