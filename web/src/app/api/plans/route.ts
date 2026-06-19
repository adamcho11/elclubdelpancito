import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
