"use client"

import { useState, useEffect } from "react"
import PlanCard from "@/components/PlanCard"
import { plans as staticPlans } from "@/data/plans"

interface PlanItem {
  id: number; slug: string; name: string; subtitle: string; frequency: string
  breadComposition: string; complements: string[]; extraProduct: string
  target: string; price: number; deliveriesPerMonth: number; highlighted: boolean
}

export default function HomePlans() {
  const [plans, setPlans] = useState<PlanItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/plans")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setPlans(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const displayPlans = plans.length > 0
    ? plans.map((p) => ({ id: p.slug, name: p.name, subtitle: p.subtitle, frequency: p.frequency, breadComposition: p.breadComposition, complements: p.complements, extraProduct: p.extraProduct, target: p.target, price: p.price, deliveriesPerMonth: p.deliveriesPerMonth, highlighted: p.highlighted }))
    : staticPlans

  if (loading && plans.length === 0) {
    return <div className="text-center py-12 text-cream-dark/50">Cargando planes...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
      {displayPlans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  )
}
