"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { ChevronRight, TrendingUp } from "lucide-react";
import type { Issue } from "@/types";
import { Badge, Card, type BadgeTone } from "@/components/ui/primitives";

const order: Issue["severity"][] = ["Critical", "High", "Medium", "Low"];
const sevTone: Record<Issue["severity"], BadgeTone> = {
  Critical: "bad",
  High: "warn",
  Medium: "ok",
  Low: "prism",
};

function IssueCard({ issue }: { issue: Issue }) {
  const [open, setOpen] = React.useState(false);
  const asset =
    issue.assetType === "Screenshot" && issue.assetIndex
      ? `Screenshot ${issue.assetIndex}`
      : issue.assetType;

  return (
    <Card className="overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-black/[0.025]"
      >
        <Badge tone={sevTone[issue.severity]}>{issue.severity}</Badge>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold tracking-[-0.02em]">{issue.title}</span>
          <span className="text-xs text-foreground/45">{asset}</span>
        </span>
        <span className="flex items-center gap-1 font-mono text-xs font-bold text-signal-good">
          <TrendingUp className="h-3.5 w-3.5" />+{issue.impactGain.toFixed(1)}
        </span>
        <ChevronRight
          className={`h-4 w-4 text-foreground/35 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-black/8 px-4 py-4"
        >
          <p className="text-sm leading-6 text-foreground/72">
            <span className="font-semibold text-foreground/42">Why it matters · </span>
            {issue.whyItMatters}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            <span className="font-semibold text-foreground/42">Suggested fix · </span>
            {issue.fix}
          </p>
        </motion.div>
      )}
    </Card>
  );
}

export function IssuesList({ issues }: { issues: Issue[] }) {
  const grouped = order
    .map((sev) => ({ sev, items: issues.filter((i) => i.severity === sev) }))
    .filter((g) => g.items.length);

  if (!issues.length) {
    return <p className="text-sm text-foreground/50">No issues were flagged. Nice work.</p>;
  }

  return (
    <div className="space-y-6">
      {grouped.map((g) => (
        <div key={g.sev}>
          <div className="mb-2 flex items-center gap-2">
            <Badge tone={sevTone[g.sev]}>{g.sev}</Badge>
            <span className="text-xs font-semibold text-foreground/45">
              {g.items.length} {g.items.length === 1 ? "issue" : "issues"}
            </span>
          </div>
          <div className="space-y-2">
            {g.items
              .sort((a, b) => a.priority - b.priority)
              .map((iss) => (
                <IssueCard key={iss.id} issue={iss} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
