import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { signToken } from "@/lib/jwt"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json())

    const user = await prisma.user.findUnique({ where: { email: body.email } })
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 })
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      telefono: user.telefono,
      role: user.role,
    })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}
