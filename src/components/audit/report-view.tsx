"use client";
import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileDown, ArrowUpRight, AlertTriangle, TrendingUp, Star, Download, Tag, ExternalLink } from "lucide-react";
import type { AuditReport } from "@/types";
import { cn } from "@/lib/utils";
import { scoreTone } from "@/types";
import { platformLabel } from "@/lib/parse-link";
import { exportReportPdf } from "@/lib/export-pdf";
import { Button } from "@/components/ui/button";
import { Badge, Card, CardContent } from "@/components/ui/primitives";
import { ScoreRing } from "@/components/ui/score-ring";
import { Logo } from "@/components/home/chrome";
import { IssuesList } from "./issues-list";
import { AssetsHealth } from "./assets-health";
import { ScreenshotMarkup } from "./screenshot-markup";
import { IconAudit, TextAudit, ActionPlan, WorkingWell } from "./audit-sections";
import { SafeImage } from "@/components/ui/safe-image";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "screenshots", label: "Screenshots" },
  { id: "icon", label: "Icon" },
  { id: "issues", label: "Issues" },
  { id: "health", label: "Assets" },
  { id: "text", label: "Text" },
  { id: "plan", label: "Action Plan" },
];

const toneClass = {
  bad: "text-signal-bad",
  warn: "text-signal-warn",
  ok: "text-signal-ok",
  good: "text-signal-good",
};

function Section({
  id,
  title,
  eyebrow,
  children,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-40">
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-foreground/38">{eyebrow}</p>}
      <h2 className="mb-4 font-display text-2xl font-extrabold tracking-[-0.05em] sm:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

export function ReportView({ report }: { report: AuditReport }) {
  const { listing, audit } = report;
  const [active, setActive] = React.useState("overview");
  const [exporting, setExporting] = React.useState(false);
  const [descExpanded, setDescExpanded] = React.useState(false);
  const tone = scoreTone(audit.score);

  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  async function handleExport() {
    setExporting(true);
    try {
      await exportReportPdf(report);
    } finally {
      setExporting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 pt-6 no-print">
        <div className="mx-auto max-w-6xl rounded-[20px] border border-[#E7E5DE] bg-white shadow-sm">
          <div className="flex h-16 items-center gap-3 px-5">
            <Link href="/" className="hidden sm:block">
              <Logo showText={false} />
            </Link>
            <span className="hidden h-5 w-px bg-[#E7E5DE] sm:block" />
            <SafeImage
              src={listing.iconUrl}
              alt=""
              className="h-8 w-8 shrink-0 rounded-lg border border-black/10 shadow-sm"
              icon
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold tracking-[-0.02em]">{listing.title}</p>
              <p className="text-xs text-foreground/45">
                {platformLabel(listing.platform)} audit report
              </p>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <span className={`font-mono text-base font-bold ${toneClass[tone]}`}>
                {audit.score.toFixed(1)}
              </span>
              <Badge tone="bad">
                <AlertTriangle className="h-3 w-3" />
                {audit.issues.length} issues
              </Badge>
            </div>
            <Button size="sm" variant="subtle" onClick={handleExport} disabled={exporting}>
              <FileDown className="h-4 w-4" />
              {exporting ? "Exporting…" : "Export PDF"}
            </Button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-black active:scale-[0.97]"
            >
              New Audit
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-3 max-w-6xl">
          <nav className="flex gap-1 overflow-x-auto rounded-full border border-[#E7E5DE] bg-white p-1.5 shadow-sm">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(s.id);
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active === s.id
                    ? "bg-[#111111] text-white shadow-sm"
                    : "text-[#77736B] hover:bg-[#F3F2EE] hover:text-[#111111]"
                }`}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div id="report-content" className="mx-auto max-w-7xl space-y-14 px-5 py-10 sm:px-8">

        <Section id="overview" title="Overview" eyebrow="Audit summary">
          <Card className="overflow-hidden">
            <CardContent className="grid gap-8 p-6 lg:grid-cols-[260px_1fr] lg:items-center">
              <div className="flex flex-col items-center gap-3 rounded-[24px] border border-black/8 bg-muted/70 p-6">
                <ScoreRing score={audit.score} label={audit.scoreLabel} />
                <Badge tone="prism" className="px-3">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +{audit.potentialGain.toFixed(1)} possible
                </Badge>
              </div>
              <div className="flex-1">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-medium leading-8 tracking-[-0.03em] text-foreground/82 sm:text-2xl sm:leading-10"
                >
                  {audit.summary}
                </motion.p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Metric label="Critical" value={audit.issues.filter((i) => i.severity === "Critical").length} tone="bad" />
                  <Metric label="High" value={audit.issues.filter((i) => i.severity === "High").length} tone="warn" />
                  <Metric label="Medium" value={audit.issues.filter((i) => i.severity === "Medium").length} tone="ok" />
                  <Metric label="Low" value={audit.issues.filter((i) => i.severity === "Low").length} tone="prism" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section id="screenshots" title="Screenshot audit" eyebrow="Visual issue markers">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <SafeImage
                    src={listing.iconUrl}
                    alt={listing.title}
                    className="h-12 w-12 shrink-0 rounded-2xl border border-black/10 shadow-sm"
                    icon
                  />
                  <div>
                    <p className="font-display text-lg font-extrabold tracking-[-0.04em]">{listing.title}</p>
                    <p className="text-xs text-foreground/45">{listing.developer}</p>
                  </div>
                </div>
                <Badge tone="beam">{platformLabel(listing.platform)}</Badge>
              </div>
              <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MiniStat icon={<Star className="h-4 w-4 text-signal-warn" />} label="Rating" value={listing.rating ? listing.rating.toFixed(1) : "—"} />
                <MiniStat icon={<Star className="h-4 w-4 text-foreground/40" />} label="Reviews" value={listing.reviews ? fmt(listing.reviews) : "—"} />
                {listing.platform === "android" ? (
                  <MiniStat icon={<Download className="h-4 w-4 text-foreground" />} label="Installs" value={listing.installs ?? "—"} />
                ) : (
                  <MiniStat icon={<Tag className="h-4 w-4 text-prism-600" />} label="Version" value={listing.version ?? "—"} />
                )}
                <MiniStat icon={<Tag className="h-4 w-4 text-foreground/40" />} label="Category" value={listing.category ?? "—"} />
              </div>
              {listing.platform === "android" && listing.featuredGraphic && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                  <SafeImage src={listing.featuredGraphic} alt="Featured graphic" className="block w-full" fill={false} />
                </div>
              )}
              <ScreenshotMarkup listing={listing} issues={audit.issues} />

              {listing.description && (
                <div className="mt-6 rounded-[22px] border border-black/8 bg-muted/60 p-4">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/68">
                    {descExpanded ? listing.description : `${listing.description.slice(0, 320)}${listing.description.length > 320 ? "…" : ""}`}
                  </p>
                  {listing.description.length > 320 && (
                    <button
                      onClick={() => setDescExpanded((v) => !v)}
                      className="mt-2 text-xs font-bold text-foreground hover:underline"
                    >
                      {descExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              )}

              <a href={listing.storeUrl} target="_blank" rel="noreferrer" className="mt-5 inline-block">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" /> View on {platformLabel(listing.platform)}
                </Button>
              </a>
            </CardContent>
          </Card>
        </Section>

        <Section id="icon" title="Icon audit" eyebrow="Small-size clarity">
          <IconAudit listing={listing} audit={audit} />
        </Section>

        <Section id="issues" title={`Issues found (${audit.issues.length})`} eyebrow="Prioritized problems">
          <IssuesList issues={audit.issues} />
        </Section>

        <Section id="health" title="Assets health" eyebrow="Listing quality">
          <AssetsHealth health={audit.assetsHealth} screenshotsCount={listing.screenshots.length} />
        </Section>

        <Section id="text" title="Text audit" eyebrow="Title and description">
          <TextAudit audit={audit} />
        </Section>

        <WorkingWell audit={audit} />

        <Section id="plan" title="Action plan" eyebrow="Top fixes">
          <ActionPlan items={audit.actionPlan} />
        </Section>
      </div>
    </main>
  );
}

function fmt(n?: number | null) {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-muted/60 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-foreground/45">
        {icon} {label}
      </div>
      <div className="truncate font-mono text-sm font-bold tracking-[-0.04em]">{value}</div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "bad" | "warn" | "ok" | "prism";
}) {
  const cls = {
    bad: "text-signal-bad bg-[#FBE5E2] border-[#EEC2BC]",
    warn: "text-signal-warn bg-[#FFF0D6] border-[#F3D398]",
    ok: "text-signal-ok bg-[#DDEEFF] border-[#BED9F4]",
    prism: "text-prism-600 bg-[#EFF5E8] border-[#D9E5CE]",
  }[tone];
  return (
    <div className={`rounded-2xl border p-4 text-center ${cls}`}>
      <div className="font-mono text-2xl font-bold tracking-[-0.05em]">{value}</div>
      <div className="text-xs font-semibold opacity-70">{label}</div>
    </div>
  );
}
