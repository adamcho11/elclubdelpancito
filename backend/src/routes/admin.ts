import { Router, type Request, type Response } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware, adminMiddleware } from "../middleware/auth"

const router = Router()

router.get("/submissions", authMiddleware, adminMiddleware, async (_req: Request, res: Response) => {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        user: {
          select: { id: true, email: true, nombre: true, telefono: true, direccion: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    res.json(submissions)
  } catch {
    res.status(500).json({ error: "Error al obtener submissions" })
  }
})

const updateSchema = z.object({
  status: z.enum(["aprobado", "rechazado"]),
})

router.put("/submissions/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const body = updateSchema.parse(req.body)

    const submission = await prisma.submission.update({
      where: { id: parseInt(id) },
      data: { status: body.status },
    })

    res.json(submission)
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: "Error al actualizar" })
  }
})

const qrSchema = z.object({
  imagen: z.string().min(1),
})

router.get("/qr", authMiddleware, adminMiddleware, async (_req: Request, res: Response) => {
  try {
    const qr = await prisma.qrImage.findFirst({ orderBy: { id: "desc" } })
    res.json({ qr: qr?.imagen || "" })
  } catch {
    res.status(500).json({ error: "Error al obtener QR" })
  }
})

router.put("/qr", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const body = qrSchema.parse(req.body)

    const qr = await prisma.qrImage.create({
      data: { imagen: body.imagen },
    })

    res.json({ qr: qr.imagen })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: "Error al guardar QR" })
  }
})

export default router
