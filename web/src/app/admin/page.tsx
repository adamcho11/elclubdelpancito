"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useAuth } from "@/components/AuthProvider"

const BASE = ""

interface SubmissionItem {
  id: number; plan: string; status: string; notas: string; recibo: string; createdAt: string
  user: { id: number; email: string; nombre: string; telefono: string; direccion?: string }
}
interface ProductItem { id: number; name: string; brand: string; category: string; description: string; shelfLife: string; image: string; price: number }
interface BreadItem { id: number; name: string; description: string; ingredients: string; texture: string; role: string; image: string }
interface PlanItem { id: number; planId: string; name: string; subtitle: string; frequency: string; breadComposition: string; complements: string; extraProduct: string; target: string; price: number; deliveriesPerMonth: number; highlighted: boolean }
interface Stats { users: number; totalSubmissions: number; pendingSubmissions: number; totalProducts: number; totalBreads: number; totalPlans: number }

const TABS = ["Dashboard", "Comprobantes", "Panes", "Productos", "Planes", "QR"]

async function fetchApi(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, { ...init, credentials: "include" })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || "Error")
  }
  return res.json()
}

async function uploadImage(file: File, folder: string): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)
  const res = await fetch(`${BASE}/api/admin/upload`, { method: "POST", body: formData, credentials: "include" })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || "Error al subir")
  }
  const data = await res.json()
  return data.url
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const [tab, setTab] = useState(0)
  const [stats, setStats] = useState<Stats | null>(null)
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [products, setProducts] = useState<ProductItem[]>([])
  const [breads, setBreads] = useState<BreadItem[]>([])
  const [plans, setPlans] = useState<PlanItem[]>([])
  const [qrPreview, setQrPreview] = useState("")
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [selectedSub, setSelectedSub] = useState<SubmissionItem | null>(null)

  // Product form
  const [showProdForm, setShowProdForm] = useState(false)
  const [editProd, setEditProd] = useState<ProductItem | null>(null)
  const [prodForm, setProdForm] = useState({ name: "", brand: "", category: "", description: "", shelfLife: "", image: "", price: 0 })
  const prodFileRef = useRef<HTMLInputElement>(null)

  // Bread form
  const [showBreadForm, setShowBreadForm] = useState(false)
  const [editBread, setEditBread] = useState<BreadItem | null>(null)
  const [breadForm, setBreadForm] = useState({ name: "", description: "", ingredients: "", texture: "", role: "", image: "" })
  const breadFileRef = useRef<HTMLInputElement>(null)

  // Plan form
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [editPlan, setEditPlan] = useState<PlanItem | null>(null)
  const [planForm, setPlanForm] = useState({ planId: "", name: "", subtitle: "", frequency: "", breadComposition: "", complements: "", extraProduct: "", target: "", price: 0, deliveriesPerMonth: 1, highlighted: false })

  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== "admin") return
    Promise.all([
      fetchApi("/api/admin/stats").catch(() => null),
      fetchApi("/api/admin/submissions").catch(() => []),
      fetchApi("/api/admin/products").catch(() => []),
      fetchApi("/api/admin/breads").catch(() => []),
      fetchApi("/api/admin/plans").catch(() => []),
      fetchApi("/api/admin/qr").catch(() => ({ qr: "" })),
    ]).then(([s, sub, prod, brd, pln, qr]) => {
      setStats(s as Stats | null)
      setSubmissions((sub || []) as SubmissionItem[])
      setProducts((prod || []) as ProductItem[])
      setBreads((brd || []) as BreadItem[])
      setPlans((pln || []) as PlanItem[])
      setQrPreview((qr as { qr: string })?.qr || "")
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user, authLoading])

  const refreshProducts = () => fetchApi("/api/admin/products").then((p) => setProducts(p || [])).catch(() => {})
  const refreshBreads = () => fetchApi("/api/admin/breads").then((b) => setBreads(b || [])).catch(() => {})
  const refreshPlans = () => fetchApi("/api/admin/plans").then((p) => setPlans(p || [])).catch(() => {})

  const handleStatus = async (id: number, status: "aprobado" | "rechazado") => {
    try {
      await fetchApi(`/api/admin/submissions/${id}`, { method: "PUT", body: JSON.stringify({ status }) })
      setMsg(`Comprobante ${status}`)
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
    } catch (err) { setError(err instanceof Error ? err.message : "Error") }
  }

  // ---- PRODUCTS ----
  const openProdForm = (p?: ProductItem) => {
    if (p) { setEditProd(p); setProdForm({ name: p.name, brand: p.brand, category: p.category, description: p.description, shelfLife: p.shelfLife, image: p.image, price: p.price }) }
    else { setEditProd(null); setProdForm({ name: "", brand: "", category: "", description: "", shelfLife: "", image: "", price: 0 }) }
    setShowProdForm(true)
  }

  const handleProdImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setSaving(true)
      const url = await uploadImage(file, "complementos")
      setProdForm((f) => ({ ...f, image: url }))
      setMsg("Imagen subida")
    } catch (err) { setError(err instanceof Error ? err.message : "Error") }
    finally { setSaving(false) }
  }

  const saveProduct = async () => {
    setSaving(true); setError("")
    try {
      if (editProd) {
        await fetchApi(`/api/admin/products/${editProd.id}`, { method: "PUT", body: JSON.stringify(prodForm) })
        setMsg("Producto actualizado")
      } else {
        await fetchApi("/api/admin/products", { method: "POST", body: JSON.stringify(prodForm) })
        setMsg("Producto creado")
      }
      setShowProdForm(false); setEditProd(null); refreshProducts()
    } catch (err) { setError(err instanceof Error ? err.message : "Error") }
    finally { setSaving(false) }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm("¿Eliminar?")) return
    try { await fetchApi(`/api/admin/products/${id}`, { method: "DELETE" }); setMsg("Eliminado"); refreshProducts() }
    catch (err) { setError(err instanceof Error ? err.message : "Error") }
  }

  // ---- BREADS ----
  const openBreadForm = (b?: BreadItem) => {
    if (b) { setEditBread(b); setBreadForm({ name: b.name, description: b.description, ingredients: b.ingredients, texture: b.texture, role: b.role, image: b.image }) }
    else { setEditBread(null); setBreadForm({ name: "", description: "", ingredients: "", texture: "", role: "", image: "" }) }
    setShowBreadForm(true)
  }

  const handleBreadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setSaving(true)
      const url = await uploadImage(file, "panes")
      setBreadForm((f) => ({ ...f, image: url }))
      setMsg("Imagen subida")
    } catch (err) { setError(err instanceof Error ? err.message : "Error") }
    finally { setSaving(false) }
  }

  const saveBread = async () => {
    setSaving(true); setError("")
    try {
      if (editBread) {
        await fetchApi(`/api/admin/breads/${editBread.id}`, { method: "PUT", body: JSON.stringify(breadForm) })
        setMsg("Pan actualizado")
      } else {
        await fetchApi("/api/admin/breads", { method: "POST", body: JSON.stringify(breadForm) })
        setMsg("Pan creado")
      }
      setShowBreadForm(false); setEditBread(null); refreshBreads()
    } catch (err) { setError(err instanceof Error ? err.message : "Error") }
    finally { setSaving(false) }
  }

  const deleteBread = async (id: number) => {
    if (!confirm("¿Eliminar?")) return
    try { await fetchApi(`/api/admin/breads/${id}`, { method: "DELETE" }); setMsg("Eliminado"); refreshBreads() }
    catch (err) { setError(err instanceof Error ? err.message : "Error") }
  }

  // ---- PLANS ----
  const openPlanForm = (p?: PlanItem) => {
    if (p) {
      const comps = (() => { try { return JSON.parse(p.complements) } catch { return [] } })()
      setEditPlan(p)
      setPlanForm({ planId: p.planId, name: p.name, subtitle: p.subtitle, frequency: p.frequency, breadComposition: p.breadComposition, complements: Array.isArray(comps) ? comps.join("\n") : p.complements, extraProduct: p.extraProduct, target: p.target, price: p.price, deliveriesPerMonth: p.deliveriesPerMonth, highlighted: p.highlighted })
    }
    else { setEditPlan(null); setPlanForm({ planId: "", name: "", subtitle: "", frequency: "", breadComposition: "", complements: "", extraProduct: "", target: "", price: 0, deliveriesPerMonth: 1, highlighted: false }) }
    setShowPlanForm(true)
  }

  const savePlan = async () => {
    setSaving(true); setError("")
    try {
      const complementsArr = planForm.complements.split("\n").map((s) => s.trim()).filter(Boolean)
      if (complementsArr.length === 0) { setError("Agregá al menos un complemento"); setSaving(false); return }
      const data = { ...planForm, complements: JSON.stringify(complementsArr) }
      if (editPlan) {
        await fetchApi(`/api/admin/plans/${editPlan.id}`, { method: "PUT", body: JSON.stringify(data) })
        setMsg("Plan actualizado")
      } else {
        await fetchApi("/api/admin/plans", { method: "POST", body: JSON.stringify(data) })
        setMsg("Plan creado")
      }
      setShowPlanForm(false); setEditPlan(null); refreshPlans()
    } catch (err) { setError(err instanceof Error ? err.message : "Error") }
    finally { setSaving(false) }
  }

  const deletePlan = async (id: number) => {
    if (!confirm("¿Eliminar?")) return
    try { await fetchApi(`/api/admin/plans/${id}`, { method: "DELETE" }); setMsg("Eliminado"); refreshPlans() }
    catch (err) { setError(err instanceof Error ? err.message : "Error") }
  }

  // ---- QR ----
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

  const inputClass = "w-full px-3 py-2 bg-oven-900 border border-oven-600/40 rounded-lg text-cream-light text-sm placeholder:text-cream-muted/50 focus:outline-none focus:border-ember/60"
  const btnPrimary = "px-4 py-2 bg-gradient-ember text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-ember/25 transition-all disabled:opacity-50"
  const btnGhost = "px-4 py-2 border border-oven-500/30 text-cream-dark/60 text-sm rounded-lg hover:text-cream-light transition-all"

  return (
    <div className="min-h-screen bg-oven-950">
      <section className="py-8 sm:py-12 bg-gradient-oven border-b border-oven-700/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-cream-light">Admin</h1>
            <span className="text-cream-dark/50 text-sm">{user.email}</span>
          </div>
          <div className="flex gap-1 bg-oven-900 rounded-xl p-1 overflow-x-auto">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${tab === i ? "bg-ember text-white" : "text-cream-dark/60 hover:text-cream-light"}`}>{t}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          {msg && <div className="mb-4 p-3 rounded-xl bg-emerald-900/20 border border-emerald-700/30 text-emerald-400 text-sm text-center cursor-pointer" onClick={() => setMsg("")}>{msg}</div>}
          {error && <div className="mb-4 p-3 rounded-xl bg-red-900/20 border border-red-700/30 text-red-400 text-sm text-center cursor-pointer" onClick={() => setError("")}>{error}</div>}

          {/* Dashboard */}
          {tab === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Usuarios", value: stats?.users || 0, color: "text-ember" },
                { label: "Comprobantes", value: stats?.totalSubmissions || 0, color: "text-crust-light" },
                { label: "Pendientes", value: stats?.pendingSubmissions || 0, color: "text-amber-400" },
                { label: "Panes", value: stats?.totalBreads || 0, color: "text-cream-light" },
                { label: "Productos", value: stats?.totalProducts || 0, color: "text-emerald-400" },
                { label: "Planes", value: stats?.totalPlans || 0, color: "text-ember-light" },
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

          {/* Breads */}
          {tab === 2 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-cream-light font-semibold">{breads.length} panes</h2>
                <button onClick={() => openBreadForm()} className={btnPrimary}>+ Nuevo pan</button>
              </div>

              {showBreadForm && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-card border border-ember/20 space-y-3">
                  <h3 className="text-cream-light font-semibold text-sm">{editBread ? "Editar pan" : "Nuevo pan"}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={breadForm.name} onChange={(e) => setBreadForm({...breadForm, name: e.target.value})} placeholder="Nombre" className={inputClass} />
                    <input value={breadForm.ingredients} onChange={(e) => setBreadForm({...breadForm, ingredients: e.target.value})} placeholder="Ingredientes" className={inputClass} />
                    <input value={breadForm.texture} onChange={(e) => setBreadForm({...breadForm, texture: e.target.value})} placeholder="Textura" className={inputClass} />
                    <input value={breadForm.role} onChange={(e) => setBreadForm({...breadForm, role: e.target.value})} placeholder="Rol / uso" className={inputClass} />
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <div className="flex-1">
                        <input value={breadForm.image} onChange={(e) => setBreadForm({...breadForm, image: e.target.value})} placeholder="URL de imagen" className={inputClass} />
                      </div>
                      <span className="text-cream-dark/40 text-xs">o</span>
                      <label className="px-4 py-2 bg-oven-800 border border-oven-600/40 rounded-lg text-cream-dark/70 text-sm cursor-pointer hover:border-ember/40 transition-all shrink-0">
                        Subir foto
                        <input ref={breadFileRef} type="file" accept="image/*" onChange={handleBreadImage} className="hidden" />
                      </label>
                    </div>
                    {breadForm.image && (
                      <div className="sm:col-span-2 relative w-24 h-24 rounded-lg overflow-hidden bg-oven-800 border border-oven-600/20">
                        <Image src={breadForm.image} alt="Preview" fill className="object-cover" sizes="96px" />
                      </div>
                    )}
                  </div>
                  <textarea value={breadForm.description} onChange={(e) => setBreadForm({...breadForm, description: e.target.value})} rows={2} placeholder="Descripción" className={`${inputClass} resize-none`} />
                  <div className="flex gap-2">
                    <button onClick={saveBread} disabled={saving} className={btnPrimary}>{saving ? "Guardando..." : "Guardar"}</button>
                    <button onClick={() => { setShowBreadForm(false); setEditBread(null) }} className={btnGhost}>Cancelar</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {loading ? <p className="text-center py-8 text-cream-dark/50">Cargando...</p> :
                 breads.map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-gradient-card border border-oven-600/20 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-oven-800 shrink-0">
                      {b.image && <Image src={b.image} alt={b.name} fill className="object-cover" sizes="40px" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-cream-light text-sm">{b.name}</p>
                      <p className="text-cream-dark/50 text-xs truncate">{b.ingredients} · {b.texture}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openBreadForm(b)} className="px-3 py-1 text-xs text-ember hover:bg-ember/10 rounded-lg">Editar</button>
                      <button onClick={() => deleteBread(b.id)} className="px-3 py-1 text-xs text-red-400 hover:bg-red-400/10 rounded-lg">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {tab === 3 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-cream-light font-semibold">{products.length} productos</h2>
                <button onClick={() => openProdForm()} className={btnPrimary}>+ Nuevo</button>
              </div>

              {showProdForm && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-card border border-ember/20 space-y-3">
                  <h3 className="text-cream-light font-semibold text-sm">{editProd ? "Editar producto" : "Nuevo producto"}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={prodForm.name} onChange={(e) => setProdForm({...prodForm, name: e.target.value})} placeholder="Nombre" className={inputClass} />
                    <input value={prodForm.brand} onChange={(e) => setProdForm({...prodForm, brand: e.target.value})} placeholder="Marca" className={inputClass} />
                    <input value={prodForm.category} onChange={(e) => setProdForm({...prodForm, category: e.target.value})} placeholder="Categoría" className={inputClass} />
                    <input type="number" value={prodForm.price} onChange={(e) => setProdForm({...prodForm, price: parseInt(e.target.value) || 0})} placeholder="Precio (Bs.)" className={inputClass} />
                    <input value={prodForm.shelfLife} onChange={(e) => setProdForm({...prodForm, shelfLife: e.target.value})} placeholder="Vida útil" className={inputClass} />
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <input value={prodForm.image} onChange={(e) => setProdForm({...prodForm, image: e.target.value})} placeholder="URL de imagen" className={inputClass} />
                      </div>
                      <span className="text-cream-dark/40 text-xs">o</span>
                      <label className="px-4 py-2 bg-oven-800 border border-oven-600/40 rounded-lg text-cream-dark/70 text-sm cursor-pointer hover:border-ember/40 transition-all shrink-0">
                        Subir foto
                        <input ref={prodFileRef} type="file" accept="image/*" onChange={handleProdImage} className="hidden" />
                      </label>
                    </div>
                    {prodForm.image && (
                      <div className="sm:col-span-2 relative w-24 h-24 rounded-lg overflow-hidden bg-oven-800 border border-oven-600/20">
                        <Image src={prodForm.image} alt="Preview" fill className="object-cover" sizes="96px" />
                      </div>
                    )}
                  </div>
                  <textarea value={prodForm.description} onChange={(e) => setProdForm({...prodForm, description: e.target.value})} rows={2} placeholder="Descripción" className={`${inputClass} resize-none`} />
                  <div className="flex gap-2">
                    <button onClick={saveProduct} disabled={saving} className={btnPrimary}>{saving ? "Guardando..." : "Guardar"}</button>
                    <button onClick={() => { setShowProdForm(false); setEditProd(null) }} className={btnGhost}>Cancelar</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {loading ? <p className="text-center py-8 text-cream-dark/50">Cargando...</p> :
                 products.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-gradient-card border border-oven-600/20 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-oven-800 shrink-0">
                      {p.image && <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-cream-light text-sm">{p.name} <span className="text-cream-dark/50 text-xs">· {p.brand}</span></p>
                      <p className="text-cream-dark/50 text-xs">{p.category} · Bs. {p.price}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openProdForm(p)} className="px-3 py-1 text-xs text-ember hover:bg-ember/10 rounded-lg">Editar</button>
                      <button onClick={() => deleteProduct(p.id)} className="px-3 py-1 text-xs text-red-400 hover:bg-red-400/10 rounded-lg">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plans */}
          {tab === 4 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-cream-light font-semibold">{plans.length} planes</h2>
                <button onClick={() => openPlanForm()} className={btnPrimary}>+ Nuevo plan</button>
              </div>

              {showPlanForm && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-card border border-ember/20 space-y-3">
                  <h3 className="text-cream-light font-semibold text-sm">{editPlan ? "Editar plan" : "Nuevo plan"}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={planForm.planId} onChange={(e) => setPlanForm({...planForm, planId: e.target.value})} placeholder="ID (ej: chuquisaqueno-diario)" className={inputClass} />
                    <input value={planForm.name} onChange={(e) => setPlanForm({...planForm, name: e.target.value})} placeholder="Nombre" className={inputClass} />
                    <input value={planForm.subtitle} onChange={(e) => setPlanForm({...planForm, subtitle: e.target.value})} placeholder="Subtítulo" className={inputClass} />
                    <input type="number" value={planForm.price} onChange={(e) => setPlanForm({...planForm, price: parseInt(e.target.value) || 0})} placeholder="Precio (Bs.)" className={inputClass} />
                    <input value={planForm.frequency} onChange={(e) => setPlanForm({...planForm, frequency: e.target.value})} placeholder="Frecuencia" className={inputClass} />
                    <input type="number" value={planForm.deliveriesPerMonth} onChange={(e) => setPlanForm({...planForm, deliveriesPerMonth: parseInt(e.target.value) || 1})} placeholder="Entregas por semana" className={inputClass} />
                    <input value={planForm.breadComposition} onChange={(e) => setPlanForm({...planForm, breadComposition: e.target.value})} placeholder="Composición del pan" className={inputClass} />
                    <input value={planForm.extraProduct} onChange={(e) => setPlanForm({...planForm, extraProduct: e.target.value})} placeholder="Producto extra semanal" className={inputClass} />
                  </div>
                  <textarea value={planForm.complements} onChange={(e) => setPlanForm({...planForm, complements: e.target.value})} rows={3} placeholder="Complementos incluidos (uno por línea)" className={`${inputClass} resize-none`} />
                  <input value={planForm.target} onChange={(e) => setPlanForm({...planForm, target: e.target.value})} placeholder="Público objetivo" className={inputClass} />
                  <label className="flex items-center gap-2 text-sm text-cream-dark/70 cursor-pointer">
                    <input type="checkbox" checked={planForm.highlighted} onChange={(e) => setPlanForm({...planForm, highlighted: e.target.checked})} className="rounded border-oven-600/40 bg-oven-900 text-ember focus:ring-ember" />
                    Destacar como &quot;Más popular&quot;
                  </label>
                  <div className="flex gap-2">
                    <button onClick={savePlan} disabled={saving} className={btnPrimary}>{saving ? "Guardando..." : "Guardar"}</button>
                    <button onClick={() => { setShowPlanForm(false); setEditPlan(null) }} className={btnGhost}>Cancelar</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {loading ? <p className="text-center py-8 text-cream-dark/50">Cargando...</p> :
                 plans.map((p) => (
                  <div key={p.id} className="p-3 sm:p-4 rounded-xl bg-gradient-card border border-oven-600/20">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-cream-light text-sm font-medium">{p.name} {p.highlighted && <span className="text-ember text-xs">★</span>}</p>
                        <p className="text-cream-dark/60 text-xs">{p.subtitle}</p>
                        <p className="text-cream-dark/50 text-xs mt-0.5">Bs. {p.price}/sem · {p.frequency} · {(() => { try { return JSON.parse(p.complements).length } catch { return 0 } })()} complementos</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => openPlanForm(p)} className="px-3 py-1 text-xs text-ember hover:bg-ember/10 rounded-lg">Editar</button>
                        <button onClick={() => deletePlan(p.id)} className="px-3 py-1 text-xs text-red-400 hover:bg-red-400/10 rounded-lg">Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QR */}
          {tab === 5 && (
            <div className="space-y-6">
              <h2 className="text-cream-light font-semibold">QR de pago</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="p-4 rounded-xl bg-gradient-card border border-oven-600/20 text-center">
                  <p className="text-cream-dark/60 text-xs mb-3">Actual</p>
                  <div className="relative w-40 h-40 mx-auto rounded-xl bg-white border border-oven-600/30 overflow-hidden">
                    {qrPreview ? <img src={qrPreview} alt="QR" className="w-full h-full object-contain" /> : <Image src="/images/qr-pago.PNG" alt="QR" fill className="object-contain p-2" unoptimized />}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-card border border-oven-600/20 flex-1">
                  <p className="text-cream-dark/60 text-xs mb-3">Subir nuevo</p>
                  <input type="file" accept="image/*" onChange={handleQrFile} className="mb-3 text-cream-dark/60 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-ember file:text-white hover:file:bg-ember-light transition-all" />
                  <button onClick={saveQr} disabled={saving} className={btnPrimary}>{saving ? "Guardando..." : "Guardar QR"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Receipt modal */}
      {selectedSub?.recibo && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setSelectedSub(null)}>
          <div className="relative max-w-lg w-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedSub(null)} className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm">Cerrar</button>
            <img src={selectedSub.recibo} alt="Comprobante" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  )
}
