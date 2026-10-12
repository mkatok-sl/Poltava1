import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-sans font-semibold transition-[color,background-color,border-color,transform] duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "rounded-lg bg-gold text-lapis-deep hover:bg-gold-hover active:bg-gold-pressed",
        outline: "rounded-lg border border-lapis-border bg-transparent text-ivory hover:border-gold/60 hover:text-ivory-light",
        ghost: "rounded-lg text-lapis-secondary hover:bg-lapis-elevated hover:text-ivory-light",
        link: "text-ivory underline decoration-lapis-border underline-offset-4 hover:decoration-gold hover:text-ivory-light",
      },
      size: {
        default: "h-10 px-4 text-sm",
        sm: "h-8 px-3 text-[13px]",
        lg: "h-11 px-5 text-[15px]",
        icon: "size-10",
        none: "",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
