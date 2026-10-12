import { cn } from "@/lib/utils";
import { SectionLink } from "./Links";

/** Lapis gem cut with a single pyrite vein */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={cn("shrink-0", className)}>
      <defs>
        <linearGradient id="logo-stone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-lapis-pure)" />
          <stop offset="1" stopColor="var(--color-lapis-deep)" />
        </linearGradient>
      </defs>
      <path d="M32 3 55 16v32L32 61 9 48V16Z" fill="url(#logo-stone)" stroke="var(--color-lapis-border)" strokeWidth="2" />
      <path d="M32 3v58M9 16l46 32M55 16 9 48" stroke="var(--color-ivory)" strokeOpacity="0.07" strokeWidth="1" />
      <path d="M14 40c9-3 13-13 22-15 6-1.5 10 1 14-2" fill="none" stroke="var(--color-gold)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ name, tagline, className }: { name: string; tagline: string; className?: string }) {
  return (
    <SectionLink href="/" aria-label={`${name}, ${tagline}: на початок сторінки`} className={cn("group flex shrink-0 items-center gap-3", className)}>
      <LogoMark className="size-9 transition-transform duration-200 group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.375rem] font-semibold tracking-[0.06em] text-ivory-light">{name}</span>
        <span className="mt-1 font-sans text-[11px] text-lapis-secondary">{tagline}</span>
      </span>
    </SectionLink>
  );
}
