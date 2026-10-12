import { Calendar, MessageCircle, Radio, Siren, Star } from "lucide-react";
import type { Article } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { commentsLabel, formatDateTime, formatText, toIsoWithZone } from "@/lib/format";
import { articleAnchor } from "@/lib/routes";
import { ArticleImage } from "./ArticleImage";

export function ArticleBadges({ article, className }: { article: Article; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {article.isLive && (
        <Badge variant="gold">
          <Radio strokeWidth={2} />
          Наживо
        </Badge>
      )}
      {article.isBreaking && (
        <Badge variant="gold">
          <Siren strokeWidth={2} />
          Терміново
        </Badge>
      )}
      <Badge>{article.category}</Badge>
      {article.isPremium && (
        <Badge variant="premium">
          <Star strokeWidth={2} />
          Ексклюзив
        </Badge>
      )}
    </div>
  );
}

export function ArticleMeta({ article, className }: { article: Article; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5 font-sans text-[12.5px] text-lapis-secondary", className)}>
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        <time dateTime={toIsoWithZone(article.date)} className="tnum">
          {formatDateTime(article.date)}
        </time>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MessageCircle className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        <span className="tnum" aria-hidden="true">
          {article.commentsCount}
        </span>
        <span className="sr-only">{commentsLabel(article.commentsCount)}</span>
      </span>
    </div>
  );
}

interface ArticleCardProps {
  article: Article;
  variant?: "feature" | "standard";
  className?: string;
  hidden?: boolean;
}

/** Image on top, badge overlapping its top-left corner, H3 headline, excerpt, date and comments. */
export function ArticleCard({ article, variant = "standard", className, hidden }: ArticleCardProps) {
  const anchor = articleAnchor(article.id);
  return (
    <article
      id={anchor}
      hidden={hidden}
      className={cn(
        "group relative flex min-w-0 flex-col rounded-[10px] border border-lapis-border bg-lapis-surface p-2 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-gold/55 hover:bg-[color-mix(in_oklab,var(--color-lapis-surface)_88%,var(--color-lapis-elevated))] focus-within:border-gold/55",
        className,
      )}
    >
      <div className="relative">
        <ArticleImage id={article.id} bg={article.imageBg} icon={article.imageIcon} size={variant === "feature" ? "feature" : "card"} />
        <ArticleBadges article={article} className="absolute top-2.5 left-2.5 right-2.5" />
      </div>
      <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2.5">
        <h3
          className={cn(
            "font-serif font-semibold text-ivory-light [overflow-wrap:anywhere] hyphens-auto",
            variant === "feature" ? "text-[1.375rem] leading-[1.25] sm:text-[1.5rem]" : "text-[1.1875rem] leading-[1.3]",
          )}
        >
          <a href={`#${anchor}`} className="outline-none after:absolute after:inset-0 after:rounded-[10px] focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:outline-gold">
            {article.title}
          </a>
        </h3>
        <p
          className={cn(
            "mt-2.5 font-serif text-[15px] leading-[1.6] text-ivory/75",
            "line-clamp-4 md:line-clamp-none",
          )}
        >
          {formatText(article.excerpt)}
        </p>
        <ArticleMeta article={article} className="mt-auto pt-4" />
      </div>
    </article>
  );
}
