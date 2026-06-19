import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"

export async function GET() {
  try { await requireAdmin(); return NextResponse.json(await prisma.plan.findMany()) }
  catch { return NextResponse.json({ error: "Acceso denegado" }, { status: 403 }) }
}

const schema = z.object({
  planId: z.string().min(1),
  name: z.string().min(1),
  subtitle: z.string().min(1),
  frequency: z.string().min(1),
  breadComposition: z.string().min(1),
  complements: z.string().min(1),
  extraProduct: z.string().min(1),
  target: z.string().min(1),
  price: z.number().int().min(1),
  deliveriesPerMonth: z.number().int().min(1),
  highlighted: z.boolean().optional(),
})

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const plan = await prisma.plan.create({ data: schema.parse(await request.json()) })
    return NextResponse.json(plan, { status: 201 })
  } catch (err) {
    if (err instanceof Error && err.message === "Acceso denegado") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
