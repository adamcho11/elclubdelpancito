import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"

export async function GET() {
  try {
    const breads = await prisma.bread.findMany({ orderBy: { name: "asc" } })
    return NextResponse.json(breads)
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

const breadSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  ingredients: z.string().min(1),
  texture: z.string().min(1),
  role: z.string().min(1),
  image: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = breadSchema.parse(await request.json())
    const bread = await prisma.bread.create({ data: body })
    return NextResponse.json(bread, { status: 201 })
  } catch (err) {
    if (err instanceof Error && err.message === "Acceso denegado") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    return NextResponse.json({ error: "Error al crear" }, { status: 500 })
  }
}
