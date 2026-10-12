import { useEffect, useState } from "react";
import { ExternalLink as ExternalIcon, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import type { Article, Club, League } from "@/types";
import { cn } from "@/lib/utils";
import { formatText, pluralUk } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "./ArticleCard";
import { ClubCrest } from "./ClubCrest";
import { ExternalLink, SectionLink } from "./Links";

interface ClubSectionProps {
  club: Club;
  league: League | null;
  articles: Article[];
  /** Flip the asymmetric grid so neighbouring sections do not repeat the same rhythm */
  mirror?: boolean;
}

/** Asymmetric brick rhythm: wide/narrow, then narrow/wide */
const SPANS = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

export function ClubSection({ club, league, articles, mirror = false }: ClubSectionProps) {
  const [location] = useLocation();
  const [expanded, setExpanded] = useState(false);
  const titleId = `${club.id}-title`;
  const grid = articles.filter((a) => a.placement === "grid");
  const more = articles.filter((a) => a.placement === "more");
  const all = [...grid, ...more];

  useEffect(() => {
    if (location === `/${club.id}`) setExpanded(true);
  }, [location, club.id]);

  return (
    <section id={club.id} aria-labelledby={titleId}>
      <header className="flex flex-wrap items-center gap-x-5 gap-y-4">
        <ClubCrest club={club} size="lg" />
        <div className="min-w-0 flex-1 basis-[13rem]">
          <h2 id={titleId} className="font-display text-[2rem] leading-[1.05] font-semibold text-ivory-light [overflow-wrap:anywhere] sm:text-[2.25rem]">
            {club.name}
          </h2>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[12.5px] text-lapis-secondary">
            {club.status === "paused" ? <Badge variant="paused">{club.statusLabel}</Badge> : league && <Badge variant="muted">{league.name}</Badge>}
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
              {club.city}
            </span>
            {club.stadium && <span>Стадіон {club.stadium}</span>}
            {club.founded && <span className="tnum">Засновано {club.founded}</span>}
            {club.officialUrl && (
              <ExternalLink
                href={club.officialUrl}
                className="inline-flex items-center gap-1 text-ivory underline decoration-lapis-border underline-offset-4 transition-colors hover:decoration-gold"
              >
                Офіційний сайт
                <ExternalIcon className="size-3" strokeWidth={1.5} aria-hidden="true" />
              </ExternalLink>
            )}
          </div>
        </div>
      </header>

      <p className="mt-5 max-w-[46rem] font-serif text-[16px] leading-[1.7] text-ivory/75">{formatText(club.summary)}</p>

      <div className="mt-7 grid gap-4 md:grid-cols-12">
        {all.map((article, i) => {
          const span = SPANS[(i + (mirror ? 1 : 0)) % 4];
          const isHidden = article.placement === "more" && !expanded;
          return (
            <ArticleCard
              key={article.id}
              article={article}
              variant={span === "md:col-span-7" ? "feature" : "standard"}
              className={cn(span)}
              hidden={isHidden}
            />
          );
        })}
      </div>

      {more.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-lapis-border/70 pt-4">
          <p className="font-sans text-[12.5px] text-lapis-secondary">
            {expanded ? `Показано всі ${all.length} ${pluralUk(all.length, ["матеріал", "матеріали", "матеріалів"])}` : `Показано ${grid.length} з ${all.length}`}
          </p>
          {expanded ? (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="font-sans text-[13px] font-semibold text-ivory underline decoration-lapis-border underline-offset-4 transition-colors hover:decoration-gold"
            >
              Згорнути розділ
            </button>
          ) : (
            <SectionLink
              href={`/${club.id}`}
              noScroll
              onClick={() => setExpanded(true)}
              className="font-sans text-[13px] font-semibold text-ivory underline decoration-gold/60 underline-offset-4 transition-colors hover:text-ivory-light hover:decoration-gold"
            >
              Всі новини розділу «{club.name}»
            </SectionLink>
          )}
        </div>
      )}
    </section>
  );
}
