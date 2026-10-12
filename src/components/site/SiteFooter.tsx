import { ExternalLink as ExternalIcon, Mail } from "lucide-react";
import type { OfficialLink, SiteInfo } from "@/types";
import { formatText } from "@/lib/format";
import { SECTION } from "@/lib/routes";
import { GoldVeins } from "./Decor";
import { ExternalLink, SectionLink } from "./Links";
import { Logo } from "./Logo";

interface FooterProps {
  site: SiteInfo;
  nav: { label: string; href: string }[];
  officialLinks: OfficialLink[];
}

export function SiteFooter({ site, nav, officialLinks }: FooterProps) {
  const year = site.edition.slice(0, 4);
  const colTitle = "font-sans text-[12px] font-semibold text-lapis-secondary";
  const link = "font-sans text-[14px] text-ivory/85 transition-colors duration-200 hover:text-ivory-light";
  return (
    <footer id={SECTION.contacts} className="lapis-texture relative overflow-hidden border-t border-lapis-border bg-lapis-deep pb-20 xl:pb-0">
      <GoldVeins variant="footer" className="h-24" />
      <div className="mx-auto grid max-w-[1440px] gap-x-10 gap-y-10 px-4 pt-14 pb-10 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="md:col-span-4">
          <Logo name={site.name} tagline={site.tagline} />
          <p className="mt-5 max-w-[24rem] font-serif text-[14.5px] leading-[1.65] text-ivory/70">{formatText(site.description)}</p>
        </div>

        <div className="md:col-span-3">
          <p className={colTitle}>Редакція</p>
          <dl className="mt-4 space-y-3 font-sans text-[14px]">
            <div>
              <dt className="text-[12px] text-lapis-secondary">Головний редактор</dt>
              <dd className="mt-0.5 text-ivory">{site.editor}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-lapis-secondary">Редакційна пошта</dt>
              <dd className="mt-0.5">
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-1.5 break-all text-ivory underline decoration-lapis-border underline-offset-4 hover:decoration-gold">
                  <Mail className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  {site.email}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <nav aria-label="Розділи сайту" className="md:col-span-2">
          <p className={colTitle}>Розділи</p>
          <ul className="mt-4 space-y-2.5">
            {nav.map((item) => (
              <li key={item.label}>
                <SectionLink href={item.href} className={link}>
                  {item.label}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className={colTitle}>Офіційні ресурси</p>
          <ul className="mt-4 space-y-2.5">
            {officialLinks.map((item) => (
              <li key={item.href}>
                <ExternalLink href={item.href} className={`${link} inline-flex items-center gap-1.5`}>
                  {item.label}
                  <ExternalIcon className="size-3 text-lapis-muted" strokeWidth={1.5} aria-hidden="true" />
                </ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-lapis-border/70">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-5 font-sans text-[12px] text-lapis-secondary sm:px-6 lg:px-8">
          <p>
            © {year} «{site.name}». Усі права захищено.
          </p>
          <p>Використання матеріалів дозволено з активним посиланням на видання.</p>
        </div>
      </div>
    </footer>
  );
}
