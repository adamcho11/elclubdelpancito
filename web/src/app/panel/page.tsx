"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"
import { fetchApi } from "@/lib/api"

interface SubmissionItem {
  id: number
  plan: string
  status: string
  notas: string
  createdAt: string
}

export default function PanelPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login")
      return
    }
    if (!user) return

    fetchApi("/api/checkout/mine")
      .then((data) => setSubmissions(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-oven-950">
        <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" />
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
          <span className="text-ember text-sm font-semibold uppercase tracking-widest">
            Mi panel
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-cream-light mt-3 mb-4">
            Hola, {user.nombre}
          </h1>
          <p className="text-cream-dark/70 max-w-xl mx-auto">
            Acá podés ver el estado de tus comprobantes de pago.
          </p>
        </div>
      </section>

      <section className="py-16 bg-oven-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-cream-light font-semibold text-lg">Mis comprobantes</h2>
            <Link
              href="/checkout"
              className="px-5 py-2.5 bg-gradient-ember text-white font-semibold rounded-xl text-sm
                hover:shadow-xl hover:shadow-ember/30 transition-all duration-300 active:scale-95"
            >
              Nueva suscripción
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-cream-dark/50">Cargando...</div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-gradient-card border border-oven-600/20">
              <p className="text-cream-dark/60 mb-4">Todavía no enviaste ningún comprobante.</p>
              <Link
                href="/checkout"
                className="text-ember hover:text-ember-light text-sm font-medium transition-colors"
              >
                Hacer mi primera suscripción →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-gradient-card border border-oven-600/20 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-cream-light text-sm font-medium truncate">{sub.plan}</p>
                    <p className="text-cream-dark/50 text-xs mt-0.5">
                      {new Date(sub.createdAt).toLocaleDateString("es-BO", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {sub.notas && (
                      <p className="text-cream-dark/40 text-xs mt-1 truncate">{sub.notas}</p>
                    )}
                  </div>
                  {statusBadge(sub.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
