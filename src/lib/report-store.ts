"use client";
import type { AuditReport } from "@/types";

const KEY = "applens:reports";

function readAll(): Record<string, AuditReport> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function saveReport(report: AuditReport) {
  if (typeof window === "undefined") return;
  const all = readAll();
  all[report.id] = report;
  // keep last 12 to avoid bloating storage
  const ids = Object.keys(all).sort(
    (a, b) =>
      new Date(all[b].createdAt).getTime() - new Date(all[a].createdAt).getTime(),
  );
  const trimmed: Record<string, AuditReport> = {};
  ids.slice(0, 12).forEach((id) => (trimmed[id] = all[id]));
  localStorage.setItem(KEY, JSON.stringify(trimmed));
}

export function loadReport(id: string): AuditReport | null {
  return readAll()[id] ?? null;
}
