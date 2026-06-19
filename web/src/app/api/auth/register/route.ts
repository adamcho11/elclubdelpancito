import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { signToken } from "@/lib/jwt"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nombre: z.string().min(1),
  telefono: z.string().min(1),
  direccion: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json())

    const exists = await prisma.user.findUnique({ where: { email: body.email } })
    if (exists) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        nombre: body.nombre,
        telefono: body.telefono,
        direccion: body.direccion || "",
        role: "user",
      },
    })

    const token = signToken({ userId: user.id, email: user.email, role: user.role })

    const cookieStore = await cookies()
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      telefono: user.telefono,
      role: user.role,
    }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al registrar" }, { status: 500 })
  }
}
