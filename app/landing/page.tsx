import { LandingNavbar } from "@/components/landing/landing-navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { CtaFooterSection } from "@/components/landing/cta-footer-section"

export default function LandingPage() {
  return (
    <main className="min-h-screen font-sans">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CtaFooterSection />
    </main>
  )
}
