import { useMemo, useRef, useState } from "react";
import { Activity, ChevronDown, ListOrdered, Menu } from "lucide-react";
import type { Club, League, LeagueId, Match, SectionLinkItem, SiteInfo, TableLeagueId } from "@/types";
import { cn } from "@/lib/utils";
import { formatFixtureDay, formatLongEditionDate, formatTime } from "@/lib/format";
import { SECTION, TABLE_ROUTES } from "@/lib/routes";
import { useHeaderOffset } from "@/hooks/use-header-offset";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ClubCrest } from "./ClubCrest";
import { SectionLink } from "./Links";
import { Logo } from "./Logo";

interface SiteHeaderProps {
  site: SiteInfo;
  matches: Match[];
  clubs: Club[];
  leagues: League[];
  tocItems: SectionLinkItem[];
}

const TABLE_LEAGUES: TableLeagueId[] = ["premier-liha", "persha-liha", "druha-liha"];

const isTableLeague = (id: LeagueId): id is TableLeagueId => id !== "kubok-ukrainy";

export function SiteHeader({ site, matches, clubs, leagues, tocItems }: SiteHeaderProps) {
  const ref = useRef<HTMLElement>(null);
  useHeaderOffset(ref);
  const leagueById = useMemo(() => Object.fromEntries(leagues.map((l) => [l.id, l])) as Record<LeagueId, League>, [leagues]);

  return (
    <header ref={ref} className="sticky top-0 z-50">
      <LiveStrip matches={matches} clubs={clubs} leagueById={leagueById} edition={site.edition} />
      <div className="border-b border-lapis-border bg-lapis-deep/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
          <Logo name={site.name} tagline={site.tagline} />
          <DesktopNav clubs={clubs} leagueById={leagueById} tocItems={tocItems} className="hidden lg:block" />
          <div className="ml-auto flex items-center gap-3">
            <time dateTime={site.edition.slice(0, 10)} className="hidden font-sans text-[12.5px] text-lapis-secondary xl:block">
              {formatLongEditionDate(site.edition)}
            </time>
            <MobileNav site={site} clubs={clubs} leagueById={leagueById} className="lg:hidden" />
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------- live strip */

function sortTicker(matches: Match[]) {
  const rank = { live: 0, finished: 1, scheduled: 2 } as const;
  return matches
    .filter((m) => m.ticker)
    .sort((a, b) => {
      if (a.status !== b.status) return rank[a.status] - rank[b.status];
      return a.status === "scheduled" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    });
}

function LiveStrip({ matches, clubs, leagueById, edition }: { matches: Match[]; clubs: Club[]; leagueById: Record<LeagueId, League>; edition: string }) {
  const items = useMemo(() => sortTicker(matches), [matches]);
  const regional = useMemo(() => new Set(clubs.map((c) => c.matchName)), [clubs]);
  return (
    <div className="border-b border-lapis-border/70 bg-lapis-deep">
      <div className="mx-auto flex h-9 max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <span className="inline-flex shrink-0 items-center gap-1.5 font-sans text-[11px] font-semibold text-lapis-secondary">
          <Activity className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
          Матчі
        </span>
        <ul aria-label="Результати та розклад матчів" className="fade-x scrollbar-none flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {items.map((m) => {
            const league = leagueById[m.competition];
            const href = isTableLeague(m.competition) ? TABLE_ROUTES[m.competition] : `/${SECTION.cup}`;
            const scoreText = m.score ? `${m.score.home}:${m.score.away}` : "";
            const when = m.status === "scheduled" ? `${formatFixtureDay(m.date, edition)}, ${formatTime(m.date)}` : "";
            const label =
              m.status === "scheduled"
                ? `${league.name}: ${m.homeTeam} — ${m.awayTeam}, ${when}`
                : `${league.name}: ${m.homeTeam} ${scoreText} ${m.awayTeam}${m.status === "live" ? `, наживо, ${m.minute}-та хвилина` : ", завершено"}`;
            const teamClass = (name: string) => (regional.has(name) ? "font-semibold text-ivory-light" : "text-ivory/85");
            return (
              <li key={m.id} className="shrink-0">
                <SectionLink
                  href={href}
                  aria-label={label}
                  className="flex h-7 items-center gap-2 rounded-md px-2.5 font-sans text-[12px] whitespace-nowrap transition-colors duration-200 hover:bg-lapis-surface"
                >
                  <span className="text-[10px] font-semibold text-lapis-muted">{league.shortName}</span>
                  {m.status === "live" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold">
                      <span className="size-1.5 animate-live-pulse rounded-full bg-gold" />
                      <span className="tnum">{m.minute}′</span>
                    </span>
                  )}
                  {m.status === "scheduled" && <span className="tnum text-[11px] text-lapis-secondary">{when}</span>}
                  <span className={teamClass(m.homeTeam)}>{m.homeTeam}</span>
                  {m.score ? (
                    <span className="tnum font-semibold text-gold">{scoreText}</span>
                  ) : (
                    <span className="text-lapis-muted">—</span>
                  )}
                  <span className={teamClass(m.awayTeam)}>{m.awayTeam}</span>
                </SectionLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- desktop nav */

type NavKey = "home" | TableLeagueId | null;

function navKeyFor(activeId: string, clubs: Club[]): NavKey {
  if (activeId === SECTION.lead || activeId === SECTION.matchCenter) return "home";
  const club = clubs.find((c) => c.id === activeId);
  return club ? club.navLeague : null;
}

const navItemClass = (active: boolean) =>
  cn(
    "relative inline-flex h-10 items-center gap-1.5 rounded-md px-3 font-sans text-[14px] font-medium transition-colors duration-200 hover:text-ivory-light",
    "after:absolute after:inset-x-3 after:-bottom-[13px] after:h-px after:bg-gold after:transition-opacity after:duration-200",
    active ? "text-ivory-light after:opacity-100" : "text-ivory/80 after:opacity-0",
  );

function DesktopNav({ clubs, leagueById, tocItems, className }: { clubs: Club[]; leagueById: Record<LeagueId, League>; tocItems: SectionLinkItem[]; className?: string }) {
  const asideBeside = useMediaQuery("(min-width: 1024px)");
  const { activeId } = useScrollSpy(tocItems, asideBeside);
  const active = navKeyFor(activeId, clubs);
  return (
    <nav aria-label="Основна навігація" className={className}>
      <ul className="flex items-center gap-0.5">
        <li>
          <SectionLink href="/" className={navItemClass(active === "home")}>
            Головна
          </SectionLink>
        </li>
        {TABLE_LEAGUES.map((id) => (
          <li key={id}>
            <LeagueMenu league={leagueById[id]} clubs={clubs.filter((c) => c.navLeague === id)} active={active === id} />
          </li>
        ))}
        <li>
          <SectionLink href={`/${SECTION.cup}`} className={navItemClass(false)}>
            {leagueById["kubok-ukrainy"].name}
          </SectionLink>
        </li>
      </ul>
    </nav>
  );
}

function LeagueMenu({ league, clubs, active }: { league: League; clubs: Club[]; active: boolean }) {
  const tableId = league.id as TableLeagueId;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={cn(navItemClass(active), "group outline-none data-[state=open]:text-ivory-light")}>
        {league.name}
        <ChevronDown className="size-3.5 text-lapis-secondary transition-transform duration-200 group-data-[state=open]:rotate-180" strokeWidth={1.75} aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Організатор: {league.organizer}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <SectionLink href={TABLE_ROUTES[tableId]}>
            <ListOrdered className="size-4 text-lapis-secondary" strokeWidth={1.5} aria-hidden="true" />
            Турнірна таблиця
          </SectionLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {clubs.length > 0 ? (
          clubs.map((club) => (
            <DropdownMenuItem key={club.id} asChild>
              <SectionLink href={`/${club.id}`}>
                <ClubCrest club={club} size="sm" />
                <span className="flex min-w-0 flex-col">
                  <span className="font-medium">{club.name}</span>
                  <span className={cn("text-xs", club.status === "paused" ? "text-dusty-red" : "text-lapis-secondary")}>
                    {club.status === "paused" ? club.statusLabel : `${club.city}, ${league.name.toLowerCase()}`}
                  </span>
                </span>
              </SectionLink>
            </DropdownMenuItem>
          ))
        ) : (
          <p className="px-2.5 py-2 font-sans text-xs leading-relaxed text-lapis-secondary">Клубів Полтавщини в цьому сезоні тут немає.</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------------------------------------------------------------- mobile nav */

function MobileNav({ site, clubs, leagueById, className }: { site: SiteInfo; clubs: Club[]; leagueById: Record<LeagueId, League>; className?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const linkClass = "flex min-h-11 items-center rounded-md px-3 font-sans text-[15px] text-ivory transition-colors hover:bg-lapis-surface hover:text-ivory-light";
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Відкрити меню"
        className={cn("inline-flex size-10 items-center justify-center rounded-lg text-ivory transition-colors hover:bg-lapis-elevated", className)}
      >
        <Menu className="size-5" strokeWidth={1.5} />
      </SheetTrigger>
      <SheetContent side="right" aria-describedby="mobile-nav-desc">
        <div className="border-b border-lapis-border px-5 pt-5 pb-4">
          <SheetTitle className="font-display text-xl text-ivory-light">Меню</SheetTitle>
          <SheetDescription id="mobile-nav-desc" className="mt-1 font-sans text-xs text-lapis-secondary">
            {formatLongEditionDate(site.edition)}, сезон {site.season}
          </SheetDescription>
        </div>
        <nav aria-label="Мобільна навігація" className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            <li>
              <SectionLink href="/" onNavigate={close} delayScroll className={linkClass}>
                Головна
              </SectionLink>
            </li>
            {TABLE_LEAGUES.map((id) => {
              const league = leagueById[id];
              const leagueClubs = clubs.filter((c) => c.navLeague === id);
              return (
                <li key={id} className="pt-2">
                  <SectionLink href={TABLE_ROUTES[id]} onNavigate={close} delayScroll className={cn(linkClass, "justify-between")}>
                    {league.name}
                    <span className="font-sans text-xs text-lapis-secondary">таблиця</span>
                  </SectionLink>
                  {leagueClubs.length > 0 && (
                    <ul className="mt-1 ml-3 space-y-1 border-l border-lapis-border pl-2">
                      {leagueClubs.map((club) => (
                        <li key={club.id}>
                          <SectionLink href={`/${club.id}`} onNavigate={close} delayScroll className={cn(linkClass, "gap-3 py-1.5")}>
                            <ClubCrest club={club} size="sm" />
                            <span className="flex min-w-0 flex-col">
                              <span>{club.name}</span>
                              {club.status === "paused" && <span className="text-xs text-dusty-red">{club.statusLabel}</span>}
                            </span>
                          </SectionLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            <li className="pt-2">
              <SectionLink href={`/${SECTION.cup}`} onNavigate={close} delayScroll className={linkClass}>
                {leagueById["kubok-ukrainy"].name}
              </SectionLink>
            </li>
          </ul>
          <div className="mt-5 border-t border-lapis-border pt-4">
            <p className="px-3 pb-2 font-sans text-xs text-lapis-secondary">На цій сторінці</p>
            <ul className="space-y-1">
              {[
                { href: `/${SECTION.matchCenter}`, label: "Матч-центр" },
                { href: `/${SECTION.latest}`, label: "Останні новини" },
                { href: `/${SECTION.social}`, label: "Спільнота у Facebook" },
                { href: `/${SECTION.contacts}`, label: "Контакти редакції" },
              ].map((item) => (
                <li key={item.href}>
                  <SectionLink href={item.href} onNavigate={close} delayScroll className={linkClass}>
                    {item.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
