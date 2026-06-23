import { auditSchema, scoreLabel, type Audit, type Listing } from "@/types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "nvidia/nemotron-nano-12b-v2-vl:free";
const MAX_IMAGES = 6; // icon + up to 5 screenshots (fewer images = faster AI response)

export class AuditAIError extends Error {
  constructor(message: string, public stage = "Building report") {
    super(message);
    this.name = "AuditAIError";
  }
}

/* ------------------------ image download → data URL ------------------------ */

async function toDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "AppLensAI/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    const buf = Buffer.from(await res.arrayBuffer());
    // skip oversized assets to protect the request payload
    if (buf.byteLength > 4_500_000) return null;
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

interface ImagePart {
  label: string;
  dataUrl: string;
}

async function collectImages(listing: Listing): Promise<ImagePart[]> {
  const jobs: { label: string; url: string }[] = [];
  if (listing.iconUrl) jobs.push({ label: "App Icon", url: listing.iconUrl });
  if (listing.featuredGraphic)
    jobs.push({ label: "Featured Graphic", url: listing.featuredGraphic });
  listing.screenshots.forEach((s, i) =>
    jobs.push({ label: `Screenshot ${i + 1}`, url: s }),
  );

  const limited = jobs.slice(0, MAX_IMAGES);
  const settled = await Promise.all(
    limited.map(async (j) => {
      const dataUrl = await toDataUrl(j.url);
      return dataUrl ? { label: j.label, dataUrl } : null;
    }),
  );
  return settled.filter((x): x is ImagePart => x !== null);
}

/* --------------------------------- prompt ---------------------------------- */

const SCHEMA_HINT = `Return ONLY valid minified JSON (no markdown, no commentary) matching exactly:
{
 "score": number 0-10,
 "scoreLabel": "Poor|Needs Work|Average|Strong|Excellent",
 "potentialGain": number,
 "summary": string,
 "issues": [{"id":string,"severity":"Critical|High|Medium|Low","assetType":"Icon|Screenshot|Featured Graphic|Title|Description|Overall","assetIndex": number|null,"title":string,"whyItMatters":string,"fix":string,"impactGain":number,"priority":number,"coordinates":{"x":0-1,"y":0-1,"width":0-1,"height":0-1}|null,"userBehaviorImpact":"Understanding|Trust|Motivation|Readability|Relevance|Decision Confidence","conversionStage":"Impression|Search Result|Product Page Scan|Screenshot Gallery|Install Decision","abTestIdea":string,"confidence":"Low|Medium|High"}],
 "assetsHealth":{"icon":H,"screenshots":H,"featuredGraphic":H|null,"title":H,"description":H,"overall":H|null} where H={"status":"Strong|Needs Work|Weak","score":0-100,"summary":string,"improvements":[string]},
 "workingWell":[{"assetType":string,"title":string,"description":string}],
 "textAudit":{"title":{"length":number|null,"feedback":string,"suggestions":[string]},"shortDescription":{...},"description":{...}},
 "actionPlan":[{"priority":number,"task":string,"impact":"Low|Medium|High","effort":"Low|Medium|High","expectedGain":number}]
}`;

const USER_JOURNEY_RULES = `Analyze this app store listing as a real user journey:

Impression → Search Result → Listing Visit → 3-Second Scan → Screenshot Gallery → Trust Check → Install Decision

Answer: "Will a real store visitor understand, trust, and install this app after seeing the listing?"

## 1. First 3-Second Clarity (weight: 20%)
- Can the user understand what the app does in 3 seconds?
- Is the first screenshot strong enough to stop scrolling?
- Does it clearly show the main user benefit?
- Does the user know who the app is for?

## 2. Search Result Conversion (weight: 15%)
- Analyze icon, title, rating, and first screenshots as they appear in search/browse.
- Does the listing communicate value before the user reads the full description?
- Screenshots 1–3 are highest priority.

## 3. Screenshot Story Flow (weight: 15%)
Evaluate the screenshot sequence as a conversion story:
- Screenshot 1: Hero benefit / strongest hook
- Screenshot 2: Main use case
- Screenshot 3: Key feature / proof
- Screenshots 4–6: Supporting features
- Final screenshot: Trust / outcome / CTA
Flag if screenshots feel random, repetitive, weak, or not ordered by user decision-making.

## 4. Benefit Clarity (weight: 15%)
For every screenshot, check if it communicates a user benefit, not just a feature.
Bad: "Save Documents"
Better: "Keep Important Documents Safe Offline"
Flag screenshots that only describe features without explaining why the user should care.

## 5. Visual Scanability (weight: 10%)
Check: headline readability at store size, text density, contrast, hierarchy, mockup size, UI clarity, clutter, unnecessary elements, dominant message.

## 6. Trust & Install Confidence (weight: 10%)
Check if the listing builds or reduces trust. Look for: professional visual quality, real UI proof, believable claims, privacy/security/accuracy proof when relevant, outdated design, fake-looking visuals, missing trust signals.

## 7. Category Fit (weight: 10%)
First identify the app category and user intent. Then judge screenshots based on what users in that category care about. Examples:
- Wallet/vault: privacy, offline, encryption, no cloud, security
- GPS/area measurement: accuracy, field use case, acres/hectares, map clarity
- Alarm: reliability, wake-up confidence, simple controls
- Recorder: audio clarity, easy recording, sharing, folders
- Dialer: caller ID, contacts, fast calling, clean UI

## 8. Scoring Model
Use weighted scoring from categories 1-7 above. Convert total to score out of 10.
The scoreLabel mapping: 0-3=Poor, 4-5=Needs Work, 6-7=Average, 8-8.5=Strong, 9-10=Excellent

## 9. Screenshot Coordinate Marking
For screenshot issues, return precise coordinates (0-1 normalized) for the exact visual area causing the conversion problem: weak headline, unreadable text, cluttered area, unclear UI, missing focus, confusing callout. Do not place markers randomly. For whole-screenshot issues, use a large bounding box around the main content area.

## 10. Requirements Per Issue
Every issue MUST include:
- what is wrong (title)
- why it affects user conversion (whyItMatters)
- what exactly to change (fix)
- which user behavior it impacts (userBehaviorImpact: Understanding|Trust|Motivation|Readability|Relevance|Decision Confidence)
- which conversion stage (conversionStage: Impression|Search Result|Product Page Scan|Screenshot Gallery|Install Decision)
- priority (1 = highest)
- expected score gain (impactGain)
- A/B test idea when useful (abTestIdea)
- confidence in the finding (confidence: Low|Medium|High)`;

function buildUserText(listing: Listing, images: ImagePart[]): string {
  const order = images.map((im, i) => `Image ${i + 1} = ${im.label}`).join("; ");
  return `${USER_JOURNEY_RULES}

PLATFORM: ${listing.platform === "android" ? "Google Play (has featured graphic)" : "Apple App Store (no featured graphic — set featuredGraphic to null)"}
IMAGES PROVIDED (in order): ${order || "none"}

LISTING METADATA:
- Title: ${listing.title}
- Developer: ${listing.developer}
- Subtitle/Short description: ${listing.subtitle ?? "(none)"}
- Category: ${listing.category ?? "(unknown)"}
- Rating: ${listing.rating ?? "n/a"} (${listing.reviews ?? 0} reviews)
- Installs: ${listing.installs ?? "n/a"}
- Full description:
"""
${(listing.description ?? "").slice(0, 4000)}
"""

${SCHEMA_HINT}`;
}

/* ------------------------------ JSON extraction ---------------------------- */

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let body = fenced ? fenced[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start !== -1 && end !== -1) body = body.slice(start, end + 1);
  return body.trim();
}

function safeParse(text: string): unknown | null {
  try {
    return JSON.parse(extractJson(text));
  } catch {
    return null;
  }
}

/* --------------------------------- request --------------------------------- */

async function callOpenRouter(messages: unknown[]): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new AuditAIError(
      "The audit service is not configured. Add OPENROUTER_API_KEY to .env.local.",
    );
  }

  let res: Response;
  try {
    res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "AppLens AI",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0,
        max_tokens: 6000,
      }),
      signal: AbortSignal.timeout(180000),
    });
  } catch {
    throw new AuditAIError(
      "The AI audit service timed out. Please retry in a moment.",
    );
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("OpenRouter error", res.status, detail.slice(0, 300));
    throw new AuditAIError(
      "The AI audit service returned an error. Please retry shortly.",
    );
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new AuditAIError("The AI returned an empty response.");
  return content;
}

/* ------------------------------- normalisation ----------------------------- */

function normalise(raw: Record<string, unknown>, listing: Listing): Audit {
  const obj = { ...raw } as Record<string, unknown>;

  // guarantee arrays exist
  obj.issues = Array.isArray(obj.issues) ? obj.issues : [];
  obj.workingWell = Array.isArray(obj.workingWell) ? obj.workingWell : [];
  obj.actionPlan = Array.isArray(obj.actionPlan) ? obj.actionPlan : [];

  // re-derive label from score for consistency
  if (typeof obj.score === "number") obj.scoreLabel = scoreLabel(obj.score);

  // iOS never has a featured graphic
  const health = (obj.assetsHealth ?? {}) as Record<string, unknown>;
  if (listing.platform === "ios") health.featuredGraphic = null;
  obj.assetsHealth = health;

  // fill missing nested objects so partial model output still validates
  const defaultHealth = { status: "Needs Work" as const, score: 50, summary: "", improvements: [] as string[] };
  const fillHealth = (obj: Record<string, unknown> | undefined, key: string) => {
    const v = obj?.[key];
    if (!v || typeof v !== "object") { obj![key] = { ...defaultHealth }; return; }
    const h = v as Record<string, unknown>;
    if (!h.status || typeof h.status !== "string") h.status = defaultHealth.status;
    if (typeof h.score !== "number") h.score = defaultHealth.score;
    if (!h.summary || typeof h.summary !== "string") h.summary = defaultHealth.summary;
    if (!Array.isArray(h.improvements)) h.improvements = [...defaultHealth.improvements];
  };
  fillHealth(health, "icon");
  fillHealth(health, "screenshots");
  fillHealth(health, "title");
  fillHealth(health, "description");
  fillHealth(health, "featuredGraphic");
  fillHealth(health, "overall");

  const textA = (obj.textAudit ?? {}) as Record<string, unknown>;
  const defaultText = { length: null, feedback: "", suggestions: [] as string[] };
  const fillText = (key: string) => {
    const v = textA[key];
    if (!v || typeof v !== "object") { textA[key] = { ...defaultText }; return; }
    const t = v as Record<string, unknown>;
    if (t.length == null) t.length = null;
    if (!t.feedback || typeof t.feedback !== "string") t.feedback = defaultText.feedback;
    if (!Array.isArray(t.suggestions)) t.suggestions = [...defaultText.suggestions];
  };
  fillText("title");
  fillText("shortDescription");
  fillText("description");
  obj.textAudit = textA;

  // coerce common model variations into the expected assetType enum
  const assetMap: Record<string, string> = {
    "app icon": "Icon",
    icon: "Icon",
    screenshot: "Screenshot",
    screenshots: "Screenshot",
    "featured graphic": "Featured Graphic",
    feature: "Overall",
    title: "Title",
    description: "Description",
    overall: "Overall",
  };
  function fixAssetType(v: unknown): string {
    if (typeof v !== "string") return "Overall";
    return assetMap[v.trim().toLowerCase()] ?? v;
  }

  // fill defaults for every issue so partial model output still validates
  (obj.issues as Record<string, unknown>[]).forEach((it, i) => {
    if (!it.id) it.id = `issue_${i + 1}`;
    if (typeof it.priority !== "number") it.priority = i + 1;
    if (!it.severity) it.severity = "Medium";
    if (!it.assetType) it.assetType = "Overall";
    else it.assetType = fixAssetType(it.assetType);
    if (!it.title) it.title = "Untitled issue";
    if (!it.whyItMatters) it.whyItMatters = "";
    if (!it.fix) it.fix = "";
    if (typeof it.impactGain !== "number") it.impactGain = 0;
  });

  for (const item of obj.workingWell as Record<string, unknown>[])
    if (typeof item.assetType === "string")
      item.assetType = fixAssetType(item.assetType);

  return auditSchema.parse(obj);
}

/* ---------------------------------- public --------------------------------- */

export async function runAudit(listing: Listing): Promise<Audit> {
  const images = await collectImages(listing);

  const content: unknown[] = [{ type: "text", text: buildUserText(listing, images) }];
  for (const im of images) {
    content.push({ type: "image_url", image_url: { url: im.dataUrl } });
  }

  const messages = [
    {
      role: "system",
        content:
          "You are a senior Conversion Rate Optimization (CRO) and App Store Optimization (ASO) expert specializing in user psychology and behavioral design. You analyze app store listings as conversion funnels — not just visual assets. You respond only with strict JSON.",
    },
    { role: "user", content },
  ];

  const first = await callOpenRouter(messages);
  let parsed = safeParse(first);

  // one repair attempt
  if (!parsed) {
    const repair = await callOpenRouter([
      {
        role: "system",
        content: "You fix malformed JSON. Return only corrected, valid JSON.",
      },
      {
        role: "user",
        content: `This should be valid JSON for an app audit but failed to parse. Return only the corrected JSON:\n\n${first.slice(0, 8000)}`,
      },
    ]);
    parsed = safeParse(repair);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new AuditAIError(
      "The AI returned a response we could not read. Please retry.",
    );
  }

  try {
    return normalise(parsed as Record<string, unknown>, listing);
  } catch (e) {
    console.error("Schema validation failed", e);
    throw new AuditAIError(
      "The AI report did not match the expected format. Please retry.",
    );
  }
}
