import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Screenshot Audit Guide — AppLens AI",
};

export default function ScreenshotAuditPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/50 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <h1 className="font-display text-4xl font-extrabold tracking-[-0.06em] sm:text-5xl">
          Screenshot Audit
        </h1>
        <p className="mt-2 text-sm text-foreground/45">
          How AppLens AI evaluates your app store screenshots
        </p>

        <div className="mt-10 space-y-6 text-base leading-8 text-foreground/78">
          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              First Frame Hook
            </h2>
            <p>
              Your first screenshot is the most valuable real estate in your
              listing. AppLens evaluates whether it clearly communicates the
              primary benefit within a three-second scan. A strong hook combines
              a clear visual with concise, readable text.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Story Flow
            </h2>
            <p>
              We analyse the screenshot sequence as a narrative. Each frame should
              build on the previous one: hook, use case, key feature, supporting
              features, trust close. Random or repetitive sequences score lower
              because they fail to guide the user toward an install decision.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Thumbnail Readability
            </h2>
            <p>
              Most users first see screenshots in the search grid, where they are
              displayed at very small sizes. AppLens flags screenshots with small
              text, low contrast, or dense UI that becomes illegible when scaled
              down. The fix is usually zooming in on the key action area and
              increasing font sizes.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Visual Markers
            </h2>
            <p>
              For each screenshot issue, AppLens places a coloured bounding box
              on the exact area that needs improvement. These markers are
              severity-coded: red for critical, amber for high, blue for medium,
              and green for low. Clicking a marker reveals the detailed issue
              description and suggested fix.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Benefit vs Feature
            </h2>
            <p>
              We check whether each screenshot communicates a user benefit rather
              than just a feature. A screenshot that says &ldquo;Save Documents&rdquo;
              is describing a feature. One that says &ldquo;Keep Important Documents
              Safe Offline&rdquo; is communicating a benefit. Benefit-driven
              screenshots consistently convert better.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
