"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------- Card ----------------------------------- */

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-black/8 bg-white shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-base font-bold tracking-[-0.02em]", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

/* ---------------------------------- Badge ---------------------------------- */

const toneMap = {
  good: "bg-[#DDF8D7] text-[#247A32] border-[#BCECB4]",
  ok: "bg-[#DDEEFF] text-[#2F5F9D] border-[#BED9F4]",
  warn: "bg-[#FFF0D6] text-[#A35B00] border-[#F3D398]",
  bad: "bg-[#FBE5E2] text-[#B44135] border-[#EEC2BC]",
  neutral: "bg-black/[0.04] text-foreground/75 border-black/10",
  beam: "bg-black text-white border-black",
  prism: "bg-[#EFF5E8] text-[#5F724C] border-[#D9E5CE]",
} as const;

export type BadgeTone = keyof typeof toneMap;

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
        toneMap[tone],
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------- Progress --------------------------------- */

export function Progress({
  value,
  tone = "beam",
  className,
}: {
  value: number;
  tone?: "beam" | "good" | "ok" | "bad";
  className?: string;
}) {
  const colors = {
    beam: "bg-foreground",
    good: "bg-signal-good",
    ok: "bg-signal-ok",
    bad: "bg-signal-bad",
  };
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-black/[0.06]", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700", colors[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
