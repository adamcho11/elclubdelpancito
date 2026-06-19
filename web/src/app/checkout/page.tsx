"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { plans } from "@/data/plans"
import { complements } from "@/data/complements"
import { useAuth } from "@/components/AuthProvider"
import { fetchApi } from "@/lib/api"

const STEPS = ["Plan", "Producto semanal", "Extras", "Revisar", "Pagar"]

function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const planFromUrl = searchParams.get("plan")
  const [step, setStep] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState(planFromUrl || "")
  const [weeklyProduct, setWeeklyProduct] = useState("")
  const [pastProducts, setPastProducts] = useState<Set<string>>(new Set())
  const [extras, setExtras] = useState<Set<string>>(new Set())
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

  useEffect(() => {
    if (!user) return
    fetchApi("/api/weekly-pick/history")
      .then((data) => setPastProducts(new Set(data.history.map((h: { complementId: string }) => h.complementId))))
      .catch(() => {})
  }, [user])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-oven-950">
        <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)
  const extrasTotal = Array.from(extras).reduce((sum, id) => sum + (complements.find((c) => c.id === id)?.price || 0), 0)
  const planPrice = selectedPlanData?.price || 0
  const total = planPrice + extrasTotal

  const weeklyProductData = complements.find((c) => c.id === weeklyProduct)
  const availableForWeekly = complements.filter((c) => !pastProducts.has(c.id))

  const toggleExtra = (id: string) => {
    if (id === weeklyProduct) return
    setExtras((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError("El comprobante no puede superar los 5 MB"); return }
    const reader = new FileReader()
    reader.onloadend = () => { setRecibo(reader.result as string); setError("") }
    reader.readAsDataURL(file)
  }

  const canNext = () => {
    if (step === 0) return !!selectedPlan
    if (step === 1) return !!weeklyProduct
    if (step === 4) return !!recibo
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!selectedPlan || !weeklyProduct || !recibo) return

    const extrasList = Array.from(extras).map((id) => {
      const c = complements.find((c) => c.id === id)
      return c ? `${c.name} (Bs. ${c.price})` : id
    }).join(", ")

    setLoading(true)
    try {
      await fetchApi("/api/weekly-pick", { method: "PUT", body: JSON.stringify({ complementId: weeklyProduct }) })
      await fetchApi("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          plan: `${selectedPlanData?.name} - Total: Bs. ${total} | Semanal: ${weeklyProductData?.name}${extrasList ? " | Extras: " + extrasList : ""}`,
          notas,
          recibo,
        }),
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-oven-950 px-4">
        <div className="text-center max-w-md mx-auto py-20">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-cream-light mb-4">Comprobante enviado</h2>
          <p className="text-cream-dark/70 mb-8">Recibimos tu comprobante. Lo revisaremos y te contactaremos pronto.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/panel" className="px-8 py-3 bg-gradient-ember text-white font-semibold rounded-xl text-sm hover:shadow-xl hover:shadow-ember/30 transition-all">Ver mi panel</Link>
            <Link href="/" className="px-8 py-3 border border-oven-500/30 text-cream-dark/90 font-semibold rounded-xl text-sm hover:border-cream-dark/40 hover:text-cream-light transition-all">Volver al inicio</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="py-16 sm:py-20 bg-gradient-oven border-b border-oven-700/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-ember text-sm font-semibold uppercase tracking-widest">Checkout</span>
          <h1 className="text-3xl sm:text-5xl font-bold text-cream-light mt-3 mb-6">Finalizar suscripción</h1>
          <div className="flex items-center justify-center gap-1 max-w-lg mx-auto">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-1 flex-1 last:flex-[0]">
                <button type="button" onClick={() => { if (i <= step || (i === step + 1 && canNext())) setStep(i) }} className={`flex flex-col items-center gap-1 min-w-0 ${i > step ? "pointer-events-none" : ""}`}>
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all ${i < step ? "bg-emerald-600 text-white" : i === step ? "bg-ember text-white scale-110" : "bg-oven-700 text-cream-muted/40"}`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className={`text-[9px] sm:text-[11px] whitespace-nowrap ${i === step ? "text-cream-light font-medium" : i < step ? "text-emerald-400/70" : "text-cream-muted/30"}`}>{label}</span>
                </button>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 rounded-full transition-all ${i < step ? "bg-emerald-600" : "bg-oven-700"}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-oven-950">
        <div className="max-w-lg mx-auto px-4">
          <form onSubmit={handleSubmit}>
            {/* Step 0: Plan */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-cream-light">Elegí tu plan</h2>
                {plans.map((plan) => (
                  <label key={plan.id} className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${selectedPlan === plan.id ? "border-ember bg-ember/5" : "border-oven-600/30 bg-gradient-card hover:border-oven-500/40"}`}>
                    <input type="radio" name="plan" value={plan.id} checked={selectedPlan === plan.id} onChange={() => setSelectedPlan(plan.id)} className="sr-only" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPlan === plan.id ? "border-ember" : "border-oven-500/40"}`}>
                      {selectedPlan === plan.id && <div className="w-2.5 h-2.5 rounded-full bg-ember" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-cream-light font-semibold text-sm">{plan.name}</div>
                      <div className="text-cream-dark/60 text-xs">{plan.subtitle}</div>
                      <div className="text-cream-dark/40 text-xs mt-0.5 line-clamp-2">{plan.frequency}</div>
                    </div>
                    <div className="text-ember font-bold text-sm shrink-0">Bs. {plan.price}/sem</div>
                  </label>
                ))}
              </div>
            )}

            {/* Step 1: Weekly product (included, must be unique) */}
            {step === 1 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-cream-light">Producto semanal incluido</h2>
                <p className="text-cream-dark/50 text-xs">Cada plan incluye 1 producto gratis por semana. Elegí uno distinto cada semana.</p>
                {pastProducts.size > 0 && <p className="text-cream-muted/40 text-xs">Ya usaste {pastProducts.size} producto{pastProducts.size > 1 ? "s" : ""}. Los disponibles están abajo.</p>}
                <div className="grid gap-2 max-h-80 overflow-y-auto">
                  {availableForWeekly.map((comp) => (
                    <button key={comp.id} type="button" onClick={() => setWeeklyProduct(comp.id)} className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border text-left transition-all ${weeklyProduct === comp.id ? "border-ember bg-ember/5" : "border-oven-600/20 bg-gradient-card hover:border-oven-500/40"}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${weeklyProduct === comp.id ? "border-ember" : "border-oven-500/40"}`}>
                        {weeklyProduct === comp.id && <div className="w-2.5 h-2.5 rounded-full bg-ember" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-cream-light text-xs sm:text-sm">{comp.name}</div>
                        <div className="text-cream-dark/50 text-[10px] sm:text-xs">{comp.brand}</div>
                      </div>
                      <span className="text-emerald-400 text-xs font-medium shrink-0">Incluido</span>
                    </button>
                  ))}
                  {pastProducts.size > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-oven-800 border border-oven-600/20">
                      <p className="text-cream-muted/40 text-[10px] mb-2">Ya usados (no disponibles):</p>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(pastProducts).map((id) => {
                          const c = complements.find((cp) => cp.id === id)
                          return c ? <span key={id} className="px-2 py-0.5 rounded-full bg-oven-700 text-cream-muted/30 text-[10px]">{c.name}</span> : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Extras */}
            {step === 2 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-cream-light">Agregar productos extra</h2>
                <p className="text-cream-dark/50 text-xs">Opcional. Cada producto suma al total.</p>
                {complements.map((comp) => {
                  const isSel = extras.has(comp.id)
                  const isWeekly = comp.id === weeklyProduct
                  return (
                    <button key={comp.id} type="button" onClick={() => toggleExtra(comp.id)} className={`w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border text-left transition-all ${isSel ? "border-ember bg-ember/5" : isWeekly ? "border-emerald-600/20 bg-emerald-600/5 opacity-60" : "border-oven-600/20 bg-gradient-card hover:border-oven-500/40"}`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${isSel ? "border-ember bg-ember" : "border-oven-500/40"}`}>
                        {isSel && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-cream-light text-xs sm:text-sm">{comp.name}</div>
                        <div className="text-cream-dark/50 text-[10px] sm:text-xs">{comp.brand}</div>
                      </div>
                      {isWeekly ? <span className="text-emerald-400/70 text-xs shrink-0">Semanal</span> : <span className="text-cream-dark/60 text-sm font-medium shrink-0">+Bs. {comp.price}</span>}
                    </button>
                  )
                })}
                {extras.size > 0 && (
                  <div className="p-3 rounded-xl bg-ember/5 border border-ember/15 text-center">
                    <span className="text-cream-dark/70 text-sm">{extras.size} producto{extras.size > 1 ? "s" : ""}: +Bs. {extrasTotal}</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-cream-light">Revisá tu pedido</h2>
                <div className="p-4 rounded-xl bg-gradient-card border border-oven-600/20 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-cream-light font-semibold text-sm">{selectedPlanData?.name}</p>
                      <p className="text-cream-dark/60 text-xs">{selectedPlanData?.subtitle}</p>
                    </div>
                    <span className="text-cream-dark/60 text-sm shrink-0">Bs. {planPrice}/sem</span>
                  </div>
                  {weeklyProductData && (
                    <div className="border-t border-oven-600/20 pt-3 flex justify-between">
                      <div>
                        <span className="text-emerald-400 text-xs font-medium">Producto semanal incluido</span>
                        <p className="text-cream-dark/70 text-sm">{weeklyProductData.name}</p>
                      </div>
                      <span className="text-emerald-400 text-sm">Gratis</span>
                    </div>
                  )}
                  {extras.size > 0 && (
                    <>
                      <div className="border-t border-oven-600/20 pt-3">
                        <p className="text-cream-dark/60 text-xs mb-2">Productos extra:</p>
                        {Array.from(extras).map((id) => {
                          const c = complements.find((c) => c.id === id)
                          return c ? <div key={id} className="flex justify-between text-sm"><span className="text-cream-dark/70">+ {c.name}</span><span className="text-cream-dark/60">Bs. {c.price}</span></div> : null
                        })}
                      </div>
                      <div className="border-t border-oven-600/20 pt-3 flex justify-between">
                        <span className="text-cream-dark/60 text-sm">Subtotal extras</span>
                        <span className="text-cream-dark/60 text-sm">Bs. {extrasTotal}</span>
                      </div>
                    </>
                  )}
                  <div className="border-t border-oven-600/20 pt-3 flex justify-between">
                    <span className="text-cream-light font-semibold">Total</span>
                    <span className="text-cream-light font-bold text-lg">Bs. {total}/sem</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="notas" className="block text-cream-dark/80 text-sm mb-1.5">Notas adicionales</label>
                  <textarea id="notas" value={notas} onChange={(e) => setNotas(e.target.value)} rows={3} className="w-full px-4 py-3 bg-oven-900 border border-oven-600/40 rounded-xl text-cream-light placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60 transition-colors text-sm resize-none" placeholder="Horario preferido, alergias, instrucciones..." />
                </div>
              </div>
            )}

            {/* Step 4: Pay */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-cream-light">Realizá el pago</h2>
                <div className="p-4 sm:p-6 rounded-xl bg-gradient-card border border-oven-600/20 text-center">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-cream-dark/60 text-sm">Total a pagar</span>
                    <span className="text-cream-light font-bold text-xl">Bs. {total}</span>
                  </div>
                  <p className="text-cream-dark/70 text-xs sm:text-sm mb-4">Escaneá el QR con tu app bancaria</p>
                  <div className="relative w-44 h-44 sm:w-48 sm:h-48 mx-auto mb-4 rounded-xl bg-white border border-oven-600/30 overflow-hidden">
                    <Image src="/images/qr-pago.PNG" alt="QR de pago" fill className="object-contain p-2" unoptimized />
                  </div>
                  <p className="text-cream-dark/50 text-xs">Guardá el comprobante y adjuntalo abajo.</p>
                </div>

                <div>
                  <label htmlFor="recibo" className={`flex flex-col items-center gap-3 p-4 sm:p-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${recibo ? "border-emerald-600/30 bg-emerald-600/5" : "border-oven-600/30 hover:border-oven-500/40 hover:bg-oven-800/20"}`}>
                    {recibo ? (
                      <>
                        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-emerald-400 text-sm font-medium">Comprobante cargado</span>
                        <span className="text-cream-dark/50 text-xs">Click para cambiar</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-cream-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                        <span className="text-cream-dark/60 text-sm">Click para subir comprobante</span>
                        <span className="text-cream-muted/40 text-xs">PNG, JPG o PDF (máx. 5 MB)</span>
                      </>
                    )}
                    <input id="recibo" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {error && <div className="mt-4 p-3 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 text-sm text-center">{error}</div>}

            <div className="mt-8 flex gap-3">
              {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 border border-oven-500/30 text-cream-dark/90 font-semibold rounded-xl text-sm hover:border-cream-dark/40 hover:text-cream-light transition-all">Atrás</button>}
              {step < 4 && (
                <button type="button" onClick={() => { if (canNext()) setStep(step + 1) }} disabled={!canNext()} className="ml-auto px-8 py-3 bg-gradient-ember text-white font-semibold rounded-xl text-sm hover:shadow-xl hover:shadow-ember/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                  {step === 0 && !selectedPlan ? "Elegí un plan" : step === 1 && !weeklyProduct ? "Elegí un producto" : `Siguiente: ${STEPS[step + 1]}`}
                </button>
              )}
              {step === 4 && (
                <button type="submit" disabled={loading || !recibo} className="ml-auto px-8 py-3 bg-gradient-ember text-white font-semibold rounded-xl text-sm hover:shadow-xl hover:shadow-ember/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Enviando..." : `Enviar (Bs. ${total})`}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-oven-950"><div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" /></div>}>
      <CheckoutForm />
    </Suspense>
  )
}
