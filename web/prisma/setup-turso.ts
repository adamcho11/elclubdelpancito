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

  console.log("Tablas creadas.")

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
