"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { HealthCard as HealthCardT, HealthStatus } from "@/types";
import { Card, Badge, Progress, type BadgeTone } from "@/components/ui/primitives";

const statusTone: Record<HealthStatus, BadgeTone> = {
  Strong: "good",
  "Needs Work": "ok",
  Weak: "bad",
};
const barTone: Record<HealthStatus, "good" | "ok" | "bad"> = {
  Strong: "good",
  "Needs Work": "ok",
  Weak: "bad",
};

function HealthCard({ label, card, i }: { label: string; card: HealthCardT; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: i * 0.04 }}
    >
      <Card className="h-full p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-sm font-extrabold tracking-[-0.03em]">{label}</h3>
          <Badge tone={statusTone[card.status]}>{card.status}</Badge>
        </div>
        <div className="mb-1 flex items-end justify-between">
          <span className="font-mono text-3xl font-bold tracking-[-0.08em]">{card.score}</span>
          <span className="text-xs text-foreground/40">/100</span>
        </div>
        <Progress value={card.score} tone={barTone[card.status]} className="mb-3" />
        <p className="mb-3 text-sm leading-6 text-foreground/58">{card.summary}</p>
        <ul className="space-y-1.5">
          {card.improvements.map((imp) => (
            <li key={imp} className="flex items-start gap-2 text-xs leading-5 text-foreground/68">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal-good" />
              {imp}
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
}

interface HealthMap {
  icon: HealthCardT;
  screenshots: HealthCardT;
  featuredGraphic?: HealthCardT | null;
  title: HealthCardT;
  description: HealthCardT;
  overall?: HealthCardT | null;
}

export function AssetsHealth({ health, screenshotsCount }: { health: HealthMap; screenshotsCount: number }) {
  const noScreenshots = screenshotsCount === 0;

  const cards: { label: string; card?: HealthCardT | null }[] = [
    { label: "Icon", card: health.icon },
    {
      label: "Screenshots",
      card: noScreenshots
        ? { status: "Weak" as const, score: 0, summary: "No screenshots were found for this listing.", improvements: ["Add at least 3–4 screenshots to show the app experience"] }
        : health.screenshots,
    },
    { label: "Featured Graphic", card: health.featuredGraphic },
    { label: "Title", card: health.title },
    { label: "Short description", card: health.description },
    { label: "Overall consistency", card: health.overall },
  ];
  const visible = cards.filter((c) => c.card) as { label: string; card: HealthCardT }[];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((c, i) => (
        <HealthCard key={c.label} label={c.label} card={c.card} i={i} />
      ))}
    </div>
  );
}
