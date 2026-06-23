import type { Listing } from "@/types";
import type { ParsedLink } from "./parse-link";

export class StoreFetchError extends Error {
  constructor(
    message: string,
    public stage: string = "Fetching listing assets",
  ) {
    super(message);
    this.name = "StoreFetchError";
  }
}

/* --------------------------------- Android --------------------------------- */

async function fetchAndroidListing(link: ParsedLink): Promise<Listing> {
  // dynamic import keeps this dependency server-only
  const gplay = (await import("google-play-scraper")).default;
  let app: Awaited<ReturnType<typeof gplay.app>>;
  try {
    app = await gplay.app({
      appId: link.appId,
      country: link.country ?? "us",
      lang: "en",
    });
  } catch {
    throw new StoreFetchError(
      "We couldn't find that app on Google Play. Double-check the link is public and try again.",
      "Fetching listing assets",
    );
  }

  const screenshots = (app.screenshots ?? []).slice(0, 8);
  if (!screenshots.length) {
    // not fatal — but we flag it for the UI
    console.warn("No screenshots found for", link.appId);
  }

  return {
    platform: "android",
    appId: link.appId,
    title: app.title,
    developer: app.developer,
    iconUrl: app.icon,
    screenshots,
    featuredGraphic: app.headerImage ?? null,
    subtitle: app.summary ?? null,
    promotionalText: null,
    description: app.description ?? "",
    rating: app.score ?? null,
    reviews: app.reviews ?? null,
    installs: app.installs ?? null,
    category: app.genre ?? null,
    updated: app.updated ? new Date(app.updated).toISOString() : null,
    version: app.version ?? null,
    storeUrl: app.url,
  };
}

/* ----------------------------------- iOS ----------------------------------- */

interface ITunesResult {
  trackName: string;
  artistName: string;
  artworkUrl512?: string;
  artworkUrl100?: string;
  screenshotUrls?: string[];
  ipadScreenshotUrls?: string[];
  description?: string;
  averageUserRating?: number;
  userRatingCount?: number;
  primaryGenreName?: string;
  version?: string;
  currentVersionReleaseDate?: string;
  trackViewUrl?: string;
}

async function fetchIosListing(link: ParsedLink): Promise<Listing> {
  // Apple's public iTunes Lookup API — reliable, no scraping needed.
  const country = link.country ?? "us";
  const lookupUrl = `https://itunes.apple.com/lookup?id=${link.appId}&country=${country}&entity=software`;

  let data: { resultCount: number; results: ITunesResult[] };
  try {
    const res = await fetch(lookupUrl, {
      headers: { "User-Agent": "AppLensAI/1.0" },
      // listing data is fine to cache briefly
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    data = await res.json();
  } catch {
    throw new StoreFetchError(
      "The App Store lookup service did not respond. Please try again in a moment.",
      "Fetching listing assets",
    );
  }

  if (!data.resultCount || !data.results?.length) {
    throw new StoreFetchError(
      "We couldn't find that app on the App Store. Double-check the link and try again.",
      "Fetching listing assets",
    );
  }

  const r = data.results[0];

  // Try to enrich with subtitle/promotional text via app-store-scraper (best effort).
  let subtitle: string | null = null;
  let promotionalText: string | null = null;
  try {
    // app-store-scraper is CommonJS with a default export (see types/app-store-scraper.d.ts).
    const mod = await import("app-store-scraper");
    const store = mod.default ?? (mod as unknown as typeof mod.default);
    if (store?.app) {
      const extra = await store.app({ id: Number(link.appId), country });
      // exposes some fields the lookup API does not (best-effort; may be undefined)
      subtitle = extra.subtitle ?? null;
    }
  } catch {
    // ignore — subtitle is optional
  }

  return {
    platform: "ios",
    appId: link.appId,
    title: r.trackName,
    developer: r.artistName,
    iconUrl: r.artworkUrl512 ?? r.artworkUrl100 ?? "",
    screenshots: (r.screenshotUrls ?? r.ipadScreenshotUrls ?? []).slice(0, 8),
    featuredGraphic: null,
    subtitle,
    promotionalText,
    description: r.description ?? "",
    rating: r.averageUserRating ?? null,
    reviews: r.userRatingCount ?? null,
    installs: null,
    category: r.primaryGenreName ?? null,
    updated: r.currentVersionReleaseDate ?? null,
    version: r.version ?? null,
    storeUrl: r.trackViewUrl ?? `https://apps.apple.com/app/id${link.appId}`,
  };
}

/* --------------------------------- Dispatch -------------------------------- */

export async function fetchListing(link: ParsedLink): Promise<Listing> {
  return link.platform === "android"
    ? fetchAndroidListing(link)
    : fetchIosListing(link);
}
