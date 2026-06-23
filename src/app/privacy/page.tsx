import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — AppLens AI",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/50 transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <h1 className="font-display text-4xl font-extrabold tracking-[-0.06em] sm:text-5xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-foreground/45">Last updated: June 2026</p>

        <div className="mt-10 space-y-6 text-base leading-8 text-foreground/78">
          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">Information We Collect</h2>
            <p>
              AppLens AI processes app store listing URLs that you provide through our audit tool. When you submit a URL, we fetch publicly available information from the app store listing — including the app icon, screenshots, title, and description — solely for the purpose of generating an audit report.
            </p>
            <p className="mt-3">
              We do not collect personal information such as your name, email address, or payment details. No account creation or login is required to use the service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">How We Use Data</h2>
            <p>
              The app store data you submit is used exclusively to perform the AI audit and return the results to you. We do not store, sell, or share your submitted URLs or the resulting audit data with third parties. Audit results are stored locally in your browser and are not uploaded to our servers after the audit is complete.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">Third-Party Services</h2>
            <p>
              We use OpenRouter AI to process audit analysis. The app store listing data submitted for audit may be processed through OpenRouter&apos;s API. No personal information is transmitted as part of this process.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">Cookies</h2>
            <p>
              This site does not use tracking cookies. We do not collect analytics or behavioral data about your visit.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">Contact</h2>
            <p>
              If you have questions about this privacy policy, please open an issue on our GitHub repository.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
