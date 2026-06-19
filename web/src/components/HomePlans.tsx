import PlanCard from "@/components/PlanCard"
import { plans } from "@/data/plans"

export default function HomePlans() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  )
}
