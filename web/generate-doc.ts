import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, Table, TableCell, TableRow, WidthType,
  BorderStyle, PageBreak,
} from "docx"
import * as fs from "fs"

function heading(text: string, level: number) {
  return new Paragraph({
    text,
    heading: `Heading${level}` as unknown as HeadingLevel,
    spacing: { before: 400, after: 200 },
  })
}

function para(text: string, bold = false) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, bold, size: 24, font: "Calibri" })],
  })
}

function multiPara(lines: string[]) {
  return new Paragraph({
    spacing: { after: 120 },
    children: lines.flatMap((line, i) => {
      const runs: TextRun[] = [new TextRun({ text: line, size: 24, font: "Calibri" })]
      if (i < lines.length - 1) runs.push(new TextRun({ break: 1 }))
      return runs
    }),
  })
}

function bullet(text: string) {
  return new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 80 },
  })
}

function cell(text: string, bold = false, width?: number) {
  return new TableCell({
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    children: [new Paragraph({
      children: [new TextRun({ text, bold, size: 22, font: "Calibri" })],
      spacing: { before: 40, after: 40 },
    })],
  })
}

function row(cells: string[], bold = false, widths?: number[]) {
  return new TableRow({
    children: cells.map((c, i) => cell(c, bold, widths?.[i])),
  })
}

async function main() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 24 },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: [
          // Título
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun({ text: "UNIVERSIDAD MAYOR, REAL Y PONTIFICIA DE", bold: true, size: 26, font: "Calibri" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun({ text: "SAN FRANCISCO XAVIER DE CHUQUISACA", bold: true, size: 26, font: "Calibri" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: "FACULTAD DE CIENCIAS Y TECNOLOGÍA", bold: true, size: 26, font: "Calibri" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [new TextRun({ text: "CARRERA DE INGENIERÍA INFORMÁTICA", bold: true, size: 26, font: "Calibri" })],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 600, after: 200 },
            children: [new TextRun({ text: "SIS406 - COMERCIO Y GOBIERNO ELECTRÓNICO", bold: true, size: 28, font: "Calibri" })],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 600 },
            children: [new TextRun({ text: 'Sistema de Comercio Electrónico por Suscripción para\nPanadería Artesanal "El Club del Pancito"', bold: true, size: 32, font: "Calibri" })],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: "Estudiante: Adam Leanos", size: 26, font: "Calibri" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [new TextRun({ text: "Sucre - Bolivia, Junio 2026", size: 26, font: "Calibri" })],
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // 1. INTRODUCCIÓN
          heading("1. Introducción", 1),
          para("El comercio electrónico ha transformado la forma en que las empresas interactúan con sus clientes. En Bolivia, y particularmente en Sucre, la adopción de canales digitales para la venta de productos de consumo diario representa una oportunidad significativa."),
          para("El pan artesanal chuquisaqueño, producto emblemático de la gastronomía local, carece de plataformas modernas que combinen la tradición panadera con modelos de negocio digitales."),
          para("El presente proyecto aborda la problemática de la comercialización digital de pan artesanal en Sucre mediante un sistema de suscripción flexible con entrega a domicilio. Se buscó resolver la ausencia de una plataforma web que permita a los clientes suscribirse a planes de panadería, gestionar pagos mediante QR y seleccionar productos complementarios de manera intuitiva."),
          para("Lo que se hizo: se diseñó y desarrolló un sitio web completo con panel de administración, sistema de autenticación, pasarela de pago QR, integración con Google Analytics y Tag Manager, chat en vivo, botón de WhatsApp flotante, y una base de datos en la nube con Turso. El backend y frontend están integrados en una sola aplicación Next.js desplegada en Vercel."),
          para("Pasos seguidos:"),
          bullet("Diseño de la arquitectura del sistema (frontend + backend + base de datos)"),
          bullet("Desarrollo del frontend con Next.js 16, React 19 y Tailwind CSS v4"),
          bullet("Implementación del backend con Next.js API Routes y Prisma ORM"),
          bullet("Configuración de base de datos SQLite en Turso (cloud)"),
          bullet("Integración de autenticación con JWT y cookies seguras"),
          bullet("Implementación del flujo de checkout con pasarela de pago QR Simple"),
          bullet("Integración de Google Tag Manager, Google Analytics y Tawk.to"),
          bullet("Despliegue en Vercel con CI/CD automático desde GitHub"),
          para("URL del proyecto: https://elclubdelpancito.vercel.app"),
          para("Resultados obtenidos: un sitio web completamente funcional con 24 rutas, panel de administración con CRUD de productos, panes y planes, dashboard de estadísticas, sistema de validación de comprobantes y más de 15 páginas responsive."),

          // 2. ANTECEDENTES
          heading("2. Antecedentes", 1),

          heading("2.1 Comercio electrónico en Bolivia", 2),
          para("El comercio electrónico en Bolivia ha experimentado un crecimiento sostenido en los últimos años, impulsado por la pandemia del COVID-19 y la creciente penetración de smartphones. Según la Cámara Nacional de Comercio, el e-commerce boliviano creció más del 40% entre 2020 y 2023."),
          para("Los métodos de pago digital más utilizados en Bolivia incluyen:"),
          bullet("QR Simple (el más extendido)"),
          bullet("Tigo Money"),
          bullet("Libélula"),
          bullet("Red Enlace"),
          bullet("Transferencias bancarias"),

          heading("2.2 Panaderías con presencia digital en Sucre", 2),
          para("En Sucre, la mayoría de las panaderías operan con modelos tradicionales: venta presencial en tienda física o, en el mejor de los casos, pedidos por WhatsApp con catálogos enviados manualmente. No existe un sistema de suscripción automatizado para panadería artesanal en la ciudad."),
          para("Los sistemas de suscripción de alimentos (meal kits, panaderías) son comunes en mercados como Estados Unidos y Europa (HelloFresh, Wildgrain), pero son prácticamente inexistentes en Bolivia. El Club del Pancito busca llenar ese vacío adaptando el modelo de suscripción al contexto chuquisaqueño."),

          heading("2.3 Tecnologías utilizadas en proyectos similares", 2),
          para("A nivel global, las plataformas de e-commerce por suscripción utilizan stacks como Shopify + plugins, WooCommerce + suscripciones, o desarrollos a medida con Next.js/Node.js. El Club del Pancito opta por un stack moderno y liviano: Next.js como solución full-stack con SQLite en la nube, eliminando la necesidad de múltiples servidores y reduciendo costos operativos."),

          // 3. OBJETIVOS
          heading("3. Objetivos", 1),

          heading("3.1 Objetivo General", 2),
          para("Desarrollar un sistema de comercio electrónico por suscripción para la panadería artesanal El Club del Pancito que permita a los clientes de Sucre gestionar sus suscripciones, realizar pagos mediante QR y seleccionar productos complementarios, con un panel de administración completo para la gestión del negocio."),

          heading("3.2 Objetivos Específicos", 2),
          bullet("Diseñar e implementar una interfaz de usuario responsive y temática con Tailwind CSS v4."),
          bullet("Desarrollar un sistema de autenticación con registro, inicio de sesión y roles (usuario/administrador) utilizando JWT y cookies httpOnly."),
          bullet("Implementar un flujo de checkout multi-paso con selección de plan, producto semanal gratuito, productos extra con precios dinámicos y pasarela de pago QR Simple."),
          bullet("Crear un panel de administración con dashboard de estadísticas, CRUD de productos, panes y planes, y gestión de comprobantes de pago."),
          bullet("Integrar herramientas de analítica y comunicación: Google Analytics, Google Tag Manager, Tawk.to (chat en vivo) y botón de WhatsApp."),
          bullet("Optimizar el SEO mediante metadatos OpenGraph, Twitter Cards, sitemap.xml, robots.txt, y datos estructurados JSON-LD."),
          bullet("Desplegar el sistema en Vercel con integración continua desde GitHub y base de datos persistente en Turso."),
          bullet("Implementar protección de rutas mediante proxy server-side de Next.js."),

          // 4. HERRAMIENTAS
          heading("4. Herramientas", 1),

          heading("4.1 Stack Tecnológico", 2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              row(["Capa", "Tecnología", "Versión"], true, [30, 40, 30]),
              row(["Framework", "Next.js (App Router)", "16.2.7"]),
              row(["Lenguaje", "TypeScript", "5.x (strict)"]),
              row(["Frontend", "React", "19.2.4"]),
              row(["Estilos", "Tailwind CSS", "v4 (custom theme)"]),
              row(["ORM", "Prisma", "6.19.3"]),
              row(["Base de Datos", "Turso (SQLite cloud)", "-"]),
              row(["Despliegue", "Vercel", "-"]),
              row(["Control de Versiones", "Git + GitHub", "-"]),
            ],
          }),

          heading("4.2 Autenticación y Seguridad", 2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              row(["Herramienta", "Versión", "Uso"], true, [35, 20, 45]),
              row(["jsonwebtoken", "9.x", "Generación y verificación de tokens JWT"]),
              row(["bcryptjs", "3.x", "Hashing de contraseñas"]),
              row(["Cookies httpOnly", "-", "Almacenamiento seguro del token"]),
            ],
          }),

          heading("4.3 Plugins y Herramientas Externas", 2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              row(["Herramienta", "Tipo", "Función"], true, [30, 25, 45]),
              row(["Google Analytics 4", "Analítica", "Tracking de visitas (G-BGZ9ZJGCQM)"]),
              row(["Google Tag Manager", "Gestión de etiquetas", "Contenedor de scripts (GTM-WLLJ2MVS)"]),
              row(["Tawk.to", "Chat en vivo", "Atención al cliente en tiempo real"]),
              row(["WhatsApp Business", "Mensajería", "Botón flotante y contacto directo"]),
              row(["QR Simple", "Método de pago", "Pasarela de pago mediante código QR"]),
              row(["@next/third-parties", "Librería", "Integración oficial de Google Analytics"]),
            ],
          }),

          heading("4.4 Otras Herramientas", 2),
          bullet("Zod: validación de esquemas en API routes"),
          bullet("ESLint v9: linting con reglas de Next.js y TypeScript"),
          bullet("@prisma/adapter-libsql: adaptador de Prisma para Turso"),
          bullet("@libsql/client: cliente nativo de Turso"),
          bullet("dotenv: gestión de variables de entorno"),

          heading("4.5 SEO y Rendimiento", 2),
          bullet("Metadatos OpenGraph y Twitter Cards en todas las páginas"),
          bullet("JSON-LD Structured Data con schema Bakery para Google Rich Results"),
          bullet("Sitemap.xml y robots.txt dinámicos"),
          bullet("Server Components por defecto para mejor rendimiento"),
          bullet("Imágenes optimizadas con next/image"),

          // 5. MODELO DE INGRESOS
          heading("5. Modelo de Ingresos", 1),
          para("El Club del Pancito opera bajo un modelo de suscripción semanal con tres planes diferenciados por precio y frecuencia:"),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              row(["Plan", "Precio (Bs./sem)", "Entregas", "Público"], true, [30, 20, 20, 30]),
              row(["El Chuquisaqueño Diario", "65", "6 (Lun-Sáb)", "Familias tradicionales"]),
              row(["Desayuno Familiar", "82", "3 (Lun, Mié, Vie)", "Hogares medianos"]),
              row(["Tarde de Té y Bienestar", "52", "1 (semanal)", "Profesionales saludables"]),
            ],
          }),

          para("Ingresos adicionales:"),
          bullet("Productos extra opcionales con precios desde Bs. 5 hasta Bs. 25"),
          bullet("Cada plan incluye 1 producto gratis semanal (distinto cada semana)"),

          para("Flujo de pago:"),
          bullet("Cliente selecciona plan y producto semanal gratis"),
          bullet("Agrega extras opcionales con precio visible"),
          bullet("Visualiza el total a pagar"),
          bullet("Escanea QR Simple con su app bancaria"),
          bullet("Sube comprobante de pago al sitio"),
          bullet("Administrador revisa, valida y aprueba el pago"),
          bullet("Se inicia la entrega"),

          // 6. DESCRIPCIÓN DEL SITIO
          heading("6. Descripción del Sitio", 1),

          heading("6.1 Vista del Usuario (Cliente)", 2),
          para("Páginas públicas:"),
          bullet("Inicio: hero con imágenes de panes, sección Cómo funciona con 4 pasos, vista previa de planes, CTA de suscripción"),
          bullet("Productos: catálogo de panes artesanales y complementos categorizados (bebidas, lácteos, proteínas, untables)"),
          bullet("Planes: tres planes con detalle completo (frecuencia, composición, complementos, precio)"),
          bullet("Nosotros: historia de la panadería, tradición chuquisaqueña, cobertura en Sucre"),
          bullet("FAQ: preguntas frecuentes con acordeón interactivo sobre entregas, pagos, pausas"),

          para("Páginas con autenticación:"),
          bullet("Login / Registro: formularios con validación en tiempo real y redireccionamiento inteligente"),
          bullet("Checkout: wizard de 5 pasos (Plan → Producto semanal → Extras → Revisar → Pago QR)"),
          bullet("Panel de usuario: selector de producto semanal, historial de productos, estado de comprobantes"),

          para("Elementos globales:"),
          bullet("Navbar con navegación completa"),
          bullet("Footer con enlaces, contacto y redes sociales"),
          bullet("Botón flotante de WhatsApp animado"),
          bullet("Chat en vivo Tawk.to"),

          heading("6.2 Vista del Administrador", 2),
          para("El panel de administración (/admin) contiene 6 pestañas:"),
          bullet("Dashboard: tarjetas con estadísticas (usuarios, comprobantes, pendientes, panes, productos, planes)"),
          bullet("Comprobantes: listado con botones aprobar/rechazar y visor de imagen"),
          bullet("Panes: CRUD completo de panes artesanales"),
          bullet("Productos: CRUD completo de complementos con precios"),
          bullet("Planes: CRUD completo de planes de suscripción"),
          bullet("QR de pago: visualización y subida de nuevo QR Simple"),

          // 7. REDES SOCIALES
          heading("7. Conexión con Redes Sociales", 1),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              row(["Plataforma", "Enlace", "Ubicación"], true, [25, 45, 30]),
              row(["TikTok", "https://www.tiktok.com/@adamchos", "Footer"]),
              row(["Facebook", "https://www.facebook.com/profile.php?id=61591090827056", "Footer"]),
              row(["WhatsApp", "+59175769711", "Botón flotante + Footer + FAQ"]),
            ],
          }),

          para("Funcionalidades de mensajería:"),
          bullet("Tawk.to: chat en vivo integrado en todas las páginas"),
          bullet("WhatsApp flotante: botón con animación de aparición al hacer scroll"),
          bullet("Contacto directo: enlace en FAQ y footer"),

          // 8. MÉTODO DE PAGO
          heading("8. Método de Pago", 1),
          para("El método de pago implementado es QR Simple, la pasarela de pago más utilizada en Bolivia por su simplicidad y compatibilidad con todas las apps bancarias."),
          para("Flujo de pago:"),
          bullet("El cliente selecciona su plan y extras, viendo el total a pagar"),
          bullet("El sistema muestra un código QR (configurable por el administrador)"),
          bullet("El cliente escanea el QR con su app bancaria y realiza el pago"),
          bullet("Guarda el comprobante y lo sube al formulario de checkout"),
          bullet("El comprobante se envía al backend con estado pendiente"),
          bullet("El administrador revisa la imagen y aprueba o rechaza el pago"),
          bullet("El cliente ve el estado en su panel de usuario"),
          para("Ventajas de QR Simple:"),
          bullet("No requiere integración de API bancaria"),
          bullet("Compatible con todas las entidades financieras bolivianas"),
          bullet("Sin costo de transacción para el comercio"),
          bullet("Flujo de validación manual que evita fraudes"),

          // 9. CONCLUSIONES
          heading("9. Conclusiones y Recomendaciones", 1),

          heading("9.1 Conclusiones", 2),
          bullet("Se desarrolló exitosamente un sistema de comercio electrónico por suscripción completo para panadería artesanal, desplegado en producción."),
          bullet("La arquitectura full-stack con Next.js permitió integrar frontend y backend en una sola aplicación, reduciendo costos a Bs. 0 mensuales."),
          bullet("La base de datos Turso (SQLite cloud) demostró ser una alternativa viable y gratuita para proyectos de pequeña y mediana escala."),
          bullet("El flujo de pago mediante QR Simple es adecuado para el mercado boliviano, donde la validación manual sigue siendo práctica común."),
          bullet("La integración de herramientas de analítica y comunicación proporciona una base sólida para la operación comercial."),

          heading("9.2 Recomendaciones", 2),
          bullet("Integrar una API bancaria oficial para automatizar la validación de comprobantes."),
          bullet("Implementar notificaciones push y por email para informar a clientes sobre el estado de sus pagos."),
          bullet("Agregar un módulo de logística para gestionar rutas de entrega."),
          bullet("Desarrollar una PWA o aplicación nativa para mejorar la experiencia móvil."),
          bullet("Explorar integración con Tigo Money como método de pago complementario."),
          bullet("Implementar control de inventario en tiempo real para productos complementarios."),
          bullet("Agregar tests automatizados para garantizar la estabilidad del sistema."),

          // ANEXOS
          new Paragraph({ children: [new PageBreak()] }),
          heading("Anexos", 1),
          para("Repositorio GitHub:"),
          para("https://github.com/adamcho11/elclubdelpancito"),
          para("URL del sitio:"),
          para("https://elclubdelpancito.vercel.app"),
          para("Credenciales de prueba:"),
          para("Admin: admin@elclubdelpancito.bo / admin123"),
        ],
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  fs.writeFileSync("../SIS406-ElClubDelPancito.docx", buffer)
  console.log("Documento generado: SIS406-ElClubDelPancito.docx")
}

main().catch(console.error)
