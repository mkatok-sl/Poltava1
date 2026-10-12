import { ExternalLink as ExternalIcon } from "lucide-react";
import type { Article, SiteInfo } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { formatNewsTime, formatText } from "@/lib/format";
import { SECTION } from "@/lib/routes";
import { ExternalLink } from "./Links";
import { LogoMark } from "./Logo";

/** Original community glyph (two conversation bubbles), used instead of a third-party logo */
function CommunityIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 5.5h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9l-3.5 3v-3H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" />
      <path d="M16.5 9.5H20a2 2 0 0 1 2 2v4.5a2 2 0 0 1-2 2h-1v2.5L16 18h-3" />
      <path d="M6 9.5h6M6 12h3.5" />
    </svg>
  );
}

export function SocialBlock({ site, posts }: { site: SiteInfo; posts: Article[] }) {
  return (
    <section id={SECTION.social} aria-labelledby="social-title" className="border-t border-lapis-border bg-lapis-bg">
      <div className="mx-auto grid max-w-[1440px] items-center gap-x-12 gap-y-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
        <div className="lg:col-span-5">
          <h2 id="social-title" className="font-display text-[2rem] leading-[1.1] font-semibold text-ivory-light sm:text-[2.25rem]">
            Спільнота у Facebook
          </h2>
          <p className="mt-4 max-w-[30rem] font-serif text-[16px] leading-[1.7] text-ivory/75">{formatText(site.socialText)}</p>
          <ExternalLink href={site.facebookUrl} className={buttonVariants({ size: "lg", className: "mt-7" })}>
            <CommunityIcon className="size-5" />
            Відкрити сторінку у Facebook
          </ExternalLink>
        </div>

        {/* Self-contained stand-in for the Facebook page plugin: no iframe, no third-party script */}
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-[12px] border border-lapis-border bg-lapis-surface">
            <div className="relative h-24 bg-[linear-gradient(120deg,var(--color-lapis-pure)_0%,var(--color-lapis-elevated)_45%,var(--color-lapis-deep)_100%)]">
              <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 600 96" preserveAspectRatio="none">
                <path d="M-10 70 C 120 40, 220 86, 340 58 S 520 22, 620 38" fill="none" stroke="var(--color-gold)" strokeOpacity={0.4} strokeWidth={1} vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-lapis-deep/70 px-2 py-1 font-sans text-[11px] text-ivory/80">
                <CommunityIcon className="size-3.5" />
                Facebook
              </span>
            </div>
            <div className="px-5 pb-5">
              <div className="relative -mt-7 flex items-end justify-between gap-4">
                <span className="rounded-[14px] border border-lapis-border bg-lapis-deep p-2">
                  <LogoMark className="size-11" />
                </span>
                <ExternalLink
                  href={site.facebookUrl}
                  aria-label="Стежити за сторінкою у Facebook"
                  className={buttonVariants({ variant: "outline", size: "sm", className: "mb-1" })}
                >
                  Стежити
                  <ExternalIcon className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
                </ExternalLink>
              </div>
              <p className="mt-3 font-sans text-[15px] font-semibold text-ivory-light">
                {site.name}, {site.tagline}
              </p>
              <p className="font-sans text-[12px] text-lapis-secondary">Спортивне медіа</p>
              <ul className="mt-5 space-y-3">
                {posts.map((p) => (
                  <li key={p.id} className="rounded-lg border border-lapis-border/80 bg-lapis-bg p-3.5">
                    <p className="flex items-center gap-2 font-sans text-[12px] text-lapis-secondary">
                      <LogoMark className="size-5" />
                      <span className="text-ivory/85">{site.name}</span>
                      <span aria-hidden="true">/</span>
                      <span className="tnum">{formatNewsTime(p.date, site.edition)}</span>
                    </p>
                    <p className="mt-2 font-serif text-[14.5px] leading-[1.55] text-ivory/85">{p.title}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
