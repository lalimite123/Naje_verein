"use client"

import { useState, useEffect } from "react"
import { DonationModal } from "./donation-modal"
import { ActivitiesSection } from "./activities-section"
import { ContactSection } from "./contact-section"
import { HeroSection } from "./hero-section"
import { WorkAreasSection } from "./work-areas-section"
import { BackgroundLines } from "./background-lines"

export function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isDonationOpen, setIsDonationOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const progress = Math.min(scrollY / viewportHeight, 1)
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleOpen = () => setIsDonationOpen(true)
    const handleClose = () => setIsDonationOpen(false)

    window.addEventListener("open-donation", handleOpen)
    window.addEventListener("close-donation", handleClose)

    return () => {
      window.removeEventListener("open-donation", handleOpen)
      window.removeEventListener("close-donation", handleClose)
    }
  }, [])

  const linesOpacity = 1 - scrollProgress
  const linesScale = 1 - scrollProgress * 0.3

  const scrollToWork = () => {
    const workSection = document.getElementById("work-areas")
    if (workSection) {
      workSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <main className="relative bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900 overflow-hidden flex-1">
      <BackgroundLines opacity={linesOpacity} scale={linesScale} />

      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />

      <section className="bg-white/90">
        <HeroSection onScrollToWork={scrollToWork} onOpenDonation={() => setIsDonationOpen(true)} />
      </section>

      <div className="border-t border-gray-200" />
      <section className="bg-gray-50">
        <WorkAreasSection />
      </section>

      <div className="border-t border-gray-200" />
      <section className="bg-white">
        <ActivitiesSection />
      </section>

      <div className="border-t border-gray-200" />
      <section className="bg-gray-50">
        <ContactSection />
      </section>
    </main>
  )
}
