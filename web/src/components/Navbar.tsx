"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"

const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/planes", label: "Planes" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/faq", label: "FAQ" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-oven-950/80 backdrop-blur-xl border-b border-oven-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="relative w-14 h-14 sm:w-12 sm:h-12 overflow-hidden rounded-xl shrink-0">
              <Image
                src="/images/logo.png"
                alt="El Club del Pancito"
                width={64}
                height={64}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
            <span className="text-cream-light font-semibold text-sm sm:text-base tracking-tight leading-tight">
              El Club del Pancito
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 ml-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? "bg-ember/15 text-ember-light"
                    : "text-cream-dark/80 hover:text-cream-light hover:bg-oven-700/40"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!loading && user && user.role === "user" && (
              <Link
                href="/panel"
                className="px-4 py-2 rounded-lg text-sm font-medium text-cream-dark/80 hover:text-cream-light hover:bg-oven-700/40 transition-all duration-300"
              >
                {user.nombre.split(" ")[0]}
              </Link>
            )}
            {!loading && user && user.role === "admin" && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg text-sm font-medium text-ember hover:text-ember-light transition-all duration-300"
              >
                Admin
              </Link>
            )}
            {!loading && !user && (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-cream-dark/80 hover:text-cream-light hover:bg-oven-700/40 transition-all duration-300"
              >
                Ingresar
              </Link>
            )}
            {!loading && user && (
              <button
                onClick={() => logout()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-cream-dark/50 hover:text-cream-light hover:bg-oven-700/40 transition-all duration-300"
              >
                Salir
              </button>
            )}
            {!loading && (!user || user.role !== "admin") && (
            <Link
              href="/checkout"
              className="ml-3 px-5 py-2 bg-gradient-ember text-white text-sm font-semibold rounded-lg
                hover:shadow-lg hover:shadow-ember/25 transition-all duration-300
                active:scale-95"
            >
              Suscribirme
            </Link>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden ml-auto p-2 text-cream-dark hover:text-cream-light transition-colors"
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-oven-700/50 bg-oven-900/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-ember/15 text-ember-light"
                    : "text-cream-dark/80 hover:text-cream-light hover:bg-oven-700/40"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-oven-700/30 pt-2 mt-2 space-y-1">
              {!loading && user && user.role === "user" && (
                <>
                  <Link
                    href="/panel"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-cream-dark/80 hover:text-cream-light hover:bg-oven-700/40 transition-all"
                  >
                    Mi panel ({user.nombre.split(" ")[0]})
                  </Link>
                  <button
                    onClick={() => { logout(); setOpen(false) }}
                    className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-cream-dark/50 hover:text-cream-light hover:bg-oven-700/40 transition-all"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
              {!loading && user && user.role === "admin" && (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-ember hover:text-ember-light transition-all"
                  >
                    Panel Admin
                  </Link>
                  <button
                    onClick={() => { logout(); setOpen(false) }}
                    className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-cream-dark/50 hover:text-cream-light hover:bg-oven-700/40 transition-all"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
              {!loading && !user && (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-cream-dark/80 hover:text-cream-light hover:bg-oven-700/40 transition-all"
                >
                  Ingresar
                </Link>
              )}
            </div>
            {!loading && (!user || user.role !== "admin") && (
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="block w-full mt-2 px-5 py-3 bg-gradient-ember text-white text-center text-sm font-semibold rounded-lg"
            >
              Suscribirme
            </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
