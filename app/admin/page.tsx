"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgramsModule } from "@/components/admin/programs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Cog, LogOut, CalendarDays, Mail } from "lucide-react"

type Section = "programs" | "newsletter"

export default function AdminPage() {
  const [section, setSection] = useState<Section>("programs")
  const [token, setToken] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const t = sessionStorage.getItem("admin_token") || ""
    if (t) setToken(t)
  }, [])

  const logout = () => {
    try {
      sessionStorage.removeItem("admin_token")
    } catch {}
    setToken("")
    router.push("/login")
  }

  return (
    <SidebarProvider className="min-h-screen bg-white">
        <Sidebar className="border-r border-red-200 bg-red-50/30">
          <SidebarHeader className="p-4 border-b border-red-200">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              <div className="text-sm font-semibold text-red-800">Administration</div>
            </div>
          </SidebarHeader>
          <SidebarMenu className="px-2 py-3">
            <SidebarMenuItem>
              <SidebarMenuButton isActive={section === "programs"} onClick={() => setSection("programs")} className="data-[active=true]:bg-red-600 data-[active=true]:text-white hover:bg-red-100"><CalendarDays className="h-4 w-4" /><span>Programmes</span></SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={section === "newsletter"} onClick={() => setSection("newsletter")} className="data-[active=true]:bg-red-600 data-[active=true]:text-white hover:bg-red-100"><Mail className="h-4 w-4" /><span>Newsletter</span></SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarFooter className="p-4 border-t border-red-200">
            <div className="flex items-center justify-between">
              <div className="text-xs px-2 py-1 rounded-full border border-red-200 bg-red-50 text-red-700">{token ? "Connecté" : "Non connecté"}</div>
              <Button variant="secondary" onClick={logout} className="inline-flex items-center gap-2"><LogOut className="h-4 w-4" />Déconnexion</Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="p-0">
          <div className="relative overflow-hidden rounded-none bg-gradient-to-r from-red-600 via-red-700 to-rose-800 p-6 text-white shadow">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-white" />
                <h1 className="text-2xl lg:text-3xl font-semibold">Espace Administration</h1>
                <p className="text-red-100">Gestion des contenus et abonnés</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <Cog className="h-6 w-6 text-red-100" />
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {section === "programs" && <ProgramsModule token={token} />}
            {section === "newsletter" && (
              <div className="rounded-xl overflow-hidden border border-red-200 bg-white shadow">
                <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-800 p-4 text-white">
                  <div className="text-lg font-semibold">Newsletter</div>
                  <div className="text-red-100 text-sm">Liste des abonnés</div>
                </div>
                <div className="p-4">
                  <NewsletterModule token={token} />
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
    </SidebarProvider>
  )
}

function NewsletterModule({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      const res = await fetch("/api/newsletter?page=1&limit=50", { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      const data = await res.json()
      setItems(data.items || [])
      setLoading(false)
    }
    run()
  }, [token])

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
      <div className="text-lg font-semibold mb-3">Newsletter</div>
      {loading ? (
        <div className="text-gray-600">Chargement…</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Heure</TableHead>
              <TableHead>Jour</TableHead>
              <TableHead>Confirmé</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((it) => (
              <TableRow key={it.email}>
                <TableCell>{it.email}</TableCell>
                <TableCell>{it.name || ""}</TableCell>
                <TableCell>{it.date}</TableCell>
                <TableCell>{it.hour}</TableCell>
                <TableCell>{it.weekday}</TableCell>
                <TableCell>{String(it.confirmed)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}