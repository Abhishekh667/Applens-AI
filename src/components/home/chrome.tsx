"use client";
import * as React from "react";
import Link from "next/link";
import { Aperture, ArrowUpRight, Menu, X as CloseIcon, Globe, Youtube, X as XLogo, Linkedin } from "lucide-react";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="grid h-8 w-8 place-items-center rounded-xl border border-black/10 bg-white text-foreground shadow-sm">
        <Aperture className="h-4.5 w-4.5" strokeWidth={2.4} />
      </span>
      {showText && (
        <span className="font-display text-lg font-extrabold tracking-[-0.04em]">
          AppLens <span className="text-foreground/45">AI</span>
        </span>
      )}
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 pt-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-[20px] border border-[#E7E5DE] bg-white shadow-sm h-16 px-5">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          <a href="#how-it-works" className="rounded-xl px-3 py-2 text-[13px] font-medium text-[#333] transition-colors hover:bg-black/[0.04]">How it works</a>
          <a href="#why-applens" className="rounded-xl px-3 py-2 text-[13px] font-medium text-[#333] transition-colors hover:bg-black/[0.04]">Why AppLens</a>
          <a href="#features" className="rounded-xl px-3 py-2 text-[13px] font-medium text-[#333] transition-colors hover:bg-black/[0.04]">Features</a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/report/demo"
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-black active:scale-[0.97]"
          >
            Demo Report
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center justify-center rounded-xl border border-[#E7E5DE] p-2 text-foreground/60 md:hidden"
            aria-label="Menu"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-[#E7E5DE] bg-white p-3 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1">
            <a href="#how-it-works" className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-black/[0.04] hover:text-foreground">How it works</a>
            <a href="#why-applens" className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-black/[0.04] hover:text-foreground">Why AppLens</a>
            <a href="#features" className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-black/[0.04] hover:text-foreground">Features</a>
            <Link href="/report/demo" className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-black/[0.04] hover:text-foreground">Demo Report</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      {/* ── TOP WHITE SECTION ── */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
            {/* Left: Newsletter */}
            <div>
              <h2 className="font-display text-5xl font-extrabold leading-[0.92] tracking-[-0.04em] text-foreground sm:text-7xl lg:text-8xl">
                GET BETTER
                <br />
                APP LISTINGS
              </h2>


            </div>

            {/* Right: Navigation columns */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-foreground">Product</h4>
                <ul className="space-y-3 text-sm text-foreground/65">
                  <li><a href="#why-applens" className="transition-opacity hover:text-foreground hover:opacity-100">Why AppLens</a></li>
                  <li><a href="#how-it-works" className="transition-opacity hover:text-foreground hover:opacity-100">How it works</a></li>
                  <li><Link href="/report/demo" className="transition-opacity hover:text-foreground hover:opacity-100">Demo report</Link></li>
                  <li><Link href="/report/demo" className="transition-opacity hover:text-foreground hover:opacity-100">Audit app</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-foreground">Resources</h4>
                <ul className="space-y-3 text-sm text-foreground/65">
                  <li><Link href="/app-listing-tips" className="transition-opacity hover:text-foreground hover:opacity-100">App listing tips</Link></li>
                  <li><Link href="/screenshot-audit" className="transition-opacity hover:text-foreground hover:opacity-100">Screenshot audit</Link></li>
                  <li><Link href="/icon-audit" className="transition-opacity hover:text-foreground hover:opacity-100">Icon audit</Link></li>
                  <li><Link href="/aso-checklist" className="transition-opacity hover:text-foreground hover:opacity-100">ASO checklist</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-foreground">Legal</h4>
                <ul className="space-y-3 text-sm text-foreground/65">
                  <li><Link href="/privacy" className="transition-opacity hover:text-foreground hover:opacity-100">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="transition-opacity hover:text-foreground hover:opacity-100">Terms of Use</Link></li>
                  <li><Link href="/contact" className="transition-opacity hover:text-foreground hover:opacity-100">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── OVERLAP CIRCLE ── */}
      <div className="relative z-10 flex justify-center -mb-[100px] sm:-mb-[120px]">
        <div className="grid h-[180px] w-[180px] place-items-center rounded-full border-8 border-foreground bg-white sm:h-[220px] sm:w-[220px]">
          <Aperture className="h-16 w-16 text-foreground sm:h-20 sm:w-20" strokeWidth={1.2} />
        </div>
      </div>

      {/* ── BOTTOM BLACK SECTION ── */}
      <div className="bg-foreground pt-28 pb-8 sm:pt-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Social icons */}
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#" className="grid h-10 w-10 place-items-center rounded-full bg-white text-foreground transition-transform hover:scale-105" aria-label="Website">
              <Globe className="h-4 w-4" />
            </a>
            <a href="#" className="grid h-10 w-10 place-items-center rounded-full bg-white text-foreground transition-transform hover:scale-105" aria-label="YouTube">
              <Youtube className="h-4 w-4" />
            </a>
            <a href="#" className="grid h-10 w-10 place-items-center rounded-full bg-white text-foreground transition-transform hover:scale-105" aria-label="X">
              <XLogo className="h-4 w-4" />
            </a>
            <a href="#" className="grid h-10 w-10 place-items-center rounded-full bg-white text-foreground transition-transform hover:scale-105" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>

          {/* Giant wordmark */}
          <div className="mt-6 overflow-hidden text-center">
            <span className="block font-matrixtype text-[clamp(3rem,18vw,10rem)] font-extrabold leading-[0.85] tracking-[-0.06em] text-white">
              APPLENS
            </span>
            <span className="block font-matrixtype text-[clamp(2.5rem,14vw,8rem)] font-extrabold leading-[0.85] tracking-[-0.04em] text-white/50">
              AI
            </span>
          </div>

          {/* Bottom legal row */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs font-medium text-white/50 sm:flex-row">
            <span>&copy; {new Date().getFullYear()} AppLens AI</span>
            <div className="flex gap-6">
              <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
              <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
            </div>
            <Link href="/contact" className="transition-colors hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
