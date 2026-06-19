import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  ingredients: z.string().min(1).optional(),
  texture: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
})

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = updateSchema.parse(await request.json())
    const bread = await prisma.bread.update({ where: { id: parseInt(id) }, data: body })
    return NextResponse.json(bread)
  } catch (err) {
    if (err instanceof Error && err.message === "Acceso denegado") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await prisma.bread.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Error && err.message === "Acceso denegado") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}
