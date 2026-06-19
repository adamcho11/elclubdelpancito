import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

export async function GET() {
  try {
    const session = await requireAuth()
    const submissions = await prisma.submission.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(submissions)
  } catch (err) {
    if (err instanceof Error && err.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    return NextResponse.json({ error: "Error al obtener" }, { status: 500 })
  }
}
