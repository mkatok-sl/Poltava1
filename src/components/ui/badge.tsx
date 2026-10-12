import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-[3px] font-sans text-[11px] font-semibold leading-4 tracking-[0.01em] [&_svg]:size-3",
  {
    variants: {
      variant: {
        /** club or competition label */
        default: "border border-lapis-border bg-lapis-deep/85 text-ivory backdrop-blur-sm",
        /** live and breaking news: the only filled gold label */
        gold: "bg-gold text-lapis-deep",
        /** premium content */
        premium: "border border-gold/60 bg-lapis-deep/85 text-gold backdrop-blur-sm",
        muted: "border border-lapis-border/80 bg-lapis-surface text-lapis-secondary",
        paused: "border border-dusty-red/40 bg-dusty-red/10 text-dusty-red",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({ className, variant, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
