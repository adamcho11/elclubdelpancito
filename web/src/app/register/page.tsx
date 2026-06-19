"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/AuthProvider"

export default function RegisterPage() {
  const router = useRouter()
  const { register, user } = useAuth()
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    telefono: "",
    direccion: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (user) {
    router.replace("/panel")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      await register({
        email: form.email,
        password: form.password,
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion || undefined,
      })
      router.push("/panel")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-oven-950">
      <div className="max-w-sm w-full mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-cream-light mb-2">Crear cuenta</h1>
          <p className="text-cream-dark/60 text-sm">
            Registrate para suscribirte a El Club del Pancito
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-cream-dark/80 text-sm mb-1.5">
              Nombre completo <span className="text-ember">*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-oven-900 border border-oven-600/40 rounded-xl text-cream-light
                placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60 transition-colors text-sm"
              placeholder="Tu nombre y apellido"
            />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-cream-dark/80 text-sm mb-1.5">
              Teléfono <span className="text-ember">*</span>
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={form.telefono}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-oven-900 border border-oven-600/40 rounded-xl text-cream-light
                placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60 transition-colors text-sm"
              placeholder="+591 XXXXXXXX"
            />
          </div>

          <div>
            <label htmlFor="direccion" className="block text-cream-dark/80 text-sm mb-1.5">
              Dirección de entrega
            </label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              value={form.direccion}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-oven-900 border border-oven-600/40 rounded-xl text-cream-light
                placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60 transition-colors text-sm"
              placeholder="Zona, calle, número de casa"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-cream-dark/80 text-sm mb-1.5">
              Email <span className="text-ember">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-oven-900 border border-oven-600/40 rounded-xl text-cream-light
                placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60 transition-colors text-sm"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-cream-dark/80 text-sm mb-1.5">
              Contraseña <span className="text-ember">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-oven-900 border border-oven-600/40 rounded-xl text-cream-light
                placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60 transition-colors text-sm"
              placeholder="Mínimo 6 caracteres"
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
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-cream-dark/50 text-sm">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-ember hover:text-ember-light transition-colors">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
