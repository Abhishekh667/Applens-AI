import type { Platform } from "@/types";

export interface ParsedLink {
  platform: Platform;
  appId: string; // android: package name, ios: numeric id
  country?: string;
}

/**
 * Detect platform + extract identifier from a Play Store or App Store URL.
 * Returns null when the URL is not a recognised store listing.
 */
export function parseStoreLink(raw: string): ParsedLink | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();

  // ---- Google Play -------------------------------------------------------
  // https://play.google.com/store/apps/details?id=com.example.app&hl=en
  if (host.endsWith("play.google.com")) {
    const id = url.searchParams.get("id");
    if (!id) return null;
    const country = url.searchParams.get("gl") ?? undefined;
    return { platform: "android", appId: id, country };
  }

  // ---- Apple App Store ---------------------------------------------------
  // https://apps.apple.com/us/app/app-name/id123456789
  // https://itunes.apple.com/us/app/app-name/id123456789
  if (host.endsWith("apps.apple.com") || host.endsWith("itunes.apple.com")) {
    const match = url.pathname.match(/\/id(\d+)/i);
    if (!match) return null;
    const segs = url.pathname.split("/").filter(Boolean);
    // country is usually the first path segment (e.g. /us/app/...)
    const country = segs[0]?.length === 2 ? segs[0] : undefined;
    return { platform: "ios", appId: match[1], country };
  }

  return null;
}

export function platformLabel(p: Platform): string {
  return p === "android" ? "Google Play" : "App Store";
}
