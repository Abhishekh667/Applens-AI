"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-foreground text-white shadow-[0_18px_40px_-22px_rgba(17,17,17,0.75)] hover:-translate-y-0.5 hover:bg-black active:translate-y-0",
        ghost: "text-foreground/70 hover:bg-black/[0.04] hover:text-foreground",
        outline:
          "border border-black/10 bg-white text-foreground shadow-sm hover:border-black/20 hover:bg-muted",
        subtle: "bg-muted text-foreground hover:bg-ink-700",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-14 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
