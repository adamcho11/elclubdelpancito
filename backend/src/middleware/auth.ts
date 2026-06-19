import type { Request, Response, NextFunction } from "express"
import { verifyToken, type JwtPayload } from "../lib/jwt"

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token

  if (!token) {
    res.status(401).json({ error: "No autorizado. Iniciá sesión." })
    return
  }

  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: "Sesión expirada. Iniciá sesión de nuevo." })
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Acceso denegado. Solo administradores." })
    return
  }
  next()
}
