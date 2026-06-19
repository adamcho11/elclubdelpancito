"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/panel"
  const { login, user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (user) {
    router.replace(redirect)
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      router.push(redirect)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-oven-950">
      <div className="max-w-sm w-full mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-cream-light mb-2">Iniciar sesión</h1>
          <p className="text-cream-dark/60 text-sm">
            Ingresá a tu cuenta de El Club del Pancito
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-cream-dark/80 text-sm mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-oven-900 border border-oven-600/40 rounded-xl text-cream-light
                placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60 transition-colors text-sm"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-cream-dark/80 text-sm mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-oven-900 border border-oven-600/40 rounded-xl text-cream-light
                placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60 transition-colors text-sm"
              placeholder="••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-ember text-white font-semibold rounded-xl text-sm
              hover:shadow-xl hover:shadow-ember/30 transition-all duration-300 active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-cream-dark/50 text-sm">
          ¿No tenés cuenta?{" "}
          <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-ember hover:text-ember-light transition-colors">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-oven-950">
        <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
