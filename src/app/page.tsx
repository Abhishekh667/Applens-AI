import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { WhyAppLens } from "@/components/home/why-applens";
import { SiteHeader, SiteFooter } from "@/components/home/chrome";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#EEE9DB_0%,#F7F5EE_42%,#FFFFFF_100%)]">
      <SiteHeader />
      <Hero />
      <WhyAppLens />
      <Features />
      <SiteFooter />
    </main>
  );
}
