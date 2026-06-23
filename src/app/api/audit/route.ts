import { NextResponse } from "next/server";
import { auditRequestSchema, type AuditApiResponse, type AuditReport } from "@/types";
import { parseStoreLink } from "@/lib/parse-link";
import { fetchListing, StoreFetchError } from "@/lib/store-fetch";
import { runAudit, AuditAIError } from "@/lib/openrouter";

export const runtime = "nodejs";
export const maxDuration = 180;

function fail(error: string, stage?: string, status = 400) {
  return NextResponse.json<AuditApiResponse>(
    { ok: false, error, stage },
    { status },
  );
}

export async function POST(req: Request) {
  // ---- parse body ----
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request body.", "Validating link");
  }

  const parsed = auditRequestSchema.safeParse(body);
  if (!parsed.success) {
    return fail(
      parsed.error.errors[0]?.message ?? "Invalid URL.",
      "Validating link",
    );
  }

  // ---- detect platform ----
  const link = parseStoreLink(parsed.data.url);
  if (!link) {
    return fail(
      "That link isn't a supported store URL. Paste a Google Play (play.google.com) or App Store (apps.apple.com) listing.",
      "Validating link",
    );
  }

  // ---- fetch listing ----
  let listing;
  try {
    listing = await fetchListing(link);
  } catch (e) {
    if (e instanceof StoreFetchError) return fail(e.message, e.stage, 502);
    console.error("listing fetch error", e);
    return fail("Store data is currently unavailable. Please try again.", "Fetching listing assets", 502);
  }

  if (!listing.screenshots.length && !listing.iconUrl) {
    return fail(
      "We found the app but couldn't load any visual assets to analyze.",
      "Fetching listing assets",
      502,
    );
  }

  // ---- run AI audit ----
  let audit;
  try {
    audit = await runAudit(listing);
  } catch (e) {
    if (e instanceof AuditAIError) return fail(e.message, e.stage, 502);
    console.error("audit error", e);
    return fail("The AI audit failed unexpectedly. Please retry.", "Building report", 502);
  }

  const report: AuditReport = {
    id: `${link.platform}-${link.appId}-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    listing,
    audit,
  };

  return NextResponse.json<AuditApiResponse>({ ok: true, report });
}
