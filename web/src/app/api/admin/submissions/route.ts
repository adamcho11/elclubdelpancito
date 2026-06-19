import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"

export async function GET() {
  try {
    await requireAdmin()
    const submissions = await prisma.submission.findMany({
      include: {
        user: {
          select: { id: true, email: true, nombre: true, telefono: true, direccion: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(submissions)
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "No autorizado") return NextResponse.json({ error: "No autorizado" }, { status: 401 })
      if (err.message === "Acceso denegado") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }
    return NextResponse.json({ error: "Error al obtener" }, { status: 500 })
  }
}
