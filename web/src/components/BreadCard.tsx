import Image from "next/image"
import type { Bread } from "@/data/breads"

export default function BreadCard({ bread }: { bread: Bread }) {
  return (
    <div className="group bg-gradient-card border border-oven-600/30 rounded-2xl overflow-hidden
      hover:border-ember/20 hover:glow-ember transition-all duration-500">
      <div className="relative aspect-[4/3] overflow-hidden bg-oven-800">
        <Image
          src={bread.image}
          alt={bread.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-oven-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-cream-light font-bold text-xl">{bread.name}</h3>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-cream-dark/70 text-sm leading-relaxed">{bread.description}</p>
        <div className="space-y-2 pt-2 border-t border-oven-600/20">
          <div className="flex items-start gap-2 text-xs">
            <span className="text-ember font-semibold shrink-0">Ingredientes:</span>
            <span className="text-cream-dark/60">{bread.ingredients}</span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-crust font-semibold shrink-0">Textura:</span>
            <span className="text-cream-dark/60">{bread.texture}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
