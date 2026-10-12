import {
  Award,
  Ban,
  CalendarClock,
  ChartColumn,
  CirclePause,
  Goal,
  History,
  Hourglass,
  ListOrdered,
  ListTree,
  MapPin,
  Radio,
  Route as RouteIcon,
  ScrollText,
  ShieldAlert,
  Table2,
  Target,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import type {
  Article,
  Club,
  FormResult,
  League,
  Match,
  OfficialLink,
  SectionLinkItem,
  SiteInfo,
  StandingRow,
  TableLeagueId,
  TableMeta,
} from "@/types";
import { SECTION, TABLE_ROUTES, articleAnchor } from "@/lib/routes";
import { ClubSection } from "@/components/site/ClubSection";
import { CrestDefs, VeinDivider } from "@/components/site/Decor";
import { Hero } from "@/components/site/Hero";
import { LatestNews } from "@/components/site/LatestNews";
import { MatchCenter } from "@/components/site/MatchCenter";
import { RouteEffects } from "@/components/site/RouteEffects";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SocialBlock } from "@/components/site/SocialBlock";
import { Standings } from "@/components/site/Standings";
import { StructuredData } from "@/components/site/StructuredData";
import { TocFloating, TocRail } from "@/components/site/TableOfContents";

/* =====================================================================
   CONTENT
   Edition: Monday, 12 October 2026, evening. League data are taken from
   the official PFL and UPL tables of that day. Editorial copy is written
   for this site; replace SITE.editor, SITE.email and SITE.facebookUrl
   with the publication's real details before going live.
   ===================================================================== */

const SITE: SiteInfo = {
  name: "Лазур",
  tagline: "футбол Полтавщини",
  edition: "2026-10-12T19:00",
  season: "2026/27",
  intro:
    "Щоденна хроніка футболу області: **СК «Полтава» в Першій лізі**, сезон без «Ворскли», пауза «Гірника-Спорт», матч-центр і таблиці всіх ліг.",
  description:
    "Видання про футбол Полтавщини. Пишемо про клуби області, **Прем’єр-лігу, Першу та Другу ліги** й Кубок України, перевіряючи дані за офіційними джерелами.",
  socialText:
    "Анонси матчів, результати й обговорення в коментарях. **Головне публікуємо одразу після фінального свистка**, а розбори туру — наступного ранку.",
  editor: "Ольга Мирошниченко",
  email: "redakciya@lazur-football.com.ua",
  facebookUrl: "https://www.facebook.com/",
};

const LEAGUES_DATA: League[] = [
  { id: "premier-liha", name: "Прем’єр-ліга", shortName: "УПЛ", organizer: "УПЛ", organizerUrl: "https://upl.ua/", officialTableUrl: "https://upl.ua/ua" },
  { id: "persha-liha", name: "Перша ліга", shortName: "1Л", organizer: "ПФЛ", organizerUrl: "https://pfl.ua/", officialTableUrl: "https://pfl.ua/standing/1353" },
  { id: "druha-liha", name: "Друга ліга", shortName: "2Л", organizer: "ПФЛ", organizerUrl: "https://pfl.ua/", officialTableUrl: "https://pfl.ua/standing/1355" },
  { id: "kubok-ukrainy", name: "Кубок України", shortName: "КУ", organizer: "УАФ", organizerUrl: "https://uaf.ua/", officialTableUrl: "https://uaf.ua/" },
];

/**
 * `navLeague` decides which menu dropdown lists the club. The competitor still files
 * СК Полтава under the Premier League; after relegation in 2026 it plays in the First
 * League, so it is listed there. Change one field to restore any other mapping.
 */
const CLUBS_DATA: Club[] = [
  {
    id: "vorskla",
    name: "Ворскла",
    quotedName: "«Ворскла»",
    city: "Полтава",
    league: null,
    navLeague: "persha-liha",
    status: "paused",
    statusLabel: "Поза змаганнями ПФЛ",
    statusNote: "Клуб не отримав атестат на сезон 2026/27 і **готується до повернення в сезоні 2027/28**.",
    crestBg: "linear-gradient(160deg, #557f74 0%, #2c4a44 55%, #1d3330 100%)",
    crestText: "В",
    crestShape: "heater",
    founded: 1955,
    stadium: "«Ворскла» ім. Олексія Бутовського",
    officialUrl: "http://vorskla.com.ua/",
    matchName: "Ворскла",
    summary:
      "Найтитулованіший клуб області пропускає сезон 2026/27: атестаційний комітет УАФ **не допустив «Ворсклу» до змагань ПФЛ** через борги. Тут новини про відновлення клубу та його історію.",
  },
  {
    id: "sk-poltava",
    name: "СК Полтава",
    quotedName: "СК «Полтава»",
    city: "Полтава",
    league: "persha-liha",
    navLeague: "persha-liha",
    status: "active",
    crestBg: "linear-gradient(160deg, #8a5262 0%, #5a2f3d 55%, #3b1f2a 100%)",
    crestText: "П",
    crestShape: "round",
    founded: 2011,
    stadium: "«Ворскла» ім. Олексія Бутовського",
    officialUrl: "https://scpoltava.com/",
    tableName: "Полтава",
    matchName: "СК Полтава",
    summary:
      "Після вильоту з УПЛ «Полтава» бореться за повернення в еліту: **п’яте місце після 11 турів** і найкращий бомбардир Першої ліги у складі.",
  },
  {
    id: "hirnyk-sport",
    name: "Гірник-Спорт",
    quotedName: "«Гірник-Спорт»",
    city: "Горішні Плавні",
    league: null,
    navLeague: "druha-liha",
    status: "paused",
    statusLabel: "Знявся з Другої ліги",
    statusNote: "Клуб відмовився від участі в сезоні 2026/27 через брак фінансування й **розраховує заявитися наступного року**.",
    crestBg: "linear-gradient(160deg, #62677d 0%, #3a3e51 55%, #262938 100%)",
    crestText: "ГС",
    crestShape: "angular",
    matchName: "Гірник-Спорт",
    summary:
      "Команда з Горішніх Плавнів **відмовилася від участі в Другій лізі 2026/27** через брак фінансування. Стежимо за планами клубу та футболом міста.",
  },
];

/* Card artwork backgrounds, built only from theme variables */
const BG = {
  a: "radial-gradient(120% 90% at 18% 12%, var(--color-lapis-pure) 0%, var(--color-lapis-surface) 46%, var(--color-lapis-deep) 100%)",
  b: "linear-gradient(140deg, var(--color-lapis-elevated) 0%, var(--color-lapis-bg) 55%, var(--color-lapis-deep) 100%)",
  c: "radial-gradient(90% 80% at 85% 18%, color-mix(in oklab, var(--color-gold) 16%, transparent) 0%, transparent 55%), linear-gradient(160deg, var(--color-lapis-surface) 0%, var(--color-lapis-deep) 100%)",
  d: "linear-gradient(200deg, var(--color-lapis-pure) 0%, var(--color-lapis-bg) 62%, var(--color-lapis-deep) 100%)",
  e: "radial-gradient(100% 100% at 50% 115%, var(--color-lapis-pure) 0%, var(--color-lapis-bg) 58%, var(--color-lapis-deep) 100%)",
  f: "linear-gradient(115deg, var(--color-lapis-deep) 0%, var(--color-lapis-elevated) 52%, var(--color-lapis-bg) 100%)",
} as const;

const ARTICLES_DATA: Article[] = [
  /* ---- lead story ---- */
  {
    id: "poltava-bez-kobzaria-ta-veremiienka",
    title: "«Полтава» зіграє з «Прикарпаттям-Благо» без Кобзаря та Веремієнка",
    excerpt:
      "Після прямої червоної картки в компенсований час матчу в Городенці **Богдан Кобзар** потрапив до списку дискваліфікованих ПФЛ, термін покарання ще не оголошено. **Олег Веремієнко** продовжує відбувати дискваліфікацію: за даними ліги, йому залишається пропустити сім матчів. Поєдинок 12-го туру відбудеться в суботу, 17 жовтня, о 14:00 на стадіоні «Ворскла» імені Олексія Бутовського.",
    category: "СК Полтава",
    club: "sk-poltava",
    league: "persha-liha",
    date: "2026-10-12T10:15",
    commentsCount: 41,
    imageBg: BG.c,
    imageIcon: ShieldAlert,
    isBreaking: true,
    placement: "lead",
  },

  /* ---- Ворскла ---- */
  {
    id: "vorskla-plan-povernennia",
    title: "Сезон без «Ворскли»: що відомо про план повернення клубу в професійний футбол",
    excerpt:
      "«Ворскла» не отримала атестат на 2026/27 через **борги, що накопичувалися з 2021 року**. Клуб заявив про реструктуризацію, пошук інвесторів і мету пройти атестацію на сезон 2027/28.",
    category: "Ворскла",
    club: "vorskla",
    league: null,
    date: "2026-10-09T11:00",
    commentsCount: 54,
    imageBg: BG.a,
    imageIcon: Hourglass,
    placement: "grid",
  },
  {
    id: "vorskla-holovni-storinky-istorii",
    title: "Кубок-2009, дві бронзи та Ліга Європи: головні сторінки історії «Ворскли»",
    excerpt:
      "Від дебютної бронзи 1997 року до **перемоги над «Шахтарем» у фіналі Кубка України 2009-го** і групових етапів Ліги Європи: хронологія найкращих сезонів полтавського клубу.",
    category: "Ворскла",
    club: "vorskla",
    league: null,
    date: "2026-10-11T09:30",
    commentsCount: 22,
    imageBg: BG.c,
    imageIcon: Trophy,
    isPremium: true,
    placement: "grid",
  },
  {
    id: "stadion-vorskla-pryimaie-poltavu",
    title: "Стадіон «Ворскла» імені Олексія Бутовського цієї осені приймає СК «Полтава»",
    excerpt:
      "Після повернення до рідного міста «Полтава» проводить домашні матчі на центральній арені області й поки **не програла на ній жодного разу**: дві перемоги та три нічиї.",
    category: "Ворскла",
    club: "vorskla",
    league: null,
    date: "2026-10-07T14:20",
    commentsCount: 15,
    imageBg: BG.e,
    imageIcon: MapPin,
    placement: "grid",
  },
  {
    id: "vorskla-dva-sezony-v-tsyfrakh",
    title: "Перший виліт в історії та 14-те місце в Першій лізі: два останні сезони «Ворскли» в цифрах",
    excerpt:
      "Сезон 2024/25 завершився для полтавців першим вильотом з еліти, а в Першій лізі 2025/26 команда набрала **30 очок у 30 матчах**.",
    category: "Ворскла",
    club: "vorskla",
    league: null,
    date: "2026-10-05T10:00",
    commentsCount: 31,
    imageBg: BG.b,
    imageIcon: ChartColumn,
    placement: "grid",
  },
  {
    id: "vid-kolhospnyka-do-vorskly",
    title: "Від «Колгоспника» до «Ворскли»: звідки походить головний клуб Полтави",
    excerpt: "Прямим попередником «Ворскли» був «Колгоспник», а під нинішньою назвою клуб виступає з **1984 року**.",
    category: "Ворскла",
    club: "vorskla",
    league: null,
    date: "2026-10-02T16:00",
    commentsCount: 9,
    imageBg: BG.f,
    imageIcon: History,
    placement: "more",
  },
  {
    id: "vorskla-khronolohiia-atestatu",
    title: "Хронологія: як «Ворскла» залишилася без атестату на сезон 2026/27",
    excerpt:
      "Атестаційний комітет УАФ відмовив клубу в ліцензії, після чого **«Ворскла» не вийшла на перехідні матчі** за збереження місця в Першій лізі.",
    category: "Ворскла",
    club: "vorskla",
    league: null,
    date: "2026-09-29T12:30",
    commentsCount: 27,
    imageBg: BG.d,
    imageIcon: ScrollText,
    placement: "more",
  },

  /* ---- СК Полтава ---- */
  {
    id: "probii-poltava-3-2",
    title: "«Пробій» — «Полтава» — 3:2: як команда втратила перевагу в Городенці",
    excerpt:
      "Полтавці вели після голів **Валерія Сада з пенальті та Володимира Одарюка**, але пропустили наприкінці першого тайму, а на 61-й хвилині після подачі кутового. У компенсований час Богдан Кобзар отримав пряму червону картку.",
    category: "СК Полтава",
    club: "sk-poltava",
    league: "persha-liha",
    date: "2026-10-10T17:40",
    commentsCount: 46,
    imageBg: BG.a,
    imageIcon: Target,
    placement: "grid",
  },
  {
    id: "sad-naikrashchyi-bombardyr",
    title: "Валерій Сад очолює список бомбардирів Першої ліги: сім голів за 11 турів",
    excerpt:
      "Гравець «Полтави» реалізував пенальті в Городенці й тепер має **7 м’ячів**. Найближчі переслідувачі — Андрій Фесенко з «Пробою» та Василь Цюцюра з «Прикарпаття-Благо», в обох по п’ять.",
    category: "СК Полтава",
    club: "sk-poltava",
    league: "persha-liha",
    date: "2026-10-11T11:15",
    commentsCount: 28,
    imageBg: BG.d,
    imageIcon: Goal,
    placement: "grid",
  },
  {
    id: "persha-liha-pislia-11-turu",
    title: "Перша ліга після 11 турів: «Полтава» п’ята, до зони підвищення два очки",
    excerpt:
      "Поразка в Городенці відкинула команду з третього місця. Лідирує **«Вікторія» з 21 очком**, «Куликів-Білка» та «Агробізнес» мають по 20.",
    category: "СК Полтава",
    club: "sk-poltava",
    league: "persha-liha",
    date: "2026-10-12T18:30",
    commentsCount: 19,
    imageBg: BG.b,
    imageIcon: ListOrdered,
    placement: "grid",
  },
  {
    id: "kalendar-poltavy-do-pauzy",
    title: "Календар «Полтави» до зимової паузи: сім турів, чотири з них удома",
    excerpt:
      "Після «Прикарпаття-Благо» команду чекають виїзд до «Полісся-2», домашній матч із **лідером, «Вікторією»**, 31 жовтня та завершення року грою з «Фенікс-Маріуполем» 28 листопада. Друге коло стартує 20 березня.",
    category: "СК Полтава",
    club: "sk-poltava",
    league: "persha-liha",
    date: "2026-10-11T15:00",
    commentsCount: 12,
    imageBg: BG.e,
    imageIcon: CalendarClock,
    placement: "grid",
  },
  {
    id: "poltava-2-druha-liha",
    title: "«Полтава-2» п’ята в групі Б Другої ліги",
    excerpt: "Друга команда має **11 очок після дев’яти матчів**, а її найкращий бомбардир Гліб Зіняр забив тричі.",
    category: "СК Полтава",
    club: "sk-poltava",
    league: "druha-liha",
    date: "2026-10-11T19:00",
    commentsCount: 6,
    imageBg: BG.f,
    imageIcon: Users,
    placement: "more",
  },
  {
    id: "kubok-poltava-maiak",
    title: "Кубок України: «Полтава» вибула в 1/32 фіналу, поступившись «Маяку» в серії пенальті",
    excerpt: "Основний час у Сарнах завершився **0:0**, а в післяматчевих пенальті точнішими були аматори: 4:2.",
    category: "Кубок України",
    club: "sk-poltava",
    league: "kubok-ukrainy",
    date: "2026-08-22T16:10",
    commentsCount: 58,
    imageBg: BG.c,
    imageIcon: Award,
    placement: "more",
  },

  /* ---- Гірник-Спорт ---- */
  {
    id: "hirnyk-sport-propuskaie-sezon",
    title: "«Гірник-Спорт» пропускає сезон 2026/27: клуб розраховує повернутися до Другої ліги",
    excerpt:
      "У клубі пояснили рішення **відсутністю коштів у головного спонсора**. Команду й тренерський штаб розпустили, а заявитися до Другої ліги планують наступного року.",
    category: "Гірник-Спорт",
    club: "hirnyk-sport",
    league: null,
    date: "2026-07-03T11:40",
    commentsCount: 35,
    imageBg: BG.b,
    imageIcon: CirclePause,
    placement: "grid",
  },
  {
    id: "druha-liha-bez-hirnyka",
    title: "Друга ліга без «Гірника-Спорт»: хто представляє Полтавщину в турнірі",
    excerpt:
      "Цього сезону Друга ліга складається з **двох груп по дев’ять команд**. Після відмови «Гірника-Спорт» єдиною командою області в турнірі залишилася «Полтава-2» з групи Б.",
    category: "Гірник-Спорт",
    club: "hirnyk-sport",
    league: "druha-liha",
    date: "2026-10-11T13:40",
    commentsCount: 8,
    imageBg: BG.a,
    imageIcon: ListTree,
    placement: "grid",
  },
  {
    id: "hirnyk-sezon-2025-26",
    title: "Сезон 2025/26 у цифрах: «Гірник-Спорт» фінішував 11-м у групі В з 14 очками",
    excerpt:
      "Останнє місце в групі стало підсумком **непростого року для команди з Горішніх Плавнів**, після якого клуб ухвалив рішення про паузу.",
    category: "Гірник-Спорт",
    club: "hirnyk-sport",
    league: null,
    date: "2026-10-03T10:30",
    commentsCount: 13,
    imageBg: BG.f,
    imageIcon: ChartColumn,
    placement: "grid",
  },
  {
    id: "shliakh-hirnyka-sport",
    title: "Шлях «Гірника-Спорт»: від Першої ліги до вимушеної паузи",
    excerpt:
      "Клуб із Горішніх Плавнів провів кілька сезонів у Першій лізі, а його **головним партнером залишалася група Ferrexpo**. Розбираємося, від чого залежить повернення команди.",
    category: "Гірник-Спорт",
    club: "hirnyk-sport",
    league: null,
    date: "2026-09-26T09:00",
    commentsCount: 17,
    imageBg: BG.d,
    imageIcon: RouteIcon,
    isPremium: true,
    placement: "grid",
  },
  {
    id: "hirnyk-borhy-pered-hravtsiamy",
    title: "Борги перед гравцями «Гірника-Спорт» обіцяли закрити до кінця липня",
    excerpt: "За словами спортивного директора клубу, заборгованість перед футболістами й тренерами **була незначною**.",
    category: "Гірник-Спорт",
    club: "hirnyk-sport",
    league: null,
    date: "2026-07-03T12:10",
    commentsCount: 21,
    imageBg: BG.e,
    imageIcon: Wallet,
    placement: "more",
  },
  {
    id: "druha-liha-dva-kluby-vidmovylysia",
    title: "Від Другої ліги відмовилися два клуби: «Гірник-Спорт» і «Ужгород»",
    excerpt: "Після затвердження складу учасників у липні **турнір стартував з 18 командами** у двох групах.",
    category: "Гірник-Спорт",
    club: "hirnyk-sport",
    league: "druha-liha",
    date: "2026-07-15T10:20",
    commentsCount: 7,
    imageBg: BG.c,
    imageIcon: Ban,
    placement: "more",
  },

  /* ---- news wire (latest-news only) ---- */
  {
    id: "persha-liha-strichka-12-tur",
    title: "Наживо: стрічка Першої ліги перед 12-м туром",
    excerpt: "Склади, дискваліфікації та анонси в одному місці. Тур стартує **16 жовтня матчем «Агробізнес» — «Металіст»**.",
    category: "Перша ліга",
    club: null,
    league: "persha-liha",
    date: "2026-10-12T08:00",
    commentsCount: 64,
    imageBg: BG.a,
    imageIcon: Radio,
    isLive: true,
    placement: "wire",
  },
  {
    id: "kulykiv-bilka-polissia-2",
    title: "Перша ліга: «Куликів-Білка» розгромила «Полісся-2» й піднялася на друге місце",
    excerpt: "Завершальний матч 11-го туру закінчився **перемогою гостей 4:1**. «Вікторія» після нічиєї з «Металістом» зберегла лідерство.",
    category: "Перша ліга",
    club: null,
    league: "persha-liha",
    date: "2026-10-12T16:20",
    commentsCount: 14,
    imageBg: BG.b,
    imageIcon: ListOrdered,
    placement: "wire",
  },
  {
    id: "upl-pislia-8-turu",
    title: "УПЛ після 8-го туру: «Шахтар» лідирує, «Полісся» втратило очки в Чернівцях",
    excerpt: "Донеччани мають **21 очко**, житомиряни після нічиєї з «Буковиною» (2:2) — 19, «Динамо» з 16 очками піднялося на третє місце.",
    category: "Прем’єр-ліга",
    club: null,
    league: "premier-liha",
    date: "2026-10-11T22:00",
    commentsCount: 33,
    imageBg: BG.d,
    imageIcon: Table2,
    placement: "wire",
  },
  {
    id: "kubok-kluby-poltavshchyny",
    title: "Кубок України 2026/27: як виступили клуби Полтавщини",
    excerpt: "У розіграші взяли участь **чотири команди області**: СК «Полтава», «Решетилівка», «Рокита» та «Олімпія» із Савинців.",
    category: "Кубок України",
    club: null,
    league: "kubok-ukrainy",
    date: "2026-09-10T12:00",
    commentsCount: 11,
    imageBg: BG.c,
    imageIcon: Award,
    placement: "wire",
  },
];

const MATCHES_DATA: Match[] = [
  /* Перша ліга, 11-й тур */
  {
    id: "probii-poltava",
    homeTeam: "Пробій",
    awayTeam: "СК Полтава",
    score: { home: 3, away: 2 },
    status: "finished",
    date: "2026-10-10T13:30",
    competition: "persha-liha",
    round: "11-й тур",
    venue: "Городенка, «Пробій-Арена»",
    ticker: true,
    events: [
      { minute: "7", type: "goal", team: "home", player: "Андрій Фесенко" },
      { minute: "13", type: "penalty", team: "away", player: "Валерій Сад" },
      { minute: "25", type: "goal", team: "away", player: "Володимир Одарюк" },
      { minute: "41", type: "goal", team: "home", player: "Валентин Напуда" },
      { minute: "61", type: "goal", team: "home", player: "Ігор Гук" },
      { minute: "90+", type: "red", team: "away", player: "Богдан Кобзар" },
    ],
  },
  { id: "polissia2-kulykiv", homeTeam: "Полісся-2", awayTeam: "Куликів-Білка", score: { home: 1, away: 4 }, status: "finished", date: "2026-10-12T14:00", competition: "persha-liha", round: "11-й тур", ticker: true },
  { id: "metalist-viktoriia", homeTeam: "Металіст", awayTeam: "Вікторія", score: { home: 2, away: 2 }, status: "finished", date: "2026-10-09T12:00", competition: "persha-liha", round: "11-й тур", ticker: true },
  { id: "inhulets-ahrobiznes", homeTeam: "Інгулець", awayTeam: "Агробізнес", score: { home: 0, away: 1 }, status: "finished", date: "2026-10-10T11:30", competition: "persha-liha", round: "11-й тур", ticker: true },
  { id: "yuksa-feniks", homeTeam: "ЮКСА", awayTeam: "Фенікс-Маріуполь", score: { home: 1, away: 2 }, status: "finished", date: "2026-10-11T12:00", competition: "persha-liha", round: "11-й тур", ticker: true },
  { id: "prykarpattia-chernihiv", homeTeam: "Прикарпаття-Благо", awayTeam: "Чернігів", score: { home: 0, away: 1 }, status: "finished", date: "2026-10-11T12:30", competition: "persha-liha", round: "11-й тур", ticker: true },
  { id: "oleksandriia-lokomotyv", homeTeam: "Олександрія", awayTeam: "Локомотив", score: { home: 1, away: 3 }, status: "finished", date: "2026-10-11T13:00", competition: "persha-liha", round: "11-й тур", ticker: true },
  /* earlier Poltava results for the match-center history */
  { id: "poltava-chernihiv", homeTeam: "СК Полтава", awayTeam: "Чернігів", score: { home: 3, away: 2 }, status: "finished", date: "2026-10-02T14:00", competition: "persha-liha", round: "10-й тур" },
  { id: "kulykiv-poltava", homeTeam: "Куликів-Білка", awayTeam: "СК Полтава", score: { home: 2, away: 1 }, status: "finished", date: "2026-09-26T15:30", competition: "persha-liha", round: "9-й тур" },

  /* Прем’єр-ліга, 8-й тур */
  { id: "dynamo-karpaty", homeTeam: "Динамо Київ", awayTeam: "Карпати", score: { home: 1, away: 0 }, status: "finished", date: "2026-10-11T13:00", competition: "premier-liha", round: "8-й тур", ticker: true },
  { id: "lnz-kudrivka", homeTeam: "ЛНЗ", awayTeam: "Кудрівка", score: { home: 2, away: 1 }, status: "finished", date: "2026-10-11T13:00", competition: "premier-liha", round: "8-й тур", ticker: true },
  { id: "bukovyna-polissia", homeTeam: "Буковина", awayTeam: "Полісся", score: { home: 2, away: 2 }, status: "finished", date: "2026-10-11T18:00", competition: "premier-liha", round: "8-й тур", ticker: true },
  { id: "kolos-epitsentr", homeTeam: "Колос", awayTeam: "Епіцентр", score: { home: 3, away: 1 }, status: "finished", date: "2026-10-10T13:00", competition: "premier-liha", round: "8-й тур", ticker: true },
  { id: "chornomorets-kharkiv", homeTeam: "Чорноморець", awayTeam: "Харків", score: { home: 1, away: 2 }, status: "finished", date: "2026-10-10T13:00", competition: "premier-liha", round: "8-й тур", ticker: true },
  { id: "veres-shakhtar", homeTeam: "Верес", awayTeam: "Шахтар", score: { home: 0, away: 3 }, status: "finished", date: "2026-10-09T15:30", competition: "premier-liha", round: "8-й тур", ticker: true },

  /* upcoming */
  { id: "ahrobiznes-metalist", homeTeam: "Агробізнес", awayTeam: "Металіст", score: null, status: "scheduled", date: "2026-10-16T13:00", competition: "persha-liha", round: "12-й тур", ticker: true },
  { id: "viktoriia-chernihiv", homeTeam: "Вікторія", awayTeam: "Чернігів", score: null, status: "scheduled", date: "2026-10-17T11:00", competition: "persha-liha", round: "12-й тур", ticker: true },
  {
    id: "poltava-prykarpattia",
    homeTeam: "СК Полтава",
    awayTeam: "Прикарпаття-Благо",
    score: null,
    status: "scheduled",
    date: "2026-10-17T14:00",
    competition: "persha-liha",
    round: "12-й тур",
    venue: "Полтава, стадіон «Ворскла» ім. Олексія Бутовського",
    ticker: true,
  },
  { id: "shakhtar-kolos", homeTeam: "Шахтар", awayTeam: "Колос", score: null, status: "scheduled", date: "2026-10-17T18:00", competition: "premier-liha", round: "9-й тур", ticker: true },
  { id: "polissia-dynamo", homeTeam: "Полісся", awayTeam: "Динамо Київ", score: null, status: "scheduled", date: "2026-10-18T13:00", competition: "premier-liha", round: "9-й тур", ticker: true },
  { id: "kharkiv-livyi-bereh", homeTeam: "Харків", awayTeam: "Лівий Берег", score: null, status: "scheduled", date: "2026-10-19T13:00", competition: "premier-liha", round: "9-й тур", ticker: true },

  /* Кубок України: клуби Полтавщини */
  { id: "ukrainian-team-reshetylivka", homeTeam: "Ukrainian Team", awayTeam: "Решетилівка", score: { home: 0, away: 5 }, status: "finished", date: "2026-08-09T14:00", competition: "kubok-ukrainy", round: "Кваліфікаційний раунд" },
  { id: "reshetylivka-prykarpattia", homeTeam: "Решетилівка", awayTeam: "Прикарпаття-Благо", score: { home: 1, away: 4 }, status: "finished", date: "2026-08-22T13:00", competition: "kubok-ukrainy", round: "1/32 фіналу" },
  { id: "maiak-poltava", homeTeam: "Маяк", awayTeam: "СК Полтава", score: { home: 0, away: 0 }, penalties: { home: 4, away: 2 }, status: "finished", date: "2026-08-22T13:00", competition: "kubok-ukrainy", round: "1/32 фіналу", venue: "Сарни" },
];

/** Builds a table row; points are derived (3 for a win, 1 for a draw), which matches the official tables. */
const r = (
  league: TableLeagueId,
  position: number,
  club: string,
  won: number,
  drawn: number,
  lost: number,
  goalsFor: number,
  goalsAgainst: number,
  form = "",
): StandingRow => ({
  league,
  position,
  club,
  played: won + drawn + lost,
  won,
  drawn,
  lost,
  goalsFor,
  goalsAgainst,
  points: won * 3 + drawn,
  form: form.split("").filter(Boolean) as FormResult[],
});

const STANDINGS_DATA: StandingRow[] = [
  /* Прем’єр-ліга після 8-го туру (без «Лівий Берег» — «Зоря» 12.10) */
  r("premier-liha", 1, "Шахтар", 7, 0, 1, 18, 4),
  r("premier-liha", 2, "Полісся", 6, 1, 1, 17, 7),
  r("premier-liha", 3, "Динамо Київ", 5, 1, 1, 10, 5),
  r("premier-liha", 4, "Харків", 5, 0, 2, 14, 5),
  r("premier-liha", 5, "Карпати", 4, 2, 2, 15, 6),
  r("premier-liha", 6, "ЛНЗ", 3, 2, 3, 7, 9),
  r("premier-liha", 7, "Верес", 2, 3, 3, 6, 9),
  r("premier-liha", 8, "Зоря", 2, 2, 3, 7, 11),
  r("premier-liha", 9, "Колос", 2, 2, 3, 9, 11),
  r("premier-liha", 10, "Буковина", 1, 5, 2, 6, 8),
  r("premier-liha", 11, "Епіцентр", 2, 2, 4, 7, 10),
  r("premier-liha", 12, "Лівий Берег", 1, 4, 1, 4, 3),
  r("premier-liha", 13, "Чорноморець", 1, 2, 4, 4, 9),
  r("premier-liha", 14, "Кривбас", 1, 2, 3, 7, 10),
  r("premier-liha", 15, "Оболонь", 0, 4, 3, 2, 12),
  r("premier-liha", 16, "Кудрівка", 0, 2, 6, 6, 20),

  /* Перша ліга після 11-го туру; форма відновлена з календаря ПФЛ */
  r("persha-liha", 1, "Вікторія", 6, 3, 2, 14, 8, "LLDWD"),
  r("persha-liha", 2, "Куликів-Білка", 6, 2, 3, 24, 12, "WLWLW"),
  r("persha-liha", 3, "Агробізнес", 6, 2, 3, 18, 14, "LWDWW"),
  r("persha-liha", 4, "Олександрія", 5, 4, 2, 16, 10, "WLDWL"),
  r("persha-liha", 5, "Полтава", 5, 3, 3, 18, 10, "LWLWL"),
  r("persha-liha", 6, "Фенікс-Маріуполь", 5, 3, 3, 14, 12, "WWDDW"),
  r("persha-liha", 7, "Локомотив", 4, 4, 3, 15, 13, "WWWDW"),
  r("persha-liha", 8, "Прикарпаття-Благо", 4, 3, 4, 12, 10, "WWLDL"),
  r("persha-liha", 9, "Металіст", 4, 3, 4, 13, 13, "LLWDD"),
  r("persha-liha", 10, "Нива", 3, 5, 3, 12, 10, "LWDDW"),
  r("persha-liha", 11, "Інгулець", 4, 2, 4, 10, 12, "DWWLL"),
  r("persha-liha", 12, "Колос-2", 4, 0, 7, 12, 20, "LWWLL"),
  r("persha-liha", 13, "ЮКСА", 2, 4, 5, 15, 19, "WLDLL"),
  r("persha-liha", 14, "Чернігів", 2, 4, 4, 11, 14, "WLLLW"),
  r("persha-liha", 15, "Пробій", 2, 2, 7, 11, 29, "LLLWW"),
  r("persha-liha", 16, "Полісся-2", 1, 4, 6, 15, 24, "WLLDL"),

  /* Друга ліга, група Б */
  r("druha-liha", 1, "Карбон", 5, 3, 1, 17, 9),
  r("druha-liha", 2, "Атлет", 3, 4, 2, 16, 12),
  r("druha-liha", 3, "Авангард", 4, 1, 3, 9, 9),
  r("druha-liha", 4, "Ребел", 3, 3, 3, 15, 15),
  r("druha-liha", 5, "Полтава-2", 3, 2, 4, 5, 7),
  r("druha-liha", 6, "Олександрія-2", 2, 4, 2, 8, 7),
  r("druha-liha", 7, "Тростянець", 2, 4, 1, 8, 5),
  r("druha-liha", 8, "Металург", 2, 3, 3, 9, 10),
  r("druha-liha", 9, "Пенуел", 1, 2, 6, 6, 19),
];

const TABLES_META: TableMeta[] = [
  {
    league: "premier-liha",
    title: "Прем’єр-ліга 2026/27, турнірна таблиця",
    caption:
      "Після 8-го туру. Без урахування матчу «Лівий Берег» — «Зоря» 12 жовтня та перерваного поєдинку «Оболонь» — «Кривбас». **Клубів Полтавщини в еліті цього сезону немає.**",
    source: "УПЛ",
    zones: [
      { from: 1, to: 1, tone: "sage", label: "Ліга чемпіонів, кваліфікація" },
      { from: 13, to: 14, tone: "muted", label: "Перехідні матчі" },
      { from: 15, to: 16, tone: "red", label: "Виліт" },
    ],
  },
  {
    league: "persha-liha",
    title: "Перша ліга 2026/27, турнірна таблиця",
    caption: "Після 11-го туру. «Інгулець» і «Чернігів» мають матч у запасі. **Дві найкращі команди підвищаться в класі.**",
    source: "ПФЛ",
    zones: [{ from: 1, to: 2, tone: "sage", label: "Підвищення в класі" }],
  },
  {
    league: "druha-liha",
    title: "Друга ліга 2026/27, група Б, турнірна таблиця",
    caption: "Станом на 12 жовтня. У групі дев’ять команд, тому щотуру одна відпочиває, і кількість зіграних матчів різниться.",
    source: "ПФЛ",
    zones: [],
  },
];

const CUP_INTRO =
  "Розіграш триває з 8 серпня 2026 до 19 травня 2027 року: кожна стадія складається з одного матчу, нічия означає серію пенальті. **Полтавщину представляли чотири команди**: СК «Полтава», «Решетилівка», «Рокита» та «Олімпія» із Савинців.";

/** Table names that are highlighted as clubs of the region */
const REGIONAL_TABLE_NAMES = ["Полтава", "Полтава-2"];
const REGIONAL_CUP_NAMES = ["СК Полтава", "Решетилівка", "Рокита", "Олімпія"];

const TOC_ITEMS: SectionLinkItem[] = [
  { id: SECTION.lead, label: "Головне", placement: "main" },
  { id: SECTION.matchCenter, label: "Матч-центр", placement: "main" },
  ...CLUBS_DATA.map((c): SectionLinkItem => ({ id: c.id, label: c.name, placement: "main" })),
  { id: SECTION.standings, label: "Турнірні таблиці", placement: "main" },
  { id: SECTION.latest, label: "Останні новини", placement: "aside" },
  { id: SECTION.social, label: "Facebook", placement: "main" },
];

const FOOTER_NAV = [
  { label: "Ворскла", href: "/vorskla" },
  { label: "Гірник-Спорт", href: "/hirnyk-sport" },
  { label: "Друга ліга", href: TABLE_ROUTES["druha-liha"] },
  { label: "Кубок України", href: `/${SECTION.cup}` },
  { label: "Перша ліга", href: TABLE_ROUTES["persha-liha"] },
  { label: "Прем’єр-ліга", href: TABLE_ROUTES["premier-liha"] },
  { label: "СК Полтава", href: "/sk-poltava" },
  { label: "Контакти", href: `/${SECTION.contacts}` },
];

const OFFICIAL_LINKS: OfficialLink[] = [
  { label: "Українська асоціація футболу", href: "https://uaf.ua/" },
  { label: "Українська Прем’єр-ліга", href: "https://upl.ua/" },
  { label: "Професіональна футбольна ліга", href: "https://pfl.ua/" },
  { label: "СК «Полтава», офіційний сайт", href: "https://scpoltava.com/" },
  { label: "«Ворскла», офіційний сайт", href: "http://vorskla.com.ua/" },
];

/* =====================================================================
   DERIVED VIEWS
   ===================================================================== */

const LEAD = ARTICLES_DATA.find((a) => a.placement === "lead")!;
const LATEST = ARTICLES_DATA.filter((a) => a.placement !== "more")
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 9);
const CUP_MATCHES = MATCHES_DATA.filter((m) => m.competition === "kubok-ukrainy");

/** Club stories link to their card; wire stories open the matching table or the Cup block */
function latestHref(a: Article): string {
  if (a.placement !== "wire") return `#${articleAnchor(a.id)}`;
  if (a.league === "kubok-ukrainy" || !a.league) return `/${SECTION.cup}`;
  return TABLE_ROUTES[a.league];
}

/* =====================================================================
   APP
   ===================================================================== */

interface AppProps {
  /** Folder the site is served from, detected at runtime (see lib/base-path.ts) */
  base: string;
  /** Full request path during prerendering */
  ssrPath?: string;
}

const useHashRouting = import.meta.env.VITE_ROUTER === "hash";

export function App({ base, ssrPath }: AppProps) {
  return useHashRouting ? (
    <Router hook={useHashLocation} ssrPath={ssrPath}>
      <Page />
    </Router>
  ) : (
    <Router base={base} ssrPath={ssrPath}>
      <Page />
    </Router>
  );
}

function Page() {
  const leagueOf = (id: Club["league"]) => LEAGUES_DATA.find((l) => l.id === id) ?? null;
  return (
    <>
      <CrestDefs />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-semibold focus:text-lapis-deep"
      >
        Перейти до матеріалів
      </a>
      <SiteHeader site={SITE} matches={MATCHES_DATA} clubs={CLUBS_DATA} leagues={LEAGUES_DATA} tocItems={TOC_ITEMS} />

      <main id="main">
        <Hero site={SITE} lead={LEAD} />

        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-x-10 gap-y-16 py-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:py-16 xl:grid-cols-[148px_minmax(0,1fr)_300px]">
            <div className="hidden xl:block">
              <TocRail items={TOC_ITEMS} />
            </div>

            <div className="min-w-0 space-y-14">
              <MatchCenter matches={MATCHES_DATA} clubs={CLUBS_DATA} leagues={LEAGUES_DATA} edition={SITE.edition} />
              {CLUBS_DATA.map((club, i) => (
                <div key={club.id} className="space-y-14">
                  <VeinDivider />
                  <ClubSection
                    club={club}
                    league={leagueOf(club.league)}
                    articles={ARTICLES_DATA.filter((a) => a.club === club.id && a.placement !== "lead")}
                    mirror={i % 2 === 1}
                  />
                </div>
              ))}
              <VeinDivider />
              <Standings
                rows={STANDINGS_DATA}
                tables={TABLES_META}
                leagues={LEAGUES_DATA}
                regionalNames={REGIONAL_TABLE_NAMES}
                defaultTable="persha-liha"
                cup={{ intro: CUP_INTRO, matches: CUP_MATCHES, regionalNames: REGIONAL_CUP_NAMES }}
              />
            </div>

            <aside aria-label="Стрічка новин" className="min-w-0">
              <LatestNews items={LATEST} edition={SITE.edition} hrefFor={latestHref} />
            </aside>
          </div>
        </div>

        <SocialBlock site={SITE} posts={LATEST.slice(0, 2)} />
      </main>

      <SiteFooter site={SITE} nav={FOOTER_NAV} officialLinks={OFFICIAL_LINKS} />
      <TocFloating items={TOC_ITEMS} className="xl:hidden" />
      <RouteEffects />
      <StructuredData site={SITE} clubs={CLUBS_DATA} leagues={LEAGUES_DATA} articles={ARTICLES_DATA.filter((a) => a.placement !== "more")} />
    </>
  );
}
