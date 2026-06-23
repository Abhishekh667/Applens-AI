import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "App Listing Tips — AppLens AI",
};

export default function AppListingTipsPage() {
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
          App Listing Tips
        </h1>
        <p className="mt-2 text-sm text-foreground/45">
          Practical advice to improve your app store conversion
        </p>

        <div className="mt-10 space-y-6 text-base leading-8 text-foreground/78">
          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Lead with the Benefit
            </h2>
            <p>
              The first three seconds are everything. Your first screenshot should
              immediately communicate what the app does and why the user needs it.
              Avoid generic feature lists — lead with a clear, benefit-driven hook
              that stops the scroll.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Optimise Your Screenshot Sequence
            </h2>
            <p>
              Treat your screenshots as a conversion story. Frame 1 should hook
              with the primary benefit. Frames 2–3 should show the key use case
              and main feature. Later frames can support with additional features,
              and the final frame should reinforce trust or include a call to
              action. Every screenshot should be readable at thumbnail size.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Write a Conversion-First Description
            </h2>
            <p>
              Only the first two to three lines are visible before a user taps
              &ldquo;Read more.&rdquo; Lead with a trust signal — install count,
              rating, or a security promise — and state the core outcome in the
              opening sentence. Save detailed feature lists for later.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Design a Readable Icon
            </h2>
            <p>
              Your icon is the first thing users see in search results. It should
              be simple, high-contrast, and communicate the app&rsquo;s category
              at a glance. Avoid intricate details that disappear at 48&times;48px.
              A single strong symbol beats a complex illustration.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Use Your Featured Graphic
            </h2>
            <p>
              On Google Play, the featured graphic is prime real estate. Use it to
              communicate your value proposition visually. A simple, bold headline
              with an app mockup outperforms busy patterns or abstract art.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
