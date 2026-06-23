"use client";
import { motion } from "framer-motion";
import { scoreTone } from "@/types";
import { cn } from "@/lib/utils";

const toneStop = {
  good: ["#247A32", "#7A8B64"],
  ok: ["#2F5F9D", "#7A8B64"],
  warn: ["#A35B00", "#D59B2F"],
  bad: ["#B44135", "#E47A6F"],
} as const;

export function ScoreRing({
  score,
  size = 168,
  stroke = 12,
  label,
  className,
}: {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
}) {
  const tone = scoreTone(score);
  const [c1, c2] = toneStop[tone];
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / 10));
  const gid = `ring-${tone}-${size}`;

  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(17,17,17,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-mono text-4xl font-bold leading-none tracking-[-0.08em]">
            {score.toFixed(1)}
            <span className="text-xl tracking-normal text-foreground/35">/10</span>
          </div>
          {label && (
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-foreground/45">
              {label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
