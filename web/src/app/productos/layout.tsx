import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catálogo de panes artesanales chuquisaqueños y complementos para tu suscripción. Bollo, k'aspa, kauka y más variedades de pan recién horneado en Sucre.",
  openGraph: {
    title: "Productos | El Club del Pancito",
    description:
      "Catálogo de panes artesanales chuquisaqueños y complementos para tu suscripción en Sucre.",
  },
}

export default function ProductosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
