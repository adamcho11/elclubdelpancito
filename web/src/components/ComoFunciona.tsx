import { steps } from "@/data/steps"

export default function ComoFunciona() {
  return (
    <section className="py-24 bg-oven-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-ember text-sm font-semibold uppercase tracking-widest">
            Simple y delicioso
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-cream-light mt-3 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-cream-dark/70 max-w-xl mx-auto">
            Cuatro pasos simples para empezar a recibir pan artesanal chuquisaqueño
            en la puerta de tu casa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative group"
            >
              <div className="bg-gradient-card border border-oven-600/30 rounded-2xl p-6 h-full
                hover:border-ember/20 glow-crust hover:glow-ember transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-ember/10 flex items-center justify-center mb-4
                  text-2xl group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-ember text-sm font-bold">Paso {step.number}</span>
                </div>
                <h3 className="text-cream-light font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-cream-dark/60 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
