"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/home/chrome";

export function AuditError({
  message,
  stage,
  onRetry,
}: {
  message: string;
  stage?: string;
  onRetry?: () => void;
}) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-6">
      <div className="pointer-events-none absolute inset-0 paper-noise opacity-50" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md text-center"
      >
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-[28px] border border-black/10 bg-white p-8 shadow-card">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-[#EEC2BC] bg-[#FBE5E2] text-[#B44135]">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="font-display text-xl font-extrabold tracking-[-0.04em]">We couldn&apos;t finish the audit</h1>
          {stage && (
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-foreground/38">
              Failed at: {stage}
            </p>
          )}
          <p className="mt-3 text-sm leading-6 text-foreground/60">{message}</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            {onRetry && (
              <Button onClick={onRetry}>
                <RotateCcw className="h-4 w-4" /> Retry
              </Button>
            )}
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4" /> New audit
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
