import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, Bug } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — AppLens AI",
};

export default function ContactPage() {
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
          Contact
        </h1>
        <p className="mt-2 text-sm text-foreground/45">
          Get in touch with the AppLens AI team
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl border border-black/8 bg-white p-5">
            <Bug className="mt-0.5 h-5 w-5 shrink-0 text-foreground/40" />
            <div>
              <h3 className="font-display text-base font-extrabold tracking-[-0.03em]">
                Report an Issue
              </h3>
              <p className="mt-1 text-sm leading-6 text-foreground/55">
                Try the demo report to see how AppLens works, then share your feedback.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-black/8 bg-white p-5">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-foreground/40" />
            <div>
              <h3 className="font-display text-base font-extrabold tracking-[-0.03em]">
                Start an Audit
              </h3>
              <p className="mt-1 text-sm leading-6 text-foreground/55">
                Head back to the home page and paste your app store URL to get started.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-black/8 bg-white p-5">
            <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-foreground/40" />
            <div>
              <h3 className="font-display text-base font-extrabold tracking-[-0.03em]">
                ASO Resources
              </h3>
              <p className="mt-1 text-sm leading-6 text-foreground/55">
                Browse our ASO checklist and app listing tips to improve your store presence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
