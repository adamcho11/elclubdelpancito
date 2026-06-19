import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [users, submissions, pending, prodCount] = await Promise.all([
      prisma.user.count(),
      prisma.submission.count(),
      prisma.submission.count({ where: { status: "pendiente" } }),
      prisma.product.count(),
    ])

    return NextResponse.json({
      users,
      totalSubmissions: submissions,
      pendingSubmissions: pending,
      totalProducts: prodCount,
    })
  } catch (err) {
    if (err instanceof Error && err.message === "Acceso denegado") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
