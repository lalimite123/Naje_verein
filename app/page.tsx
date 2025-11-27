import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero-naje"
import { Footer } from "@/components/footer"
import { WorldMapDemo } from "@/components/world-map-demo"
import { NewsletterSection } from "@/components/newsletter-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <Hero />
      <NewsletterSection />
      <WorldMapDemo />
      <Footer />
    </div>
  )
}
