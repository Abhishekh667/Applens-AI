import { NextResponse } from "next/server";
import { demoReport } from "@/lib/demo-data";
import type { AuditApiResponse } from "@/types";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json<AuditApiResponse>({ ok: true, report: demoReport });
}
