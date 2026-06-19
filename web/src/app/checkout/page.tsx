"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { plans } from "@/data/plans"
import { useAuth } from "@/components/AuthProvider"
import { fetchApi } from "@/lib/api"

function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const planFromUrl = searchParams.get("plan")
  const [selectedPlan, setSelectedPlan] = useState(planFromUrl || "")
  const [notas, setNotas] = useState("")
  const [recibo, setRecibo] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent("/checkout" + (planFromUrl ? `?plan=${planFromUrl}` : ""))}`)
    }
  }, [user, authLoading, router, planFromUrl])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-oven-950">
        <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("El comprobante no puede superar los 5 MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setRecibo(reader.result as string)
      setError("")
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedPlan) {
      setError("Seleccioná un plan de suscripción")
      return
    }

    setLoading(true)

    try {
      await fetchApi("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          plan: plans.find((p) => p.id === selectedPlan)?.name || selectedPlan,
          notas,
          recibo,
        }),
      })

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el formulario")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-oven-950">
        <div className="text-center max-w-md mx-auto px-4 py-20">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-cream-light mb-4">Comprobante enviado</h2>
          <p className="text-cream-dark/70 mb-8">
            Recibimos tu comprobante de pago. Lo revisaremos y te contactaremos pronto para confirmar tu suscripción.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/panel"
              className="px-8 py-3 bg-gradient-ember text-white font-semibold rounded-xl text-sm
                hover:shadow-xl hover:shadow-ember/30 transition-all duration-300"
            >
              Ver mi panel
            </Link>
            <Link
              href="/"
              className="px-8 py-3 border border-oven-500/30 text-cream-dark/90 font-semibold rounded-xl text-sm
                hover:border-cream-dark/40 hover:text-cream-light transition-all duration-300"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-oven border-b border-oven-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-ember text-sm font-semibold uppercase tracking-widest">
            Checkout
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-cream-light mt-3 mb-4">
            Finalizar suscripción
          </h1>
          <p className="text-cream-dark/70 max-w-xl mx-auto">
            Elegí tu plan, adjuntá el comprobante de pago y listo.
          </p>
        </div>
      </section>

      <section className="py-16 bg-oven-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <h2 className="text-lg font-semibold text-cream-light mb-4">1. Elegí tu plan</h2>
              <div className="grid gap-3">
                {plans.map((plan) => (
                  <label
                    key={plan.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200
                      ${selectedPlan === plan.id
                        ? "border-ember bg-ember/5"
                        : "border-oven-600/30 bg-gradient-card hover:border-oven-500/40"
                      }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={selectedPlan === plan.id}
                      onChange={() => setSelectedPlan(plan.id)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                      ${selectedPlan === plan.id ? "border-ember" : "border-oven-500/40"}`}
                    >
                      {selectedPlan === plan.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-ember" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-cream-light font-semibold text-sm">{plan.name}</div>
                      <div className="text-cream-dark/60 text-xs">{plan.subtitle}</div>
                    </div>
                    <div className="ml-auto text-ember font-bold text-sm">Bs. {plan.price}/sem</div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-cream-light mb-4">2. Realizá el pago</h2>
              <div className="p-6 rounded-xl bg-gradient-card border border-oven-600/20 text-center">
                <p className="text-cream-dark/70 text-sm mb-4">
                  Escaneá el código QR con tu app bancaria para realizar el pago.
                </p>
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-xl bg-white border border-oven-600/30 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/qr-pago.PNG"
                    alt="QR de pago"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
                <p className="text-cream-dark/50 text-xs">
                  Realizá el pago por el monto del plan seleccionado y guardá el comprobante.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-cream-light mb-4">3. Notas adicionales</h2>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-oven-900 border border-oven-600/40 rounded-xl text-cream-light
                  placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60 transition-colors
                  text-sm resize-none"
                placeholder="Horario preferido, alergias, instrucciones especiales..."
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-cream-light mb-4">4. Adjuntá tu comprobante</h2>
              <div className="p-6 rounded-xl bg-gradient-card border border-oven-600/20">
                <label
                  htmlFor="recibo"
                  className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed
                    cursor-pointer transition-colors
                    ${recibo
                      ? "border-emerald-600/30 bg-emerald-600/5"
                      : "border-oven-600/30 hover:border-oven-500/40 hover:bg-oven-800/20"
                    }`}
                >
                  {recibo ? (
                    <>
                      <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-emerald-400 text-sm font-medium">Comprobante cargado</span>
                      <span className="text-cream-dark/50 text-xs">Click para cambiar</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-cream-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <span className="text-cream-dark/60 text-sm">Click para subir el comprobante</span>
                      <span className="text-cream-muted/40 text-xs">PNG, JPG o PDF (máx. 5 MB)</span>
                    </>
                  )}
                  <input
                    id="recibo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedPlan}
              className="w-full py-4 bg-gradient-ember text-white font-semibold rounded-xl text-base
                hover:shadow-xl hover:shadow-ember/30 transition-all duration-300 active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : !selectedPlan ? "Seleccioná un plan" : "Enviar comprobante"}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-oven-950">
        <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  )
}
