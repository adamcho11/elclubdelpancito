import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "pancito2026-dev-secret"

export interface JwtPayload {
  userId: number
  email: string
  role: string
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload
}
