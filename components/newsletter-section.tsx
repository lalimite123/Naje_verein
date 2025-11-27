"use client"

import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

type NewsletterValues = {
  name?: string
  email: string
}

export function NewsletterSection() {
  const form = useForm<NewsletterValues>({
    defaultValues: { name: "", email: "" },
    mode: "onBlur",
  })

  const onSubmit = (values: NewsletterValues) => {
    toast({ title: "Erfolgreich abonniert", description: "Vielen Dank! Wir halten Sie auf dem Laufenden." })
    form.reset()
  }

  return (
    <section id="newsletter" className="py-16 lg:py-20 px-4 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <div className="inline-flex items-center justify-center px-6 py-2 rounded-full border border-red-200/50 bg-red-50/50 mb-6">
          <span className="text-sm font-medium text-red-700">Newsletter</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-light mb-3 text-balance text-gray-900">Newsletter abonnieren</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">Bleiben Sie informiert über Projekte, Veranstaltungen und Neuigkeiten.</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl border border-gray-200 bg-white p-4 lg:p-6 shadow-lg"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Name (optional)</FormLabel>
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
                <FormItem className="md:col-span-1">
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="name@domain.de" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-1 flex items-end">
              <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700">Abonnieren</Button>
            </div>
          </form>
        </Form>
        <p className="text-xs text-gray-500 mt-3">Mit Ihrer Anmeldung stimmen Sie dem Erhalt unseres Newsletters zu. Sie können sich jederzeit abmelden.</p>
      </div>
    </section>
  )
}