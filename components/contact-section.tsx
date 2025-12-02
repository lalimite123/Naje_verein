"use client"

import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import SphereImageGrid, { ImageData } from "@/components/image-sphere"

type ContactValues = {
  name: string
  email: string
  message: string
}

export function ContactSection() {
  const form = useForm<ContactValues>({
    defaultValues: { name: "", email: "", message: "" },
    mode: "onBlur",
  })

  const [sphereSize, setSphereSize] = useState(420)
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      const target = w < 640 ? Math.max(260, Math.min(360, w - 48)) : w < 1024 ? 380 : 420
      setSphereSize(target)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const onSubmit = async (values: ContactValues) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "send_failed")
      }
      toast({ title: "Nachricht gesendet", description: "Wir melden uns bald bei Ihnen." })
      form.reset()
    } catch (err: any) {
      toast({ title: "Fehler", description: "Senden fehlgeschlagen. Bitte versuchen Sie es erneut." })
    }
  }

  const BASE_IMAGES: Omit<ImageData, "id">[] = [
    {
      src: "https://images.unsplash.com/photo-1758178309498-036c3d7d73b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      alt: "Image 1",
      title: "Mountain Landscape",
      description: "A beautiful landscape captured at golden hour with mountains in the background."
    },
    {
      src: "https://images.unsplash.com/photo-1757647016230-d6b42abc6cc9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2072",
      alt: "Image 2",
      title: "Portrait Photography",
      description: "Stunning portrait photography showcasing natural lighting and composition."
    },
    {
      src: "https://images.unsplash.com/photo-1757906447358-f2b2cb23d5d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      alt: "Image 3",
      title: "Urban Architecture",
      description: "Modern architectural design featuring clean lines and geometric patterns."
    },
    {
      src: "https://images.unsplash.com/photo-1742201877377-03d18a323c18?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1064",
      alt: "Image 4",
      title: "Nature Scene",
      description: "Peaceful nature scene with vibrant colors and natural beauty."
    },
    {
      src: "https://images.unsplash.com/photo-1757081791153-3f48cd8c67ac?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      alt: "Image 5",
      title: "Abstract Art",
      description: "Creative abstract composition with bold colors and unique patterns."
    },
    {
      src: "https://images.unsplash.com/photo-1757626961383-be254afee9a0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      alt: "Image 6",
      title: "Mountain Landscape",
      description: "A beautiful landscape captured at golden hour with mountains in the background."
    },
    {
      src: "https://images.unsplash.com/photo-1756748371390-099e4e6683ae?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      alt: "Image 7",
      title: "Portrait Photography",
      description: "Stunning portrait photography showcasing natural lighting and composition."
    },
    {
      src: "https://images.unsplash.com/photo-1755884405235-5c0213aa3374?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      alt: "Image 8",
      title: "Urban Architecture",
      description: "Modern architectural design featuring clean lines and geometric patterns."
    },
    {
      src: "https://images.unsplash.com/photo-1757495404191-e94ed7e70046?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      alt: "Image 9",
      title: "Nature Scene",
      description: "Peaceful nature scene with vibrant colors and natural beauty."
    },
    {
      src: "https://images.unsplash.com/photo-1756197256528-f9e6fcb82b04?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1064",
      alt: "Image 10",
      title: "Abstract Art",
      description: "Creative abstract composition with bold colors and unique patterns."
    },
    {
      src: "https://images.unsplash.com/photo-1534083220759-4c3c00112ea0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987",
      alt: "Image 11",
      title: "Abstract Art",
      description: "Creative abstract composition with bold colors and unique patterns."
    },
    {
      src: "https://images.unsplash.com/photo-1755278338891-e8d8481ff087?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1674",
      alt: "Image 12",
      title: "Abstract Art",
      description: "Creative abstract composition with bold colors and unique patterns."
    }
  ]

  const IMAGES: ImageData[] = []
  for (let i = 0; i < 60; i++) {
    const baseIndex = i % BASE_IMAGES.length
    const baseImage = BASE_IMAGES[baseIndex]
    IMAGES.push({ id: `img-${i + 1}`, ...baseImage, alt: `${baseImage.alt} (${Math.floor(i / BASE_IMAGES.length) + 1})` })
  }

  return (
    <section id="contact" className="py-16 lg:py-20 px-4 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="inline-flex items-center justify-center px-6 py-2 rounded-full border border-red-200/50 bg-red-50/50 mb-6">
          <span className="text-sm font-medium text-red-700">Kontakt</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-light mb-3 text-balance text-gray-900">Kontakt aufnehmen</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">Schreiben Sie uns. Wir freuen uns auf Ihre Nachricht.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Form {...form}>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 lg:p-6 shadow-lg flex items-center justify-center min-h-[360px] lg:min-h-[480px]">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-md grid grid-cols-1 gap-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Bitte geben Sie Ihren Namen ein" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ihr Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                rules={{
                  required: "Bitte geben Sie Ihre E-Mail ein",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Bitte geben Sie eine gültige E-Mail ein" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="name@domain.de" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                  control={form.control}
                  name="message"
                  rules={{ required: "Bitte geben Sie eine Nachricht ein", minLength: { value: 10, message: "Mindestens 10 Zeichen" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nachricht</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ihre Nachricht" rows={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" className="bg-red-600 text-white hover:bg-red-700" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Senden
                  </Button>
                </div>
              </form>
            </div>
          </Form>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 lg:p-6 shadow-lg flex items-center justify-center min-h-[360px] lg:min-h-[480px]">
            <SphereImageGrid
              images={IMAGES}
              containerSize={sphereSize}
              sphereRadius={Math.round(sphereSize * 0.38)}
              dragSensitivity={0.8}
              momentumDecay={0.96}
              maxRotationSpeed={6}
              baseImageScale={sphereSize < 380 ? 0.12 : 0.15}
              hoverScale={sphereSize < 380 ? 1.2 : 1.3}
              perspective={1000}
              autoRotate={true}
              autoRotateSpeed={0.2}
            />
          </div>
        </div>
      </div>
    </section>
  )
}