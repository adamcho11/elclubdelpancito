"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [qrPreview, setQrPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthenticated(true)
  }

  useEffect(() => {
    if (!authenticated) return
    fetch("/api/admin/qr")
      .then((res) => res.json())
      .then((data) => setQrPreview(data.qr || ""))
      .catch(() => {})
  }, [authenticated])

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

  const handleSave = async () => {
    if (!qrPreview) {
      setError("Primero subí una imagen del QR")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch("/api/admin/qr", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ qr: qrPreview }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al guardar")
      }

      setMessage("QR guardado correctamente")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-oven-950">
        <div className="max-w-sm w-full mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-cream-light mb-2">Admin</h1>
            <p className="text-cream-dark/60 text-sm">Ingresá la contraseña para continuar</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="w-full px-4 py-3 bg-oven-900 border border-oven-600/40 rounded-xl text-cream-light
                placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60 transition-colors
                text-sm text-center"
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-ember text-white font-semibold rounded-xl text-sm
                hover:shadow-xl hover:shadow-ember/30 transition-all duration-300 active:scale-[0.98]"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-oven border-b border-oven-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-ember text-sm font-semibold uppercase tracking-widest">
            Admin
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-cream-light mt-3 mb-4">
            Configurar QR de pago
          </h1>
          <p className="text-cream-dark/70 max-w-xl mx-auto">
            Subí la imagen del código QR que los clientes escanearán para pagar.
          </p>
        </div>
      </section>

      <section className="py-16 bg-oven-950">
        <div className="max-w-lg mx-auto px-4 space-y-8">
          <div className="p-6 rounded-xl bg-gradient-card border border-oven-600/20">
            <h2 className="text-cream-light font-semibold text-sm mb-4">QR actual</h2>
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

          <div className="p-6 rounded-xl bg-gradient-card border border-oven-600/20">
            <h2 className="text-cream-light font-semibold text-sm mb-4">Subir nuevo QR</h2>
            <label
              className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed
                border-oven-600/30 cursor-pointer hover:border-oven-500/40 hover:bg-oven-800/20
                transition-colors"
            >
              <svg className="w-8 h-8 text-cream-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-cream-dark/60 text-sm">Click para subir imagen del QR</span>
              <span className="text-cream-muted/40 text-xs">PNG, JPG o WEBP (máx. 2 MB)</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-700/30 text-emerald-400 text-sm text-center">
              {message}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-4 bg-gradient-ember text-white font-semibold rounded-xl text-base
              hover:shadow-xl hover:shadow-ember/30 transition-all duration-300 active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : "Guardar QR"}
          </button>
        </div>
      </section>
    </div>
  )
}
