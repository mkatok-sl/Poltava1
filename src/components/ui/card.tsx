import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("rounded-[10px] border border-lapis-border bg-lapis-surface text-card-foreground", className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 pt-5", className)} {...props} />;
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-5 pb-5", className)} {...props} />;
}

export { Card, CardHeader, CardContent };
