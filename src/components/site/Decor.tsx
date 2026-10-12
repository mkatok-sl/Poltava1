import { cn } from "@/lib/utils";

/** Fine pyrite veins crossing the hero and footer stone */
export function GoldVeins({ variant = "hero", className }: { variant?: "hero" | "footer"; className?: string }) {
  const paths =
    variant === "hero"
      ? [
          { d: "M-40 470 C 180 430, 300 520, 520 455 S 860 300, 1010 330 S 1240 240, 1320 180", o: 0.42 },
          { d: "M-40 505 C 220 470, 360 548, 560 492 S 880 352, 1040 372 S 1250 300, 1320 262", o: 0.16 },
          { d: "M760 -20 C 800 80, 742 160, 830 238 S 960 330, 1000 336", o: 0.2 },
        ]
      : [
          { d: "M-40 60 C 220 110, 420 20, 640 70 S 1000 140, 1320 40", o: 0.32 },
          { d: "M-40 84 C 240 132, 440 44, 660 94 S 1020 162, 1320 66", o: 0.12 },
        ];
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 h-full w-full", className)}
      viewBox={variant === "hero" ? "0 0 1280 560" : "0 0 1280 200"}
      preserveAspectRatio="none"
    >
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill="none" stroke="var(--color-gold)" strokeOpacity={p.o} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

/** Section divider: a single curved gold vein */
export function VeinDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative h-3 w-full", className)}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 12" preserveAspectRatio="none">
        <path d="M0 7 C 180 7, 260 2, 420 4 S 700 11, 820 8 S 960 3, 1000 5" fill="none" stroke="var(--color-gold)" strokeOpacity={0.34} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        <path d="M0 8 C 220 9, 300 6, 460 7 S 760 10, 1000 7" fill="none" stroke="var(--color-lapis-border)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

export const CREST_PATHS = {
  heater: "M0.06,0.04 H0.94 V0.44 C0.94,0.72 0.74,0.88 0.5,0.97 C0.26,0.88 0.06,0.72 0.06,0.44 Z",
  angular: "M0.5,0.03 L0.94,0.19 V0.6 L0.5,0.97 L0.06,0.6 V0.19 Z",
} as const;

/** Clip-path definitions for crest silhouettes, rendered once per page */
export function CrestDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <clipPath id="crest-heater" clipPathUnits="objectBoundingBox">
          <path d={CREST_PATHS.heater} />
        </clipPath>
        <clipPath id="crest-angular" clipPathUnits="objectBoundingBox">
          <path d={CREST_PATHS.angular} />
        </clipPath>
      </defs>
    </svg>
  );
}
