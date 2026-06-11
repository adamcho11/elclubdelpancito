import Link from "next/link"
import type { Plan } from "@/data/plans"

export default function PlanCard({ plan, detailed = false }: { plan: Plan; detailed?: boolean }) {
  return (
    <div
      className={`relative group rounded-2xl border transition-all duration-500 h-full flex flex-col ${
        plan.highlighted
          ? "border-ember/40 bg-gradient-to-b from-ember/10 to-oven-800/80 glow-ember"
          : "border-oven-600/30 bg-gradient-card hover:border-cream-dark/20"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-ember text-white text-xs font-bold rounded-full">
          Más popular
        </div>
      )}

      <div className="p-6 sm:p-8 flex-1 flex flex-col">
        <h3 className="text-cream-light font-bold text-xl mb-1">{plan.name}</h3>
        <p className="text-cream-dark/60 text-sm mb-4">{plan.subtitle}</p>

        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-ember-light text-4xl font-bold">Bs.</span>
          <span className="text-cream-light text-5xl font-bold tracking-tight">{plan.price}</span>
          <span className="text-cream-dark/50 text-sm">/semana</span>
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <span className="text-cream-dark text-xs font-semibold uppercase tracking-wider">Frecuencia</span>
            <p className="text-cream-dark/70 text-sm mt-1">{plan.frequency}</p>
          </div>

          <div>
            <span className="text-cream-dark text-xs font-semibold uppercase tracking-wider">Panadería incluida</span>
            <p className="text-cream-dark/70 text-sm mt-1">{plan.breadComposition}</p>
          </div>

          <div>
            <span className="text-cream-dark text-xs font-semibold uppercase tracking-wider">Complementos</span>
            <ul className="mt-2 space-y-1.5">
              {plan.complements.map((comp, i) => (
                <li key={i} className="text-cream-dark/60 text-sm flex items-start gap-2">
                  <span className="text-ember mt-0.5 shrink-0">•</span>
                  {comp}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-ember/5 border border-ember/15 p-3">
            <span className="text-ember-light text-xs font-semibold uppercase tracking-wider">
              + Producto extra a elección
            </span>
            <p className="text-cream-dark/70 text-xs mt-1">{plan.extraProduct}</p>
          </div>

          {detailed && (
            <div>
              <span className="text-cream-dark text-xs font-semibold uppercase tracking-wider">Ideal para</span>
              <p className="text-cream-dark/70 text-sm mt-1">{plan.target}</p>
            </div>
          )}
        </div>

        <Link
          href="/planes"
          className={`mt-8 block w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95 ${
            plan.highlighted
              ? "bg-gradient-ember text-white hover:shadow-xl hover:shadow-ember/30"
              : "border border-cream-dark/20 text-cream-light hover:bg-cream-dark/10"
          }`}
        >
          Elegir plan
        </Link>
      </div>
    </div>
  )
}
