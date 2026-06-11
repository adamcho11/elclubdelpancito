import Image from "next/image"
import type { Complement } from "@/data/complements"

export default function ComplementCard({ complement }: { complement: Complement }) {
  return (
    <div className="group bg-gradient-card border border-oven-600/30 rounded-xl overflow-hidden
      hover:border-ember/20 transition-all duration-500">
      <div className="relative aspect-square overflow-hidden bg-oven-800">
        <Image
          src={complement.image}
          alt={complement.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
      </div>
      <div className="p-4">
        <span className="text-ember text-xs font-semibold uppercase tracking-wider">
          {complement.category}
        </span>
        <h3 className="text-cream-light font-semibold text-sm mt-1 mb-1">{complement.name}</h3>
        <p className="text-cream-muted text-xs mb-2">{complement.brand}</p>
        <p className="text-cream-dark/60 text-xs leading-relaxed line-clamp-2">
          {complement.description}
        </p>
        <div className="mt-3 pt-3 border-t border-oven-600/20 flex items-center gap-1 text-cream-muted text-xs">
          <span>⏱</span>
          {complement.shelfLife}
        </div>
      </div>
    </div>
  )
}
