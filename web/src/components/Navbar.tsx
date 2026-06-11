"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-oven-950/80 backdrop-blur-xl border-b border-oven-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center gap-3 group shrink-0 relative">
            <div className="relative mt-20 md:mt-28 lg:mt-36">
              <Image
                src="/images/logo.png"
                alt="El Club del Pancito"
                width={2816}
                height={1536}
                className="w-32 sm:w-52 md:w-72 lg:w-96 h-auto object-contain
                  group-hover:scale-105 transition-transform duration-500
                  drop-shadow-[0_10px_25px_rgba(0,0,0,0.4)]"
                priority
              />
            </div>
            <span className="text-cream-light font-semibold text-xs sm:text-sm md:text-3xl tracking-tight">
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
            <Link
              href="/planes"
              className="ml-3 px-5 py-2 bg-gradient-ember text-white text-sm font-semibold rounded-lg
                hover:shadow-lg hover:shadow-ember/25 transition-all duration-300
                active:scale-95"
            >
              Suscribirme
            </Link>
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
            <Link
              href="/planes"
              onClick={() => setOpen(false)}
              className="block w-full mt-2 px-5 py-3 bg-gradient-ember text-white text-center text-sm font-semibold rounded-lg"
            >
              Suscribirme
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
