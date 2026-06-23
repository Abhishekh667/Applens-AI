"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Link2, Download, Crosshair, ImageIcon, FileText } from "lucide-react";
import { Logo } from "@/components/home/chrome";

const STAGES = [
  { id: "Validating link", icon: Link2 },
  { id: "Fetching listing assets", icon: Download },
  { id: "Analyzing icon", icon: Crosshair },
  { id: "Analyzing screenshots", icon: ImageIcon },
  { id: "Building report", icon: FileText },
];

export function AuditProgress({ activeStage }: { activeStage: string }) {
  const realIndex = STAGES.findIndex((s) => s.id === activeStage);
  const [shown, setShown] = React.useState(0);

  React.useEffect(() => {
    const target = realIndex < 0 ? STAGES.length - 1 : realIndex;
    if (shown < target) {
      const t = setTimeout(() => setShown((s) => s + 1), 700);
      return () => clearTimeout(t);
    }
  }, [shown, realIndex]);

  const current = Math.max(shown, realIndex < 0 ? 0 : realIndex);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-6">
      <div className="pointer-events-none absolute inset-0 paper-noise opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-white blur-[120px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="relative mx-auto mb-10 h-28 w-28">
          <div className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-black/18" />
          <div className="absolute inset-3 rounded-full border border-black/10 bg-white" />
          <div className="absolute inset-0 grid place-items-center">
            <Crosshair className="h-10 w-10 text-foreground" />
          </div>
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute inset-x-0 h-px animate-sweep bg-foreground shadow-[0_0_12px_rgba(17,17,17,0.3)]" />
          </div>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-card">
          <ul className="space-y-3">
            {STAGES.map((stage, i) => {
              const done = i < current;
              const isCurrent = i === current;
              return (
                <li key={stage.id} className="flex items-center gap-3">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-xl border transition-colors ${
                      done
                        ? "border-[#BCECB4] bg-[#DDF8D7] text-[#247A32]"
                        : isCurrent
                          ? "border-black/18 bg-black/[0.04] text-foreground"
                          : "border-black/8 bg-muted text-foreground/30"
                    }`}
                  >
                    {done ? (
                      <Check className="h-4 w-4" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <stage.icon className="h-4 w-4" />
                    )}
                  </span>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      done || isCurrent ? "text-foreground" : "text-foreground/35"
                    }`}
                  >
                    {stage.id}
                  </span>
                  {isCurrent && (
                    <motion.span
                      className="ml-auto text-xs font-semibold text-foreground/50"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    >
                      working…
                    </motion.span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-4 text-center text-xs text-foreground/42">
          The AI is inspecting your listing assets and building the report.
        </p>
      </div>
    </main>
  );
}
