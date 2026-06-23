import { z } from "zod";

/* ---------------------------------- Platform --------------------------------- */

export type Platform = "android" | "ios";

/* ---------------------------------- Listing ---------------------------------- */

export interface Listing {
  platform: Platform;
  appId: string;
  title: string;
  developer: string;
  iconUrl: string;
  screenshots: string[];
  featuredGraphic?: string | null;
  subtitle?: string | null; // iOS subtitle / Android short description
  promotionalText?: string | null; // iOS only
  description: string;
  rating?: number | null;
  reviews?: number | null;
  installs?: string | null; // Android
  category?: string | null;
  updated?: string | null;
  version?: string | null;
  storeUrl: string;
}

/* ----------------------------------- Audit ----------------------------------- */

export const severityEnum = z.enum(["Critical", "High", "Medium", "Low"]);
export type Severity = z.infer<typeof severityEnum>;

export const assetTypeEnum = z.enum([
  "Icon",
  "Screenshot",
  "Featured Graphic",
  "Title",
  "Description",
  "Overall",
]);
export type AssetType = z.infer<typeof assetTypeEnum>;

export const coordinatesSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  width: z.number().min(0).max(1),
  height: z.number().min(0).max(1),
});

export const issueSchema = z.object({
  id: z.string(),
  severity: severityEnum,
  assetType: assetTypeEnum,
  assetIndex: z.number().nullable().optional(),
  title: z.string(),
  whyItMatters: z.string(),
  fix: z.string(),
  impactGain: z.number(),
  priority: z.number(),
  coordinates: coordinatesSchema.nullable().optional(),
  userBehaviorImpact: z.string().optional(),
  conversionStage: z.string().optional(),
  abTestIdea: z.string().optional(),
  confidence: z.enum(["Low", "Medium", "High"]).optional(),
});
export type Issue = z.infer<typeof issueSchema>;

export const healthStatusEnum = z.enum(["Strong", "Needs Work", "Weak"]);
export type HealthStatus = z.infer<typeof healthStatusEnum>;

export const healthCardSchema = z.object({
  status: healthStatusEnum,
  score: z.number().min(0).max(100),
  summary: z.string(),
  improvements: z.array(z.string()),
});
export type HealthCard = z.infer<typeof healthCardSchema>;

export const assetsHealthSchema = z.object({
  icon: healthCardSchema,
  screenshots: healthCardSchema,
  featuredGraphic: healthCardSchema.nullable().optional(),
  title: healthCardSchema,
  description: healthCardSchema,
  overall: healthCardSchema.nullable().optional(),
});

export const workingWellSchema = z.object({
  assetType: assetTypeEnum,
  title: z.string(),
  description: z.string(),
});

export const textFieldAuditSchema = z.object({
  length: z.number().nullable().optional(),
  feedback: z.string(),
  suggestions: z.array(z.string()),
});

export const actionItemSchema = z.object({
  priority: z.number(),
  task: z.string(),
  impact: z.enum(["Low", "Medium", "High"]),
  effort: z.enum(["Low", "Medium", "High"]),
  expectedGain: z.number(),
});
export type ActionItem = z.infer<typeof actionItemSchema>;

export const auditSchema = z.object({
  score: z.number().min(0).max(10),
  scoreLabel: z.string(),
  potentialGain: z.number(),
  summary: z.string(),
  issues: z.array(issueSchema),
  assetsHealth: assetsHealthSchema,
  workingWell: z.array(workingWellSchema),
  textAudit: z.object({
    title: textFieldAuditSchema,
    shortDescription: textFieldAuditSchema,
    description: textFieldAuditSchema,
  }),
  actionPlan: z.array(actionItemSchema),
});
export type Audit = z.infer<typeof auditSchema>;

/* ----------------------------------- API ------------------------------------- */

export interface AuditReport {
  id: string;
  createdAt: string;
  listing: Listing;
  audit: Audit;
}

export const auditRequestSchema = z.object({
  url: z.string().url("Please paste a full store URL."),
});

export type AuditApiResponse =
  | { ok: true; report: AuditReport }
  | { ok: false; error: string; stage?: string };

/* -------------------------------- Score helpers ------------------------------ */

export function scoreLabel(score: number): string {
  if (score <= 3) return "Poor";
  if (score <= 5) return "Needs Work";
  if (score <= 7) return "Average";
  if (score <= 8.5) return "Strong";
  return "Excellent";
}

export function scoreTone(score: number): "bad" | "warn" | "ok" | "good" {
  if (score <= 3) return "bad";
  if (score <= 5) return "warn";
  if (score <= 7) return "ok";
  return "good";
}
