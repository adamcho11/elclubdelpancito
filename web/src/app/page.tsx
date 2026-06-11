import Hero from "@/components/Hero"
import ComoFunciona from "@/components/ComoFunciona"
import PlanCard from "@/components/PlanCard"
import { plans } from "@/data/plans"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <Hero />
      <ComoFunciona />

      <section className="py-24 bg-oven-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-ember text-sm font-semibold uppercase tracking-widest">
              Nuestros planes
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-cream-light mt-3 mb-4">
              Elegí el plan perfecto para tu hogar
            </h2>
            <p className="text-cream-dark/70 max-w-xl mx-auto">
              Desde entregas diarias de pan de batalla hasta experiencias premium de té
              de la tarde. Hay un plan para cada estilo de vida en Sucre.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/planes"
              className="inline-flex text-cream-dark/70 hover:text-cream-light text-sm font-medium transition-colors
                underline underline-offset-4 decoration-oven-500/30 hover:decoration-cream-dark/40"
            >
              Ver comparativa completa de planes →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-oven-900/50 border-t border-oven-700/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-cream-light mb-6">
            ¿Listo para empezar?
          </h2>
          <p className="text-cream-dark/70 text-lg mb-10">
            Únete a las familias chuquisaqueñas que ya disfrutan del pan artesanal
            más rico de Sucre en la comodidad de su hogar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/planes"
              className="px-10 py-4 bg-gradient-ember text-white font-semibold rounded-xl text-base
                hover:shadow-xl hover:shadow-ember/30 transition-all duration-300 active:scale-95"
            >
              Suscribirme ahora
            </Link>
            <Link
              href="/productos"
              className="px-10 py-4 border border-oven-500/30 text-cream-dark/90 font-semibold rounded-xl text-base
                hover:border-cream-dark/40 hover:text-cream-light transition-all duration-300"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
