import type { Article, SiteInfo } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { formatLongEditionDate, formatText } from "@/lib/format";
import { SECTION, articleAnchor } from "@/lib/routes";
import { ArticleBadges, ArticleMeta } from "./ArticleCard";
import { ArticleImage } from "./ArticleImage";
import { GoldVeins } from "./Decor";
import { SectionLink } from "./Links";

export function Hero({ site, lead }: { site: SiteInfo; lead: Article }) {
  const anchor = articleAnchor(lead.id);
  return (
    <section id={SECTION.lead} aria-labelledby="lead-heading" className="lapis-texture relative overflow-hidden border-b border-lapis-border bg-lapis-deep">
      <GoldVeins variant="hero" />
      <div className="mx-auto grid max-w-[1440px] gap-x-12 gap-y-10 px-4 pt-10 pb-12 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pt-16 lg:pb-20">
        <div className="flex flex-col lg:col-span-5 lg:pt-4">
          <p className="font-sans text-[13px] text-lapis-secondary">
            <time dateTime={site.edition.slice(0, 10)}>{formatLongEditionDate(site.edition)}</time>
            <span className="mx-2 text-lapis-muted" aria-hidden="true">
              /
            </span>
            сезон {site.season}
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.75rem,7vw,4.75rem)] leading-[0.95] font-semibold tracking-[0.01em] text-ivory-light [overflow-wrap:anywhere]">
            Футбол Полтавщини
            <span className="mt-5 block max-w-[30rem] font-serif text-[clamp(1.125rem,2vw,1.375rem)] leading-[1.4] font-normal tracking-normal text-ivory/80 normal-case">
              новини СК «Полтава», «Ворскли» та «Гірника-Спорт», матч‑центр і турнірні таблиці
            </span>
          </h1>
          <p className="mt-6 max-w-[32rem] font-serif text-[16px] leading-[1.7] text-ivory/70">{formatText(site.intro)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <SectionLink href={`/${SECTION.matchCenter}`} className={buttonVariants({ size: "lg" })}>
              Відкрити матч-центр
            </SectionLink>
            <SectionLink href={`/${SECTION.standings}`} className={buttonVariants({ variant: "outline", size: "lg" })}>
              Турнірні таблиці
            </SectionLink>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <div className="mb-4 flex items-center gap-4">
            <h2 id="lead-heading" className="shrink-0 font-sans text-[13px] font-semibold text-gold">
              Головне за день
            </h2>
            <span aria-hidden="true" className="h-px flex-1 bg-lapis-border" />
          </div>
          <article id={anchor} className="group relative rounded-[12px] border border-lapis-border bg-lapis-bg/70 p-2.5 transition-colors duration-200 hover:border-gold/55">
            <div className="relative">
              <ArticleImage id={lead.id} bg={lead.imageBg} icon={lead.imageIcon} size="lead" className="rounded-[9px]" />
              <ArticleBadges article={lead} className="absolute top-3 left-3 right-3" />
            </div>
            <div className="px-3 pt-6 pb-4 sm:px-5">
              <h3 className="font-serif text-[1.625rem] leading-[1.2] font-semibold text-ivory-light [overflow-wrap:anywhere] hyphens-auto sm:text-[2rem]">
                <a href={`#${anchor}`} className="outline-none after:absolute after:inset-0 after:rounded-[12px] focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:outline-gold">
                  {lead.title}
                </a>
              </h3>
              <p className="mt-4 max-w-[44rem] font-serif text-[16.5px] leading-[1.7] text-ivory/80">{formatText(lead.excerpt)}</p>
              <ArticleMeta article={lead} className="mt-5" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
