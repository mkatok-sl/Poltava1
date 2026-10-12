import type { Club } from "@/types";
import { cn } from "@/lib/utils";
import { teamInitials } from "@/lib/format";
import { CREST_PATHS } from "./Decor";

const SIZES = {
  lg: { box: "size-16 rounded-[14px]", shield: "h-[46px] w-[40px]", round: "size-[42px]", text: "text-[17px]", textGs: "text-[13px]" },
  md: { box: "size-10 rounded-[10px]", shield: "h-[29px] w-[25px]", round: "size-[27px]", text: "text-[11px]", textGs: "text-[9px]" },
  sm: { box: "size-8 rounded-[8px]", shield: "h-[23px] w-[20px]", round: "size-[22px]", text: "text-[9px]", textGs: "text-[7px]" },
} as const;

/**
 * Original crest emblem for a club section: a shield silhouette in muted club tones,
 * set in a stone tile. Deliberately not a reproduction of any official badge.
 */
export function ClubCrest({ club, size = "lg", className }: { club: Club; size?: keyof typeof SIZES; className?: string }) {
  const s = SIZES[size];
  const isRound = club.crestShape === "round";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center border border-lapis-border bg-lapis-elevated",
        s.box,
        size === "lg" && "shadow-[0_10px_20px_rgba(0,0,0,0.15)]",
        className,
      )}
    >
      <span className={cn("relative block", isRound ? s.round : s.shield)}>
        <span
          className={cn("absolute inset-0", isRound ? "crest-round rounded-full" : club.crestShape === "heater" ? "crest-heater" : "crest-angular")}
          style={{ background: club.crestBg }}
        />
        {isRound ? (
          <span className="absolute inset-[12%] rounded-full border border-gold/60" />
        ) : (
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1 1" preserveAspectRatio="none">
            <path
              d={club.crestShape === "heater" ? CREST_PATHS.heater : CREST_PATHS.angular}
              transform="translate(0.5 0.5) scale(0.86) translate(-0.5 -0.5)"
              fill="none"
              stroke="var(--color-gold)"
              strokeOpacity={0.7}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center font-display font-semibold text-ivory-light",
            !isRound && "pb-[8%]",
            club.crestText.length > 1 ? s.textGs : s.text,
          )}
        >
          {club.crestText}
        </span>
      </span>
    </span>
  );
}

/** Neutral initials mark for opponents */
export function TeamMark({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-lapis-border bg-lapis-elevated font-sans text-[10px] font-semibold tracking-wide text-lapis-secondary",
        className,
      )}
    >
      {teamInitials(name)}
    </span>
  );
}
