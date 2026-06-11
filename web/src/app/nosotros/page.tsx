export default function NosotrosPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-oven border-b border-oven-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-ember text-sm font-semibold uppercase tracking-widest">
            Nuestra historia
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-cream-light mt-3 mb-4">
            Sobre nosotros
          </h1>
          <p className="text-cream-dark/70 max-w-xl mx-auto">
            Rescatando la tradición panadera de Chuquisaca, un pan a la vez.
          </p>
        </div>
      </section>

      <section className="py-20 bg-oven-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-16">
              <div>
                <h2 className="text-2xl font-bold text-cream-light mb-6">
                  La tradición panadera de Chuquisaca
                </h2>
                <div className="space-y-4 text-cream-dark/70 leading-relaxed">
                  <p>
                    La ciudad de Sucre, capital constitucional de Bolivia, cuenta con una herencia
                    culinaria profundamente arraigada donde la panadería desempeña un rol fundamental
                    en la vida diaria de sus habitantes.
                  </p>
                  <p>
                    La tradición panadera de Chuquisaca se caracteriza por una variedad de masas
                    enriquecidas con manteca de cerdo, huevos y técnicas de fermentación locales que
                    han pasado de generación en generación. Desde el icónico pan de Villa hasta las
                    crujientes k&apos;aspas, cada variedad cuenta una historia de identidad y sabor.
                  </p>
                  <p>
                    Variedades como el pan mestizo —que combina harina integral y blanca—, el bollo
                    elaborado con flor de harina y abundante huevo, la kauka que incorpora tuétano de
                    res, y las k&apos;aspas untadas con manteca antes del horneado, representan un
                    patrimonio gastronómico que merece ser preservado y compartido.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cream-light mb-6">
                  Nuestra misión
                </h2>
                <div className="space-y-4 text-cream-dark/70 leading-relaxed">
                  <p>
                    En <span className="text-cream-light font-semibold">El Club del Pancito</span>,
                    nuestra misión es preservar y difundir la rica tradición panadera chuquisaqueña
                    a través de un modelo de suscripción moderno y conveniente.
                  </p>
                  <p>
                    Creemos que el pan artesanal de calidad merece ser accesible para todas las familias
                    de Sucre. Por eso combinamos recetas tradicionales con tecnología de suscripción y
                    logística inteligente para llevar el sabor auténtico del horno de barro directamente
                    a la puerta de tu casa.
                  </p>
                  <p>
                    Cada pan que horneamos es un homenaje a los panificadores tradicionales de
                    Chuquisaca, a sus técnicas centenarias y al valor cultural del pan como elemento
                    central de la mesa boliviana.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
                <div className="text-center p-6 rounded-xl bg-gradient-card border border-oven-600/20">
                  <div className="text-ember text-3xl font-bold mb-2">7+</div>
                  <p className="text-cream-dark/60 text-sm">Variedades de pan tradicional chuquisaqueño</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-card border border-oven-600/20">
                  <div className="text-ember text-3xl font-bold mb-2">6</div>
                  <p className="text-cream-dark/60 text-sm">Zonas de entrega en Sucre y periferia</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-card border border-oven-600/20">
                  <div className="text-ember text-3xl font-bold mb-2">24/6</div>
                  <p className="text-cream-dark/60 text-sm">Entregas al mes en plan diario</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-cream-light mb-6">
                  El modelo de suscripción
                </h2>
                <div className="space-y-4 text-cream-dark/70 leading-relaxed">
                  <p>
                    Frente a los desafíos económicos estructurales del sector panificador —márgenes
                    reducidos, control de precios municipales y eliminación de subvenciones—, el modelo
                    de suscripción digital surge como una alternativa estratégica de alta viabilidad.
                  </p>
                  <p>
                    Al empaquetar el pan de consumo diario con una gama de productos complementarios
                    de alta rotación y margen libre, logramos un subsidio cruzado que beneficia a todos:
                    el pan tradicional actúa como dinamizador de la retención, mientras que los productos
                    adicionales para el desayuno y el té capturan la rentabilidad real del negocio.
                  </p>
                  <p>
                    Este modelo nos permite ofrecerte precios justos, calidad consistente y la comodidad
                    de recibir todo en la puerta de tu casa, sin que tengas que preocuparte por hacer
                    filas en la panadería o correr al mercado antes de que cierren.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-oven-900/50 border-t border-oven-700/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-cream-dark/70 text-lg italic leading-relaxed">
            &ldquo;La tradición panadera de Chuquisaca no es solo harina, agua y levadura.
            Es historia, es identidad, es el calor del horno que despierta a Sucre cada mañana.&rdquo;
          </p>
          <p className="text-cream-light font-semibold text-sm mt-4">
            — El Club del Pancito
          </p>
        </div>
      </section>
    </div>
  )
}
