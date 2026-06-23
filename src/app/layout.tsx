import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AppLens AI — Audit app listings on facts, not guesswork",
  description:
    "Paste your Google Play or App Store link and get a visual AI audit of your icon, screenshots, title, description, and conversion issues.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
