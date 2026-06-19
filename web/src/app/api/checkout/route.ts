import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

const schema = z.object({
  plan: z.string().min(1),
  notas: z.string().optional(),
  recibo: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    const body = schema.parse(await request.json())

    const submission = await prisma.submission.create({
      data: {
        userId: session.userId,
        plan: body.plan,
        notas: body.notas || "",
        recibo: body.recibo || "",
        status: "pendiente",
      },
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (err) {
    if (err instanceof Error && err.message === "No autorizado") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al enviar" }, { status: 500 })
  }
}
