import { useEffect, useState } from "react";
import { ExternalLink as ExternalIcon } from "lucide-react";
import { useLocation } from "wouter";
import type { FormResult, League, LeagueId, Match, StandingRow, TableLeagueId, TableMeta, TableZone } from "@/types";
import { cn } from "@/lib/utils";
import { formatDayMonth, formatText, toIsoWithZone } from "@/lib/format";
import { SECTION, resolveRoute } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "./Links";
import { SectionHeading } from "./MatchCenter";

interface StandingsProps {
  rows: StandingRow[];
  tables: TableMeta[];
  leagues: League[];
  /** Table names that belong to clubs of the region */
  regionalNames: string[];
  defaultTable: TableLeagueId;
  cup: { intro: string; matches: Match[]; regionalNames: string[] };
}

const ZONE_SHADOW: Record<TableZone["tone"], string> = {
  sage: "shadow-[inset_2px_0_0_var(--color-sage)]",
  pure: "shadow-[inset_2px_0_0_var(--color-lapis-pure)]",
  muted: "shadow-[inset_2px_0_0_var(--color-lapis-muted)]",
  red: "shadow-[inset_2px_0_0_var(--color-dusty-red)]",
};
const ZONE_SWATCH: Record<TableZone["tone"], string> = {
  sage: "bg-sage",
  pure: "bg-lapis-pure",
  muted: "bg-lapis-muted",
  red: "bg-dusty-red",
};

const FORM_META: Record<FormResult, { letter: string; label: string; className: string }> = {
  W: { letter: "В", label: "перемога", className: "bg-sage/20 text-sage" },
  D: { letter: "Н", label: "нічия", className: "bg-lapis-muted/25 text-lapis-secondary" },
  L: { letter: "П", label: "поразка", className: "bg-dusty-red/20 text-dusty-red" },
};

const signed = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : "0");

export function Standings({ rows, tables, leagues, regionalNames, defaultTable, cup }: StandingsProps) {
  const [location] = useLocation();
  const [tab, setTab] = useState<TableLeagueId>(defaultTable);
  const leagueById = Object.fromEntries(leagues.map((l) => [l.id, l])) as Record<LeagueId, League>;

  useEffect(() => {
    const { table } = resolveRoute(location);
    if (table) setTab(table);
  }, [location]);

  return (
    <section id={SECTION.standings} aria-labelledby="standings-title">
      <SectionHeading id="standings-title" title="Турнірні таблиці" description="Сезон 2026/27. Клуби Полтавщини виділено." />
      <Tabs value={tab} onValueChange={(v) => setTab(v as TableLeagueId)}>
        <TabsList aria-label="Оберіть лігу">
          {tables.map((t) => {
            const hasRegional = rows.some((r) => r.league === t.league && regionalNames.includes(r.club));
            return (
              <TabsTrigger key={t.league} value={t.league}>
                {leagueById[t.league].name}
                {hasRegional && <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {tables.map((meta) => (
          <TabsContent key={meta.league} value={meta.league} forceMount className="data-[state=inactive]:hidden">
            <LeagueTable
              meta={meta}
              league={leagueById[meta.league]}
              rows={rows.filter((r) => r.league === meta.league).sort((a, b) => a.position - b.position)}
              regionalNames={regionalNames}
            />
          </TabsContent>
        ))}
      </Tabs>
      <CupBlock league={leagueById["kubok-ukrainy"]} intro={cup.intro} matches={cup.matches} regionalNames={cup.regionalNames} />
    </section>
  );
}

function LeagueTable({ meta, league, rows, regionalNames }: { meta: TableMeta; league: League; rows: StandingRow[]; regionalNames: string[] }) {
  const showForm = rows.some((r) => r.form.length > 0);
  const hasRegional = rows.some((r) => regionalNames.includes(r.club));
  const zoneFor = (pos: number) => meta.zones.find((z) => pos >= z.from && pos <= z.to);

  const th = "px-2.5 py-2.5 text-center font-medium";
  return (
    <div>
      <p className="mb-3 font-serif text-[14.5px] leading-[1.6] text-lapis-secondary">{formatText(meta.caption)}</p>
      <div className="scrollbar-thin overflow-x-auto rounded-[10px] border border-lapis-border">
        <table className={cn("tnum w-full border-collapse font-sans text-[13px]", showForm ? "min-w-[720px]" : "min-w-[600px]")}>
          <caption className="sr-only">{meta.title}</caption>
          <thead>
            <tr className="bg-lapis-deep text-[11.5px] text-lapis-secondary">
              <th scope="col" className="sticky left-0 z-10 w-11 bg-lapis-deep px-2.5 py-2.5 text-center font-medium">
                #
              </th>
              <th scope="col" className="sticky left-11 z-10 bg-lapis-deep px-2.5 py-2.5 text-left font-medium">
                Клуб
              </th>
              <th scope="col" className={th}><abbr title="Ігри" className="no-underline">І</abbr></th>
              <th scope="col" className={th}><abbr title="Перемоги" className="no-underline">В</abbr></th>
              <th scope="col" className={th}><abbr title="Нічиї" className="no-underline">Н</abbr></th>
              <th scope="col" className={th}><abbr title="Поразки" className="no-underline">П</abbr></th>
              <th scope="col" className={th}><abbr title="Забиті та пропущені м’ячі" className="no-underline">М</abbr></th>
              <th scope="col" className={th}><abbr title="Різниця м’ячів" className="no-underline">РМ</abbr></th>
              <th scope="col" className={cn(th, "text-ivory")}><abbr title="Очки" className="no-underline">О</abbr></th>
              {showForm && (
                <th scope="col" className="px-3 py-2.5 text-left font-medium">
                  Форма
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const regional = regionalNames.includes(r.club);
              const zone = zoneFor(r.position);
              const cell = cn(
                "border-t border-lapis-border/60 transition-colors duration-150",
                regional
                  ? "bg-[color-mix(in_oklab,var(--color-gold)_13%,var(--color-lapis-surface))] group-hover:bg-[color-mix(in_oklab,var(--color-gold)_17%,var(--color-lapis-elevated))]"
                  : "bg-lapis-surface group-hover:bg-lapis-elevated",
              );
              return (
                <tr key={r.club} className="group">
                  <td className={cn(cell, "sticky left-0 z-[1] w-11 px-2.5 py-2.5 text-center text-lapis-secondary", zone && ZONE_SHADOW[zone.tone])}>
                    {r.position}
                  </td>
                  <th scope="row" className={cn(cell, "sticky left-11 z-[1] px-2.5 py-2.5 text-left font-normal whitespace-nowrap")}>
                    <span className="inline-flex items-center gap-2">
                      {regional && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-gold" />}
                      <span className={cn(regional ? "font-semibold text-ivory-light" : "text-ivory")}>{r.club}</span>
                    </span>
                    {regional && <span className="sr-only"> (клуб Полтавщини)</span>}
                  </th>
                  <td className={cn(cell, "px-2.5 py-2.5 text-center text-ivory/85")}>{r.played}</td>
                  <td className={cn(cell, "px-2.5 py-2.5 text-center text-ivory/85")}>{r.won}</td>
                  <td className={cn(cell, "px-2.5 py-2.5 text-center text-ivory/85")}>{r.drawn}</td>
                  <td className={cn(cell, "px-2.5 py-2.5 text-center text-ivory/85")}>{r.lost}</td>
                  <td className={cn(cell, "px-2.5 py-2.5 text-center whitespace-nowrap text-ivory/85")}>
                    {r.goalsFor}–{r.goalsAgainst}
                  </td>
                  <td className={cn(cell, "px-2.5 py-2.5 text-center text-lapis-secondary")}>{signed(r.goalsFor - r.goalsAgainst)}</td>
                  <td className={cn(cell, "px-2.5 py-2.5 text-center font-semibold text-ivory-light")}>{r.points}</td>
                  {showForm && (
                    <td className={cn(cell, "px-3 py-2")}>
                      <span className="flex gap-1" aria-label={`Останні матчі: ${r.form.map((f) => FORM_META[f].label).join(", ")}`}>
                        {r.form.map((f, i) => (
                          <span
                            key={i}
                            aria-hidden="true"
                            title={FORM_META[f].label}
                            className={cn("inline-flex size-[22px] items-center justify-center rounded-[5px] text-[10.5px] font-semibold", FORM_META[f].className)}
                          >
                            {FORM_META[f].letter}
                          </span>
                        ))}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[12px] text-lapis-secondary">
        {meta.zones.map((z) => (
          <span key={z.label} className="inline-flex items-center gap-2">
            <span aria-hidden="true" className={cn("h-3 w-0.5 rounded-full", ZONE_SWATCH[z.tone])} />
            {z.label}
          </span>
        ))}
        {hasRegional && (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-flex size-3 items-center justify-center rounded-[3px] bg-[color-mix(in_oklab,var(--color-gold)_22%,var(--color-lapis-surface))]"><span className="size-1 rounded-full bg-gold" /></span>
            Клуб Полтавщини
          </span>
        )}
        {showForm && <span>Форма: від давнішого матчу до останнього</span>}
        <ExternalLink
          href={league.officialTableUrl}
          className="ml-auto inline-flex items-center gap-1 text-ivory underline decoration-lapis-border underline-offset-4 transition-colors hover:decoration-gold"
        >
          Джерело: {meta.source}
          <ExternalIcon className="size-3" strokeWidth={1.5} aria-hidden="true" />
        </ExternalLink>
      </div>
    </div>
  );
}

function CupBlock({ league, intro, matches, regionalNames }: { league: League; intro: string; matches: Match[]; regionalNames: string[] }) {
  const sorted = [...matches].sort((a, b) => a.date.localeCompare(b.date));
  const outcome = (m: Match) => {
    if (!m.score) return null;
    const regionalHome = regionalNames.includes(m.homeTeam);
    const decided = m.penalties ?? m.score;
    const homeWon = decided.home > decided.away;
    return regionalHome === homeWon ? "Пройшла далі" : "Вибула";
  };
  return (
    <div id={SECTION.cup} className="mt-12 rounded-[10px] border border-lapis-border bg-lapis-bg p-5 sm:p-6">
      <h3 className="font-display text-[1.5rem] leading-tight font-semibold text-ivory-light">{league.name} 2026/27</h3>
      <p className="mt-2 max-w-[46rem] font-serif text-[15px] leading-[1.65] text-ivory/75">{formatText(intro)}</p>
      <ul className="mt-5 divide-y divide-lapis-border/70 rounded-lg border border-lapis-border">
        {sorted.map((m) => {
          const result = outcome(m);
          return (
            <li key={m.id} className="grid gap-x-4 gap-y-1.5 bg-lapis-surface px-4 py-3 first:rounded-t-lg last:rounded-b-lg sm:grid-cols-[9.5rem_minmax(0,1fr)_auto] sm:items-center">
              <span className="font-sans text-[12px] text-lapis-secondary">
                {m.round},{" "}
                <time dateTime={toIsoWithZone(m.date)} className="tnum">
                  {formatDayMonth(m.date)}
                </time>
              </span>
              <span className="font-sans text-[13.5px] text-ivory">
                <span className={cn(regionalNames.includes(m.homeTeam) && "font-semibold text-ivory-light")}>{m.homeTeam}</span>{" "}
                <span className="tnum font-semibold text-gold">
                  {m.score?.home}:{m.score?.away}
                </span>{" "}
                <span className={cn(regionalNames.includes(m.awayTeam) && "font-semibold text-ivory-light")}>{m.awayTeam}</span>
                {m.penalties && (
                  <span className="tnum text-lapis-secondary">
                    {" "}
                    (пен. {m.penalties.home}:{m.penalties.away})
                  </span>
                )}
              </span>
              {result && <Badge variant={result === "Вибула" ? "paused" : "muted"}>{result}</Badge>}
            </li>
          );
        })}
      </ul>
      <ExternalLink
        href={league.officialTableUrl}
        className="mt-4 inline-flex items-center gap-1 font-sans text-[12.5px] text-ivory underline decoration-lapis-border underline-offset-4 transition-colors hover:decoration-gold"
      >
        Сітка й регламент на сайті {league.organizer}
        <ExternalIcon className="size-3" strokeWidth={1.5} aria-hidden="true" />
      </ExternalLink>
    </div>
  );
}
