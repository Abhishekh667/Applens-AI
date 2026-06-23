"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Apple, Play, Crosshair, Layers, Type, Image as ImageIcon, ShieldCheck, AlertTriangle } from "lucide-react";
import { AuditInput } from "./audit-input";
import { ScoreRing } from "@/components/ui/score-ring";
import { Badge } from "@/components/ui/primitives";

const floats = [
  { text: "Screenshot 1: weak hook", tone: "warn", x: "-5%", y: "10%", delay: 0 },
  { text: "Icon clarity · 81/100", tone: "good", x: "82%", y: "4%", delay: 0.35 },
  { text: "Potential gain · +1.8", tone: "prism", x: "86%", y: "63%", delay: 0.7 },
  { text: "6 high-impact fixes", tone: "bad", x: "-7%", y: "72%", delay: 1.05 },
] as const;

const toneCls = {
  warn: "text-[#A35B00] border-[#F3D398] bg-[#FFF0D6]",
  good: "text-[#247A32] border-[#BCECB4] bg-[#DDF8D7]",
  prism: "text-[#5F724C] border-[#D9E5CE] bg-[#EFF5E8]",
  bad: "text-[#B44135] border-[#EEC2BC] bg-[#FBE5E2]",
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 paper-noise opacity-25" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.7),rgba(248,247,243,0)_65%)]" />
      <div className="pointer-events-none absolute left-1/2 top-40 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[#D8D3C4]/50 blur-[140px]" />
      <div className="pointer-events-none absolute left-1/3 top-1/3 h-[480px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DDF8D7]/20 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 text-center sm:px-8 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge tone="neutral" className="mx-auto mb-8 px-3 py-1.5">
            <Crosshair className="h-3.5 w-3.5" />
            AI vision + store listing logic
          </Badge>

          <h1 className="mx-auto max-w-[1000px] font-display text-[2.8rem] font-extrabold leading-[1.02] tracking-[-0.025em] sm:leading-[0.94] sm:tracking-[-0.035em] sm:text-7xl lg:text-[5.5rem]">
            <span className="block">Audit app listings on</span>
            <span className="block">facts, not guesswork.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-foreground/58 sm:text-lg">
            Paste any Play Store or App Store link and get a visual AI audit of your icon,
            screenshots, title, description, and conversion issues.
          </p>
        </motion.div>

        <motion.div
          className="relative mt-10 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <AuditInput />

          {floats.map((f) => (
            <motion.div
              key={f.text}
              className={`absolute hidden rounded-full border px-3.5 py-2 text-xs font-bold shadow-sm backdrop-blur lg:block ${toneCls[f.tone]}`}
              style={{ left: f.x, top: f.y }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { delay: 0.55 + f.delay, duration: 0.35 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: f.delay },
              }}
            >
              {f.text}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-foreground/65"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a href="https://play.google.com/store/apps" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 transition-colors hover:bg-[#F3F2EE]">
            <Play className="h-4 w-4" /> Google Play
          </a>
          <a href="https://apps.apple.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 transition-colors hover:bg-[#F3F2EE]">
            <Apple className="h-4 w-4" /> Apple App Store
          </a>
          <Link
            href="/report/demo"
            className="flex items-center gap-1 rounded-full border border-black/10 bg-white px-3 py-1.5 text-foreground transition-colors hover:bg-[#F3F2EE]"
          >
            See a sample report <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        <DashboardPreview />
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <motion.div
      className="relative mx-auto mt-16 max-w-5xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      <div className="overflow-hidden rounded-[32px] border border-black/10 bg-white p-3 text-left shadow-card">
        <div className="rounded-[24px] border border-black/8 bg-[#F8F7F3] p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-foreground/38">Audit dashboard</p>
              <h3 className="mt-1 font-display text-xl font-extrabold tracking-[-0.04em]">Conversion health report</h3>
            </div>
            <Badge tone="neutral">Generated in seconds</Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <Badge tone="ok">Average</Badge>
                <span className="font-mono text-xs text-foreground/42">+1.8 gain</span>
              </div>
              <div className="flex justify-center">
                <ScoreRing score={6.7} size={150} label="Score" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2 text-center">
                <MiniStat label="Issues" value="6" />
                <MiniStat label="Assets" value="5" />
              </div>
            </div>

            <div className="grid gap-3">
              {[
                { icon: ImageIcon, label: "Screenshots", v: 62, tone: "ok", note: "Hook needs clarity" },
                { icon: Crosshair, label: "Icon", v: 81, tone: "good", note: "Readable at 48px" },
                { icon: Type, label: "Title & copy", v: 76, tone: "good", note: "Opening can be sharper" },
                { icon: Layers, label: "Visual consistency", v: 67, tone: "ok", note: "Mixed hierarchy" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-3 rounded-2xl border border-black/8 bg-white px-4 py-3 shadow-sm"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted text-foreground/62">
                    <row.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold tracking-[-0.02em] text-foreground">{row.label}</span>
                    <span className="block truncate text-xs text-foreground/45">{row.note}</span>
                  </span>
                  <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-black/[0.06] sm:block">
                    <div
                      className={`h-full rounded-full ${row.tone === "good" ? "bg-signal-good" : "bg-signal-ok"}`}
                      style={{ width: `${row.v}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-xs font-bold text-foreground/58">
                    {row.v}
                  </span>
                </div>
              ))}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#EEC2BC] bg-[#FBE5E2] p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#B44135]"><AlertTriangle className="h-4 w-4" /> Screenshot issue</div>
                  <p className="mt-1 text-xs leading-5 text-[#7B3029]">Headline is too small and does not explain the primary benefit fast enough.</p>
                </div>
                <div className="rounded-2xl border border-[#BCECB4] bg-[#DDF8D7] p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#247A32]"><ShieldCheck className="h-4 w-4" /> What works</div>
                  <p className="mt-1 text-xs leading-5 text-[#1D5D28]">Icon contrast is solid and the listing has a clear core use case.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-muted/70 p-3">
      <div className="font-mono text-lg font-bold tracking-[-0.05em]">{value}</div>
      <div className="text-xs text-foreground/45">{label}</div>
    </div>
  );
}
