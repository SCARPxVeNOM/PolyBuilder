"use client"

import { HeroSection } from "@/components/landing/hero-section"
import { StatsSection } from "@/components/landing/stats-section"
import { TemplateCards } from "@/components/landing/template-cards"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { CTASection } from "@/components/landing/cta-section"

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />
      <StatsSection />
      <div id="templates">
        <TemplateCards />
      </div>
      <HowItWorks />
      <Features />
      <CTASection />
    </div>
  )
}

