---
name: webapp-dev
description: Desarrollo de webapp con Next.js 16, React 19, TypeScript strict y Tailwind CSS v4. Usar para agregar features, componentes, páginas o refactorizar código del frontend.
---

## Stack del proyecto

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Lenguaje | TypeScript 5 (`strict: true`) |
| Estilos | Tailwind CSS v4 (`@theme inline`) |
| Linting | ESLint v9 (flat config: `next/core-web-vitals` + `next/typescript`) |
| Package manager | npm |
| Deploy | Vercel |

## Comandos

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run lint     # Ejecutar ESLint
npm run start    # Iniciar build de producción
```

## Estructura del proyecto

```
web/
  src/
    app/              # Rutas del App Router
      layout.tsx       # Layout raíz (Navbar + Footer)
      page.tsx         # Home
      productos/       # /productos
      planes/          # /planes
      nosotros/        # /nosotros
      faq/             # /faq
      globals.css      # Tema + utilities Tailwind
    components/        # Componentes reutilizables
    data/              # Datos estáticos (productos, planes, FAQs, etc.)
    lib/               # Utilidades (vacío por ahora)
  public/images/       # Imágenes (.webp)
```

## Convenciones de componentes

- **Server Components por defecto**: todo componente nuevo es server component a menos que necesite interactividad.
- Si necesita `useState`, `useEffect`, `usePathname` o eventos del cliente → agregar `"use client"` al inicio del archivo.
- Seguir el patrón de los componentes existentes: interfaces tipadas con TypeScript, props desestructuradas.
- Imágenes con `<Image>` de `next/image`, usando el patrón `fill` con contenedor `relative`.

## Convenciones de estilos

### Tokens de color del tema (Tailwind v4)

El tema personalizado de la panadería está en `globals.css`. Tokens disponibles:

- **oven-50** a **oven-950**: marrones oscuros (fondo principal)
- **ember** / **ember-light** / **ember-dark**: naranjas cálidos (acento primario)
- **crust** / **crust-light** / **crust-dark**: dorados (acento secundario)
- **cream** / **cream-light** / **cream-dark** / **cream-muted**: cremas (texto/fondos claros)

### Utilidades predefinidas

- `bg-gradient-ember`, `bg-gradient-oven`, `text-gradient-ember`: gradientes temáticos
- `glow-ember`, `glow-crust`: efectos de brillo/sombra

## Datos y contenido

- Los datos estáticos van en `web/src/data/` como archivos `.ts` que exportan arrays tipados con interfaces.
- Todo el contenido está en español (Bolivia).
- No hay CMS ni base de datos todavía.

## Reglas

1. **NUNCA** agregar comentarios a menos que se pidan explícitamente.
2. **SIEMPRE** correr `npm run lint` después de hacer cambios.
3. Mantener consistencia con el código existente: mismos patrones, mismos imports, mismo estilo.
4. No instalar librerías nuevas sin antes verificar si ya existe algo similar en el proyecto.
5. Los componentes "use client" solo cuando sea estrictamente necesario (interactividad, hooks de React, eventos).
6. Las imágenes nuevas deben ser `.webp` y colocarse en `web/public/images/`.
7. Respetar el `tsconfig.json` strict: todas las props deben estar tipadas.
