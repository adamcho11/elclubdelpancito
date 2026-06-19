import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"

const updateSchema = z.object({
  slug: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  subtitle: z.string().min(1).optional(),
  frequency: z.string().min(1).optional(),
  breadComposition: z.string().min(1).optional(),
  complements: z.array(z.string()).optional(),
  extraProduct: z.string().min(1).optional(),
  target: z.string().min(1).optional(),
  price: z.number().int().min(1).optional(),
  deliveriesPerMonth: z.number().int().min(1).optional(),
  highlighted: z.boolean().optional(),
})

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = updateSchema.parse(await request.json())
    const data: Record<string, unknown> = { ...body }
    if (body.complements) data.complements = JSON.stringify(body.complements)
    const plan = await prisma.plan.update({ where: { id: parseInt(id) }, data })
    return NextResponse.json({ ...plan, complements: JSON.parse(plan.complements) })
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
    await prisma.plan.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Error && err.message === "Acceso denegado") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}
