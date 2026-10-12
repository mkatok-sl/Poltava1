import type { Article } from "@/types";
import { cn } from "@/lib/utils";
import { formatNewsTime, toIsoWithZone } from "@/lib/format";
import { SECTION } from "@/lib/routes";
import { SectionLink } from "./Links";

/** Sticky side column: newest headlines across every category */
export function LatestNews({ items, edition, hrefFor }: { items: Article[]; edition: string; hrefFor: (a: Article) => string }) {
  return (
    <section
      id={SECTION.latest}
      aria-labelledby="latest-title"
      className="scrollbar-thin lg:sticky lg:top-[calc(var(--header-h)+40px)] lg:max-h-[calc(100vh-var(--header-h)-64px)] lg:overflow-y-auto lg:pr-1"
    >
      <h2 id="latest-title" className="font-display text-[1.625rem] leading-tight font-semibold text-ivory-light">
        Останні новини
      </h2>
      <ol className="mt-4 divide-y divide-lapis-border/70 border-t border-lapis-border">
        {items.map((a) => {
          const href = hrefFor(a);
          const flag = a.isLive ? "Наживо" : a.isBreaking ? "Терміново" : null;
          const linkClass = "transition-colors duration-200 hover:text-gold-hover focus-visible:text-gold-hover";
          return (
            <li key={a.id} className="py-3.5">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-sans text-[11.5px]">
                <time dateTime={toIsoWithZone(a.date)} className="tnum text-lapis-secondary">
                  {formatNewsTime(a.date, edition)}
                </time>
                <span aria-hidden="true" className="h-3 w-px bg-lapis-border" />
                <span className={cn(flag ? "font-semibold text-gold" : "text-lapis-secondary")}>{flag ? `${flag}, ${a.category}` : a.category}</span>
              </p>
              <h3 className="mt-1 font-serif text-[15.5px] leading-[1.4] font-semibold text-ivory-light">
                {href.startsWith("#") ? (
                  <a href={href} className={linkClass}>
                    {a.title}
                  </a>
                ) : (
                  <SectionLink href={href} className={linkClass}>
                    {a.title}
                  </SectionLink>
                )}
              </h3>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
