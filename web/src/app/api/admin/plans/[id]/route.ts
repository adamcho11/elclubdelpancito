import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"

const schema = z.object({
  name: z.string().min(1).optional(),
  subtitle: z.string().min(1).optional(),
  frequency: z.string().min(1).optional(),
  breadComposition: z.string().min(1).optional(),
  complements: z.string().min(1).optional(),
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
    return NextResponse.json(await prisma.plan.update({ where: { id: parseInt(id) }, data: schema.parse(await request.json()) }))
  } catch (err) {
    if (err instanceof Error && err.message === "Acceso denegado") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
