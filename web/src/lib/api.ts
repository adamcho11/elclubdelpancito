export async function fetchApi(path: string, options: RequestInit = {}) {
  const res = await fetch(path, {
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
