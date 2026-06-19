"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import { fetchApi } from "@/lib/api"
import { complements } from "@/data/complements"

interface SubmissionItem {
  id: number
  plan: string
  status: string
  notas: string
  createdAt: string
}

interface WeeklyPickItem {
  complementId: string
  complementName: string
  complementPrice: number
  weekStart: string
}

export default function PanelPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [weekPick, setWeekPick] = useState<string>("")
  const [history, setHistory] = useState<WeeklyPickItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const pastIds = new Set(history.filter((h) => h.complementId !== weekPick).map((h) => h.complementId))

  useEffect(() => {
    if (authLoading || !user) return
    if (!authLoading && !user) { router.replace("/login"); return }

    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [subs, pick, hist] = await Promise.all([
          fetchApi("/api/checkout/mine"),
          fetchApi("/api/weekly-pick"),
          fetchApi("/api/weekly-pick/history"),
        ])
        if (!cancelled) {
          setSubmissions(subs)
          setWeekPick(pick.pick?.complementId || "")
          setHistory(hist.history || [])
        }
      } catch {
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user, authLoading, router])

  const saveWeeklyPick = async () => {
    if (!weekPick) return
    setSaving(true)
    setMsg("")
    try {
      await fetchApi("/api/weekly-pick", { method: "PUT", body: JSON.stringify({ complementId: weekPick }) })
      setMsg("Producto semanal guardado")
      const [pick, hist] = await Promise.all([
        fetchApi("/api/weekly-pick"),
        fetchApi("/api/weekly-pick/history"),
      ])
      setWeekPick(pick.pick?.complementId || "")
      setHistory(hist.history || [])
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error")
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-oven-950">
        <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "aprobado": return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30">Aprobado</span>
      case "rechazado": return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-600/20 text-red-400 border border-red-600/30">Rechazado</span>
      default: return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-600/20 text-amber-400 border border-amber-600/30">Pendiente</span>
    }
  }

  return (
    <div className="min-h-screen">
      <section className="py-16 sm:py-20 bg-gradient-oven border-b border-oven-700/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-ember text-sm font-semibold uppercase tracking-widest">Mi panel</span>
          <h1 className="text-3xl sm:text-5xl font-bold text-cream-light mt-3 mb-4">Hola, {user.nombre}</h1>
          <p className="text-cream-dark/70 max-w-xl mx-auto text-sm">Gestioná tu suscripción y producto semanal.</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-oven-950">
        <div className="max-w-2xl mx-auto px-4 space-y-12">
          {/* Weekly product selector */}
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-card border border-ember/20">
            <h2 className="text-cream-light font-semibold text-lg mb-1">Producto semanal</h2>
            <p className="text-cream-dark/50 text-xs mb-4">Elegí el producto gratis que viene con tu plan esta semana. Debe ser distinto cada semana.</p>

            {loading ? (
              <div className="text-center py-4 text-cream-dark/50 text-sm">Cargando...</div>
            ) : (
              <>
                <div className="grid gap-2 max-h-60 overflow-y-auto mb-4">
                  {complements.map((comp) => {
                    const blocked = pastIds.has(comp.id)
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => { if (!blocked) setWeekPick(comp.id) }}
                        disabled={blocked}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${blocked ? "border-oven-600/10 bg-oven-800/20 opacity-40 cursor-not-allowed" : weekPick === comp.id ? "border-ember bg-ember/5" : "border-oven-600/20 hover:border-oven-500/40 cursor-pointer"}`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${weekPick === comp.id ? "border-ember" : "border-oven-500/40"}`}>
                          {weekPick === comp.id && <div className="w-2.5 h-2.5 rounded-full bg-ember" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-cream-light text-xs sm:text-sm">{comp.name}</div>
                          <div className="text-cream-dark/50 text-[10px] sm:text-xs">{comp.brand}</div>
                        </div>
                        {blocked ? (
                          <span className="text-cream-muted/30 text-[10px] shrink-0">Ya usado</span>
                        ) : (
                          <span className="text-emerald-400/70 text-xs shrink-0">Gratis</span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {msg && <div className={`p-3 rounded-xl text-sm text-center mb-3 ${msg.includes("Error") || msg.includes("distinto") ? "bg-red-900/20 border border-red-700/30 text-red-400" : "bg-emerald-900/20 border border-emerald-700/30 text-emerald-400"}`}>{msg}</div>}

                <button onClick={saveWeeklyPick} disabled={saving || !weekPick} className="w-full py-3 bg-gradient-ember text-white font-semibold rounded-xl text-sm hover:shadow-xl hover:shadow-ember/30 transition-all active:scale-[0.98] disabled:opacity-50">
                  {saving ? "Guardando..." : "Guardar producto semanal"}
                </button>
              </>
            )}
          </div>

          {/* Weekly history */}
          {!loading && history.length > 0 && (
            <div>
              <h2 className="text-cream-light font-semibold text-lg mb-4">Historial de productos semanales</h2>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gradient-card border border-oven-600/20">
                    <div>
                      <p className="text-cream-light text-sm">{h.complementName}</p>
                      <p className="text-cream-dark/50 text-xs">Semana del {new Date(h.weekStart + "T00:00:00").toLocaleDateString("es-BO", { day: "numeric", month: "short" })}</p>
                    </div>
                    <span className="text-emerald-400 text-xs">Incluido</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submissions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-cream-light font-semibold text-lg">Mis comprobantes</h2>
              <Link href="/checkout" className="px-5 py-2.5 bg-gradient-ember text-white font-semibold rounded-xl text-sm hover:shadow-xl hover:shadow-ember/30 transition-all">Nueva suscripción</Link>
            </div>

            {loading ? (
              <div className="text-center py-8 text-cream-dark/50">Cargando...</div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8 rounded-xl bg-gradient-card border border-oven-600/20">
                <p className="text-cream-dark/60 mb-3">Todavía no enviaste ningún comprobante.</p>
                <Link href="/checkout" className="text-ember hover:text-ember-light text-sm font-medium">Hacer mi primera suscripción →</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-3 sm:p-4 rounded-xl bg-gradient-card border border-oven-600/20 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-cream-light text-sm font-medium truncate">{sub.plan}</p>
                      <p className="text-cream-dark/50 text-xs mt-0.5">{new Date(sub.createdAt).toLocaleDateString("es-BO", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    {statusBadge(sub.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
