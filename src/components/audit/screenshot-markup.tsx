"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, ExternalLink, AlertTriangle, TrendingUp, Star } from "lucide-react";
import type { Issue, Listing } from "@/types";
import { Badge, type BadgeTone } from "@/components/ui/primitives";
import { SafeImage } from "@/components/ui/safe-image";

const sevTone: Record<Issue["severity"], BadgeTone> = {
  Critical: "bad",
  High: "warn",
  Medium: "ok",
  Low: "prism",
};
const sevColor: Record<Issue["severity"], string> = {
  Critical: "#B44135",
  High: "#A35B00",
  Medium: "#2F5F9D",
  Low: "#5F724C",
};
const sevLabel: Record<Issue["severity"], string> = {
  Critical: "Critical",
  High: "High",
  Medium: "Medium",
  Low: "Low",
};

const MIN_BOX = 28;

function clampBox(w: number, h: number) {
  const rw = Math.max(w * 100, (MIN_BOX / 220) * 100);
  const rh = Math.max(h * 100, (MIN_BOX / 220) * 100);
  return { w: Math.min(rw, 100), h: Math.min(rh, 100) };
}

/* ------------------------------- Severity Legend ------------------------------ */

function SeverityLegend() {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-medium text-foreground/55">
      <span className="text-xs font-semibold text-foreground/40">Severity:</span>
      {(Object.keys(sevColor) as Issue["severity"][]).map((s) => (
        <span key={s} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: sevColor[s] }}
          />
          {sevLabel[s]}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------- Severity Summary ----------------------------- */

function SevSummary({ issues }: { issues: Issue[] }) {
  const groups = { Critical: 0, High: 0, Medium: 0, Low: 0 } as Record<string, number>;
  issues.forEach((i) => { groups[i.severity]++; });
  const parts = (Object.keys(groups) as Issue["severity"][]).filter((s) => groups[s] > 0);
  if (!parts.length) return null;
  return (
    <span className="text-xs text-foreground/45">
      {parts.map((s) => (
        <span key={s} className="ml-1">
          <span className="font-semibold" style={{ color: sevColor[s] }}>{groups[s]}</span> {s.toLowerCase()}
        </span>
      ))}
    </span>
  );
}

/* ------------------------------- Issue Detail Popover -------------------------- */

function IssuePopover({
  issue,
  num,
}: {
  issue: Issue;
  num: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.15 }}
      className="fixed bottom-6 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 rounded-2xl border border-[#E7E5DE] bg-white p-4 text-left shadow-xl"
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ background: sevColor[issue.severity] }}
        >
          {num}
        </span>
        <Badge tone={sevTone[issue.severity]}>{issue.severity}</Badge>
        <span className="ml-auto flex items-center gap-1 font-mono text-xs font-bold text-signal-good">
          <TrendingUp className="h-3 w-3" />+{issue.impactGain.toFixed(1)}
        </span>
      </div>
      <p className="text-sm font-bold leading-tight">{issue.title}</p>
      <p className="mt-1.5 text-xs leading-5 text-foreground/58">{issue.whyItMatters}</p>
      <div className="mt-2 rounded-xl border border-black/8 bg-muted/60 p-2.5">
        <p className="text-[11px] font-semibold text-foreground/45">Suggested fix</p>
        <p className="mt-0.5 text-xs leading-5 text-foreground">{issue.fix}</p>
      </div>
    </motion.div>
  );
}

/* ------------------------------- Detail Modal ---------------------------------- */

function ScreenshotDetailModal({
  src,
  index,
  issues,
  shotNumber,
  onClose,
}: {
  src: string;
  index: number;
  issues: Issue[];
  shotNumber: number;
  onClose: () => void;
}) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const activeIssue = activeId ? issues.find((i) => i.id === activeId) ?? null : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#E7E5DE] bg-white shadow-2xl lg:flex-row"
      >
        {/* Screenshot side */}
        <div className="relative flex-1 bg-[#F8F7F3] p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-white shadow-sm hover:bg-[#F3F2EE]"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-foreground/38">
            Screenshot {index}
          </p>
          <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-black/10 shadow-sm">
            <SafeImage src={src} alt={`Screenshot ${index}`} className="block w-full" fill={false} />
            {issues.map((iss, n) => {
              if (!iss.coordinates) return null;
              const c = iss.coordinates;
              const isActive = activeId === iss.id;
              const num = shotNumber + n;
              const { w, h } = clampBox(c.width, c.height);
              return (
                <button
                  key={iss.id}
                  onClick={() => setActiveId(isActive ? null : iss.id)}
                  className="absolute z-10 cursor-pointer"
                  style={{
                    left: `${c.x * 100}%`,
                    top: `${c.y * 100}%`,
                    width: `${w}%`,
                    height: `${h}%`,
                  }}
                  aria-label={iss.title}
                >
                  <span
                    className="absolute inset-0 rounded transition-all"
                    style={{
                      border: isActive ? `3px solid ${sevColor[iss.severity]}` : `2px solid ${sevColor[iss.severity]}`,
                      boxShadow: isActive
                        ? `0 0 0 9999px rgba(17,17,17,0.3), 0 0 16px ${sevColor[iss.severity]}55`
                        : "none",
                      background: `${sevColor[iss.severity]}${isActive ? "1a" : "12"}`,
                    }}
                  />
                  <span
                    className="absolute -left-1 -top-1 grid h-6 w-6 place-items-center rounded-full text-xs font-bold text-white shadow-md"
                    style={{ background: sevColor[iss.severity] }}
                  >
                    {num}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail side */}
        <div className="flex w-full flex-col border-t border-[#E7E5DE] bg-white lg:w-80 lg:border-l lg:border-t-0">
          <div className="border-b border-[#E7E5DE] px-5 py-4">
            <h3 className="font-display text-lg font-extrabold tracking-[-0.04em]">
              Screenshot {index}
            </h3>
            <p className="text-xs text-foreground/45">
              {issues.length} issue{issues.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-5">
            {issues.length === 0 && (
              <div className="flex items-center gap-2 rounded-2xl border border-[#BCECB4] bg-[#DDF8D7] px-4 py-3 text-sm font-bold text-[#247A32]">
                <CheckCircle2 className="h-4 w-4" /> No major issue found
              </div>
            )}
            {issues.map((iss, n) => {
              const num = shotNumber + n;
              const isActive = activeId === iss.id;
              return (
                <button
                  key={iss.id}
                  onClick={() => setActiveId(isActive ? null : iss.id)}
                  className={`w-full rounded-2xl border p-3 text-left transition-all ${
                    isActive
                      ? "border-black/20 bg-[#F3F2EE] shadow-sm"
                      : "border-black/8 bg-white hover:bg-muted/60"
                  }`}
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: sevColor[iss.severity] }}
                    >
                      {num}
                    </span>
                    <Badge tone={sevTone[iss.severity]}>{iss.severity}</Badge>
                    <span className="ml-auto font-mono text-xs font-bold text-signal-good">
                      +{iss.impactGain.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm font-bold leading-tight">{iss.title}</p>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-2 space-y-2 overflow-hidden"
                    >
                      <p className="text-xs leading-5 text-foreground/58">{iss.whyItMatters}</p>
                      <div className="rounded-xl border border-black/8 bg-muted/60 p-2.5">
                        <p className="text-[11px] font-semibold text-foreground/45">Fix</p>
                        <p className="mt-0.5 text-xs leading-5 text-foreground">{iss.fix}</p>
                      </div>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------- Shot Card ------------------------------------- */

function ShotCard({
  src,
  index,
  issues,
  shotNumber,
}: {
  src: string;
  index: number;
  issues: Issue[];
  shotNumber: number;
}) {
  const [active, setActive] = React.useState<string | null>(null);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const shotIssues = issues.filter(
    (i) => i.assetType === "Screenshot" && i.assetIndex === index && i.coordinates,
  );

  const activeIssue = active ? shotIssues.find((i) => i.id === active) ?? null : null;
  const hoveredIssue = hovered ? shotIssues.find((i) => i.id === hovered) ?? null : null;
  const showIssue = activeIssue ?? hoveredIssue;
  const showNum = showIssue ? shotNumber + shotIssues.indexOf(showIssue) : 0;

  return (
    <>
      <div className="relative shrink-0">
        {/* Screenshot image */}
        <div className="relative w-[200px] overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-sm sm:w-[240px]">
          <button
            onClick={() => setModalOpen(true)}
            className="absolute right-2 top-2 z-20 rounded-full border border-black/8 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-foreground/55 shadow-sm backdrop-blur transition-colors hover:bg-white"
          >
            <ExternalLink className="mr-1 inline-block h-3 w-3" />
            Expand
          </button>
          <SafeImage src={src} alt={`Screenshot ${index}`} className="block w-full" fill={false} />

          {shotIssues.map((iss, n) => {
            if (!iss.coordinates) return null;
            const c = iss.coordinates;
            const isHovered = hovered === iss.id;
            const isActiveMarker = active === iss.id;
            const highlighted = isActiveMarker || isHovered;
            const num = shotNumber + n;
            const { w, h } = clampBox(c.width, c.height);

            return (
              <button
                key={iss.id}
                onClick={() => setActive(active === iss.id ? null : iss.id)}
                onMouseEnter={() => setHovered(iss.id)}
                onMouseLeave={() => setHovered(null)}
                className="absolute z-10 cursor-pointer"
                style={{
                  left: `${c.x * 100}%`,
                  top: `${c.y * 100}%`,
                  width: `${w}%`,
                  height: `${h}%`,
                }}
                aria-label={iss.title}
              >
                {/* Bounding box */}
                <span
                  className="absolute inset-0 rounded transition-all duration-150"
                  style={{
                    border: `2px solid ${sevColor[iss.severity]}`,
                    boxShadow: highlighted
                      ? `0 0 0 9999px rgba(17,17,17,0.3), 0 0 12px ${sevColor[iss.severity]}44`
                      : "none",
                    background: highlighted
                      ? "transparent"
                      : `${sevColor[iss.severity]}12`,
                  }}
                />
                {/* Numbered pill - top-left corner */}
                {highlighted && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -left-1 -top-1 z-20 grid h-6 w-6 place-items-center rounded-full text-xs font-bold text-white shadow-md"
                    style={{ background: sevColor[iss.severity] }}
                  >
                    {num}
                  </motion.span>
                )}
                {!highlighted && (
                  <span
                    className="absolute -left-1 -top-1 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white shadow-sm"
                    style={{ background: sevColor[iss.severity] }}
                  >
                    {num}
                  </span>
                )}
              </button>
            );
          })}

          {shotIssues.length === 0 && (
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 rounded-full border border-[#BCECB4] bg-[#DDF8D7]/95 py-1.5 text-xs font-bold text-[#247A32] backdrop-blur">
              <CheckCircle2 className="h-3.5 w-3.5" /> No major issue found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-2 flex w-[200px] items-center justify-between sm:w-[240px]">
          <div className="text-xs font-semibold text-foreground/45">
            Screenshot {index}
            {shotIssues.length > 0 && (
              <span> · {shotIssues.length} issue{shotIssues.length > 1 ? "s" : ""}</span>
            )}
          </div>
          {shotIssues.length > 0 && (
            <SevSummary issues={shotIssues} />
          )}
        </div>

        {/* Clickable issue list below */}
        {shotIssues.length > 0 && (
          <div className="mt-1.5 w-[200px] space-y-1 sm:w-[240px]">
            {shotIssues.map((iss, n) => {
              const num = shotNumber + n;
              const isActiveItem = active === iss.id;
              return (
                <button
                  key={iss.id}
                  onClick={() => setActive(active === iss.id ? null : iss.id)}
                  onMouseEnter={() => setHovered(iss.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all ${
                    isActiveItem
                      ? "border-black/20 bg-[#F3F2EE] shadow-sm"
                      : "border-black/8 bg-white hover:bg-muted/60"
                  }`}
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: sevColor[iss.severity] }}
                  >
                    {num}
                  </span>
                  <span className="min-w-0 flex-1 text-xs font-semibold leading-tight text-foreground">
                    {iss.title}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] font-bold text-signal-good">
                    +{iss.impactGain.toFixed(1)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Hover popover */}
        <AnimatePresence>
          {showIssue && !activeIssue && (
            <IssuePopover
              key={showIssue.id}
              issue={showIssue}
              num={showNum}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {modalOpen && (
          <ScreenshotDetailModal
            src={src}
            index={index}
            issues={shotIssues}
            shotNumber={shotNumber}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------- Main Export ----------------------------------- */

export function ScreenshotMarkup({
  listing,
  issues,
}: {
  listing: Listing;
  issues: Issue[];
}) {
  if (!listing.screenshots.length) {
    return <p className="text-sm text-foreground/50">No screenshots were found for this listing.</p>;
  }

  let shotNumber = 1;
  const shotIssuesCount = listing.screenshots.map((_, i) => {
    const count = issues.filter(
      (iss) => iss.assetType === "Screenshot" && iss.assetIndex === i + 1 && iss.coordinates,
    ).length;
    const start = shotNumber;
    shotNumber += count;
    return start;
  });

  return (
    <div className="space-y-3">
      <SeverityLegend />
      <div className="flex gap-5 overflow-x-auto pb-2">
        {listing.screenshots.map((src, i) => (
          <ShotCard
            key={i}
            src={src}
            index={i + 1}
            issues={issues}
            shotNumber={shotIssuesCount[i]}
          />
        ))}
      </div>
    </div>
  );
}
