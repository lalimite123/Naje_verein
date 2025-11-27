"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { ArrowRight } from "lucide-react"

const workAreas = {
  migration: [
    {
      title: "Migrationsberatung",
      description:
        "Wir unterstützen Migrantinnen und Migranten durch spezialisierte Beratung und bieten Orientierungshilfen für Integration und rechtliche Fragen.",
    },
    {
      title: "Netzwerkarbeit",
      description:
        "Wir schaffen Plattformen für Austausch und Vernetzung zwischen Migrantengemeinden und lokalen Institutionen zur Förderung gegenseitigen Verständnisses.",
    },
  ],
  education: [
    {
      title: "Sprachförderung",
      description:
        "Wir bieten Sprach- und Alphabetisierungskurse, um Menschen bei der sprachlichen Integration zu unterstützen und ihre Chancen auf dem Arbeitsmarkt zu verbessern.",
    },
    {
      title: "Berufliche Qualifikation",
      description:
        "Wir helfen durch Trainings und Mentoring, berufliche Fähigkeiten zu entwickeln und den Übergang in den Arbeitsmarkt zu erleichtern.",
    },
  ],
  culture: [
    {
      title: "Kulturelle Veranstaltungen",
      description:
        "Wir organisieren Festivals, Ausstellungen und Workshops, die diverse Kulturen feiern und zum interkulturellen Dialog beitragen.",
    },
    {
      title: "Künstlerischer Austausch",
      description:
        "Wir unterstützen Künstler aus verschiedenen Kulturen und fördern Kreativität als Medium für kulturelle Verständigung und soziale Veränderung.",
    },
  ],
  development: [
    {
      title: "Nachhaltige Entwicklung",
      description:
        "Wir arbeiten an Projekten zur wirtschaftlichen Entwicklung in Partnerländern und fördern nachhaltige Lösungen für lokale Gemeinschaften.",
    },
    {
      title: "Advocacy & Kampagnen",
      description:
        "Wir setzen uns aktiv für gerechte Politiken ein und mobilisieren Zivilgesellschaft zur Förderung von Menschenrechten und sozialer Gerechtigkeit.",
    },
  ],
}

function WorkAreaCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="group relative rounded-2xl border border-gray-200 p-3 bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:border-red-200">
      <GlowingEffect
        blur={0}
        borderWidth={2}
        spread={80}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      <div className="relative bg-white rounded-xl p-6 lg:p-8 shadow-sm ring-1 ring-gray-100 group-hover:shadow-xl group-hover:ring-red-200 transition-all duration-300">
        <h3 className="text-lg lg:text-xl font-light mb-3 text-gray-900">{title}</h3>
        <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-4">{description}</p>
        <a
          href="#"
          className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors duration-300 group text-sm lg:text-base"
        >
          <span className="underline decoration-2 underline-offset-4">Mehr erfahren</span>
          <ArrowRight className="ml-1 h-3 w-3 lg:h-4 lg:w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  )
}

export function WorkAreasSection() {
  return (
    <section id="work-areas" className="relative z-20 py-16 lg:py-20">
      <div className="container p-6 lg:p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 mx-auto px-4 lg:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 text-balance text-gray-900">
          Unsere Arbeitsbereiche
        </h2>

        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl">
          Wir konzentrieren uns auf vier Hauptbereiche, um gesellschaftliche Veränderungen zu fördern.
        </p>

        <Tabs defaultValue="migration" className="w-full">
          <TabsList className="bg-gray-100 border border-gray-200 p-1 mb-6 rounded-full flex flex-wrap gap-2 h-auto">
            <TabsTrigger
              value="migration"
              className="text-gray-600 data-[state=active]:bg-red-600 data-[state=active]:text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full transition-all text-sm lg:text-base"
            >
              Migration
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="text-gray-600 data-[state=active]:bg-red-600 data-[state=active]:text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full transition-all text-sm lg:text-base"
            >
              Bildung
            </TabsTrigger>
            <TabsTrigger
              value="culture"
              className="text-gray-600 data-[state=active]:bg-red-600 data-[state=active]:text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full transition-all text-sm lg:text-base"
            >
              Kultur
            </TabsTrigger>
            <TabsTrigger
              value="development"
              className="text-gray-600 data-[state=active]:bg-red-600 data-[state=active]:text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full transition-all text-sm lg:text-base"
            >
              Entwicklung
            </TabsTrigger>
          </TabsList>

          {(Object.keys(workAreas) as Array<keyof typeof workAreas>).map((key) => (
            <TabsContent key={key} value={key} className="mt-6">
              <div className="grid md:grid-cols-2 gap-6 bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 shadow-inner transition-all duration-300 hover:shadow-md">
                {workAreas[key].map((area, index) => (
                  <WorkAreaCard key={index} title={area.title} description={area.description} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
