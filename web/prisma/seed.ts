import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
