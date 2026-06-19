import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [users, submissions, pending, prodCount, breadCount, planCount] = await Promise.all([
      prisma.user.count(),
      prisma.submission.count(),
      prisma.submission.count({ where: { status: "pendiente" } }),
      prisma.product.count(),
      prisma.bread.count(),
      prisma.plan.count(),
    ])

    return NextResponse.json({
      users,
      totalSubmissions: submissions,
      pendingSubmissions: pending,
      totalProducts: prodCount,
      totalBreads: breadCount,
      totalPlans: planCount,
    })
  } catch (err) {
    if (err instanceof Error && err.message === "Acceso denegado") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
