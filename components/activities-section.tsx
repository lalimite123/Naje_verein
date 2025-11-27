"use client"

import { Card } from "@/components/ui/card"

export function ActivitiesSection() {
  return (
    <div className="py-16 lg:py-20 px-4 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-6 mb-12">
          <div>
            <div className="inline-flex items-center justify-center px-6 py-2 rounded-full border border-red-200/50 bg-red-50/50 mb-6">
              <span className="text-sm font-medium text-red-700">Unsere Aktivitäten</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-light mb-3 text-balance text-gray-900">Was wir bewirken</h2>
            <p className="text-gray-600 text-lg text-pretty leading-relaxed max-w-2xl">
              Durch vielfältige Projekte und Veranstaltungen schaffen wir nachhaltigen Wandel in den Bereichen
              Migration, Bildung, Kultur und Entwicklung.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Large Featured Activity - Stadtteilfest */}
          <Card className="lg:col-span-7 relative overflow-hidden h-[400px] lg:h-[500px] group shadow-lg bg-gradient-to-br from-red-500 via-red-600 to-red-700">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[url('/festival-community-event.jpg')] bg-cover bg-center" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <div className="space-y-2">
                <div className="text-white/70 text-sm font-mono uppercase tracking-wider">01</div>
                <h3 className="text-white text-2xl lg:text-3xl font-light text-balance">Stadtteilfest Rothenburg</h3>
                <p className="text-white/90 text-sm lg:text-base leading-relaxed text-pretty">
                  Jährliche Veranstaltung zur Förderung von interkulturellem Austausch und Gemeinschaft in unserem
                  Stadtteil.
                </p>
              </div>
            </div>
          </Card>

          {/* Right Column - NaJe Festival */}
          <Card className="lg:col-span-5 relative overflow-hidden h-[400px] lg:h-[500px] group shadow-lg bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[url('/cultural-music-festival.jpg')] bg-cover bg-center" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <div className="space-y-2">
                <div className="text-white/70 text-sm font-mono uppercase tracking-wider">02</div>
                <h3 className="text-white text-2xl lg:text-3xl font-light text-balance">NaJe Festival</h3>
                <p className="text-white/90 text-sm lg:text-base leading-relaxed text-pretty">
                  Großes Kulturfestival zur Feier von Vielfalt, Kunstformen und kulturellem Erbe verschiedener
                  Gemeinschaften.
                </p>
              </div>
            </div>
          </Card>

          {/* About Card */}
          <Card className="lg:col-span-5 relative overflow-hidden h-[350px] shadow-lg bg-gradient-to-br from-red-600 via-red-600/90 to-red-700 p-6 lg:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-4xl lg:text-5xl font-light text-white tracking-tight">NaJe</div>
              <div className="space-y-3">
                <p className="text-white/95 text-sm lg:text-base leading-relaxed font-medium">
                  Der NaJe Verein steht für Menschenrechte, Gerechtigkeit und interkulturelle Verständigung.
                </p>
                <p className="text-white/80 text-xs lg:text-sm leading-relaxed">
                  Seit Februar 2020 arbeiten wir daran, Grenzen zu überwinden und gemeinsam eine gerechtere,
                  vielfältigere Gesellschaft aufzubauen. Mit Partnern in mehreren Ländern engagieren wir uns für
                  nachhaltige Entwicklung und soziale Veränderung.
                </p>
              </div>
            </div>
            <div className="text-white/60 text-xs font-mono">NAJE VEREIN · DEUTSCHLAND</div>
          </Card>

          {/* Projekte Card */}
          <Card className="lg:col-span-7 relative overflow-hidden h-[350px] shadow-lg bg-gradient-to-br from-gray-100 via-gray-50 to-white p-6 lg:p-8 flex flex-col justify-between border border-gray-200">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500 font-mono mb-1">03</div>
                  <div className="font-medium text-gray-900">Migrations-Projekte</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-mono mb-1">04</div>
                  <div className="font-medium text-gray-900">Bildungs-Programme</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-mono mb-1">05</div>
                  <div className="font-medium text-gray-900">Kulturelle Initiativen</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-mono mb-1">06</div>
                  <div className="font-medium text-gray-900">Entwicklungshilfe</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-300">
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray-600">Fokusbereich</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Interkultureller Dialog</span>
                    <span className="text-xs font-mono">✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Nachhaltige Entwicklung</span>
                    <span className="text-xs font-mono">✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Soziale Gerechtigkeit</span>
                    <span className="text-xs font-mono">✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Zivilgesellschaftliche Teilhabe</span>
                    <span className="text-xs font-mono">✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
              <span>NAJE-VEREIN.DE</span>
              <span>HAMBURG · DEUTSCHLAND</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
