"use client"

import BreadCard from "@/components/BreadCard"
import ComplementCard from "@/components/ComplementCard"
import { breads } from "@/data/breads"
import { complements } from "@/data/complements"
import { useMemo } from "react"

export default function ProductosPage() {
  const categories = useMemo(() => {
    const cats = new Map<string, typeof complements>()
    complements.forEach((c) => {
      const existing = cats.get(c.category) || []
      existing.push(c)
      cats.set(c.category, existing)
    })
    return Array.from(cats.entries())
  }, [])

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-oven border-b border-oven-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-ember text-sm font-semibold uppercase tracking-widest">
            Catálogo
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-cream-light mt-3 mb-4">
            Nuestros productos
          </h1>
          <p className="text-cream-dark/70 max-w-xl mx-auto">
            Conocé nuestra selección de panes artesanales chuquisaqueños y complementos
            seleccionados para el desayuno y el té de la tarde.
          </p>
        </div>
      </section>

      <section className="py-20 bg-oven-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-oven-600/50" />
            <h2 className="text-2xl font-bold text-cream-light shrink-0">Panes Artesanales</h2>
            <div className="h-px flex-1 bg-oven-600/50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {breads.map((bread) => (
              <BreadCard key={bread.id} bread={bread} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-oven-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-oven-600/50" />
            <h2 className="text-2xl font-bold text-cream-light shrink-0">Complementos</h2>
            <div className="h-px flex-1 bg-oven-600/50" />
          </div>

          {categories.map(([category, items]) => (
            <div key={category} className="mb-10">
              <h3 className="text-ember font-semibold text-xs uppercase tracking-widest mb-4">
                {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {items.map((complement) => (
                  <ComplementCard key={complement.id} complement={complement} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
