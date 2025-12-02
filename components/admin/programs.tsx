"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { ImagePlus } from "lucide-react"

type ProgramFormValues = {
  title: string
  summary: string
  date: string
  time?: string
  location?: string
  organizer?: string
  type: "program" | "event"
  image?: string
}

export function ProgramsModule({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<ProgramFormValues>({ title: "", summary: "", date: "", type: "program" })
  const [errors, setErrors] = useState<{ date?: string; time?: string }>({})
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>("")
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const headers = useMemo(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" }
    if (token) h.Authorization = `Bearer ${token}`
    return h
  }, [token])

  const refresh = async () => {
    setLoading(true)
    const res = await fetch("/api/programs?page=1&limit=100", { headers })
    const data = await res.json()
    setItems(data.items || [])
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  const validateDate = (dateStr: string) => {
    const r = /^\d{4}-\d{2}-\d{2}$/
    if (!r.test(dateStr)) return false
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return false
    const [y, m, day] = dateStr.split("-").map((v) => Number(v))
    return d.getUTCFullYear() === y && d.getUTCMonth() + 1 === m && d.getUTCDate() === day
  }

  const validateTime = (timeStr: string) => {
    const r = /^\d{2}:\d{2}$/
    if (!r.test(timeStr)) return false
    const [h, min] = timeStr.split(":").map((v) => Number(v))
    if (h < 0 || h > 23) return false
    if (min < 0 || min > 59) return false
    return true
  }

  const validateForm = () => {
    const errs: { date?: string; time?: string } = {}
    if (!form.date || !validateDate(form.date)) errs.date = "Date invalide (YYYY-MM-DD)"
    if (form.time && !validateTime(form.time)) errs.time = "Heure invalide (HH:MM)"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = async () => {
    if (!form.title || !form.type) return
    if (!validateForm()) return
    const res = await fetch("/api/programs", { method: "POST", headers, body: JSON.stringify(form) })
    if (res.ok) {
      setForm({ title: "", summary: "", date: "", type: "program" })
      setErrors({})
      await refresh()
      toast.success("Programme créé")
    } else {
      toast.error("Erreur lors de la création")
    }
  }

  const update = async () => {
    if (!editing?._id) return
    if (!validateForm()) return
    const res = await fetch(`/api/programs/${editing._id}`, { method: "PUT", headers, body: JSON.stringify(form) })
    if (res.ok) {
      setEditing(null)
      setForm({ title: "", summary: "", date: "", type: "program" })
      setErrors({})
      await refresh()
      toast.success("Programme mis à jour")
    } else {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const remove = async (id: string) => {
    const res = await fetch(`/api/programs/${id}`, { method: "DELETE", headers })
    if (res.ok) {
      await refresh()
      toast.success("Programme supprimé")
    } else {
      toast.error("Erreur lors de la suppression")
    }
  }

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || "",
        summary: editing.summary || "",
        date: editing.date || "",
        time: editing.time || "",
        location: editing.location || "",
        organizer: editing.organizer || "",
        type: editing.type || "program",
        image: editing.image || "",
      })
      setErrors({})
    }
  }, [editing])

  const uploadImage = async () => {
    if (!selectedFile || !token) return
    if (typeof window !== "undefined") {
      const ok = window.confirm("Confirmer l’upload de l’image ?")
      if (!ok) return
    }
    setUploading(true)
    setUploadError("")
    const fd = new FormData()
    fd.append("file", selectedFile)
    fd.append("name", selectedFile.name)
    if (form.image) fd.append("previous", form.image)
    const res = await fetch("/api/media/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd })
    const data = await res.json()
    if (res.ok && data?.original?.url) {
      setForm((f) => ({ ...f, image: String(data.original.url) }))
      setPreviewUrl(String(data?.thumbnail?.url || data?.original?.url))
      toast.success("Image uploadée")
    } else {
      setUploadError(String(data?.error || "Erreur d’upload"))
      toast.error(String(data?.error || "Erreur d’upload"))
    }
    setUploading(false)
  }

  const deleteImageServer = async () => {
    if (!token || !form.image) return
    if (typeof window !== "undefined") {
      const ok = window.confirm("Confirmer la suppression de l’image ?")
      if (!ok) return
    }
    const res = await fetch("/api/media/delete", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ url: form.image }) })
    const data = await res.json()
    if (res.ok && data?.ok) {
      setForm((f) => ({ ...f, image: "" }))
      setPreviewUrl("")
      toast.success("Image supprimée")
    } else {
      toast.error(String(data?.error || "Erreur suppression image"))
    }
  }

  useEffect(() => {
    setPreviewUrl(form.image || "")
  }, [form.image])

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="rounded-xl overflow-hidden bg-white border border-red-200 shadow">
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-800 p-4 text-white">
          <div className="text-lg font-semibold">Programmes</div>
          <div className="text-red-100 text-sm">Créer et gérer les programmes et événements</div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Titre" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as any }))}>
              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="program">Programme</SelectItem>
                <SelectItem value="event">Événement</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between">
                  {form.date ? new Date(form.date).toLocaleDateString() : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={form.date ? new Date(form.date) : undefined}
                  onSelect={(d) => d && setForm((f) => ({ ...f, date: d.toISOString().slice(0, 10) }))}
                />
              </PopoverContent>
            </Popover>
            {errors.date && <div className="text-red-600 text-xs">{errors.date}</div>}
            <div className="flex items-center gap-2">
              <Select value={(form.time || "").split(":")[0] || ""} onValueChange={(h) => {
                const min = (form.time || "").split(":")[1] || "00"
                setForm((f) => ({ ...f, time: `${h}:${min}` }))
              }}>
                <SelectTrigger><SelectValue placeholder="Heure" /></SelectTrigger>
                <SelectContent>
                  {[...Array(24).keys()].map((h) => {
                    const hh = String(h).padStart(2, "0")
                    return <SelectItem key={hh} value={hh}>{hh}</SelectItem>
                  })}
                </SelectContent>
              </Select>
              <Select value={(form.time || "").split(":")[1] || ""} onValueChange={(m) => {
                const h = (form.time || "").split(":")[0] || "00"
                setForm((f) => ({ ...f, time: `${h}:${m}` }))
              }}>
                <SelectTrigger><SelectValue placeholder="Minutes" /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0")).map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.time && <div className="text-red-600 text-xs">{errors.time}</div>}
            <Input placeholder="Lieu" value={form.location || ""} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            <Input placeholder="Organisateur" value={form.organizer || ""} onChange={(e) => setForm((f) => ({ ...f, organizer: e.target.value }))} />
            <div className="md:col-span-2 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                <Button className="bg-red-600 hover:bg-red-700 transition-transform duration-200 hover:scale-105 active:scale-95" onClick={uploadImage} disabled={!token || uploading || !selectedFile}>{uploading ? "Upload…" : "Uploader"}</Button>
                {form.image && (
                  <Button variant="secondary" className="transition-transform duration-200 hover:scale-105 active:scale-95" onClick={deleteImageServer} disabled={!token}>Supprimer</Button>
                )}
              </div>
              {previewUrl && (
                <img src={previewUrl} alt="Aperçu" className="w-24 h-24 object-cover rounded border" />
              )}
            </div>
            {!previewUrl && (
              <div className="md:col-span-2 mt-2 flex items-center gap-3 text-xs text-gray-600">
                <div className="w-20 h-20 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-500">
                  <ImagePlus className="w-5 h-5" />
                </div>
                Aucune image liée
              </div>
            )}
            {uploadError && <div className="md:col-span-2 text-red-600 text-xs">{uploadError}</div>}
            <Input className="md:col-span-2" placeholder="Résumé" value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} />
          </div>
          <div className="mt-3 flex gap-2">
            {!editing ? (
            <Button className="bg-red-600 hover:bg-red-700" onClick={submit} disabled={!token}>Créer</Button>
            ) : (
            <>
              <Button className="bg-red-600 hover:bg-red-700" onClick={update} disabled={!token}>Mettre à jour</Button>
              <Button variant="secondary" onClick={() => { setEditing(null); setForm({ title: "", summary: "", date: "", type: "program" }) }}>Annuler</Button>
            </>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-white border border-red-200 shadow">
        <div className="flex items-center justify-between bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="text-sm font-semibold text-red-800">Liste</div>
          <Button className="bg-red-600 hover:bg-red-700" onClick={refresh}>Rafraîchir</Button>
        </div>
        <div className="p-4">
        {loading ? (
          <div className="text-gray-600">Chargement…</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Organisateur</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it) => (
                <TableRow key={it._id}>
                  <TableCell>{it.title}</TableCell>
                  <TableCell>{it.type}</TableCell>
                  <TableCell>{it.date}</TableCell>
                  <TableCell>{it.location || ""}</TableCell>
                  <TableCell>{it.organizer || ""}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setEditing(it)}>Éditer</Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => remove(it._id)} disabled={!token}>Supprimer</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        </div>
      </div>
    </div>
  )
}