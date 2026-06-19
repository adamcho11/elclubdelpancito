import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET

if (!SECRET) {
  if (process.env.NODE_ENV === "production") {
    console.error("JWT_SECRET no está configurado en las variables de entorno")
  }
}

const secret = SECRET || "pancito2026-dev-secret"

export interface JwtPayload {
  userId: number
  email: string
  role: string
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, secret, { expiresIn: "7d" })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload
}
