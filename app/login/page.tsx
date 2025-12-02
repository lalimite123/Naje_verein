"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const submit = async () => {
    setLoading(true)
    setError(null)
    try {
      const u = username.trim()
      if (!u || !password) {
        setError("Veuillez entrer votre email et mot de passe")
        return
      }
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || "Échec de connexion")
      } else {
        if (data?.token) {
          sessionStorage.setItem("admin_token", data.token)
          router.push("/admin")
        } else {
          setError("Token manquant")
        }
      }
    } catch (e: any) {
      setError(e?.message || "Erreur serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
        <div className="text-lg font-semibold mb-4">Connexion Admin</div>
        <div className="space-y-3">
          <Input placeholder="Email ou nom d’utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <Button onClick={submit} disabled={loading || !username || !password}>{loading ? "Connexion…" : "Se connecter"}</Button>
        </div>
      </div>
    </div>
  )
}