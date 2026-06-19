import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({ orderBy: { price: "asc" } })
    const parsed = plans.map((p) => ({
      ...p,
      complements: JSON.parse(p.complements),
    }))
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

const planSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  subtitle: z.string().min(1),
  frequency: z.string().min(1),
  breadComposition: z.string().min(1),
  complements: z.array(z.string()),
  extraProduct: z.string().min(1),
  target: z.string().min(1),
  price: z.number().int().min(1),
  deliveriesPerMonth: z.number().int().min(1),
  highlighted: z.boolean().default(false),
})

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = planSchema.parse(await request.json())
    const plan = await prisma.plan.create({
      data: { ...body, complements: JSON.stringify(body.complements) },
    })
    return NextResponse.json({ ...plan, complements: JSON.parse(plan.complements) }, { status: 201 })
  } catch (err) {
    if (err instanceof Error && err.message === "Acceso denegado") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    return NextResponse.json({ error: "Error al crear" }, { status: 500 })
  }
}
