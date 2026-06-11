export interface FAQItem {
  question: string
  answer: string
}

export const faqItems: FAQItem[] = [
  {
    question: "¿Cómo funciona la suscripción de El Club del Pancito?",
    answer: "El Club del Pancito es un servicio de suscripción de pan artesanal a domicilio en Sucre. Eliges uno de nuestros tres planes, configuras tu frecuencia de entrega y recibes pan caliente en la puerta de tu casa junto con complementos seleccionados (huevos, café, té, embutidos y más). Todo se gestiona desde nuestra plataforma digital con cobro semanal automático.",
  },
  {
    question: "¿En qué zonas de Sucre realizan entregas?",
    answer: "Cubrimos todo el casco urbano de Sucre y zonas periféricas accesibles, divididas en seis zonas operativas: Centro Histórico, Zona Sur, Zona Norte, Zona La Recoleta, Zona Villa Armonía y Zona Lajastambo. Cada zona tiene una tarifa de envío diferenciada que se calcula automáticamente al momento del checkout.",
  },
  {
    question: "¿Puedo pausar o cancelar mi suscripción en cualquier momento?",
    answer: "Sí. Puedes pausar tu suscripción temporalmente (máximo 30 días) desde tu panel de control, durante el cual no se generan pedidos pero mantienes tu cuenta activa. La cancelación toma efecto al final del ciclo de facturación semanal actual.",
  },
  {
    question: "¿Cómo se realizan los cobros?",
    answer: "Los cobros son semanales y automáticos a través de pasarelas de pago bolivianas certificadas (Libélula y Red Enlace). Puedes pagar con tarjeta de crédito/débito, QR Simple, Tigo Money o transferencia bancaria. Tus datos de tarjeta nunca se almacenan en nuestros servidores gracias a la tokenización segura PCI DSS.",
  },
  {
    question: "¿Qué pasa si un cobro falla?",
    answer: "Nuestro sistema de Dunning automático reintenta el cobro los días 1, 2 y 4 tras un fallo. Recibirás notificaciones por WhatsApp con un enlace de pago alternativo. Si tras 7 días no se regulariza, la suscripción se suspende temporalmente con un mensaje amigable para reactivarla cuando desees.",
  },
  {
    question: "¿El pan se entrega caliente?",
    answer: "Sí. El pan se hornea durante la madrugada y se entrega temprano en la mañana (antes de las 8:00 AM) en bolsas de algodón reutilizables que mantenemos en un sistema de rotación. Para las entregas de media tarde, el pan se hornea en tandas programadas para garantizar la frescura.",
  },
  {
    question: "¿Qué hago si tengo alergias o restricciones alimentarias?",
    answer: "Nuestro catálogo incluye información detallada de ingredientes de cada producto. Puedes especificar alergias y preferencias en tu perfil. Los panes como el Mestizo (integral) o el Pan de Mesa (con fécula de papa) ofrecen alternativas para diferentes necesidades. Contáctanos directamente si tienes requerimientos especiales.",
  },
  {
    question: "¿Cómo recibo mi factura electrónica?",
    answer: "Cada pago semanal exitoso genera automáticamente una factura electrónica certificada por el Servicio de Impuestos Nacionales (SIN) de Bolivia, que recibirás en tu correo electrónico registrado. La facturación está integrada nativamente a través de nuestra pasarela de pagos.",
  },
  {
    question: "¿Entregan pan los fines de semana y feriados?",
    answer: "El plan 'El Chuquisaqueño Diario' incluye entregas de lunes a sábado. Los otros planes tienen sus frecuencias específicas detalladas en cada plan. En feriados nacionales, las entregas pueden reprogramarse al día hábil siguiente con notificación previa.",
  },
  {
    question: "¿Cómo puedo contactarlos si tengo un problema?",
    answer: "Puedes contactarnos por WhatsApp Business al número que te proporcionamos al suscribirte, por correo electrónico a hola@elclubdelpancito.bo, o a través del chat en vivo de nuestra plataforma. Respondemos en horario de 5:00 AM a 8:00 PM de lunes a sábado.",
  },
]
