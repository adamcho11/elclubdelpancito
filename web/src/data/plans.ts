export interface Plan {
  id: string
  name: string
  subtitle: string
  frequency: string
  breadComposition: string
  complement: string
  extraProduct: string
  target: string
  price: number
  deliveriesPerMonth: number
  highlighted?: boolean
}

export const plans: Plan[] = [
  {
    id: "chuquisaqueno-diario",
    name: "El Chuquisaqueño Diario",
    subtitle: "10 sarnitas cada mañana · Solo Bs. 10.83/día",
    frequency: "Lunes a Sábado · 6 entregas por semana",
    breadComposition: "10 sarnitas recién horneadas por entrega (60 sarnitas/sem a Bs. 0.50 c/u)",
    complement: "1 complemento gratis a elección: huevos, queso, café, mermelada y más. ¡Distinto cada semana!",
    extraProduct: "Agregá extras a tu pedido desde Bs. 5.",
    target: "Familias que quieren pan caliente todos los días sin salir de casa.",
    price: 65,
    deliveriesPerMonth: 6,
    highlighted: true,
  },
  {
    id: "desayuno-familiar",
    name: "Desayuno Familiar",
    subtitle: "15 panes variados 3x/sem · Solo Bs. 27.33/entrega",
    frequency: "Lunes, Miércoles y Viernes · 3 entregas por semana",
    breadComposition: "5 sarnitas + 5 mestizos + 5 k'aspas por entrega (45 panes/sem a Bs. 0.50 c/u)",
    complement: "1 complemento gratis a elección: queso criollo, dulce de leche, mermelada y más. ¡Distinto cada semana!",
    extraProduct: "Agregá extras a tu pedido desde Bs. 5.",
    target: "Hogares que quieren variedad de panes tradicionales 3 veces por semana.",
    price: 82,
    deliveriesPerMonth: 3,
  },
  {
    id: "tarde-te-bienestar",
    name: "Tarde de Té y Bienestar",
    subtitle: "11 panes premium/sem · Solo Bs. 52/entrega",
    frequency: "1 entrega semanal · El día que vos elijas",
    breadComposition: "5 sarnitas + 3 bollos + 2 mestizos + 1 kauka integral por entrega (a Bs. 0.50 c/u)",
    complement: "1 complemento gratis a elección: mantequilla, café yungas, mermelada artesanal y más. ¡Distinto cada semana!",
    extraProduct: "Agregá extras a tu pedido desde Bs. 5.",
    target: "Amantes del buen pan, café premium y alimentación saludable.",
    price: 52,
    deliveriesPerMonth: 1,
  },
]
