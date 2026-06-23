"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseStoreLink, platformLabel } from "@/lib/parse-link";

export function AuditInput() {
  const router = useRouter();
  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const parsed = React.useMemo(() => (url ? parseStoreLink(url) : null), [url]);

  function submit() {
    const link = parseStoreLink(url);
    if (!link) {
      setError(
        "Paste a Google Play (play.google.com) or App Store (apps.apple.com) listing link.",
      );
      return;
    }
    setError(null);
    router.push(`/report/run?url=${encodeURIComponent(url.trim())}`);
  }

  return (
    <div className="w-full max-w-3xl">
      <div
        className={`group relative flex flex-col gap-3 rounded-[28px] border bg-white p-2.5 shadow-card transition-colors sm:flex-row sm:items-center ${
          error ? "border-signal-bad/40" : "border-black/10 focus-within:border-black/25"
        }`}
      >
        <div className="flex flex-1 items-center gap-3 px-3 sm:px-4">
          <Search className="h-5 w-5 shrink-0 text-foreground/34" />
          <input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Paste your Play Store or App Store link…"
            className="h-12 w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-foreground/34 sm:text-base"
            aria-label="App store listing URL"
            spellCheck={false}
          />
        </div>
        <Button size="lg" onClick={submit} className="shrink-0">
          <Sparkles className="h-4 w-4" />
          Run Audit
        </Button>
      </div>

      <div className="mt-3 flex min-h-[20px] items-center justify-center gap-2 px-1 text-sm">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.span
              key="err"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-signal-bad"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </motion.span>
          ) : parsed ? (
            <motion.span
              key="ok"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 text-signal-good"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-signal-good" />
              Detected {platformLabel(parsed.platform)} · {parsed.appId}
            </motion.span>
          ) : (
            <motion.span key="hint" className="text-center text-foreground/45">
              No login required · AI visual audit · Screenshot issue markers
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
