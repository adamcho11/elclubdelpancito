import { cookies } from "next/headers"
import { verifyToken, type JwtPayload } from "./jwt"

export async function getSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null
  try {
    return verifyToken(token)
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<JwtPayload> {
  const session = await getSession()
  if (!session) throw new AuthError("No autorizado")
  return session
}

export async function requireAdmin(): Promise<JwtPayload> {
  const session = await requireAuth()
  if (session.role !== "admin") throw new AuthError("Acceso denegado")
  return session
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthError"
  }
}
