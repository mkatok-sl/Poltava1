import type { ComponentProps } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetTitle = SheetPrimitive.Title;
const SheetDescription = SheetPrimitive.Description;

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: ComponentProps<typeof SheetPrimitive.Content> & { side?: "right" | "bottom" }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-[60] animate-fade-in bg-lapis-deep/70 backdrop-blur-[2px]" />
      <SheetPrimitive.Content
        className={cn(
          "fixed z-[61] flex flex-col border-lapis-border bg-lapis-deep text-ivory outline-none",
          side === "right" &&
            "inset-y-0 right-0 h-full w-[min(88vw,380px)] animate-sheet-right border-l pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[80vh] animate-sheet-up rounded-t-[14px] border-t pb-[env(safe-area-inset-bottom)]",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute top-3 right-3 inline-flex size-10 items-center justify-center rounded-lg text-lapis-secondary transition-colors hover:bg-lapis-elevated hover:text-ivory-light">
          <X className="size-5" strokeWidth={1.5} />
          <span className="sr-only">Закрити</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };
