import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"

export async function GET() {
  try {
    await requireAdmin()
    const products = await prisma.product.findMany({ orderBy: { category: "asc" } })
    return NextResponse.json(products)
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "No autorizado") return NextResponse.json({ error: "No autorizado" }, { status: 401 })
      if (err.message === "Acceso denegado") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

const productSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  shelfLife: z.string().min(1),
  image: z.string().min(1),
  price: z.number().int().min(1),
})

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = productSchema.parse(await request.json())
    const product = await prisma.product.create({ data: body })
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Acceso denegado") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    return NextResponse.json({ error: "Error al crear" }, { status: 500 })
  }
}
