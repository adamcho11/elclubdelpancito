import { NextResponse } from "next/server"
import { getQrImage, setQrImage } from "@/lib/store"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 })
}

export async function GET() {
  const qr = getQrImage()
  return NextResponse.json({ qr })
}

export async function PUT(request: Request) {
  const password = request.headers.get("x-admin-password")
  if (password !== ADMIN_PASSWORD) return unauthorized()

  try {
    const body = await request.json()
    const { qr } = body

    if (!qr || typeof qr !== "string") {
      return NextResponse.json({ error: "QR inválido" }, { status: 400 })
    }

    if (qr.length > 2_000_000) {
      return NextResponse.json({ error: "Imagen demasiado grande (máx. 2 MB)" }, { status: 400 })
    }

    setQrImage(qr)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al guardar el QR" }, { status: 500 })
  }
}
