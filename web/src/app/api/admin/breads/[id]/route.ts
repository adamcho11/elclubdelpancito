import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"

const schema = z.object({
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
    return NextResponse.json(await prisma.bread.update({ where: { id: parseInt(id) }, data: schema.parse(await request.json()) }))
  } catch (err) {
    if (err instanceof Error && err.message === "Acceso denegado") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await prisma.bread.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
