import { Fragment, type ReactNode } from "react";

/**
 * Turns `**bold**` markdown into <strong>. Used for every paragraph and list item
 * so editorial copy can carry emphasis without raw asterisks leaking into the page.
 */
export function formatText(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+?\*\*)/g)
    .filter((part) => part.length > 0)
    .map((part, i) => {
      const match = /^\*\*([^*]+?)\*\*$/.exec(part);
      return match ? (
        <strong key={i} className="font-semibold text-ivory-light">
          {match[1]}
        </strong>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      );
    });
}

/** Plain-text version for attributes, JSON-LD and meta tags */
export function stripFormatting(text: string): string {
  return text.replace(/\*\*([^*]+?)\*\*/g, "$1");
}

const MONTHS_GENITIVE = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
const MONTHS_SHORT = ["січ.", "лют.", "бер.", "квіт.", "трав.", "черв.", "лип.", "серп.", "вер.", "жовт.", "лист.", "груд."];
const WEEKDAYS = ["неділя", "понеділок", "вівторок", "середа", "четвер", "п’ятниця", "субота"];
const WEEKDAYS_SHORT = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

interface LocalDate {
  y: number;
  m: number;
  d: number;
  hh: string;
  mm: string;
}

/** Parses "YYYY-MM-DDTHH:mm" without touching the runtime time zone, so server and browser render identical text. */
export function parseLocal(iso: string): LocalDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso);
  if (!match) throw new Error(`Bad date: ${iso}`);
  return { y: +match[1], m: +match[2], d: +match[3], hh: match[4], mm: match[5] };
}

const dayIndex = ({ y, m, d }: LocalDate) => Date.UTC(y, m - 1, d) / 86_400_000;
const weekday = (ld: LocalDate) => new Date(Date.UTC(ld.y, ld.m - 1, ld.d)).getUTCDay();

export const formatTime = (iso: string) => {
  const ld = parseLocal(iso);
  return `${ld.hh}:${ld.mm}`;
};

export const formatDate = (iso: string) => {
  const ld = parseLocal(iso);
  return `${ld.d} ${MONTHS_GENITIVE[ld.m - 1]} ${ld.y}`;
};

export const formatDateTime = (iso: string) => `${formatDate(iso)}, ${formatTime(iso)}`;

export const formatDayMonth = (iso: string) => {
  const ld = parseLocal(iso);
  return `${ld.d} ${MONTHS_GENITIVE[ld.m - 1]}`;
};

export const formatShortDate = (iso: string) => {
  const ld = parseLocal(iso);
  return `${ld.d} ${MONTHS_SHORT[ld.m - 1]}`;
};

export const formatWeekdayShort = (iso: string) => WEEKDAYS_SHORT[weekday(parseLocal(iso))];

export const formatLongEditionDate = (iso: string) => {
  const ld = parseLocal(iso);
  const wd = WEEKDAYS[weekday(ld)];
  return `${wd[0].toUpperCase()}${wd.slice(1)}, ${ld.d} ${MONTHS_GENITIVE[ld.m - 1]} ${ld.y}`;
};

/** "18:30" for the edition day, "Учора, 22:00" for the day before, otherwise "8 жовт., 16:20" */
export function formatNewsTime(iso: string, editionIso: string): string {
  const diff = dayIndex(parseLocal(editionIso)) - dayIndex(parseLocal(iso));
  const time = formatTime(iso);
  if (diff === 0) return time;
  if (diff === 1) return `Учора, ${time}`;
  return `${formatShortDate(iso)}, ${time}`;
}

/** Relative day name for fixtures: "Сьогодні", "Завтра" or "Сб, 17 жовтня" */
export function formatFixtureDay(iso: string, editionIso: string): string {
  const diff = dayIndex(parseLocal(iso)) - dayIndex(parseLocal(editionIso));
  if (diff === 0) return "Сьогодні";
  if (diff === 1) return "Завтра";
  return `${formatWeekdayShort(iso)}, ${formatDayMonth(iso)}`;
}

/** Ukraine observes EEST (+03:00) from the last Sunday of March to the last Sunday of October. */
function kyivOffset({ y, m, d }: LocalDate): string {
  const lastSunday = (month: number) => {
    const last = new Date(Date.UTC(y, month, 0));
    return last.getUTCDate() - last.getUTCDay();
  };
  const afterStart = m > 3 || (m === 3 && d >= lastSunday(3));
  const beforeEnd = m < 10 || (m === 10 && d < lastSunday(10));
  return afterStart && beforeEnd ? "+03:00" : "+02:00";
}

/** Machine-readable value for <time dateTime> and JSON-LD */
export function toIsoWithZone(iso: string): string {
  const ld = parseLocal(iso);
  return `${iso.slice(0, 16)}:00${kyivOffset(ld)}`;
}

/** Ukrainian plural forms: [one, few, many] */
export function pluralUk(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export const commentsLabel = (n: number) => `${n} ${pluralUk(n, ["коментар", "коментарі", "коментарів"])}`;

/** Two-letter mark for clubs that have no crest of their own on the site */
export function teamInitials(name: string): string {
  const words = name.replace(/[«»"]/g, "").split(/[\s-]+/).filter(Boolean);
  if (words.length > 1 && !/^\d/.test(words[1])) return (words[0][0] + words[1][0]).toUpperCase();
  return words[0].slice(0, 2).toUpperCase();
}
