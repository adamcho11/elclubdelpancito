import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { complements } from "@/data/complements"

function getWeekStart(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  return monday.toISOString().split("T")[0]
}

export async function GET() {
  try {
    const session = await requireAuth()
    const weekStart = getWeekStart()

    const pick = await prisma.weeklyPick.findUnique({
      where: { userId_weekStart: { userId: session.userId, weekStart } },
    })

    const complement = pick ? complements.find((c) => c.id === pick.complementId) : null

    return NextResponse.json({
      pick: pick ? { id: pick.id, complementId: pick.complementId, complement } : null,
    })
  } catch (err) {
    if (err instanceof Error && err.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    return NextResponse.json({ error: "Error al obtener" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAuth()
    const { complementId } = await request.json()
    const weekStart = getWeekStart()

    if (!complements.find((c) => c.id === complementId)) {
      return NextResponse.json({ error: "Producto inválido" }, { status: 400 })
    }

    const pastPicks = await prisma.weeklyPick.findMany({
      where: {
        userId: session.userId,
        complementId,
        weekStart: { not: weekStart },
      },
    })

    if (pastPicks.length > 0) {
      return NextResponse.json({ error: "Ya elegiste este producto en otra semana. Elegí uno distinto." }, { status: 409 })
    }

    const pick = await prisma.weeklyPick.upsert({
      where: { userId_weekStart: { userId: session.userId, weekStart } },
      update: { complementId },
      create: { userId: session.userId, complementId, weekStart },
    })

    const complement = complements.find((c) => c.id === pick.complementId)

    return NextResponse.json({
      pick: { id: pick.id, complementId: pick.complementId, complement },
    })
  } catch (err) {
    if (err instanceof Error && err.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 })
  }
}
