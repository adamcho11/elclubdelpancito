export interface Step {
  number: number
  title: string
  description: string
  icon: string
}

export const steps: Step[] = [
  {
    number: 1,
    title: "Elige tu plan",
    description: "Selecciona entre nuestros tres planes de suscripción: El Chuquisaqueño Diario, Desayuno Familiar o Tarde de Té y Bienestar. Cada uno diseñado para distintos estilos de vida en Sucre.",
    icon: "🥖",
  },
  {
    number: 2,
    title: "Configura tu entrega",
    description: "Indica tu dirección, zona de Sucre, frecuencia deseada y si prefieres el pan entero (corteza crujiente) o rebanado (para tostadora).",
    icon: "🏠",
  },
  {
    number: 3,
    title: "Pago semanal seguro",
    description: "Realiza tu primer pago con tarjeta, QR Simple o Tigo Money. Los cobros siguientes son automáticos cada semana con factura electrónica incluida.",
    icon: "💳",
  },
  {
    number: 4,
    title: "Recibe en tu puerta",
    description: "Tu pan caliente y complementos llegan a tu domicilio en nuestra bolsa de algodón reutilizable, con la frescura y calidad de la panadería artesanal chuquisaqueña.",
    icon: "🚪",
  },
]
