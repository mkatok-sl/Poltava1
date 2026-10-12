import type { LucideIcon } from "lucide-react";

export type ClubId = "vorskla" | "sk-poltava" | "hirnyk-sport";
export type LeagueId = "premier-liha" | "persha-liha" | "druha-liha" | "kubok-ukrainy";
export type TableLeagueId = Exclude<LeagueId, "kubok-ukrainy">;

export interface League {
  id: LeagueId;
  name: string;
  shortName: string;
  /** Body that runs the competition (УПЛ, ПФЛ, УАФ) */
  organizer: string;
  organizerUrl: string;
  /** Official table or calendar page */
  officialTableUrl: string;
}

export interface Club {
  id: ClubId;
  name: string;
  /** Name inside running text, with Ukrainian quotes */
  quotedName: string;
  city: string;
  /** Competition the club plays in this season; null when it is not playing */
  league: LeagueId | null;
  /** Menu group the club is listed under (mirrors the competitor's information architecture) */
  navLeague: TableLeagueId;
  status: "active" | "paused";
  statusLabel?: string;
  statusNote?: string;
  crestBg: string;
  crestText: string;
  crestShape: "heater" | "round" | "angular";
  founded?: number;
  stadium?: string;
  officialUrl?: string;
  /** How the club is written in league tables */
  tableName?: string;
  /** How the club is written in match listings */
  matchName: string;
  summary: string;
}

export type ArticlePlacement = "lead" | "grid" | "more" | "wire";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  /** Badge text: club or competition name */
  category: string;
  club: ClubId | null;
  league: LeagueId | null;
  /** Kyiv local time, "YYYY-MM-DDTHH:mm" */
  date: string;
  commentsCount: number;
  imageBg: string;
  imageIcon: LucideIcon;
  isBreaking?: boolean;
  isLive?: boolean;
  isPremium?: boolean;
  placement: ArticlePlacement;
}

export type MatchStatus = "live" | "finished" | "scheduled";

export interface MatchEvent {
  minute: string;
  type: "goal" | "penalty" | "red";
  team: "home" | "away";
  player: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  score: { home: number; away: number } | null;
  penalties?: { home: number; away: number };
  status: MatchStatus;
  /** Current minute for live matches */
  minute?: number;
  /** Kyiv local time, "YYYY-MM-DDTHH:mm" */
  date: string;
  competition: LeagueId;
  round: string;
  venue?: string;
  events?: MatchEvent[];
  /** Show in the header score strip */
  ticker?: boolean;
}

export type FormResult = "W" | "D" | "L";

export interface StandingRow {
  league: TableLeagueId;
  position: number;
  club: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  /** Oldest to newest; empty when the source does not publish form */
  form: FormResult[];
}

export interface TableZone {
  from: number;
  to: number;
  tone: "sage" | "pure" | "muted" | "red";
  label: string;
}

export interface TableMeta {
  league: TableLeagueId;
  title: string;
  caption: string;
  source: string;
  zones: TableZone[];
}

export interface SectionLinkItem {
  id: string;
  label: string;
  /** Sections rendered in the side column are skipped by scroll-spy when the column sits beside the main flow */
  placement: "main" | "aside";
}

export interface SiteInfo {
  name: string;
  tagline: string;
  /** Edition timestamp the content is current to, Kyiv local time */
  edition: string;
  season: string;
  intro: string;
  description: string;
  socialText: string;
  editor: string;
  email: string;
  facebookUrl: string;
}

export interface OfficialLink {
  label: string;
  href: string;
}
