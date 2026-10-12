import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Deterministic 0..n-1 from an id, so server and browser pick the same artwork */
function pick(id: string, n: number) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % n;
}

const LINE = { fill: "none", stroke: "var(--color-ivory)", strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };

function Pitch() {
  return (
    <g strokeOpacity={0.11} {...LINE}>
      <rect x="8" y="8" width="144" height="74" rx="1" />
      <line x1="80" y1="8" x2="80" y2="82" />
      <circle cx="80" cy="45" r="11" />
      <rect x="8" y="27" width="20" height="36" />
      <rect x="132" y="27" width="20" height="36" />
      <rect x="8" y="37" width="7" height="16" />
      <rect x="145" y="37" width="7" height="16" />
    </g>
  );
}

function Bowl() {
  return (
    <g strokeOpacity={0.1} {...LINE}>
      {[34, 52, 70, 88, 106].map((r) => (
        <ellipse key={r} cx="80" cy="104" rx={r * 1.25} ry={r * 0.62} />
      ))}
    </g>
  );
}

function Formation() {
  const dots = [
    [24, 45], [44, 20], [44, 37], [44, 53], [44, 70], [70, 28], [70, 45], [70, 62], [100, 22], [104, 45], [100, 68],
  ];
  return (
    <g>
      <g strokeOpacity={0.07} {...LINE}>
        <line x1="8" y1="45" x2="152" y2="45" />
        <line x1="60" y1="8" x2="60" y2="82" />
        <line x1="120" y1="8" x2="120" y2="82" />
      </g>
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="var(--color-ivory)" fillOpacity={0.16} />
      ))}
    </g>
  );
}

const ARTWORK = [Pitch, Bowl, Formation];
const VEINS = [
  "M-4 70 C 30 58, 52 76, 84 62 S 130 36, 166 44",
  "M-4 30 C 26 40, 60 22, 92 34 S 138 66, 166 58",
  "M-4 84 C 40 70, 70 82, 104 66 S 146 50, 166 30",
];

interface ArticleImageProps {
  id: string;
  bg: string;
  icon: LucideIcon;
  size?: "lead" | "feature" | "card";
  className?: string;
}

/** Custom 16:9 artwork standing in for a photo: stone gradient, pitch geometry, one pyrite vein, a thin line icon. */
export function ArticleImage({ id, bg, icon: Icon, size = "card", className }: ArticleImageProps) {
  const Art = ARTWORK[pick(id, ARTWORK.length)];
  const vein = VEINS[pick(id + "v", VEINS.length)];
  return (
    <div aria-hidden="true" className={cn("relative aspect-video w-full overflow-hidden rounded-[8px] bg-lapis-deep", className)}>
      <div className="absolute inset-0 transition-transform duration-200 ease-out group-hover:scale-105" style={{ background: bg }}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">
          <Art />
          <path d={vein} fill="none" stroke="var(--color-gold)" strokeOpacity={0.38} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        </svg>
        <Icon
          strokeWidth={1}
          className={cn(
            "absolute text-ivory/45",
            size === "lead" ? "right-[9%] bottom-[14%] size-24 sm:size-28" : size === "feature" ? "right-[8%] bottom-[13%] size-16" : "right-[8%] bottom-[12%] size-12",
          )}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[8px] ring-1 ring-inset ring-ivory/[0.06]" />
    </div>
  );
}
