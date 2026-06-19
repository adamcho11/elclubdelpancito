# EL CLUB DEL PANCITO

**Sistema de Comercio Electrónico por Suscripción para Panadería Artesanal**

---

## Carátula

| Campo | Valor |
|-------|-------|
| **Carrera** | Ingeniería Informática |
| **Facultad** | Facultad de Ciencias y Tecnología |
| **Universidad** | Universidad Mayor, Real y Pontificia de San Francisco Xavier de Chuquisaca |
| **Título del Proyecto** | Sistema de Comercio Electrónico por Suscripción para Panadería Artesanal "El Club del Pancito" |
| **Nombre del Estudiante** | Adam Leanos |
| **Fecha** | Junio 2026 |
| **URL del Proyecto** | https://elclubdelpancito.vercel.app |

---

## 1. Introducción

El comercio electrónico ha transformado la forma en que las empresas interactúan con sus clientes. En Bolivia, y particularmente en Sucre, la adopción de canales digitales para la venta de productos de consumo diario representa una oportunidad significativa. El pan artesanal chuquisaqueño, producto emblemático de la gastronomía local, carece de plataformas modernas que combinen la tradición panadera con modelos de negocio digitales.

El presente proyecto aborda la **problemática** de la comercialización digital de pan artesanal en Sucre mediante un sistema de suscripción flexible con entrega a domicilio. Se buscó resolver la ausencia de una plataforma web que permita a los clientes suscribirse a planes de panadería, gestionar pagos mediante QR y seleccionar productos complementarios de manera intuitiva.

**Lo que se hizo:** se diseñó y desarrolló un sitio web completo con panel de administración, sistema de autenticación, pasarela de pago QR, integración con Google Analytics y Tag Manager, chat en vivo, botón de WhatsApp flotante, y una base de datos en la nube con Turso. El backend y frontend están integrados en una sola aplicación Next.js desplegada en Vercel.

**Pasos seguidos:**
1. Diseño de la arquitectura del sistema (frontend + backend + base de datos)
2. Desarrollo del frontend con Next.js 16, React 19 y Tailwind CSS v4
3. Implementación del backend con Next.js API Routes y Prisma ORM
4. Configuración de base de datos SQLite en Turso (cloud)
5. Integración de autenticación con JWT y cookies seguras
6. Implementación del flujo de checkout con pasarela de pago QR Simple
7. Integración de Google Tag Manager, Google Analytics y Tawk.to
8. Despliegue en Vercel con CI/CD automático desde GitHub

**Resultados obtenidos:** un sitio web completamente funcional con 24 rutas, panel de administración con CRUD de productos, panes y planes, dashboard de estadísticas, sistema de validación de comprobantes y más de 15 páginas responsive.

---

## 2. Antecedentes

### 2.1 Comercio electrónico en Bolivia

El comercio electrónico en Bolivia ha experimentado un crecimiento sostenido en los últimos años, impulsado por la pandemia del COVID-19 y la creciente penetración de smartphones. Según la Cámara Nacional de Comercio, el e-commerce boliviano creció más del 40% entre 2020 y 2023.

Los métodos de pago digital más utilizados en Bolivia incluyen:
- QR Simple (el más extendido)
- Tigo Money
- Libélula
- Red Enlace
- Transferencias bancarias

### 2.2 Panaderías con presencia digital en Sucre

En Sucre, la mayoría de las panaderías operan con modelos tradicionales: venta presencial en tienda física o, en el mejor de los casos, pedidos por WhatsApp con catálogos enviados manualmente. No existe un sistema de suscripción automatizado para panadería artesanal en la ciudad.

Los sistemas de suscripción de alimentos (meal kits, panaderías) son comunes en mercados como Estados Unidos y Europa (HelloFresh, Wildgrain), pero son prácticamente inexistentes en Bolivia. El Club del Pancito busca llenar ese vacío adaptando el modelo de suscripción al contexto chuquisaqueño.

### 2.3 Tecnologías utilizadas en proyectos similares

A nivel global, las plataformas de e-commerce por suscripción utilizan stacks como Shopify + plugins, WooCommerce + suscripciones, o desarrollos a medida con Next.js/Node.js. El Club del Pancito opta por un stack moderno y liviano: Next.js como solución full-stack con SQLite en la nube, eliminando la necesidad de múltiples servidores y reduciendo costos operativos.

---

## 3. Objetivos

### 3.1 Objetivo General

Desarrollar un sistema de comercio electrónico por suscripción para la panadería artesanal "El Club del Pancito" que permita a los clientes de Sucre gestionar sus suscripciones, realizar pagos mediante QR y seleccionar productos complementarios, con un panel de administración completo para la gestión del negocio.

### 3.2 Objetivos Específicos

1. Diseñar e implementar una interfaz de usuario responsive y temática con Tailwind CSS v4.
2. Desarrollar un sistema de autenticación con registro, inicio de sesión y roles (usuario/administrador) utilizando JWT y cookies httpOnly.
3. Implementar un flujo de checkout multi-paso con selección de plan, producto semanal gratuito, productos extra con precios dinámicos y pasarela de pago QR Simple.
4. Crear un panel de administración con dashboard de estadísticas, CRUD de productos, panes y planes, y gestión de comprobantes de pago.
5. Integrar herramientas de analítica y comunicación: Google Analytics, Google Tag Manager, Tawk.to (chat en vivo) y botón de WhatsApp.
6. Optimizar el SEO mediante metadatos OpenGraph, Twitter Cards, sitemap.xml, robots.txt, y datos estructurados JSON-LD.
7. Desplegar el sistema en Vercel con integración continua desde GitHub y base de datos persistente en Turso.
8. Implementar protección de rutas mediante proxy server-side de Next.js.

---

## 4. Herramientas

### 4.1 Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.2.7 |
| **Lenguaje** | TypeScript | 5.x (strict) |
| **Frontend** | React | 19.2.4 |
| **Estilos** | Tailwind CSS | v4 (custom theme) |
| **ORM** | Prisma | 6.19.3 |
| **Base de Datos** | Turso (SQLite cloud) | - |
| **Despliegue** | Vercel | - |
| **Control de Versiones** | Git + GitHub | - |

### 4.2 Autenticación y Seguridad

| Herramienta | Versión | Uso |
|------------|---------|-----|
| **jsonwebtoken** | 9.x | Generación y verificación de tokens JWT |
| **bcryptjs** | 3.x | Hashing de contraseñas |
| **Cookies httpOnly** | - | Almacenamiento seguro del token de sesión |

### 4.3 Plugins y herramientas externas

| Herramienta | Tipo | Función |
|------------|------|---------|
| **Google Analytics 4** | Analítica | Tracking de visitas (G-BGZ9ZJGCQM) |
| **Google Tag Manager** | Gestión de etiquetas | Contenedor de scripts (GTM-WLLJ2MVS) |
| **Tawk.to** | Chat en vivo | Atención al cliente en tiempo real |
| **WhatsApp Business** | Mensajería | Botón flotante y contacto directo (+59175769711) |
| **QR Simple** | Método de pago | Pasarela de pago mediante código QR |
| **@next/third-parties** | Librería | Integración oficial de Google Analytics con Next.js |

### 4.4 Otras herramientas

| Herramienta | Uso |
|------------|-----|
| **Zod** | Validación de esquemas en API routes |
| **ESLint v9** | Linting con reglas de Next.js y TypeScript |
| **dotenv** | Gestión de variables de entorno |
| **@prisma/adapter-libsql** | Adaptador de Prisma para Turso |
| **@libsql/client** | Cliente nativo de Turso |

### 4.5 SEO y rendimiento

- **Metadatos OpenGraph** y **Twitter Cards** en todas las páginas
- **JSON-LD Structured Data** con schema `Bakery` para Google Rich Results
- **Sitemap.xml** y **robots.txt** dinámicos
- **Server Components** por defecto para mejor rendimiento
- **Imágenes optimizadas** con `next/image`

---

## 5. Modelo de Ingresos

El Club del Pancito opera bajo un **modelo de suscripción semanal** con tres planes diferenciados por precio y frecuencia:

| Plan | Precio (Bs./sem) | Entregas/sem | Público objetivo |
|------|-----------------|-------------|------------------|
| **El Chuquisaqueño Diario** | 65 | 6 (Lun-Sáb) | Familias tradicionales |
| **Desayuno Familiar** | 82 | 3 (Lun, Mié, Vie) | Hogares medianos |
| **Tarde de Té y Bienestar** | 52 | 1 (semanal) | Profesionales saludables |

### Ingresos adicionales

1. **Productos extra opcionales**: cada plan incluye 1 producto gratis semanal (distinto cada semana). El cliente puede agregar productos extra pagos con precios desde Bs. 5 hasta Bs. 25.
2. **Venta de complementos**: los productos disponibles (café, queso, embutidos, mermeladas, etc.) pueden adquirirse por separado como extras semanales.

### Flujo de pago

1. Cliente selecciona plan → elige producto semanal gratis → agrega extras opcionales
2. Visualiza el total (plan + extras)
3. Escanea QR Simple con su app bancaria
4. Realiza el pago y guarda el comprobante
5. Sube el comprobante al sitio
6. Administrador revisa, valida y aprueba el pago
7. Se inicia la entrega

---

## 6. Descripción del Sitio

### 6.1 Vista del Usuario (Cliente)

El sitio cuenta con las siguientes secciones para el cliente final:

**Páginas públicas:**
- **Inicio**: hero con imágenes de panes chuquisaqueños, sección "Cómo funciona" con 4 pasos visuales, vista previa de planes, CTA de suscripción.
- **Productos**: catálogo de panes artesanales (bollo, k'aspa, kauka, mestizo, sarnita) y complementos categorizados (bebidas, lácteos, proteínas, untables).
- **Planes**: los tres planes de suscripción con detalle completo (frecuencia, composición de pan, complementos incluidos, precio).
- **Nosotros**: historia de la panadería, tradición chuquisaqueña, datos de cobertura en Sucre.
- **FAQ**: preguntas frecuentes con acordeón interactivo sobre entregas, pagos, pausas y cancelaciones.

**Páginas con autenticación:**
- **Login / Registro**: formularios de acceso y creación de cuenta con validación en tiempo real.
- **Checkout**: wizard de 5 pasos con barra de progreso (Plan → Producto semanal → Extras → Revisar → Pago con QR + comprobante).
- **Panel de usuario**: selector de producto semanal gratuito, historial de productos elegidos por semana, estado de comprobantes enviados (pendiente/aprobado/rechazado).

**Elementos globales:**
- Navbar con navegación completa y botón de "Suscribirme"
- Footer con enlaces, contacto (email, WhatsApp, TikTok, Facebook)
- Botón flotante de WhatsApp (animado, aparece con scroll)
- Chat en vivo Tawk.to (esquina inferior derecha)

### 6.2 Vista del Administrador

El panel de administración (`/admin`) está protegido por autenticación con rol `admin` y contiene 6 pestañas:

1. **Dashboard**: tarjetas con estadísticas (usuarios registrados, total de comprobantes, pendientes de revisión, panes, productos, planes).
2. **Comprobantes**: listado de comprobantes enviados por clientes con botones para aprobar/rechazar y visor de imagen del comprobante.
3. **Panes**: CRUD completo de panes artesanales (nombre, descripción, ingredientes, textura, imagen).
4. **Productos**: CRUD completo de complementos (nombre, marca, categoría, descripción, precio).
5. **Planes**: CRUD completo de planes de suscripción (nombre, precio, frecuencia, complementos incluidos, destacado).
6. **QR de pago**: visualización del QR actual y subida de nuevo QR Simple.

### 6.3 Capturas de pantalla

*(Insertar capturas del sitio: Home, Productos, Planes, Checkout, Panel admin, Dashboard)*

---

## 7. Conexión con Redes Sociales

El sitio integra las siguientes redes sociales y canales de comunicación:

| Plataforma | URL | Ubicación en el sitio |
|-----------|-----|----------------------|
| **TikTok** | https://www.tiktok.com/@adamchos | Footer (enlace directo) |
| **Facebook** | https://www.facebook.com/profile.php?id=61591090827056 | Footer (enlace directo) |
| **WhatsApp** | +59175769711 | Botón flotante + Footer + FAQ |

### Funcionalidades de mensajería

- **Tawk.to**: chat en vivo integrado en todas las páginas para atención al cliente en tiempo real.
- **WhatsApp flotante**: botón con animación de aparición al hacer scroll, con mensaje predefinido para consultas sobre suscripciones.
- **Contacto directo**: enlace de WhatsApp en la página de FAQ y en la sección de contacto del footer.

---

## 8. Método de Pago

### QR Simple

El método de pago implementado es **QR Simple**, la pasarela de pago más utilizada en Bolivia por su simplicidad y compatibilidad con todas las apps bancarias (Banco Unión, BNB, BCP, etc.).

**Flujo de pago:**
1. El cliente selecciona su plan y extras, viendo el total a pagar.
2. El sistema muestra un código QR estático (configurable por el administrador desde el panel).
3. El cliente escanea el QR con su app bancaria y realiza el pago por el monto indicado.
4. Guarda el comprobante de pago (captura de pantalla).
5. Sube la imagen del comprobante al formulario de checkout.
6. El comprobante se envía al backend y queda registrado con estado "pendiente".
7. El administrador revisa la imagen del comprobante desde el panel de administración.
8. El administrador aprueba o rechaza el pago.
9. El cliente puede ver el estado de su comprobante en su panel de usuario.

**Ventajas de QR Simple:**
- No requiere integración de API bancaria
- Compatible con todas las entidades financieras bolivianas
- Sin costo de transacción para el comercio
- Flujo de validación manual que evita fraudes

---

## 9. Conclusiones y Recomendaciones

### 9.1 Conclusiones

1. Se desarrolló exitosamente un sistema de comercio electrónico por suscripción completo para panadería artesanal, funcional y desplegado en producción.
2. La arquitectura full-stack con Next.js permitió integrar frontend y backend en una sola aplicación, simplificando el despliegue y reduciendo costos a Bs. 0 mensuales.
3. La base de datos Turso (SQLite cloud) demostró ser una alternativa viable y gratuita para proyectos de pequeña y mediana escala, eliminando la necesidad de servidores de base de datos tradicionales.
4. El flujo de pago mediante QR Simple es adecuado para el mercado boliviano, donde la validación manual de comprobantes sigue siendo una práctica común y confiable.
5. La integración de herramientas de analítica (Google Analytics, Tag Manager) y comunicación (Tawk.to, WhatsApp) proporciona una base sólida para la operación comercial del sitio.

### 9.2 Recomendaciones

1. **Automatización de pagos**: integrar una API bancaria oficial (cuando esté disponible en Bolivia) para automatizar la validación de comprobantes y eliminar la revisión manual.
2. **Notificaciones**: implementar notificaciones push y por email para informar a los clientes sobre el estado de sus pagos y entregas.
3. **Panel de entregas**: agregar un módulo de logística para gestionar rutas de entrega y confirmación de recepción.
4. **Aplicación móvil**: desarrollar una PWA o aplicación nativa para mejorar la experiencia en dispositivos móviles.
5. **Pasarela de pago alternativa**: explorar la integración con Tigo Money como método de pago complementario al QR Simple.
6. **Stock e inventario**: implementar control de inventario en tiempo real para los productos complementarios.
7. **Tests automatizados**: agregar tests unitarios y de integración para garantizar la estabilidad del sistema ante futuros cambios.

---

## Anexos

### A. Repositorio
https://github.com/adamcho11/elclubdelpancito

### B. URL del sitio
https://elclubdelpancito.vercel.app

### C. Credenciales de prueba
- **Admin**: admin@elclubdelpancito.bo / admin123
- **Panel admin**: https://elclubdelpancito.vercel.app/admin

### D. Variables de entorno requeridas (Vercel)
```
TURSO_DATABASE_URL
TURSO_AUTH_TOKEN
JWT_SECRET
```
