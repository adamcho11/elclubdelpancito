"use client"

import { useState, useEffect, useMemo } from "react"
import BreadCard from "@/components/BreadCard"
import ComplementCard from "@/components/ComplementCard"
import { breads as staticBreads } from "@/data/breads"
import { complements as staticComplements } from "@/data/complements"

interface BreadItem { id: number; name: string; description: string; ingredients: string; texture: string; role: string; image: string }
interface ProductItem { id: number; name: string; brand: string; category: string; description: string; shelfLife: string; image: string; price: number }

export default function ProductosPage() {
  const [breads, setBreads] = useState<BreadItem[]>([])
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/breads").then((r) => r.json()).catch(() => []),
      fetch("/api/products").then((r) => r.json()).catch(() => []),
    ]).then(([b, p]) => {
      setBreads(b.length ? b : [])
      setProducts(p.length ? p : [])
      setLoading(false)
    })
  }, [])

  const displayBreads = breads.length > 0
    ? breads.map((b) => ({ id: b.name.toLowerCase().replace(/\s+/g, "-"), name: b.name, description: b.description, ingredients: b.ingredients, texture: b.texture, role: b.role, image: b.image }))
    : staticBreads

  const displayProducts = products.length > 0
    ? products.map((p) => ({ id: String(p.id), name: p.name, brand: p.brand, category: p.category, description: p.description, shelfLife: p.shelfLife, image: p.image, price: p.price }))
    : staticComplements

  const categories = useMemo(() => {
    const cats = new Map<string, typeof displayProducts>()
    displayProducts.forEach((c) => {
      const existing = cats.get(c.category) || []
      existing.push(c)
      cats.set(c.category, existing)
    })
    return Array.from(cats.entries())
  }, [displayProducts])

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-oven border-b border-oven-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-ember text-sm font-semibold uppercase tracking-widest">Catálogo</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-cream-light mt-3 mb-4">Nuestros productos</h1>
          <p className="text-cream-dark/70 max-w-xl mx-auto">
            Conocé nuestra selección de panes artesanales chuquisaqueños y complementos seleccionados para el desayuno y el té de la tarde.
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
          {loading && breads.length === 0 ? (
            <div className="text-center py-12 text-cream-dark/50">Cargando...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayBreads.map((bread) => (
                <BreadCard key={bread.id} bread={bread} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-oven-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-oven-600/50" />
            <h2 className="text-2xl font-bold text-cream-light shrink-0">Complementos</h2>
            <div className="h-px flex-1 bg-oven-600/50" />
          </div>
          {loading && products.length === 0 ? (
            <div className="text-center py-12 text-cream-dark/50">Cargando...</div>
          ) : (
            categories.map(([category, items]) => (
              <div key={category} className="mb-10">
                <h3 className="text-ember font-semibold text-xs uppercase tracking-widest mb-4">{category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {items.map((complement) => (
                    <ComplementCard key={complement.id} complement={complement} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
