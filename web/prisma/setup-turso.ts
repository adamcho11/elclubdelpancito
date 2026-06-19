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
