"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Heart } from "lucide-react"

interface HeroSectionProps {
  onScrollToWork: () => void
  onOpenDonation: () => void
}

export function HeroSection({ onScrollToWork, onOpenDonation }: HeroSectionProps) {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[url('/img-hero-section.png')] bg-cover bg-center">
      {/* Overlay pour améliorer le contraste */}
      <div className="absolute inset-0 bg-black/30" />

      <div className=" bottom-6 left-6 right-6 max-w-[min(46rem,92vw)] md:bottom-8 md:left-8 z-10">
        <div className="relative overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 transition-transform duration-500 ease-in hover:scale-[1.01]">
          <h1 className="text-balance text-3xl/tight sm:text-4xl/tight md:text-5xl/tight tracking-tight text-red-50">
            Herzlich Willkommen beim NaJe Verein
          </h1>
          <p className="mt-3 text-sm/6 text-red-100/85 max-w-prose">
            Wir engagieren uns weltweit in Migration, Bildung, Kultur und Entwicklungspolitik. Als aktive
            Zivilgesellschaftsorganisation arbeiten wir an nachhaltigen Lösungen für globale Herausforderungen.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onScrollToWork}
              className="inline-flex items-center rounded-full border border-red-400/50 bg-red-600/10 px-4 py-2 text-sm font-medium text-red-50 backdrop-blur hover:bg-red-600/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 transition-colors"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Unsere Arbeit entdecken
            </Button>
            <Button
              onClick={onOpenDonation}
              className="inline-flex items-center rounded-full border border-red-400/50 bg-white/10 px-4 py-2 text-sm font-medium text-red-50 backdrop-blur hover:bg:white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 transition-colors"
            >
              <Heart className="mr-2 h-4 w-4 fill-current" />
              Spenden
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
