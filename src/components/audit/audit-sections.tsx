"use client";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Zap, ArrowUpRight } from "lucide-react";
import type { Audit, Listing, ActionItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress, type BadgeTone } from "@/components/ui/primitives";
import { SafeImage } from "@/components/ui/safe-image";

/* --------------------------------- Icon audit ------------------------------ */

export function IconAudit({ listing, audit }: { listing: Listing; audit: Audit }) {
  const h = audit.assetsHealth.icon;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Icon audit</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex items-end gap-4 rounded-[24px] border border-black/8 bg-muted/60 p-5">
          <SafeImage src={listing.iconUrl} alt="Icon large" className="h-24 w-24 rounded-3xl border border-black/10 shadow-sm" icon />
          <div className="text-center">
            <SafeImage src={listing.iconUrl} alt="Icon 48px" className="h-12 w-12 rounded-xl border border-black/10 shadow-sm" icon />
            <span className="mt-1 block text-[10px] font-semibold text-foreground/40">48px</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Badge tone={h.status === "Strong" ? "good" : h.status === "Weak" ? "bad" : "ok"}>
              {h.status}
            </Badge>
            <span className="font-mono text-sm font-bold tracking-[-0.04em]">{h.score}/100</span>
          </div>
          <Progress value={h.score} tone={h.status === "Strong" ? "good" : h.status === "Weak" ? "bad" : "ok"} className="mb-3" />
          <p className="text-sm leading-6 text-foreground/60">{h.summary}</p>
          <ul className="mt-2 space-y-1">
            {h.improvements.map((i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-5 text-foreground/68">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground" />
                {i}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

/* --------------------------------- Text audit ------------------------------ */

function TextBlock({
  label,
  length,
  feedback,
  suggestions,
}: {
  label: string;
  length?: number | null;
  feedback: string;
  suggestions: string[];
}) {
  return (
    <div className="rounded-[22px] border border-black/8 bg-muted/60 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="font-display text-sm font-extrabold tracking-[-0.03em]">{label}</h4>
        {length != null && (
          <span className="font-mono text-xs font-semibold text-foreground/40">{length} chars</span>
        )}
      </div>
      <p className="text-sm leading-6 text-foreground/60">{feedback}</p>
      <ul className="mt-2 space-y-1">
        {suggestions.map((s) => (
          <li key={s} className="flex items-start gap-2 text-xs font-medium leading-5 text-foreground">
            <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TextAudit({ audit }: { audit: Audit }) {
  const t = audit.textAudit;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title &amp; description audit</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        <TextBlock label="Title" length={t.title.length} feedback={t.title.feedback} suggestions={t.title.suggestions} />
        <TextBlock label="Short description" length={t.shortDescription.length} feedback={t.shortDescription.feedback} suggestions={t.shortDescription.suggestions} />
        <TextBlock label="Full description" length={t.description.length} feedback={t.description.feedback} suggestions={t.description.suggestions} />
      </CardContent>
    </Card>
  );
}

/* ------------------------------- Working well ------------------------------ */

export function WorkingWell({ audit }: { audit: Audit }) {
  if (!audit.workingWell.length) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-signal-good" /> What&apos;s working well
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {audit.workingWell.map((w, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-[22px] border border-[#BCECB4] bg-[#DDF8D7] p-4"
          >
            <Badge tone="good" className="mb-2">{w.assetType}</Badge>
            <h4 className="text-sm font-bold tracking-[-0.02em] text-[#1D5D28]">{w.title}</h4>
            <p className="mt-1 text-xs leading-5 text-[#1D5D28]/80">{w.description}</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

/* -------------------------------- Action plan ------------------------------ */

const levelTone: Record<string, BadgeTone> = {
  High: "good",
  Medium: "ok",
  Low: "neutral",
};

export function ActionPlan({ items }: { items: ActionItem[] }) {
  const sorted = [...items].sort((a, b) => a.priority - b.priority).slice(0, 5);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-foreground" /> Action plan — top {sorted.length} fixes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sorted.map((item) => (
          <div
            key={item.priority}
            className="flex flex-col gap-3 rounded-[22px] border border-black/8 bg-muted/60 p-4 sm:flex-row sm:items-center sm:gap-4"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground font-mono text-sm font-bold text-white">
              {item.priority}
            </span>
            <p className="min-w-0 flex-1 text-sm font-bold tracking-[-0.02em]">{item.task}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={levelTone[item.impact]}>Impact {item.impact}</Badge>
              <Badge tone="neutral">Effort {item.effort}</Badge>
            </div>
            <span className="shrink-0 font-mono text-sm font-bold text-signal-good">
              +{item.expectedGain.toFixed(1)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
