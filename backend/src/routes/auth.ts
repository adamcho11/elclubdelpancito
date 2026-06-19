import { Router, type Request, type Response } from "express"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { signToken } from "../lib/jwt"
import { authMiddleware } from "../middleware/auth"

const router = Router()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nombre: z.string().min(1),
  telefono: z.string().min(1),
  direccion: z.string().optional(),
})

router.post("/register", async (req: Request, res: Response) => {
  try {
    const body = registerSchema.parse(req.body)

    const exists = await prisma.user.findUnique({ where: { email: body.email } })
    if (exists) {
      res.status(409).json({ error: "El email ya está registrado" })
      return
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      telefono: user.telefono,
      role: user.role,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: "Error al registrar" })
  }
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post("/login", async (req: Request, res: Response) => {
  try {
    const body = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email: body.email } })
    if (!user) {
      res.status(401).json({ error: "Email o contraseña incorrectos" })
      return
    }

    const valid = await bcrypt.compare(body.password, user.password)
    if (!valid) {
      res.status(401).json({ error: "Email o contraseña incorrectos" })
      return
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      telefono: user.telefono,
      role: user.role,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: "Error al iniciar sesión" })
  }
})

router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, nombre: true, telefono: true, direccion: true, role: true, createdAt: true },
    })

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" })
      return
    }

    res.json(user)
  } catch {
    res.status(500).json({ error: "Error al obtener usuario" })
  }
})

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("token", { path: "/" })
  res.json({ success: true })
})

export default router
