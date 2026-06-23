"use client";
import { motion } from "framer-motion";
import { Bot, Sparkles, Target, Eye, TrendingUp, Shield } from "lucide-react";

const reasons = [
  {
    icon: Bot,
    title: "AI-powered precision",
    body: "AppLens uses computer vision and LLM analysis to detect issues human reviewers often miss — like weak visual hierarchy, low-contrast icons, or conversion-killing screenshot flows.",
  },
  {
    icon: Eye,
    title: "See issues on the image",
    body: "Every visual problem is marked directly on your screenshot. You see exactly what to fix and where, not a generic checklist.",
  },
  {
    icon: Target,
    title: "Focused on conversion",
    body: "We don't just score your listing — we surface what hurts conversion most, prioritized by impact so you know what to fix first.",
  },
  {
    icon: TrendingUp,
    title: "Track improvement over time",
    body: "Run audits after each update and watch your score grow. AppLens makes listing optimization measurable.",
  },
  {
    icon: Shield,
    title: "Built for teams",
    body: "Export clean PDF reports to share with designers, ASO managers, and stakeholders. No account or login required.",
  },
  {
    icon: Sparkles,
    title: "Fast and free to start",
    body: "Paste any public Google Play or App Store link and get a full visual audit in seconds. No credit card, no sign-up.",
  },
];

export function WhyAppLens() {
  return (
    <section id="why-applens" className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-foreground/38">Why AppLens</p>
          <h2 className="font-display text-4xl font-extrabold tracking-[-0.06em] sm:text-6xl">
            Audits that actually show you the problem.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-foreground/58">
            Most ASO tools give you a score and leave you guessing. AppLens marks each issue directly on your assets.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group rounded-[28px] border border-black/8 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <div className="mb-5 inline-grid h-11 w-11 place-items-center rounded-2xl bg-muted text-foreground transition-colors group-hover:bg-foreground group-hover:text-white">
                <r.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-extrabold tracking-[-0.04em]">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/58">{r.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
