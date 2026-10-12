import type { Article, Club, League, SiteInfo } from "@/types";
import { stripFormatting, toIsoWithZone } from "@/lib/format";

/** schema.org graph: organisation, page, the clubs it covers and the news on the page */
export function StructuredData({ site, clubs, leagues, articles }: { site: SiteInfo; clubs: Club[]; leagues: League[]; articles: Article[] }) {
  const leagueName = (id: string | null) => leagues.find((l) => l.id === id)?.name;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsMediaOrganization",
        "@id": "#organization",
        name: site.name,
        description: stripFormatting(site.description),
        email: site.email,
        sameAs: [site.facebookUrl],
      },
      {
        "@type": "WebSite",
        "@id": "#website",
        name: `${site.name}, ${site.tagline}`,
        inLanguage: "uk",
        publisher: { "@id": "#organization" },
      },
      {
        "@type": "CollectionPage",
        "@id": "#webpage",
        name: "Футбол Полтавщини: новини, матч-центр і турнірні таблиці",
        inLanguage: "uk",
        isPartOf: { "@id": "#website" },
        dateModified: toIsoWithZone(site.edition),
        about: clubs.map((c) => ({
          "@type": "SportsTeam",
          name: c.name,
          sport: "Футбол",
          location: { "@type": "Place", name: c.city },
          ...(c.league ? { memberOf: { "@type": "SportsOrganization", name: leagueName(c.league) } } : {}),
          ...(c.officialUrl ? { url: c.officialUrl } : {}),
        })),
        mainEntity: {
          "@type": "ItemList",
          itemListElement: articles.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "NewsArticle",
              headline: a.title,
              description: stripFormatting(a.excerpt),
              datePublished: toIsoWithZone(a.date),
              articleSection: a.category,
              inLanguage: "uk",
              publisher: { "@id": "#organization" },
            },
          })),
        },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
