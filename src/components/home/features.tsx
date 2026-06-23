"use client";
import { motion } from "framer-motion";
import { Crosshair, ImageIcon, Type, ListChecks, FileDown, Gauge, Link2, BrainCircuit, ClipboardCheck } from "lucide-react";
import { AuditInput } from "./audit-input";

const features = [
  {
    icon: Crosshair,
    title: "Screenshot issue markers",
    body: "Every screenshot is scanned and weak areas are marked directly on the image.",
  },
  {
    icon: Gauge,
    title: "App score out of 10",
    body: "A clear quality score, potential uplift, and issue severity breakdown.",
  },
  {
    icon: ImageIcon,
    title: "Asset health checks",
    body: "Icon, screenshots, featured graphic, title, and description are graded separately.",
  },
  {
    icon: Type,
    title: "Title & description audit",
    body: "Keyword clarity, first-line strength, readability, and conversion hook review.",
  },
  {
    icon: ListChecks,
    title: "Prioritized action plan",
    body: "Top fixes ordered by impact, effort, and expected score gain.",
  },
  {
    icon: FileDown,
    title: "Clean PDF export",
    body: "Share a polished audit report with founders, ASO teams, and designers.",
  },
];

const steps = [
  { icon: Link2, title: "Paste the app link", body: "Use any public Google Play or Apple App Store listing URL." },
  { icon: BrainCircuit, title: "AI scans the listing", body: "The model reviews visuals, text, hierarchy, clarity, and store conversion signals." },
  { icon: ClipboardCheck, title: "Get practical fixes", body: "See what to improve, where to improve it, and how much it can impact score." },
];

export function Features() {
  return (
    <>
      <section id="how-it-works" className="bg-[#F4F1E8]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-foreground/38">Getting started</p>
            <h2 className="font-display text-4xl font-extrabold tracking-[-0.06em] sm:text-6xl">
              Your first audit is one link away.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-foreground/58">
              Built to help app teams move from opinions to a clear, visual listing improvement plan.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group rounded-[28px] border border-black/8 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-card"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-foreground transition-colors group-hover:bg-foreground group-hover:text-white">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground/30">0{i + 1}</span>
                </div>
                <h3 className="font-display text-xl font-extrabold tracking-[-0.04em]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/58">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-muted/40">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-foreground/38">Complete report</p>
            <h2 className="font-display text-4xl font-extrabold tracking-[-0.06em] sm:text-6xl">
              Everything your listing needs to convert better.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-foreground/58">
              AppLens reads your store page the way a shopper does — quickly, visually, and with conversion intent.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group rounded-[28px] border border-black/8 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-card"
              >
                <div className="mb-5 inline-grid h-11 w-11 place-items-center rounded-2xl bg-muted text-foreground transition-colors group-hover:bg-foreground group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-extrabold tracking-[-0.04em]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/58">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="overflow-hidden rounded-[36px] border border-black/10 bg-foreground p-8 text-center shadow-card sm:p-14">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-white">Ready to audit</p>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-extrabold tracking-[-0.06em] text-white sm:text-6xl">
            Stop guessing what hurts conversion.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/60">
            Run a visual AI audit and turn your app listing into a practical improvement checklist.
          </p>
          <div className="mx-auto mt-8 max-w-3xl">
            <div className="[&_button]:!bg-black [&_button]:!text-white [&_button]:border [&_button]:border-white/15 [&_button:hover]:!bg-neutral-900">
              <AuditInput />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
