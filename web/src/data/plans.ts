export interface Plan {
  id: string
  name: string
  subtitle: string
  frequency: string
  breadComposition: string
  complements: string[]
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
    subtitle: "Pan caliente cada mañana en tu puerta",
    frequency: "Lunes a Sábado · 6 entregas por semana",
    breadComposition: "10 panes de batalla recién horneados por entrega (60 panes por semana)",
    complements: [
      "1 maple de huevos criollos (30 unidades, quincenal)",
      "1 Margarina Regia (250g, mensual)",
      "1 Jamón Cobolde (500g, quincenal)",
      "1 caja de Té con Canela Windsor (50 bolsitas, mensual)",
    ],
    extraProduct: "1 producto extra a elección semanal (café, queso, dulce, embutido, etc.)",
    target: "Familias tradicionales de Sucre que consumen pan diariamente y desean la comodidad de recibirlo caliente cada mañana.",
    price: 65,
    deliveriesPerMonth: 6,
    highlighted: true,
  },
  {
    id: "desayuno-familiar",
    name: "Desayuno Familiar Chuquisaqueño",
    subtitle: "Variedad tradicional tres veces por semana",
    frequency: "Lunes, Miércoles y Viernes · 3 entregas por semana",
    breadComposition: "15 panes variados tradicionales por entrega (k'aspas, sarnitas con queso y mestizos · 45 panes por semana)",
    complements: [
      "1 maple de huevos criollos (30 unidades, mensual)",
      "1 porción de Queso Criollo (300g, quincenal)",
      "1 Dulce de Leche artesanal (350g, mensual)",
      "1 lata de Pasta de Hígado Cobolde (mensual)",
      "1 caja de Té con Limón Windsor (mensual)",
    ],
    extraProduct: "1 producto extra a elección semanal (mermelada, margarina, café, etc.)",
    target: "Hogares medianos que prefieren el pan tradicional chuquisaqueño de alta calidad con proteínas saladas y untables.",
    price: 82,
    deliveriesPerMonth: 3,
  },
  {
    id: "tarde-te-bienestar",
    name: "Tarde de Té y Bienestar",
    subtitle: "La experiencia premium del té de la tarde",
    frequency: "Cada 7 días · 1 entrega por semana",
    breadComposition: "1 hogaza grande de Pan de Masa Madre (750g) y 10 panes de toco integrales por entrega",
    complements: [
      "1 bolsa de Café de Especialidad Yungas molido (250g, mensual)",
      "1 Mantequilla Pil (200g, quincenal)",
      "1 mermelada local sin azúcar (mensual)",
      "1 docena de huevos criollos (quincenal)",
      "1 caja de Manzanilla Windsor (mensual)",
    ],
    extraProduct: "1 producto extra a elección semanal (queso, dulce de leche, pâté, etc.)",
    target: "Profesionales de nivel socioeconómico medio-alto, amantes de la alimentación saludable y el café premium.",
    price: 52,
    deliveriesPerMonth: 1,
  },
]
