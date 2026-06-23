import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Normalise image URL: trim, upgrade http→https, return empty string for bad input */
export function imgSrc(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed.startsWith("http")) return "";
  return trimmed.replace(/^http:\/\//i, "https://");
}
