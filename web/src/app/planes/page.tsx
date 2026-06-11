import PlanCard from "@/components/PlanCard"
import { plans } from "@/data/plans"
import Link from "next/link"

export default function PlanesPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-oven border-b border-oven-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-ember text-sm font-semibold uppercase tracking-widest">
            Planes
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-cream-light mt-3 mb-4">
            Elegí tu suscripción
          </h1>
          <p className="text-cream-dark/70 max-w-xl mx-auto">
            Tres planes diseñados para adaptarse a los hábitos de consumo de los hogares
            chuquisaqueños. Todos incluyen pan fresco a domicilio y complementos seleccionados.
          </p>
        </div>
      </section>

      <section className="py-20 bg-oven-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} detailed />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-oven-900/50 border-t border-oven-700/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-cream-light mb-8 text-center">
            ¿Qué incluye cada suscripción?
          </h2>

          <div className="grid gap-6">
            {[
              {
                title: "Entrega a domicilio",
                desc: "Pan caliente entregado en la puerta de tu casa en bolsa de algodón reutilizable, dentro de los horarios programados para tu zona de Sucre.",
              },
              {
                title: "Factura electrónica SIN",
                desc: "Cada pago semanal genera automáticamente tu factura electrónica certificada por el Servicio de Impuestos Nacionales de Bolivia.",
              },
              {
                title: "Pausa y cancelación flexible",
                desc: "Pausá tu suscripción hasta 30 días sin costo adicional. Cancelá en cualquier momento, sin penalizaciones ni letras chicas.",
              },
              {
                title: "Soporte vía WhatsApp",
                desc: "Atención personalizada por WhatsApp Business de 5:00 AM a 8:00 PM. Resolvemos cualquier incidencia de entrega de inmediato.",
              },
              {
                title: "Pago seguro",
                desc: "Múltiples opciones de pago: tarjeta de crédito/débito, QR Simple, Tigo Money. Tus datos nunca se almacenan en nuestros servidores.",
              },
              {
                title: "Productos de calidad",
                desc: "Todos nuestros productos cumplen con las normativas bolivianas de inocuidad alimentaria NB-ISO 22000 y etiquetado NB 314001.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 p-5 rounded-xl bg-gradient-card border border-oven-600/20"
              >
                <span className="text-ember text-lg mt-0.5 shrink-0">✓</span>
                <div>
                  <h3 className="text-cream-light font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-cream-dark/60 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/planes"
              className="px-10 py-4 bg-gradient-ember text-white font-semibold rounded-xl text-base
                hover:shadow-xl hover:shadow-ember/30 transition-all duration-300 active:scale-95"
            >
              Suscribirme ahora
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
