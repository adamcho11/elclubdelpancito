import { Router, type Request, type Response } from "express"
import { prisma } from "../lib/prisma"

const router = Router()

router.get("/", async (_req: Request, res: Response) => {
  try {
    const qr = await prisma.qrImage.findFirst({ orderBy: { id: "desc" } })
    res.json({ qr: qr?.imagen || "" })
  } catch {
    res.status(500).json({ error: "Error al obtener QR" })
  }
})

export default router
