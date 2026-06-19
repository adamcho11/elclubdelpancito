const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface ApiError {
  error: string
}

export async function fetchApi(path: string, options: RequestInit = {}) {
  const url = `${API_URL}${path}`

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error de conexión" }))
    throw new Error(body.error || `Error ${res.status}`)
  }

  return res.json()
}
