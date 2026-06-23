import { NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "play-lh.googleusercontent.com",
  "lh3.googleusercontent.com",
  "is1-ssl.mzstatic.com",
  "is2-ssl.mzstatic.com",
  "is3-ssl.mzstatic.com",
  "is4-ssl.mzstatic.com",
  "is5-ssl.mzstatic.com",
  "mzstatic.com",
];

function isAllowed(url: URL): boolean {
  return ALLOWED_HOSTS.some((h) => url.hostname.endsWith(h));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const urlStr = searchParams.get("url");
  if (!urlStr)
    return new NextResponse("Missing url param", { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  if (!isAllowed(parsed)) {
    // not an allowed host — return a transparent pixel so the UI fallback shows
    return new NextResponse(
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      { headers: { "Content-Type": "image/gif" } },
    );
  }

  try {
    const res = await fetch(urlStr, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);

    const contentType =
      res.headers.get("content-type") ?? "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return new NextResponse(
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      { headers: { "Content-Type": "image/gif" } },
    );
  }
}
