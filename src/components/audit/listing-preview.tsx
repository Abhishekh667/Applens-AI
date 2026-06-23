"use client";
import * as React from "react";
import { Star, Download, ExternalLink, Tag } from "lucide-react";
import type { Listing } from "@/types";
import { Card, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { platformLabel } from "@/lib/parse-link";
import { SafeImage } from "@/components/ui/safe-image";

function fmt(n?: number | null) {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

export function ListingPreview({ listing }: { listing: Listing }) {
  const [expanded, setExpanded] = React.useState(false);
  const desc = listing.description ?? "";
  const short = desc.length > 320 && !expanded ? desc.slice(0, 320) + "…" : desc;

  return (
    <Card className="overflow-hidden">
      {listing.featuredGraphic && (
          <SafeImage
            src={listing.featuredGraphic}
            alt="Featured graphic"
            className="h-44 w-full"
          />
      )}

      <div className="p-6">
        <div className="flex gap-4">
          <SafeImage
            src={listing.iconUrl}
            alt={listing.title}
            className="h-20 w-20 shrink-0 rounded-3xl border border-black/10 shadow-sm"
            icon
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-xl font-extrabold leading-tight tracking-[-0.05em]">
                {listing.title}
              </h3>
              <Badge tone="beam">{platformLabel(listing.platform)}</Badge>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground/55">{listing.developer}</p>
            {listing.subtitle && (
              <p className="mt-2 text-sm leading-6 text-foreground/72">{listing.subtitle}</p>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={<Star className="h-4 w-4 text-signal-warn" />} label="Rating" value={listing.rating ? listing.rating.toFixed(1) : "—"} />
          <Stat icon={<Star className="h-4 w-4 text-foreground/40" />} label="Reviews" value={fmt(listing.reviews)} />
          {listing.platform === "android" ? (
            <Stat icon={<Download className="h-4 w-4 text-foreground" />} label="Installs" value={listing.installs ?? "—"} />
          ) : (
            <Stat icon={<Tag className="h-4 w-4 text-prism-600" />} label="Version" value={listing.version ?? "—"} />
          )}
          <Stat icon={<Tag className="h-4 w-4 text-foreground/40" />} label="Category" value={listing.category ?? "—"} />
        </div>

        {listing.screenshots.length > 0 && (
          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {listing.screenshots.map((s, i) => (
              <SafeImage
                key={i}
                src={s}
                alt={`Screenshot ${i + 1}`}
                className="h-44 shrink-0 rounded-2xl border border-black/8 shadow-sm"
              />
            ))}
          </div>
        )}

        {desc && (
          <div className="mt-5 rounded-[22px] border border-black/8 bg-muted/60 p-4">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/68">
              {short}
            </p>
            {desc.length > 320 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-2 text-xs font-bold text-foreground hover:underline"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        <a href={listing.storeUrl} target="_blank" rel="noreferrer" className="mt-5 inline-block">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" /> View on {platformLabel(listing.platform)}
          </Button>
        </a>
      </div>
    </Card>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-muted/60 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-foreground/45">
        {icon} {label}
      </div>
      <div className="truncate font-mono text-sm font-bold tracking-[-0.04em]">{value}</div>
    </div>
  );
}
