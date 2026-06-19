import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-utils"

export async function GET() {
  try {
    await requireAdmin()
    const qr = await prisma.qrImage.findFirst({ orderBy: { id: "desc" } })
    return NextResponse.json({ qr: qr?.imagen || "" })
  } catch (err) {
    if (err instanceof Error && err.message === "Acceso denegado") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }
    return NextResponse.json({ error: "Error al obtener QR" }, { status: 500 })
  }
}

const schema = z.object({
  imagen: z.string().min(1),
})

export async function PUT(request: Request) {
  try {
    await requireAdmin()
    const body = schema.parse(await request.json())

    const qr = await prisma.qrImage.create({ data: { imagen: body.imagen } })
    return NextResponse.json({ qr: qr.imagen })
  } catch (err) {
    if (err instanceof Error && err.message === "Acceso denegado") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al guardar QR" }, { status: 500 })
  }
}
