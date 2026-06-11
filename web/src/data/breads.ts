export interface Bread {
  id: string
  name: string
  description: string
  ingredients: string
  texture: string
  role: string
  image: string
}

export const breads: Bread[] = [
  {
    id: "bollo",
    name: "Bollo",
    description: "Pan dulce de alta gama, esponjoso y tierno, con sabor sutilmente dulce. Perfecto para desayunos especiales y ocasiones festivas.",
    ingredients: "Flor de harina, huevo en alta proporción, manteca, azúcar",
    texture: "Esponjoso, miga tierna, sabor sutilmente dulce",
    role: "Pan dulce de alta gama para desayunos especiales",
    image: "/images/panes/bollo.webp",
  },
  {
    id: "kaspa",
    name: "K'aspa",
    description: "Variedad tradicional chuquisaqueña de forma plana y redonda, untada con manteca antes del horneado para lograr una costra sumamente crocante y tostada.",
    ingredients: "Harina blanca, manteca de cerdo superficial, agua, sal, levadura",
    texture: "Plana, redonda, costra sumamente crocante y tostada",
    role: "Variedad tradicional de media tarde para acompañar el té",
    image: "/images/panes/kaspa.webp",
  },
  {
    id: "kauka",
    name: "Kauka",
    description: "Pan tradicional robusto que incorpora leche, manteca de cerdo y tuétano de res. Horneado doble para un dorado interno característico.",
    ingredients: "Harina blanca, manteca de cerdo, tuétano de res, leche, sal, levadura",
    texture: "Masa densa enriquecida, horneado doble para dorado interno",
    role: "Orientado a consumidores que buscan panadería tradicional robusta",
    image: "/images/panes/kauka.webp",
  },
  {
    id: "mestizo",
    name: "Mestizo",
    description: "Combina de forma concéntrica una envoltura de harina integral con un corazón de harina blanca refinada, creando un contraste de texturas único.",
    ingredients: "Harina integral (capa externa), harina blanca (núcleo), agua, sal, levadura",
    texture: "Contraste de texturas, miga suave y corteza rústica",
    role: "Producto premium para desayunos familiares de fin de semana",
    image: "/images/panes/mestizo.webp",
  },
  {
    id: "sarnita",
    name: "Sarnita",
    description: "Pan de masa fina y ligera con queso desmenuzado y superficie gratinada. Alta rotación, ideal para el consumo matutino y meriendas escolares.",
    ingredients: "Harina refinada, queso desmenuzado, manteca, leche, levadura",
    texture: "Masa fina, ligera, superficie gratinada con queso",
    role: "Alta rotación, ideal para consumo matutino y meriendas escolares",
    image: "/images/panes/sarnita.webp",
  },
]
