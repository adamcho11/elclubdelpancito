"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { fetchApi } from "@/lib/api"

interface User {
  id: number
  email: string
  nombre: string
  telefono: string
  direccion?: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; nombre: string; telefono: string; direccion?: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApi("/api/auth/me")
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const data = await fetchApi("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    setUser(data)
  }

  const register = async (formData: { email: string; password: string; nombre: string; telefono: string; direccion?: string }) => {
    const data = await fetchApi("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    })
    setUser(data)
  }

  const logout = async () => {
    await fetchApi("/api/auth/logout", { method: "POST" }).catch(() => {})
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
