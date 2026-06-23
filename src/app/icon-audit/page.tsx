import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Icon Audit Guide — AppLens AI",
};

export default function IconAuditPage() {
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
          Icon Audit
        </h1>
        <p className="mt-2 text-sm text-foreground/45">
          How AppLens AI evaluates your app icon
        </p>

        <div className="mt-10 space-y-6 text-base leading-8 text-foreground/78">
          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Instant Category Recognition
            </h2>
            <p>
              The icon is evaluated for how quickly a user can identify the
              app&rsquo;s category and purpose. An icon for a fitness app should
              communicate movement or health, just as a finance app should
              convey security and trust. Icons that blend with unrelated
              categories score lower.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Readability at Small Sizes
            </h2>
            <p>
              AppLens checks whether the icon remains legible at 48&times;48px,
              the standard display size in store search results. Intricate
              details, thin lines, and complex gradients often disappear at
              this scale. The best icons use a single bold symbol with high
              contrast against the background.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Distinctiveness
            </h2>
            <p>
              A strong icon stands out in a grid of competitors. We evaluate
              whether the icon uses a unique shape, colour palette, or symbol
              that helps it get noticed. Icons that resemble generic utility
              badges or use overused symbols may not capture attention.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Brand Consistency
            </h2>
            <p>
              The icon should feel visually aligned with the screenshots and
              overall listing design. Inconsistent colour palettes or art
              styles between the icon and screenshots can reduce the sense
              of polish and professionalism.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
              Platform Guidelines
            </h2>
            <p>
              Both Google Play and the App Store have specific icon design
              guidelines. AppLens checks that the icon follows best practices
              for its platform, including shape requirements, shadow usage,
              and safe zone margins.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
