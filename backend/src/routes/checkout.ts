import { Router, type Request, type Response } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authMiddleware } from "../middleware/auth"

const router = Router()

const checkoutSchema = z.object({
  plan: z.string().min(1),
  notas: z.string().optional(),
  recibo: z.string().optional(),
})

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const body = checkoutSchema.parse(req.body)

    const submission = await prisma.submission.create({
      data: {
        userId: req.user!.userId,
        plan: body.plan,
        notas: body.notas || "",
        recibo: body.recibo || "",
        status: "pendiente",
      },
    })

    res.status(201).json(submission)
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message })
      return
    }
    res.status(500).json({ error: "Error al enviar el comprobante" })
  }
})

router.get("/mine", authMiddleware, async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.submission.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
    })

    res.json(submissions)
  } catch {
    res.status(500).json({ error: "Error al obtener comprobantes" })
  }
})

export default router
