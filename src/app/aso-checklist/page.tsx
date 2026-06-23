import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "ASO Checklist — AppLens AI",
};

export default function AsoChecklistPage() {
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
          ASO Checklist
        </h1>
        <p className="mt-2 text-sm text-foreground/45">
          A complete app store optimisation checklist for higher visibility and conversion
        </p>

        <div className="mt-10 space-y-6 text-base leading-8 text-foreground/78">
          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Title &amp; Subtitle
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Place primary keyword near the beginning of the title</li>
              <li>Keep the full title under 40 characters for Google Play</li>
              <li>Use the subtitle field for secondary keywords (iOS) or short description (Android)</li>
              <li>Ensure the title clearly communicates the app&rsquo;s core function</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Description
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Lead with a benefit-driven opening sentence</li>
              <li>Include primary and secondary keywords naturally within the first 200 characters</li>
              <li>Use short, scannable bullet points for features</li>
              <li>Add social proof early: install count, awards, press mentions</li>
              <li>Avoid keyword stuffing — write for humans first</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Icon
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Use a single, recognisable symbol</li>
              <li>Ensure high contrast for small-size readability</li>
              <li>Avoid text in the icon</li>
              <li>Choose colours that stand out from competitors</li>
              <li>Test the icon at 48&times;48px before publishing</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Screenshots
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>First screenshot must communicate the core benefit in under 3 seconds</li>
              <li>Use a consistent visual style across all screenshots</li>
              <li>Keep text large enough to read at thumbnail size</li>
              <li>Follow a narrative sequence: hook, use case, features, trust</li>
              <li>Use the final screenshot to reinforce trust or provide a call to action</li>
              <li>Avoid showing error states, login screens, or empty states</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Featured Graphic (Android)
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Lead with a short, benefit-driven headline</li>
              <li>Include an app mockup or product visual</li>
              <li>Avoid busy backgrounds or excessive text</li>
              <li>Follow Google Play&rsquo;s 1024&times;500 dimension guideline</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Ratings &amp; Reviews
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Encourage positive reviews through in-app prompts at moments of delight</li>
              <li>Respond to negative reviews promptly and professionally</li>
              <li>Monitor review sentiment for feature requests and bug reports</li>
              <li>Use review data to inform listing updates</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Regular Updates
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Update your listing when you release new features</li>
              <li>Refresh screenshots periodically to keep them current</li>
              <li>A/B test different screenshot arrangements using Google Play experiments</li>
              <li>Monitor conversion rate changes after listing updates</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
