import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t border-oven-700/30 bg-oven-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="El Club del Pancito"
                width={2816}
                height={1536}
                className="w-16 h-auto rounded-lg object-contain"
              />
              <span className="text-cream-light font-semibold text-lg">
                El Club del Pancito
              </span>
            </div>
            <p className="text-cream-dark/70 text-sm leading-relaxed max-w-md">
              Panadería artesanal por suscripción en Sucre, Bolivia. Llevamos el sabor
              de la tradición chuquisaqueña a la puerta de tu casa, con la calidez del
              pan recién horneado cada mañana.
            </p>
          </div>

          <div>
            <h4 className="text-cream-light font-semibold text-sm mb-4 uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Inicio" },
                { href: "/productos", label: "Productos" },
                { href: "/planes", label: "Planes" },
                { href: "/nosotros", label: "Nosotros" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream-dark/60 hover:text-cream-light text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-cream-light font-semibold text-sm mb-4 uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-3 text-cream-dark/60 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-cream-dark/40">📍</span>
                Sucre, Chuquisaca, Bolivia
              </li>
              <li>
                <a
                  href="mailto:hola@elclubdelpancito.bo"
                  className="flex items-center gap-2 hover:text-cream-light transition-colors duration-200"
                >
                  <span className="text-cream-dark/40">✉️</span>
                  hola@elclubdelpancito.bo
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/591XXXXXXXX"
                  className="flex items-center gap-2 hover:text-cream-light transition-colors duration-200"
                >
                  <span className="text-cream-dark/40">💬</span>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-oven-700/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream-muted text-xs">
            © {new Date().getFullYear()} El Club del Pancito. Todos los derechos reservados.
          </p>
          <p className="text-cream-muted/50 text-xs">
            Hecho con amor y harina en Sucre, Bolivia
          </p>
        </div>
      </div>
    </footer>
  )
}
