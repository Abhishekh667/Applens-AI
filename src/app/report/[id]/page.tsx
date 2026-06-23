"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import type { AuditReport } from "@/types";
import { loadReport } from "@/lib/report-store";
import { ReportView } from "@/components/audit/report-view";
import { AuditError } from "@/components/audit/audit-error";
import { demoReport } from "@/lib/demo-data";

export default function ReportByIdPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [report, setReport] = React.useState<AuditReport | null | undefined>(undefined);

  React.useEffect(() => {
    if (id === "demo") {
      setReport(demoReport);
      return;
    }
    setReport(loadReport(id));
  }, [id]);

  if (report === undefined) {
    return (
      <main className="grid min-h-screen place-items-center">
        <p className="text-sm text-foreground/50">Loading report…</p>
      </main>
    );
  }

  if (!report) {
    return (
      <AuditError
        message="This report isn't in your browser anymore. Reports are stored locally for this MVP — run a new audit to generate a fresh one."
        stage="Loading report"
      />
    );
  }

  return <ReportView report={report} />;
}
