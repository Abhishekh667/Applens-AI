import { Suspense } from "react";
import { RunnerClient } from "@/components/audit/runner-client";
import { AuditProgress } from "@/components/audit/audit-progress";

export const dynamic = "force-dynamic";

export default function RunPage() {
  return (
    <Suspense fallback={<AuditProgress activeStage="Validating link" />}>
      <RunnerClient />
    </Suspense>
  );
}
