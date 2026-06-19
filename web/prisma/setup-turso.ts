import { PrismaLibSql } from "@prisma/adapter-libsql"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import "dotenv/config"

async function main() {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN

  if (!tursoUrl || !tursoToken) {
    console.log("TURSO_DATABASE_URL y TURSO_AUTH_TOKEN no configurados. Saltando.")
    return
  }

  const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken })
  const prisma = new PrismaClient({ adapter })

  console.log("Creando tablas en Turso...")

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      nombre TEXT NOT NULL,
      telefono TEXT NOT NULL,
      direccion TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Submission (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      plan TEXT NOT NULL,
      notas TEXT,
      recibo TEXT,
      status TEXT NOT NULL DEFAULT 'pendiente',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id)
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS QrImage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imagen TEXT NOT NULL
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS WeeklyPick (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      complementId TEXT NOT NULL,
      weekStart TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id),
      UNIQUE(userId, weekStart)
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      shelfLife TEXT NOT NULL,
      image TEXT NOT NULL,
      price INTEGER NOT NULL
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Bread (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      texture TEXT NOT NULL,
      role TEXT NOT NULL,
      image TEXT NOT NULL
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Plan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      planId TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      frequency TEXT NOT NULL,
      breadComposition TEXT NOT NULL,
      complements TEXT NOT NULL,
      extraProduct TEXT NOT NULL,
      target TEXT NOT NULL,
      price INTEGER NOT NULL,
      deliveriesPerMonth INTEGER NOT NULL,
      highlighted INTEGER NOT NULL DEFAULT 0
    )
  `)

  console.log("Tablas creadas.")

  // Seed products
  const products = [
    { name: "Huevos de Granja", brand: "Criollos frescos seleccionados", category: "Proteínas", description: "Huevos criollos frescos de gallinas de campo.", shelfLife: "21 a 30 días", image: "/images/complementos/huevos_granja.webp", price: 15 },
    { name: "Api Morado", brand: "Artesanal chuquisaqueño", category: "Bebidas", description: "Bebida tradicional de maíz morado hervido con canela.", shelfLife: "6 a 12 meses (en polvo)", image: "/images/complementos/api_morado.webp", price: 8 },
    { name: "Sultana Chuquisaqueña", brand: "Cáscara de cereza de café", category: "Bebidas", description: "Bebida de cáscara de cereza de café. Producto de nicho.", shelfLife: "12 meses", image: "/images/complementos/sultana.webp", price: 5 },
    { name: "Té Windsor Clásico", brand: "Windsor", category: "Bebidas", description: "Té negro aromatizado en saquitos.", shelfLife: "24 meses", image: "/images/complementos/te_windsor.webp", price: 12 },
    { name: "Té con Limón", brand: "Windsor", category: "Bebidas", description: "Té negro saborizado con limón en saquitos.", shelfLife: "24 meses", image: "/images/complementos/te_limon.webp", price: 12 },
    { name: "Manzanilla", brand: "Windsor / Frutté", category: "Bebidas", description: "Infusión herbal natural de manzanilla.", shelfLife: "18 a 24 meses", image: "/images/complementos/manzanilla.webp", price: 10 },
    { name: "Café de Especialidad Yungas", brand: "Origen boliviano", category: "Bebidas", description: "Café de altura cultivado en los Yungas.", shelfLife: "6 meses", image: "/images/complementos/cafe_copacabana.webp", price: 25 },
    { name: "Café Instantáneo", brand: "Copacabana / Nescafé", category: "Bebidas", description: "Café instantáneo en frasco o sachet.", shelfLife: "12 a 24 meses", image: "/images/complementos/cafe_instantaneo.webp", price: 18 },
    { name: "Leche Condensada", brand: "Pil / Delizia", category: "Lácteos", description: "Envase flexible con pico vertedor.", shelfLife: "12 meses", image: "/images/complementos/leche_condensada_pil.webp", price: 12 },
    { name: "Mantequilla", brand: "Pil", category: "Lácteos y Untables", description: "Mantequilla de mesa cremosa.", shelfLife: "3 a 6 meses", image: "/images/complementos/mantequilla.webp", price: 15 },
    { name: "Margarina", brand: "Regia", category: "Lácteos y Untables", description: "Margarina para untar.", shelfLife: "3 a 6 meses", image: "/images/complementos/margarina.webp", price: 8 },
    { name: "Queso Criollo", brand: "Artesanal de campo", category: "Lácteos y Untables", description: "Queso semiduro artesanal.", shelfLife: "15 a 30 días", image: "/images/complementos/queso_criollo.webp", price: 22 },
    { name: "Jamón y Mortadela", brand: "Cobolde", category: "Embutidos", description: "Jamón de pierna y mortadela.", shelfLife: "15 a 21 días", image: "/images/complementos/mortadela.webp", price: 18 },
    { name: "Pasta de Hígado", brand: "Cobolde / Gourmet", category: "Embutidos", description: "Pâté untable premium.", shelfLife: "30 a 45 días", image: "/images/complementos/pate_higado.webp", price: 12 },
    { name: "Dulce de Leche", brand: "Artesanal chuquisaqueño", category: "Untables Dulces", description: "Dulce de leche artesanal.", shelfLife: "3 a 6 meses", image: "/images/complementos/dulce_de_leche.webp", price: 18 },
    { name: "Mermelada", brand: "Orieta / Local", category: "Untables Dulces", description: "Mermelada local sin azúcar añadido.", shelfLife: "12 meses", image: "/images/complementos/mermelada.webp", price: 14 },
    { name: "Mate de Porongo", brand: "Artesanal boliviano", category: "Bebidas", description: "Recipiente tradicional de mate.", shelfLife: "Indefinido", image: "/images/complementos/mates.webp", price: 8 },
  ]

  for (const p of products) {
    const exists = await prisma.product.findFirst({ where: { name: p.name, brand: p.brand } })
    if (!exists) {
      await prisma.product.create({ data: p })
    }
  }
  console.log(`${products.length} productos sincronizados.`)

  // Seed breads
  const breads = [
    { name: "Bollo", description: "Pan clásico sucrense de miga densa y corteza crocante. El pan de cada día.", ingredients: "Harina de trigo, agua, levadura, sal, manteca", texture: "Corteza crocante, miga densa", role: "Pan de batalla", image: "/images/panes/bollo.webp" },
    { name: "K'aspa", description: "Pan crujiente y delgado, especial para acompañar sopas y guisos.", ingredients: "Harina de trigo, agua, levadura, sal, grasa", texture: "Muy crujiente, hojaldrado", role: "Acompañante", image: "/images/panes/kaspa.webp" },
    { name: "Kauka", description: "Pan integral con salvado de trigo, sabor rústico y alto contenido de fibra.", ingredients: "Harina integral, agua, levadura, sal, miel", texture: "Rústico, miga aireada", role: "Saludable", image: "/images/panes/kauka.webp" },
    { name: "Mestizo", description: "Pan mestizo de harina blanca e integral, el punto medio perfecto.", ingredients: "Harina de trigo, harina integral, agua, levadura, sal", texture: "Equilibrado, esponjoso", role: "Versátil", image: "/images/panes/mestizo.webp" },
    { name: "Sarnita", description: "Pan dulce con queso criollo rallado, tradición chuquisaqueña.", ingredients: "Harina de trigo, agua, levadura, sal, azúcar, queso criollo", texture: "Suave, dulce, con trozos de queso", role: "Desayuno", image: "/images/panes/sarnita.webp" },
  ]
  for (const b of breads) {
    const exists = await prisma.bread.findFirst({ where: { name: b.name } })
    if (!exists) await prisma.bread.create({ data: b })
  }
  console.log(`${breads.length} panes sincronizados.`)

  // Seed plans
  const plans = [
    { planId: "chuquisaqueno-diario", name: "El Chuquisaqueño Diario", subtitle: "Pan caliente cada mañana en tu puerta", frequency: "Lunes a Sábado · 6 entregas por semana", breadComposition: "10 sarnitas recién horneadas por entrega (60 sarnitas por semana a Bs. 0.50 c/u)", complements: JSON.stringify(["1 maple de huevos criollos (30 unidades, quincenal)", "1 Margarina Regia (250g, mensual)", "1 Jamón Cobolde (500g, quincenal)", "1 caja de Té con Canela Windsor (50 bolsitas, mensual)"]), extraProduct: "1 producto gratis a elección semanal (café, queso, dulce, embutido, etc.) · ¡Distinto cada semana!", target: "Familias tradicionales de Sucre", price: 65, deliveriesPerMonth: 6, highlighted: true },
    { planId: "desayuno-familiar", name: "Desayuno Familiar Chuquisaqueño", subtitle: "Variedad tradicional tres veces por semana", frequency: "Lunes, Miércoles y Viernes · 3 entregas por semana", breadComposition: "15 panes variados por entrega: 5 sarnitas, 5 mestizos y 5 k'aspas (45 panes por semana a Bs. 0.50 c/u)", complements: JSON.stringify(["1 maple de huevos criollos (30 unidades, mensual)", "1 porción de Queso Criollo (300g, quincenal)", "1 Dulce de Leche artesanal (350g, mensual)", "1 lata de Pasta de Hígado Cobolde (mensual)", "1 caja de Té con Limón Windsor (mensual)"]), extraProduct: "1 producto gratis a elección semanal (mermelada, margarina, café, etc.) · ¡Distinto cada semana!", target: "Hogares medianos", price: 82, deliveriesPerMonth: 3, highlighted: false },
    { planId: "tarde-te-bienestar", name: "Tarde de Té y Bienestar", subtitle: "La experiencia premium del té de la tarde", frequency: "Cada 7 días · 1 entrega por semana", breadComposition: "5 sarnitas, 3 bollos, 2 mestizos y 1 kauka integral por entrega (11 panes por semana a Bs. 0.50 c/u)", complements: JSON.stringify(["1 bolsa de Café de Especialidad Yungas molido (250g, mensual)", "1 Mantequilla Pil (200g, quincenal)", "1 mermelada local sin azúcar (mensual)", "1 docena de huevos criollos (quincenal)", "1 caja de Manzanilla Windsor (mensual)"]), extraProduct: "1 producto gratis a elección semanal (queso, dulce de leche, pâté, etc.) · ¡Distinto cada semana!", target: "Profesionales saludables", price: 52, deliveriesPerMonth: 1, highlighted: false },
  ]
  for (const p of plans) {
    const exists = await prisma.plan.findUnique({ where: { planId: p.planId } })
    if (!exists) await prisma.plan.create({ data: p })
  }
  console.log(`${plans.length} planes sincronizados.`)

  const password = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@elclubdelpancito.bo" },
    update: {},
    create: {
      email: "admin@elclubdelpancito.bo",
      password,
      nombre: "Admin",
      telefono: "+59175769711",
      role: "admin",
    },
  })

  console.log("Admin creado:", admin.email)
  await prisma.$disconnect()
}

main().catch(console.error)
