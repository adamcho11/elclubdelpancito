"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "@/components/AuthProvider"
import { fetchApi } from "@/lib/api"

interface SubmissionItem {
  id: number
  plan: string
  status: string
  notas: string
  recibo: string
  createdAt: string
  user: { id: number; email: string; nombre: string; telefono: string; direccion?: string }
}

interface ProductItem {
  id: number
  name: string
  brand: string
  category: string
  description: string
  shelfLife: string
  image: string
  price: number
}

interface Stats {
  users: number
  totalSubmissions: number
  pendingSubmissions: number
  totalProducts: number
}

const TABS = ["Dashboard", "Comprobantes", "Productos", "QR"]

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const [tab, setTab] = useState(0)
  const [stats, setStats] = useState<Stats | null>(null)
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [products, setProducts] = useState<ProductItem[]>([])
  const [qrPreview, setQrPreview] = useState("")
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [selectedSub, setSelectedSub] = useState<SubmissionItem | null>(null)
  const [editProduct, setEditProduct] = useState<ProductItem | null>(null)
  const [newProduct, setNewProduct] = useState(false)
  const [form, setForm] = useState({ name: "", brand: "", category: "", description: "", shelfLife: "", image: "", price: 0 })

  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== "admin") return

    Promise.all([
      fetchApi("/api/admin/stats").catch(() => null),
      fetchApi("/api/admin/submissions").catch(() => []),
      fetchApi("/api/admin/products").catch(() => []),
      fetchApi("/api/admin/qr").catch(() => ({ qr: "" })),
    ]).then(([s, sub, prod, qr]) => {
      setStats(s as Stats | null)
      setSubmissions((sub || []) as SubmissionItem[])
      setProducts((prod || []) as ProductItem[])
      setQrPreview((qr as { qr: string })?.qr || "")
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user, authLoading])

  const refreshProducts = () => {
    fetchApi("/api/admin/products").then((p) => setProducts(p || [])).catch(() => {})
  }

  const handleStatus = async (id: number, status: "aprobado" | "rechazado") => {
    try {
      await fetchApi(`/api/admin/submissions/${id}`, { method: "PUT", body: JSON.stringify({ status }) })
      setMsg(`Comprobante ${status}`)
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
    } catch (err) { setError(err instanceof Error ? err.message : "Error") }
  }

  const saveProduct = async () => {
    setSaving(true)
    setError("")
    try {
      if (editProduct) {
        await fetchApi(`/api/admin/products/${editProduct.id}`, { method: "PUT", body: JSON.stringify(form) })
        setMsg("Producto actualizado")
      } else {
        await fetchApi("/api/admin/products", { method: "POST", body: JSON.stringify(form) })
        setMsg("Producto creado")
      }
      setEditProduct(null)
      setNewProduct(false)
      refreshProducts()
    } catch (err) { setError(err instanceof Error ? err.message : "Error") }
    finally { setSaving(false) }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return
    try {
      await fetchApi(`/api/admin/products/${id}`, { method: "DELETE" })
      setMsg("Producto eliminado")
      refreshProducts()
    } catch (err) { setError(err instanceof Error ? err.message : "Error") }
  }

  const openEdit = (p: ProductItem) => {
    setEditProduct(p)
    setNewProduct(false)
    setForm({ name: p.name, brand: p.brand, category: p.category, description: p.description, shelfLife: p.shelfLife, image: p.image, price: p.price })
  }

  const openNew = () => {
    setNewProduct(true)
    setEditProduct(null)
    setForm({ name: "", brand: "", category: "", description: "", shelfLife: "", image: "", price: 0 })
  }

  const handleQrFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError("Máx 2 MB"); return }
    const reader = new FileReader()
    reader.onloadend = () => setQrPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const saveQr = async () => {
    setSaving(true)
    try {
      await fetchApi("/api/admin/qr", { method: "PUT", body: JSON.stringify({ imagen: qrPreview }) })
      setMsg("QR guardado")
    } catch (err) { setError(err instanceof Error ? err.message : "Error") }
    finally { setSaving(false) }
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-oven-950"><div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" /></div>
  if (!user || user.role !== "admin") return <div className="min-h-screen flex items-center justify-center bg-oven-950"><p className="text-cream-dark/60">Acceso denegado</p></div>

  const statusBadge = (s: string) => {
    switch (s) {
      case "aprobado": return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30">Aprobado</span>
      case "rechazado": return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-600/20 text-red-400 border border-red-600/30">Rechazado</span>
      default: return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-600/20 text-amber-400 border border-amber-600/30">Pendiente</span>
    }
  }

  return (
    <div className="min-h-screen bg-oven-950">
      <section className="py-12 sm:py-16 bg-gradient-oven border-b border-oven-700/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-cream-light">Admin</h1>
            <span className="text-cream-dark/50 text-sm">{user.email}</span>
          </div>
          <div className="flex gap-1 bg-oven-900 rounded-xl p-1 overflow-x-auto">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === i ? "bg-ember text-white" : "text-cream-dark/60 hover:text-cream-light"}`}>{t}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          {msg && <div className="mb-4 p-3 rounded-xl bg-emerald-900/20 border border-emerald-700/30 text-emerald-400 text-sm text-center" onClick={() => setMsg("")}>{msg}</div>}
          {error && <div className="mb-4 p-3 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 text-sm text-center" onClick={() => setError("")}>{error}</div>}

          {/* Dashboard */}
          {tab === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Usuarios", value: stats?.users || 0, color: "text-ember" },
                { label: "Comprobantes", value: stats?.totalSubmissions || 0, color: "text-crust-light" },
                { label: "Pendientes", value: stats?.pendingSubmissions || 0, color: "text-amber-400" },
                { label: "Productos", value: stats?.totalProducts || 0, color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl bg-gradient-card border border-oven-600/20 text-center">
                  <p className={`text-2xl sm:text-3xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-cream-dark/50 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Submissions */}
          {tab === 1 && (
            <div className="space-y-2">
              {loading ? <p className="text-center py-8 text-cream-dark/50">Cargando...</p> :
               submissions.length === 0 ? <p className="text-center py-8 text-cream-dark/60">No hay comprobantes.</p> :
               submissions.map((sub) => (
                <div key={sub.id} className="p-3 sm:p-4 rounded-xl bg-gradient-card border border-oven-600/20">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="text-cream-light text-sm font-medium">{sub.plan}</p>
                      <p className="text-cream-dark/60 text-xs">{sub.user.nombre} · {sub.user.telefono} · {sub.user.email}</p>
                      <p className="text-cream-muted/50 text-xs">{new Date(sub.createdAt).toLocaleDateString("es-BO", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {statusBadge(sub.status)}
                      {sub.recibo && <button onClick={() => setSelectedSub(sub)} className="text-xs text-ember hover:text-ember-light">Ver</button>}
                    </div>
                  </div>
                  {sub.status === "pendiente" && (
                    <div className="flex gap-2 pt-2 border-t border-oven-600/20">
                      <button onClick={() => handleStatus(sub.id, "aprobado")} className="px-3 py-1.5 bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 text-xs rounded-lg hover:bg-emerald-600/30">Aprobar</button>
                      <button onClick={() => handleStatus(sub.id, "rechazado")} className="px-3 py-1.5 bg-red-600/20 border border-red-600/30 text-red-400 text-xs rounded-lg hover:bg-red-600/30">Rechazar</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Products */}
          {tab === 2 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-cream-light font-semibold">{products.length} productos</h2>
                <button onClick={openNew} className="px-4 py-2 bg-gradient-ember text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-ember/25 transition-all">+ Nuevo</button>
              </div>

              {(newProduct || editProduct) && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-card border border-ember/20 space-y-3">
                  <h3 className="text-cream-light font-semibold text-sm">{editProduct ? "Editar producto" : "Nuevo producto"}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Nombre" className="px-3 py-2 bg-oven-900 border border-oven-600/40 rounded-lg text-cream-light text-sm placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60" />
                    <input value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})} placeholder="Marca" className="px-3 py-2 bg-oven-900 border border-oven-600/40 rounded-lg text-cream-light text-sm placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60" />
                    <input value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} placeholder="Categoría" className="px-3 py-2 bg-oven-900 border border-oven-600/40 rounded-lg text-cream-light text-sm placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60" />
                    <input type="number" value={form.price} onChange={(e) => setForm({...form, price: parseInt(e.target.value) || 0})} placeholder="Precio (Bs.)" className="px-3 py-2 bg-oven-900 border border-oven-600/40 rounded-lg text-cream-light text-sm placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60" />
                    <input value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} placeholder="Ruta imagen" className="px-3 py-2 bg-oven-900 border border-oven-600/40 rounded-lg text-cream-light text-sm placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60" />
                    <input value={form.shelfLife} onChange={(e) => setForm({...form, shelfLife: e.target.value})} placeholder="Vida útil" className="px-3 py-2 bg-oven-900 border border-oven-600/40 rounded-lg text-cream-light text-sm placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60" />
                  </div>
                  <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} placeholder="Descripción" className="w-full px-3 py-2 bg-oven-900 border border-oven-600/40 rounded-lg text-cream-light text-sm placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60 resize-none" />
                  <div className="flex gap-2">
                    <button onClick={saveProduct} disabled={saving} className="px-4 py-2 bg-gradient-ember text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-ember/25 transition-all disabled:opacity-50">{saving ? "Guardando..." : "Guardar"}</button>
                    <button onClick={() => { setEditProduct(null); setNewProduct(false) }} className="px-4 py-2 border border-oven-500/30 text-cream-dark/60 text-sm rounded-lg hover:text-cream-light transition-all">Cancelar</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {loading ? <p className="text-center py-8 text-cream-dark/50">Cargando...</p> :
                 products.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-gradient-card border border-oven-600/20 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-cream-light text-sm">{p.name} <span className="text-cream-dark/50 text-xs">· {p.brand}</span></p>
                      <p className="text-cream-dark/50 text-xs">{p.category} · Bs. {p.price}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openEdit(p)} className="px-3 py-1 text-xs text-ember hover:bg-ember/10 rounded-lg transition-all">Editar</button>
                      <button onClick={() => deleteProduct(p.id)} className="px-3 py-1 text-xs text-red-400 hover:bg-red-400/10 rounded-lg transition-all">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QR */}
          {tab === 3 && (
            <div className="space-y-6">
              <h2 className="text-cream-light font-semibold">QR de pago</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="p-4 rounded-xl bg-gradient-card border border-oven-600/20 text-center">
                  <p className="text-cream-dark/60 text-xs mb-3">Actual</p>
                  <div className="relative w-40 h-40 mx-auto rounded-xl bg-white border border-oven-600/30 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {qrPreview ? <img src={qrPreview} alt="QR" className="w-full h-full object-contain" /> : <Image src="/images/qr-pago.PNG" alt="QR" fill className="object-contain p-2" unoptimized />}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-card border border-oven-600/20 flex-1">
                  <p className="text-cream-dark/60 text-xs mb-3">Subir nuevo</p>
                  <input type="file" accept="image/*" onChange={handleQrFile} className="mb-3 text-cream-dark/60 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-ember file:text-white hover:file:bg-ember-light transition-all" />
                  <button onClick={saveQr} disabled={saving} className="px-4 py-2 bg-gradient-ember text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-ember/25 transition-all disabled:opacity-50">{saving ? "Guardando..." : "Guardar QR"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {selectedSub?.recibo && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setSelectedSub(null)}>
          <div className="relative max-w-lg w-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedSub(null)} className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm">Cerrar</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedSub.recibo} alt="Comprobante" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  )
}
