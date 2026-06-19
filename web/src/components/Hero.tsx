"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        setScrollY(-rect.top)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const breads = [
    "/images/panes/bollo.webp",
    "/images/panes/kaspa.webp",
    "/images/panes/mestizo.webp",
    "/images/panes/sarnita.webp",
  ]

  const breadSpeeds = [0.03, 0.07, 0.05, 0.08]

  return (
    <section ref={sectionRef} className="relative flex overflow-hidden" style={{ minHeight: "calc(100svh - 4rem)" }}>
      {/* Dark base */}
      <div className="absolute inset-0 bg-gradient-oven z-[1]" />

      {/* Clean 2x2 bread grid filling background - each with different parallax speed */}
      <div className="absolute inset-0 z-[2]" style={{ transform: `translateY(${scrollY * 0.02}px)` }}>
        <div className="grid grid-cols-2 h-full opacity-[0.30]">
          {breads.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden"
              style={{ transform: `translateY(${scrollY * breadSpeeds[i]}px) scale(1.1)` }}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="50vw" loading="eager" />
            </div>
          ))}
        </div>
      </div>

      {/* Radial glow - parallax */}
      <div
        className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,rgba(224,112,48,0.12),transparent_60%)]"
        style={{ transform: `translateY(${scrollY * -0.03}px)` }}
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-[4] bg-oven-950/35" />

      {/* Embers - faster parallax */}
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
        {[
          { left: "8%", top: "20%", size: 6, delay: 0 },
          { left: "35%", top: "50%", size: 4, delay: 1.2 },
          { left: "55%", top: "15%", size: 8, delay: 2 },
          { left: "75%", top: "55%", size: 5, delay: 0.7 },
          { left: "90%", top: "25%", size: 6, delay: 1.5 },
          { left: "20%", top: "75%", size: 5, delay: 2.5 },
          { left: "60%", top: "80%", size: 4, delay: 1.8 },
          { left: "45%", top: "35%", size: 7, delay: 3 },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-ember/35 animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${4 + (i % 3)}s`,
              boxShadow: `0 0 ${p.size * 5}px rgba(224,112,48,0.2)`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col justify-center pt-28 sm:pt-20 lg:pt-36 pb-8 text-center">
        <div
          className="bg-oven-950/40 backdrop-blur-sm rounded-3xl px-6 sm:px-12 py-8 sm:py-10 border border-oven-700/15"
          style={{ transform: `translateY(${scrollY * -0.04}px)` }}
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-cream-light mb-4 leading-[1.1] [text-shadow:0_2px_20px_rgba(13,7,4,0.8)]">
            El sabor de la{" "}
            <span className="text-gradient-ember">tradición</span>
            <br />
            en la puerta de tu casa
          </h1>

          <p className="text-cream-dark/85 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed [text-shadow:0_1px_10px_rgba(13,7,4,0.6)]">
            Pan artesanal chuquisaqueño recién horneado, entregado a domicilio
            con un modelo de suscripción flexible. Descubrí la calidez del horno de barro
            cada mañana sin salir de casa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/planes"
              className="px-8 py-4 bg-gradient-ember text-white font-semibold rounded-xl text-sm
                hover:shadow-xl hover:shadow-ember/30 transition-all duration-300
                active:scale-95 hover:-translate-y-0.5"
            >
              Ver planes de suscripción
            </Link>
            <Link
              href="/productos"
              className="px-8 py-4 border border-oven-500/40 text-cream-dark/90 font-semibold rounded-xl text-sm
                hover:border-cream-dark/40 hover:text-cream-light hover:bg-oven-800/30
                transition-all duration-300 active:scale-95"
            >
              Explorar productos
            </Link>
          </div>
        </div>

        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-cream-muted/50 text-xs"
          style={{ transform: `translateY(${scrollY * -0.02}px)` }}
        >
          <div className="flex items-center gap-2"><span className="w-6 h-px bg-oven-500/30" />Pagos seguros</div>
          <div className="flex items-center gap-2"><span className="w-6 h-px bg-oven-500/30" />Entrega a domicilio</div>
          <div className="flex items-center gap-2"><span className="w-6 h-px bg-oven-500/30" />Factura electrónica SIN</div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-oven-950 to-transparent pointer-events-none z-[6]" />
    </section>
  )
}
