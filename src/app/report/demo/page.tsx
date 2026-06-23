import { ReportView } from "@/components/audit/report-view";
import { demoReport } from "@/lib/demo-data";

export const metadata = { title: "Sample audit · AppLens AI" };

export default function DemoReportPage() {
  return <ReportView report={demoReport} />;
}
