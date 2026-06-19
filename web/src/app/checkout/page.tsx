"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { plans } from "@/data/plans"
import { complements } from "@/data/complements"
import { useAuth } from "@/components/AuthProvider"
import { fetchApi } from "@/lib/api"

const STEPS = [
  { label: "Plan", icon: "📋" },
  { label: "Extras", icon: "➕" },
  { label: "Revisar", icon: "✅" },
  { label: "Pagar", icon: "💳" },
]

function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const planFromUrl = searchParams.get("plan")
  const preselectedPlan = plans.find((p) => p.id === planFromUrl)
  const [step, setStep] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState(planFromUrl || "")
  const [extras, setExtras] = useState<Set<string>>(new Set())
  const [notas, setNotas] = useState("")
  const [recibo, setRecibo] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [animDir, setAnimDir] = useState<"forward" | "backward">("forward")

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

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)
  const extrasTotal = Array.from(extras).reduce((sum, id) => sum + (complements.find((c) => c.id === id)?.price || 0), 0)
  const planPrice = selectedPlanData?.price || 0
  const total = planPrice + extrasTotal

  const toggleExtra = (id: string) => {
    setExtras((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const goNext = () => {
    if (!canNext()) return
    setAnimDir("forward")
    setStep((s) => Math.min(s + 1, 3))
  }

  const goBack = () => {
    setAnimDir("backward")
    setStep((s) => Math.max(s - 1, 0))
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
    if (step === 3) return !!recibo
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!selectedPlan || !recibo) return

    const extrasList = Array.from(extras).map((id) => {
      const c = complements.find((c) => c.id === id)
      return c ? `${c.name} (Bs. ${c.price})` : id
    }).join(", ")

    setLoading(true)
    try {
      await fetchApi("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          plan: `${selectedPlanData?.name} - Total: Bs. ${total}${extrasList ? " + Extras: " + extrasList : ""}`,
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
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-600/20 border-2 border-emerald-600/30 flex items-center justify-center animate-[bounce_0.6s_ease-out]">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-cream-light mb-4">Comprobante enviado</h2>
          <p className="text-cream-dark/70 mb-8 max-w-sm mx-auto">Recibimos tu comprobante. Lo revisaremos y te contactaremos pronto por WhatsApp.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/panel" className="w-full sm:w-auto px-8 py-3.5 bg-gradient-ember text-white font-semibold rounded-xl text-sm hover:shadow-xl hover:shadow-ember/30 transition-all active:scale-[0.98]">Ver mi panel</Link>
            <Link href="/" className="w-full sm:w-auto px-8 py-3.5 border border-oven-500/30 text-cream-dark/90 font-semibold rounded-xl text-sm hover:border-cream-dark/40 hover:text-cream-light transition-all">Volver al inicio</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-oven-950">
      {/* Header with progress */}
      <section className="py-8 sm:py-12 bg-gradient-oven border-b border-oven-700/20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="text-ember text-xs sm:text-sm font-semibold uppercase tracking-widest">Checkout</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream-light mt-2 mb-8">Finalizar suscripción</h1>

          {/* Progress bar - horizontal steps */}
          <div className="flex items-center justify-center gap-0 max-w-lg mx-auto">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center flex-1 last:flex-[0_0_auto]">
                <button
                  type="button"
                  onClick={() => { if (i < step) { setAnimDir("backward"); setStep(i) } }}
                  className={`flex flex-col items-center gap-1.5 group ${i > step ? "pointer-events-none" : ""}`}
                >
                  {/* Step circle */}
                  <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    i < step
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                      : i === step
                      ? "bg-ember text-white scale-110 shadow-lg shadow-ember/30 ring-2 ring-ember/30"
                      : "bg-oven-700/60 text-cream-muted/40"
                  }`}>
                    {i < step ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <span>{i + 1}</span>
                    )}
                    {/* Pulse ring for current step */}
                    {i === step && (
                      <span className="absolute inset-0 rounded-full bg-ember/30 animate-ping" />
                    )}
                  </div>
                  {/* Step label */}
                  <span className={`text-[10px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                    i === step ? "text-cream-light" : i < step ? "text-emerald-400/60" : "text-cream-muted/30"
                  }`}>
                    {s.label}
                  </span>
                </button>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 sm:mx-2 rounded-full transition-all duration-700 ${
                    i < step ? "bg-emerald-600" : "bg-oven-700"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-xl mx-auto px-4">
          <form onSubmit={handleSubmit}>
            {/* Step 0: Plan */}
            <div className={`transition-all duration-500 ${step === 0 ? "opacity-100 translate-x-0" : animDir === "forward" ? "opacity-0 -translate-x-8 absolute inset-x-0 pointer-events-none" : "hidden"}`}>
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-cream-light mb-1">Elegí tu plan</h2>
                  <p className="text-cream-dark/60 text-sm mb-6">Seleccioná el plan de suscripción que mejor se adapte a tu hogar.</p>
                  <div className="space-y-3">
                    {plans.map((plan) => (
                      <label key={plan.id} className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedPlan === plan.id
                          ? "border-ember bg-ember/5 shadow-lg shadow-ember/5"
                          : "border-oven-600/20 bg-gradient-card hover:border-oven-500/40 hover:bg-oven-800/20"
                      }`}>
                        <input type="radio" name="plan" value={plan.id} checked={selectedPlan === plan.id} onChange={() => setSelectedPlan(plan.id)} className="sr-only" />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          selectedPlan === plan.id ? "border-ember bg-ember" : "border-oven-500/40"
                        }`}>
                          {selectedPlan === plan.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-cream-light font-semibold text-sm sm:text-base">{plan.name}</span>
                            {plan.highlighted && (
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-ember/20 text-ember-light border border-ember/20">Más popular</span>
                            )}
                          </div>
                          <p className="text-cream-dark/60 text-xs mt-0.5">{plan.subtitle}</p>
                          <p className="text-cream-dark/40 text-xs mt-0.5">{plan.frequency}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-ember font-bold text-lg sm:text-xl">Bs. {plan.price}</div>
                          <div className="text-cream-dark/50 text-xs">/semana</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 1: Extras - with product photos */}
            <div className={`transition-all duration-500 ${step === 1 ? "opacity-100 translate-x-0" : step < 1 ? "hidden" : animDir === "forward" ? "opacity-0 translate-x-8 absolute inset-x-0 pointer-events-none" : "hidden"}`}>
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-cream-light mb-1">Agregar productos extra</h2>
                    <p className="text-cream-dark/60 text-sm">Opcional. Cada producto suma al total semanal.</p>
                  </div>

                  {/* Summary bar */}
                  {extras.size > 0 && (
                    <div className="sticky top-20 z-10 p-3 rounded-xl bg-ember/10 border border-ember/20 backdrop-blur-sm flex items-center justify-between animate-[fadeIn_0.3s_ease-out]">
                      <span className="text-cream-light text-sm font-medium">{extras.size} producto{extras.size > 1 ? "s" : ""} seleccionado{extras.size > 1 ? "s" : ""}</span>
                      <span className="text-ember font-bold">+Bs. {extrasTotal}</span>
                    </div>
                  )}

                  {/* Grid of complement cards with photos */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {complements.map((comp) => {
                      const isSel = extras.has(comp.id)
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => toggleExtra(comp.id)}
                          className={`group relative flex flex-col rounded-xl border-2 overflow-hidden text-left transition-all duration-300 ${
                            isSel
                              ? "border-ember bg-ember/5 shadow-lg shadow-ember/5 scale-[1.02]"
                              : "border-oven-600/20 bg-gradient-card hover:border-oven-500/40 hover:bg-oven-800/20"
                          }`}
                        >
                          {/* Product image */}
                          <div className="relative aspect-square overflow-hidden bg-oven-800">
                            <Image
                              src={comp.image}
                              alt={comp.name}
                              fill
                              className={`object-cover transition-all duration-500 ${isSel ? "scale-105 brightness-110" : "group-hover:scale-105"}`}
                              sizes="(max-width: 640px) 50vw, 33vw"
                            />
                            {/* Selection overlay */}
                            <div className={`absolute inset-0 transition-all duration-300 ${isSel ? "bg-ember/10" : "bg-transparent"}`} />
                            {/* Checkmark */}
                            <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isSel ? "bg-ember scale-100" : "bg-oven-900/70 scale-0 group-hover:scale-100"
                            }`}>
                              {isSel ? (
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              ) : (
                                <svg className="w-3.5 h-3.5 text-cream-light/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                              )}
                            </div>
                          </div>
                          {/* Info */}
                          <div className="p-2.5 sm:p-3 flex-1 flex flex-col">
                            <span className="text-[10px] text-ember font-semibold uppercase tracking-wider">{comp.category}</span>
                            <h3 className="text-cream-light text-xs sm:text-sm font-semibold mt-0.5 leading-tight line-clamp-2">{comp.name}</h3>
                            <p className="text-cream-dark/50 text-[10px] sm:text-xs mt-0.5">{comp.brand}</p>
                            <div className="mt-auto pt-2">
                              <span className={`text-sm font-bold ${isSel ? "text-ember" : "text-cream-dark/60"}`}>+Bs. {comp.price}</span>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {extras.size === 0 && (
                    <p className="text-center text-cream-dark/40 text-sm py-8">No seleccionaste productos extra. Podés continuar sin agregar ninguno.</p>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Review */}
            <div className={`transition-all duration-500 ${step === 2 ? "opacity-100 translate-x-0" : step < 2 ? "hidden" : animDir === "forward" ? "opacity-0 translate-x-8 absolute inset-x-0 pointer-events-none" : "hidden"}`}>
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-cream-light mb-1">Revisá tu pedido</h2>
                  <p className="text-cream-dark/60 text-sm mb-2">Confirmá que todo esté correcto antes de pagar.</p>

                  {/* Plan summary */}
                  <div className="p-5 rounded-xl bg-gradient-card border border-oven-600/20 space-y-4">
                    {/* Plan info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-ember/10 border border-ember/20 flex items-center justify-center shrink-0">
                        <span className="text-xl">📋</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-cream-light font-semibold">{selectedPlanData?.name}</p>
                        <p className="text-cream-dark/60 text-xs mt-0.5">{selectedPlanData?.subtitle}</p>
                        <p className="text-cream-dark/40 text-xs mt-0.5">{selectedPlanData?.frequency}</p>
                      </div>
                      <span className="text-cream-light font-bold shrink-0">Bs. {planPrice}/sem</span>
                    </div>

                    {/* Extras list */}
                    {extras.size > 0 && (
                      <>
                        <div className="border-t border-oven-600/20 pt-4">
                          <p className="text-cream-dark/60 text-xs font-medium mb-3 uppercase tracking-wider">Productos extra</p>
                          <div className="space-y-2">
                            {Array.from(extras).map((id) => {
                              const c = complements.find((c) => c.id === id)
                              if (!c) return null
                              return (
                                <div key={id} className="flex items-center gap-3">
                                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-oven-800 shrink-0">
                                    <Image src={c.image} alt={c.name} fill className="object-cover" sizes="40px" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-cream-light text-sm truncate">{c.name}</p>
                                    <p className="text-cream-dark/50 text-xs">{c.brand}</p>
                                  </div>
                                  <span className="text-cream-dark/60 text-sm shrink-0">Bs. {c.price}</span>
                                </div>
                              )
                            })}
                          </div>
                          <div className="flex justify-between mt-3 pt-3 border-t border-oven-600/10">
                            <span className="text-cream-dark/60 text-sm">Subtotal extras</span>
                            <span className="text-cream-dark/60 text-sm font-medium">Bs. {extrasTotal}</span>
                          </div>
                        </div>
                      </>
                      )}

                    {/* Total */}
                    <div className="border-t border-oven-600/20 pt-4 flex justify-between items-baseline">
                      <span className="text-cream-light font-semibold text-lg">Total</span>
                      <div className="text-right">
                        <span className="text-cream-light font-bold text-2xl">Bs. {total}</span>
                        <span className="text-cream-dark/50 text-sm ml-1">/sem</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notas" className="block text-cream-dark/80 text-sm mb-1.5 font-medium">Notas adicionales</label>
                    <textarea id="notas" value={notas} onChange={(e) => setNotas(e.target.value)} rows={3} className="w-full px-4 py-3 bg-oven-900 border border-oven-600/40 rounded-xl text-cream-light placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60 transition-colors text-sm resize-none" placeholder="Horario preferido de entrega, alergias, instrucciones especiales..." />
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Pay */}
            <div className={`transition-all duration-500 ${step === 3 ? "opacity-100 translate-x-0" : step < 3 ? "hidden" : animDir === "forward" ? "opacity-0 translate-x-8 absolute inset-x-0 pointer-events-none" : "hidden"}`}>
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-cream-light mb-1">Realizá el pago</h2>
                  <p className="text-cream-dark/60 text-sm">Transferí el total y adjuntá tu comprobante.</p>

                  {/* Payment card */}
                  <div className="p-5 sm:p-6 rounded-xl bg-gradient-card border border-oven-600/20 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-cream-dark/80 font-medium">Total a pagar</span>
                      <span className="text-cream-light font-bold text-2xl">Bs. {total}</span>
                    </div>

                    <div className="text-center space-y-4">
                      <p className="text-cream-dark/70 text-sm">Escaneá el QR con tu app bancaria</p>
                      <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-xl bg-white border-2 border-oven-600/20 overflow-hidden shadow-lg">
                        <Image src="/images/qr-pago.PNG" alt="QR de pago" fill className="object-contain p-2" unoptimized />
                      </div>
                      <p className="text-cream-dark/50 text-xs">Una vez realizada la transferencia, adjuntá el comprobante abajo.</p>
                    </div>
                  </div>

                  {/* Upload */}
                  <div>
                    <label htmlFor="recibo" className={`flex flex-col items-center gap-3 p-6 sm:p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
                      recibo
                        ? "border-emerald-600/40 bg-emerald-600/5 hover:bg-emerald-600/10"
                        : "border-oven-600/30 hover:border-oven-500/40 hover:bg-oven-800/20"
                    }`}>
                      {recibo ? (
                        <>
                          <div className="w-12 h-12 rounded-full bg-emerald-600/20 flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <div className="text-center">
                            <span className="text-emerald-400 text-sm font-semibold">Comprobante cargado</span>
                            <p className="text-cream-dark/50 text-xs mt-0.5">Click para cambiar el archivo</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-oven-800 flex items-center justify-center">
                            <svg className="w-6 h-6 text-cream-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                          </div>
                          <div className="text-center">
                            <span className="text-cream-dark/70 text-sm font-medium">Click para subir comprobante</span>
                            <p className="text-cream-muted/40 text-xs mt-0.5">PNG, JPG, WebP o PDF (máx. 5 MB)</p>
                          </div>
                        </>
                      )}
                      <input id="recibo" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 text-sm text-center animate-[shake_0.5s_ease-out]">{error}</div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-2 px-5 py-3 border border-oven-500/30 text-cream-dark/90 font-semibold rounded-xl text-sm hover:border-cream-dark/40 hover:text-cream-light transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  Atrás
                </button>
              ) : (
                <Link
                  href="/planes"
                  className="flex items-center gap-2 px-5 py-3 border border-oven-500/30 text-cream-dark/90 font-semibold rounded-xl text-sm hover:border-cream-dark/40 hover:text-cream-light transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  Planes
                </Link>
              )}

              {step < 3 && (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canNext()}
                  className="ml-auto flex items-center gap-2 px-6 sm:px-8 py-3 bg-gradient-ember text-white font-semibold rounded-xl text-sm hover:shadow-xl hover:shadow-ember/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {step === 0 && !selectedPlan ? "Elegí un plan" : `Siguiente: ${STEPS[step + 1].label}`}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              )}

              {step === 3 && (
                <button
                  type="submit"
                  disabled={loading || !recibo}
                  className="ml-auto flex items-center gap-2 px-8 py-3 bg-gradient-ember text-white font-semibold rounded-xl text-sm hover:shadow-xl hover:shadow-ember/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>Enviar (Bs. {total})</>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Custom animation keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
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
