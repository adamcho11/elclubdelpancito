import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const qr = await prisma.qrImage.findFirst({ orderBy: { id: "desc" } })
    return NextResponse.json({ qr: qr?.imagen || "" })
  } catch {
    return NextResponse.json({ error: "Error al obtener QR" }, { status: 500 })
  }
}
