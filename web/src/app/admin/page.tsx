"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "@/components/AuthProvider"
import { fetchApi } from "@/lib/api"

interface SubmissionItem {
  id: number
  plan: string
  status: string
  notas: string
  recibo: string
  createdAt: string
  user: {
    id: number
    email: string
    nombre: string
    telefono: string
    direccion?: string
  }
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [qrPreview, setQrPreview] = useState("")
  const [loadingSubs, setLoadingSubs] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== "admin") return

    async function load() {
      setLoadingSubs(true)
      try {
        const data = await fetchApi("/api/admin/submissions")
        setSubmissions(data)
      } catch {
        setError("Error al cargar submissions")
      } finally {
        setLoadingSubs(false)
      }
    }

    async function loadQrData() {
      try {
        const qr = await fetchApi("/api/qr")
        setQrPreview(qr.qr || "")
      } catch {}
    }

    load()
    loadQrData()
  }, [user, authLoading])

  const handleStatus = async (id: number, status: "aprobado" | "rechazado") => {
    try {
      await fetchApi(`/api/admin/submissions/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      })
      setMessage(`Comprobante ${status}`)
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen no puede superar los 2 MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setQrPreview(reader.result as string)
      setError("")
    }
    reader.readAsDataURL(file)
  }

  const handleSaveQr = async () => {
    if (!qrPreview) {
      setError("Primero subí una imagen del QR")
      return
    }

    setSaving(true)
    setError("")
    setMessage("")

    try {
      await fetchApi("/api/admin/qr", {
        method: "PUT",
        body: JSON.stringify({ imagen: qrPreview }),
      })
      setMessage("QR guardado correctamente")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) return null
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-oven-950">
        <div className="text-center max-w-sm mx-auto px-4">
          <p className="text-cream-dark/60 text-lg mb-4">Acceso denegado</p>
          <p className="text-cream-muted text-sm">Solo administradores pueden acceder a esta página.</p>
        </div>
      </div>
    )
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "aprobado":
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30">Aprobado</span>
      case "rechazado":
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-600/20 text-red-400 border border-red-600/30">Rechazado</span>
      default:
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-600/20 text-amber-400 border border-amber-600/30">Pendiente</span>
    }
  }

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-oven border-b border-oven-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-ember text-sm font-semibold uppercase tracking-widest">Admin</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-cream-light mt-3 mb-4">
            Panel de administración
          </h1>
          <p className="text-cream-dark/70 max-w-xl mx-auto">
            Gestioná comprobantes y el QR de pago.
          </p>
        </div>
      </section>

      <section className="py-16 bg-oven-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-cream-light font-semibold text-lg mb-6">Comprobantes recibidos</h2>

            {loadingSubs ? (
              <div className="text-center py-12 text-cream-dark/50">Cargando...</div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12 rounded-xl bg-gradient-card border border-oven-600/20">
                <p className="text-cream-dark/60">No hay comprobantes todavía.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl bg-gradient-card border border-oven-600/20"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <p className="text-cream-light text-sm font-medium">{sub.plan}</p>
                        <p className="text-cream-dark/60 text-xs mt-0.5">
                          {sub.user.nombre} · {sub.user.telefono} · {sub.user.email}
                        </p>
                        {sub.user.direccion && (
                          <p className="text-cream-dark/40 text-xs mt-0.5">{sub.user.direccion}</p>
                        )}
                        <p className="text-cream-muted/50 text-xs mt-1">
                          {new Date(sub.createdAt).toLocaleDateString("es-BO", {
                            day: "numeric", month: "long", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                        {sub.notas && (
                          <p className="text-cream-dark/40 text-xs mt-1 italic">{sub.notas}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {statusBadge(sub.status)}
                        {sub.recibo && (
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="text-xs text-ember hover:text-ember-light transition-colors"
                          >
                            Ver comprobante
                          </button>
                        )}
                      </div>
                    </div>

                    {sub.status === "pendiente" && (
                      <div className="flex gap-2 pt-2 border-t border-oven-600/20">
                        <button
                          onClick={() => handleStatus(sub.id, "aprobado")}
                          className="px-4 py-1.5 bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 text-xs font-medium rounded-lg
                            hover:bg-emerald-600/30 transition-colors"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleStatus(sub.id, "rechazado")}
                          className="px-4 py-1.5 bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-medium rounded-lg
                            hover:bg-red-600/30 transition-colors"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-oven-700/20 pt-12">
            <h2 className="text-cream-light font-semibold text-lg mb-6">QR de pago</h2>
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="p-6 rounded-xl bg-gradient-card border border-oven-600/20 text-center">
                <p className="text-cream-dark/60 text-sm mb-4">QR actual</p>
                <div className="relative w-48 h-48 mx-auto rounded-xl bg-white border border-oven-600/30 flex items-center justify-center overflow-hidden">
                  {qrPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrPreview} alt="QR de pago" className="w-full h-full object-contain" />
                  ) : (
                    <Image
                      src="/images/qr-pago.PNG"
                      alt="QR de pago"
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  )}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-card border border-oven-600/20 flex-1">
                <p className="text-cream-dark/60 text-sm mb-4">Subir nuevo QR</p>
                <label className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-oven-600/30 cursor-pointer hover:border-oven-500/40 hover:bg-oven-800/20 transition-colors">
                  <svg className="w-8 h-8 text-cream-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-cream-dark/60 text-sm">Click para subir imagen del QR</span>
                  <span className="text-cream-muted/40 text-xs">PNG, JPG o WEBP (máx. 2 MB)</span>
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
                </label>
                <button
                  onClick={handleSaveQr}
                  disabled={saving}
                  className="w-full mt-4 py-2.5 bg-gradient-ember text-white font-semibold rounded-xl text-sm
                    hover:shadow-xl hover:shadow-ember/30 transition-all duration-300 active:scale-[0.98]
                    disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Guardando..." : "Guardar QR"}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 text-sm text-center">{error}</div>
          )}
          {message && (
            <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-700/30 text-emerald-400 text-sm text-center">{message}</div>
          )}
        </div>
      </section>

      {selectedSubmission && selectedSubmission.recibo && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setSelectedSubmission(null)}>
          <div className="relative max-w-lg w-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm"
            >
              Cerrar
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedSubmission.recibo} alt="Comprobante" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  )
}
