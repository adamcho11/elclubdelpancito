import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { complements } from "@/data/complements"

export async function GET() {
  try {
    const session = await requireAuth()

    const picks = await prisma.weeklyPick.findMany({
      where: { userId: session.userId },
      orderBy: { weekStart: "desc" },
      take: 10,
    })

    const history = picks.map((p) => {
      const complement = complements.find((c) => c.id === p.complementId)
      return {
        weekStart: p.weekStart,
        complementId: p.complementId,
        complementName: complement?.name || "Desconocido",
        complementPrice: complement?.price || 0,
      }
    })

    return NextResponse.json({ history })
  } catch (err) {
    if (err instanceof Error && err.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    return NextResponse.json({ error: "Error al obtener" }, { status: 500 })
  }
}
