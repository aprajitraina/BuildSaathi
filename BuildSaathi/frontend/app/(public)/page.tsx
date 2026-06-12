import { LandingNav } from "@/modules/landing/components/landing-nav";
import { LandingHero } from "@/modules/landing/components/landing-hero";
import { MetricsStrip } from "@/modules/landing/components/metrics-strip";
import { LandingFeatures } from "@/modules/landing/components/landing-features";
import { Testimonials } from "@/modules/landing/components/testimonials";
import { LandingPricing } from "@/modules/landing/components/landing-pricing";
import { CTASection } from "@/modules/landing/components/cta-section";
import { LandingFooter } from "@/modules/landing/components/landing-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <LandingHero />
        <MetricsStrip />
        <LandingFeatures />
        <Testimonials />
        <LandingPricing />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
