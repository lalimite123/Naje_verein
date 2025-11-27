"use client"

import { WorldMap } from "@/components/ui/world-map"
import { motion } from "framer-motion"

export function WorldMapDemo() {
  const values = ["Justice", "Droits humains", "Diversité", "Solidarité", "Développement durable"]
  return (
    <div className="py-28 w-full bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-neutral-900 dark:to-black">
      <div className="max-w-7xl mx-auto text-center px-4">
        <p className="font-light text-3xl md:text-4xl text-gray-900 dark:text-white mb-2">Nos valeurs</p>
        <p className="font-semibold text-xl md:text-2xl text-red-600 mb-4">
          {values.map((word, idx) => (
            <motion.span
              key={word}
              className="inline-block mr-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              {word}
            </motion.span>
          ))}
        </p>
        <p className="text-sm md:text-lg text-gray-600 dark:text-neutral-300 max-w-2xl mx-auto">
          Nous agissons pour la justice sociale, la défense des droits humains, le dialogue interculturel et un développement durable au service des communautés.
        </p>
        <div className="flex flex-wrap justify-center gap-2 py-6">
          <span className="px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 text-sm">Interculturalité</span>
          <span className="px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 text-sm">Égalité</span>
          <span className="px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 text-sm">Participation citoyenne</span>
          <span className="px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 text-sm">Solidarité internationale</span>
        </div>
      </div>
      <WorldMap
        lineColor="#dc2626"
        dots={[
          // Canada
          { start: { lat: 48.1372, lng: 11.5756 }, end: { lat: 43.6532, lng: -79.3832 } },
          { start: { lat: 53.5511, lng: 9.9937 }, end: { lat: 49.2827, lng: -123.1207 } },
          // USA
          { start: { lat: 48.8566, lng: 2.3522 }, end: { lat: 40.7128, lng: -74.006 } },
          { start: { lat: 48.1372, lng: 11.5756 }, end: { lat: 34.0522, lng: -118.2437 } },
          // Afrique
          { start: { lat: 53.5511, lng: 9.9937 }, end: { lat: -1.2921, lng: 36.8219 } },
          { start: { lat: 48.1372, lng: 11.5756 }, end: { lat: 6.5244, lng: 3.3792 } },
          { start: { lat: 48.1372, lng: 11.5756 }, end: { lat: 14.6928, lng: -17.4467 } },
          // Brésil
          { start: { lat: 48.8566, lng: 2.3522 }, end: { lat: -23.5505, lng: -46.6333 } },
          { start: { lat: 53.5511, lng: 9.9937 }, end: { lat: -15.7975, lng: -47.8919 } },
          // Asie
          { start: { lat: 48.1372, lng: 11.5756 }, end: { lat: 35.6762, lng: 139.6503 } },
          { start: { lat: 48.8566, lng: 2.3522 }, end: { lat: 28.6139, lng: 77.209 } },
          { start: { lat: 48.1372, lng: 11.5756 }, end: { lat: 1.3521, lng: 103.8198 } },
          // Corée
          { start: { lat: 53.5511, lng: 9.9937 }, end: { lat: 37.5665, lng: 126.978 } },
          // Australie
          { start: { lat: 48.8566, lng: 2.3522 }, end: { lat: -33.8688, lng: 151.2093 } },
          { start: { lat: 48.1372, lng: 11.5756 }, end: { lat: -37.8136, lng: 144.9631 } },
        ]}
      />
    </div>
  )
}