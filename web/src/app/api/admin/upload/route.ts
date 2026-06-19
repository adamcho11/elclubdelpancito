import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-utils"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "uploads"

    if (!file) return NextResponse.json({ error: "No se envió archivo" }, { status: 400 })
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Solo imágenes" }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Máximo 5 MB" }, { status: 400 })

    const ext = file.name.split(".").pop() || "webp"
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), "public", "images", folder)
    await writeFile(path.join(uploadDir, filename), buffer)

    const imagePath = `/images/${folder}/${filename}`
    return NextResponse.json({ url: imagePath }, { status: 201 })

  } catch (err) {
    if (err instanceof Error && err.message === "Acceso denegado") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }
    return NextResponse.json({ error: "Error al subir" }, { status: 500 })
  }
}
