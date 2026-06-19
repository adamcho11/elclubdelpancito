import { NextResponse } from "next/server"
import { addSubmission } from "@/lib/store"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { nombre, telefono, direccion, plan, notas, recibo } = body

    if (!nombre || !telefono || !plan) {
      return NextResponse.json(
        { error: "Nombre, teléfono y plan son requeridos" },
        { status: 400 }
      )
    }

    const submission = addSubmission({
      nombre,
      telefono,
      direccion: direccion || "",
      plan,
      notas: notas || "",
      recibo: recibo || "",
    })

    return NextResponse.json(submission, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Error al procesar el formulario" },
      { status: 500 }
    )
  }
}
