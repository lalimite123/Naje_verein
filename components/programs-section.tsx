"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { buildICSDataUrl, icsFilename, buildGoogleCalendarUrl } from "@/lib/ics"
import Head from "next/head"
import Image from "next/image"

const gcsLoader = ({ src }: { src: string; width?: number; quality?: number }) => src

type ProgramItem = {
  id: string
  title: string
  summary: string
  date: string
  time?: string
  location?: string
  organizer?: string
  type: "program" | "event"
  image?: string
}

export function ProgramsSection() {
  const [items, setItems] = useState<ProgramItem[]>([])
  const [loading, setLoading] = useState(true)
  const [zoomItem, setZoomItem] = useState<ProgramItem | null>(null)

  const downloadIcs = (it: ProgramItem) => {
    const time = it.time || "00:00"
    const href = buildICSDataUrl({
      uid: it.id,
      title: it.title,
      description: it.summary || "",
      date: it.date,
      time,
      location: it.location || undefined,
    })
    const a = document.createElement("a")
    a.href = href
    a.download = icsFilename(it.title, it.date)
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const openGoogleCalendar = (it: ProgramItem) => {
    const time = it.time || "00:00"
    const url = buildGoogleCalendarUrl({
      title: it.title,
      description: it.summary || "",
      date: it.date,
      time,
      location: it.location || undefined,
    })
    window.open(url, "_blank")
  }

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/programs?page=1&limit=60")
        const data = await res.json()
        const mapped: ProgramItem[] = (data.items || []).map((it: any) => ({
          id: it._id?.toString?.() || it._id || it.id || String(Math.random()),
          title: String(it.title || ""),
          summary: String(it.summary || ""),
          date: String(it.date || ""),
          time: it.time ? String(it.time) : undefined,
          location: it.location ? String(it.location) : undefined,
          organizer: it.organizer ? String(it.organizer) : undefined,
          type: (it.type === "event" ? "event" : "program") as "program" | "event",
          image: it.image ? String(it.image) : undefined,
        }))
        setItems(mapped)
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  return (
    <section id="programs-events" className="py-16 lg:py-20 px-4 lg:px-8 bg-white">
      <Head>
        <link rel="preconnect" href="https://storage.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://storage.googleapis.com" />
      </Head>
      <div className="container mx-auto max-w-6xl">
        <div className="inline-flex items-center justify-center px-6 py-2 rounded-full border border-red-200/50 bg-red-50/50 mb-6">
          <span className="text-sm font-medium text-red-700">Programme & Veranstaltungen</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-light mb-3 text-balance text-gray-900">Aktuell und demnächst</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">Übersicht der Programme und Events, verwaltet im Admin-Bereich.</p>

        {loading ? (
          <div aria-busy className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="relative overflow-hidden rounded-lg bg-white shadow-2xl">
                <div className="h-56 md:h-72 lg:h-80 w-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-t from-red-600/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="bg-white/70 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-gray-400 flex items-center justify-between">
                    <span className="truncate w-24 h-3 bg-gray-200 rounded" />
                    <span className="inline-flex items-center gap-1">
                      <span className="h-3 w-16 bg-gray-200 rounded" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg text-gray-600">Keine Einträge verfügbar.</div>
        ) : (
          <div className="mt-4">
            <Carousel className="relative">
              <CarouselContent className="items-stretch">
                {items.map((it) => (
                  <CarouselItem key={it.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                    <div className="group relative">
                      <div className="relative overflow-hidden rounded-lg bg-white shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-red-600/50 h-56 md:h-72 lg:h-80">
                         <div className="absolute inset-0 bg-gradient-to-t from-red-600/80 via-transparent to-transparent z-10 pointer-events-none" />
                         <button
                          type="button"
                          onClick={() => setZoomItem(it)}
                          className="block"
                        >
                          <Image
                            loader={gcsLoader}
                            unoptimized
                            src={it.image || "/logo-naje.png"}
                            alt={it.title}
                            loading="lazy"
                            sizes="(min-width:1024px) 16.66vw, (min-width:768px) 25vw, (min-width:640px) 33.33vw, 50vw"
                            fill
                            className="object-cover"
                          />
                        </button>
                        <div className="absolute left-2 top-2 z-20">
                          <span className={`text-[10px] px-2 py-1 rounded-full border ${it.type === "program" ? "border-blue-200 text-blue-700 bg-blue-50" : "border-amber-200 text-amber-700 bg-amber-50"}`}>{it.type === "program" ? "Programm" : "Event"}</span>
                        </div>
                        <div className="absolute inset-0 ring-2 ring-white group-hover:ring-red-600 transition-colors duration-300 rounded-lg pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
                          <div className="bg-white/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-gray-800 flex items-center justify-between">
                            <span className="truncate">{it.title}</span>
                            <span className="inline-flex items-center gap-1 text-gray-600"><CalendarDays className="h-3.5 w-3.5" />{it.date}</span>
                          </div>
                        </div>
                        <div className="absolute inset-0 shadow-[0_0_30px_rgba(220,38,38,0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 hidden md:flex" />
              <CarouselNext className="-right-4 hidden md:flex" />
            </Carousel>

                {zoomItem && (
                  <Dialog open={!!zoomItem} onOpenChange={(o) => !o && setZoomItem(null)}>
                    <DialogContent overlayClassName="bg-black/70 backdrop-blur-sm" className="sm:max-w-3xl bg-white border border-gray-200 shadow-2xl shadow-[0_25px_80px_rgba(220,38,38,0.25)]">
                      <DialogHeader>
                        <div className="flex items-center gap-2">
                          <DialogTitle className="flex-1">{zoomItem.title}</DialogTitle>
                          {zoomItem.organizer && (
                            <span className="text-[11px] px-2 py-1 rounded-full border border-red-200 bg-red-50 text-red-700">Organisateur: {zoomItem.organizer}</span>
                          )}
                        </div>
                      </DialogHeader>
                  <div className="rounded-xl overflow-hidden border border-gray-200 bg-black/5 relative h-[300px] sm:h-[360px] md:h-[420px]">
                    <Image
                      loader={gcsLoader}
                      unoptimized
                      src={zoomItem.image || "/logo-naje.png"}
                      alt={zoomItem.title}
                      loading="lazy"
                      sizes="(min-width:768px) 60vw, 90vw"
                      fill
                      className="object-cover"
                    />
                  </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
                          <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{zoomItem.date}</span>
                          {zoomItem.time && (
                            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{zoomItem.time}</span>
                          )}
                          {zoomItem.location && (
                            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{zoomItem.location}</span>
                          )}
                        </div>
                        {zoomItem.summary && (
                          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-800">
                            {zoomItem.summary.split(/\n+/).map((p, i) => (
                              <p key={i} className="mb-2 last:mb-0">{p}</p>
                            ))}
                          </div>
                        )}
                        <div className="pt-2 flex gap-2 flex-wrap">
                          <Button className="bg-red-600 hover:bg-red-700" onClick={() => downloadIcs(zoomItem!)}>Ajouter à mon agenda (.ics)</Button>
                          <Button className="bg-sky-600 hover:bg-sky-700" onClick={() => openGoogleCalendar(zoomItem!)}>Ajouter à Google Calendar</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
          </div>
        )}
      </div>
    </section>
  )
}