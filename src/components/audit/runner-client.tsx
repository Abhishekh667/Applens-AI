"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AuditApiResponse } from "@/types";
import { AuditProgress } from "@/components/audit/audit-progress";
import { AuditError } from "@/components/audit/audit-error";
import { saveReport } from "@/lib/report-store";

type State =
  | { phase: "running"; stage: string }
  | { phase: "error"; message: string; stage?: string };

export function RunnerClient() {
  const router = useRouter();
  const params = useSearchParams();
  const url = params.get("url") ?? "";
  const [state, setState] = React.useState<State>({
    phase: "running",
    stage: "Validating link",
  });

  const run = React.useCallback(async () => {
    setState({ phase: "running", stage: "Validating link" });

    // staged visual cues while the single request runs
    const cues = [
      "Fetching listing assets",
      "Analyzing icon",
      "Analyzing screenshots",
      "Building report",
    ];
    let ci = 0;
    const timer = setInterval(() => {
      if (ci < cues.length) {
        setState({ phase: "running", stage: cues[ci] });
        ci += 1;
      }
    }, 4500);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data: AuditApiResponse = await res.json();
      clearInterval(timer);

      if (!data.ok) {
        setState({ phase: "error", message: data.error, stage: data.stage });
        return;
      }
      saveReport(data.report);
      router.replace(`/report/${data.report.id}`);
    } catch {
      clearInterval(timer);
      setState({
        phase: "error",
        message: "Something went wrong reaching the audit service. Please retry.",
        stage: "Building report",
      });
    }
  }, [url, router]);

  React.useEffect(() => {
    if (!url) {
      setState({
        phase: "error",
        message: "No app URL was provided. Start a new audit from the home page.",
        stage: "Validating link",
      });
      return;
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.phase === "error") {
    return (
      <AuditError
        message={state.message}
        stage={state.stage}
        onRetry={url ? run : undefined}
      />
    );
  }
  return <AuditProgress activeStage={state.stage} />;
}
