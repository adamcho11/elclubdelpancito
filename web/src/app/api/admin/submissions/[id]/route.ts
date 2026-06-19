import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"

const schema = z.object({
  status: z.enum(["aprobado", "rechazado"]),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = schema.parse(await request.json())

    const submission = await prisma.submission.update({
      where: { id: parseInt(id) },
      data: { status: body.status },
    })

    return NextResponse.json(submission)
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "No autorizado") return NextResponse.json({ error: "No autorizado" }, { status: 401 })
      if (err.message === "Acceso denegado") return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}
