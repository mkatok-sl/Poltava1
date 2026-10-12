import { ChevronRight, CirclePause, Goal, MapPin } from "lucide-react";
import type { Club, League, LeagueId, Match, MatchEvent } from "@/types";
import { cn } from "@/lib/utils";
import { formatFixtureDay, formatText, formatTime, toIsoWithZone } from "@/lib/format";
import { SECTION } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ClubCrest, TeamMark } from "./ClubCrest";
import { SectionLink } from "./Links";

export function SectionHeading({ id, title, description }: { id: string; title: string; description?: string }) {
  return (
    <div className="mb-7 max-w-[44rem]">
      <h2 id={id} className="font-display text-[2rem] leading-[1.1] font-semibold text-ivory-light sm:text-[2.25rem]">
        {title}
      </h2>
      {description && <p className="mt-2 font-serif text-[15.5px] leading-[1.6] text-lapis-secondary">{formatText(description)}</p>}
    </div>
  );
}

interface MatchCenterProps {
  matches: Match[];
  clubs: Club[];
  leagues: League[];
  edition: string;
}

const clubOf = (name: string, clubs: Club[]) => clubs.find((c) => c.matchName === name);
const involves = (m: Match, club: Club) => m.homeTeam === club.matchName || m.awayTeam === club.matchName;

export function MatchCenter({ matches, clubs, leagues, edition }: MatchCenterProps) {
  const leagueById = Object.fromEntries(leagues.map((l) => [l.id, l])) as Record<LeagueId, League>;
  const regional = matches.filter((m) => clubs.some((c) => involves(m, c)));
  const live = regional.find((m) => m.status === "live");
  const finished = regional.filter((m) => m.status === "finished").sort((a, b) => b.date.localeCompare(a.date));
  const featured = live ?? finished[0];
  const previous = finished.filter((m) => m !== featured && m.competition === featured?.competition).slice(0, 2);

  return (
    <section id={SECTION.matchCenter} aria-labelledby="match-center-title">
      <SectionHeading id="match-center-title" title="Матч-центр" description="Останній результат клубів Полтавщини та найближчі матчі." />
      <div className="grid gap-4 md:grid-cols-12">
        {featured && (
          <Scoreboard
            match={featured}
            league={leagueById[featured.competition]}
            clubs={clubs}
            previous={previous}
            edition={edition}
            className="md:col-span-7"
          />
        )}
        <NextMatches clubs={clubs} matches={matches} leagueById={leagueById} edition={edition} className="md:col-span-5" />
        <QuickLinks clubs={clubs} leagueById={leagueById} className="md:col-span-12" />
      </div>
    </section>
  );
}

function TeamSide({ name, clubs, align }: { name: string; clubs: Club[]; align: "start" | "end" }) {
  const club = clubOf(name, clubs);
  return (
    <div className={cn("flex min-w-0 flex-col items-center gap-2.5 text-center sm:flex-row", align === "end" && "sm:flex-row-reverse sm:text-right", align === "start" && "sm:text-left")}>
      {club ? <ClubCrest club={club} size="md" /> : <TeamMark name={name} className="size-10 text-[11px]" />}
      <span className={cn("font-sans text-[15px] leading-tight [overflow-wrap:anywhere]", club ? "font-semibold text-ivory-light" : "text-ivory")}>{name}</span>
    </div>
  );
}

function EventIcon({ type }: { type: MatchEvent["type"] }) {
  if (type === "red") return <span aria-hidden="true" className="inline-block h-3 w-2 shrink-0 rounded-[2px] bg-dusty-red" />;
  return <Goal className="size-3.5 shrink-0 text-lapis-secondary" strokeWidth={1.5} aria-hidden="true" />;
}

const eventLabel = (e: MatchEvent) => (e.type === "penalty" ? `${e.player} (пен.)` : e.type === "red" ? `${e.player}, вилучення` : e.player);

function Scoreboard({
  match,
  league,
  clubs,
  previous,
  edition,
  className,
}: {
  match: Match;
  league: League;
  clubs: Club[];
  previous: Match[];
  edition: string;
  className?: string;
}) {
  const isLive = match.status === "live";
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <h3 className="font-sans text-[15px] font-semibold text-ivory-light">{isLive ? "Матч триває" : "Останній результат"}</h3>
        {isLive ? (
          <Badge variant="gold">
            <span className="size-1.5 animate-live-pulse rounded-full bg-lapis-deep" />
            Наживо, <span className="tnum">{match.minute}′</span>
          </Badge>
        ) : (
          <Badge variant="muted">Завершено</Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-5">
        <p className="font-sans text-[12.5px] text-lapis-secondary">
          {league.name}, {match.round}
          <span className="mx-1.5 text-lapis-muted">/</span>
          <time dateTime={toIsoWithZone(match.date)}>
            {formatFixtureDay(match.date, edition)}, {formatTime(match.date)}
          </time>
        </p>
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-5">
          <TeamSide name={match.homeTeam} clubs={clubs} align="start" />
          <p className="tnum text-center font-sans text-[2.75rem] leading-none font-semibold text-gold sm:text-[3.25rem]" aria-label={`Рахунок ${match.score?.home} : ${match.score?.away}`}>
            {match.score?.home}
            <span className="mx-1.5 text-lapis-muted">:</span>
            {match.score?.away}
          </p>
          <TeamSide name={match.awayTeam} clubs={clubs} align="end" />
        </div>
        {match.venue && (
          <p className="mt-4 flex items-center justify-center gap-1.5 font-sans text-[12.5px] text-lapis-secondary">
            <MapPin className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
            {match.venue}
          </p>
        )}
        {match.events && match.events.length > 0 && (
          <ol aria-label="Ключові моменти" className="mt-5 space-y-1.5 border-t border-lapis-border pt-4">
            {match.events.map((e, i) => (
              <li key={i} className={cn("flex items-center gap-2 font-sans text-[13px]", e.team === "away" && "flex-row-reverse text-right")}>
                <span className="tnum w-9 shrink-0 text-lapis-secondary">{e.minute}′</span>
                <EventIcon type={e.type} />
                <span className="text-ivory/90">{eventLabel(e)}</span>
              </li>
            ))}
          </ol>
        )}
        {previous.length > 0 && (
          <div className="mt-auto pt-5">
            <p className="font-sans text-[12px] text-lapis-secondary">Попередні матчі</p>
            <ul className="mt-2 divide-y divide-lapis-border/70 rounded-lg border border-lapis-border">
              {previous.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 py-2 font-sans text-[13px]">
                  <span className="text-ivory/90">
                    {m.homeTeam} <span className="tnum font-semibold text-gold">{m.score?.home}:{m.score?.away}</span> {m.awayTeam}
                  </span>
                  <span className="text-[12px] text-lapis-secondary">{m.round}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NextMatches({
  clubs,
  matches,
  leagueById,
  edition,
  className,
}: {
  clubs: Club[];
  matches: Match[];
  leagueById: Record<LeagueId, League>;
  edition: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="font-sans text-[15px] font-semibold text-ivory-light">Наступні матчі</h3>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="divide-y divide-lapis-border/70">
          {clubs.map((club) => {
            const next = matches
              .filter((m) => m.status === "scheduled" && involves(m, club))
              .sort((a, b) => a.date.localeCompare(b.date))[0];
            const home = next?.homeTeam === club.matchName;
            const opponent = next ? (home ? next.awayTeam : next.homeTeam) : "";
            return (
              <li key={club.id} className="flex gap-3.5 py-4 first:pt-1 last:pb-0">
                <ClubCrest club={club} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-[14px] font-semibold text-ivory-light">{club.name}</p>
                  {next ? (
                    <>
                      <p className="mt-1 flex flex-wrap items-baseline gap-x-2 font-sans text-[13px] text-ivory/85">
                        <time dateTime={toIsoWithZone(next.date)} className="tnum">
                          {formatFixtureDay(next.date, edition)},{" "}
                          <span className="font-semibold text-ivory-light">{formatTime(next.date)}</span>
                        </time>
                        <span className="text-lapis-secondary">{home ? "вдома" : "на виїзді"}</span>
                      </p>
                      <p className="mt-0.5 font-sans text-[13px] text-ivory/85">
                        проти «{opponent}»
                      </p>
                      <p className="mt-1 font-sans text-[12px] text-lapis-secondary">
                        {leagueById[next.competition].name}, {next.round}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-1 inline-flex items-center gap-1.5 font-sans text-[12.5px] text-dusty-red">
                        <CirclePause className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                        {club.statusLabel ?? "Офіційних матчів немає"}
                      </p>
                      {club.statusNote && <p className="mt-1 font-serif text-[13.5px] leading-[1.55] text-ivory/70">{formatText(club.statusNote)}</p>}
                      <SectionLink
                        href={`/${club.id}`}
                        className="mt-1.5 inline-flex items-center gap-1 font-sans text-[12.5px] text-ivory underline decoration-lapis-border underline-offset-4 transition-colors hover:decoration-gold"
                      >
                        Що відомо про клуб
                      </SectionLink>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

function QuickLinks({ clubs, leagueById, className }: { clubs: Club[]; leagueById: Record<LeagueId, League>; className?: string }) {
  return (
    <div className={cn("rounded-[10px] border border-lapis-border bg-lapis-bg px-5 py-4", className)}>
      <h3 className="font-sans text-[13px] font-semibold text-lapis-secondary">Розділи клубів</h3>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {clubs.map((club) => (
          <li key={club.id}>
            <SectionLink
              href={`/${club.id}`}
              className="flex items-center gap-3 rounded-lg border border-lapis-border bg-lapis-surface p-2.5 pr-3 transition-[transform,border-color] duration-200 hover:scale-105 hover:border-gold/55"
            >
              <ClubCrest club={club} size="md" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-sans text-[14px] font-semibold text-ivory-light">{club.name}</span>
                <span className="truncate font-sans text-[12px] text-lapis-secondary">
                  {club.league ? leagueById[club.league].name : club.statusLabel}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-lapis-muted" strokeWidth={1.5} aria-hidden="true" />
            </SectionLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
