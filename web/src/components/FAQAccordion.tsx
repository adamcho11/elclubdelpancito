"use client"

import { useState } from "react"
import type { FAQItem } from "@/data/faq"

export default function FAQAccordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-oven-600/30 rounded-xl overflow-hidden transition-all duration-300
      hover:border-oven-500/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-center justify-between text-left
          hover:bg-oven-800/40 transition-colors duration-200"
      >
        <span className="text-cream-light font-medium pr-4">{item.question}</span>
        <span
          className={`text-cream-muted shrink-0 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-5 text-cream-dark/70 text-sm leading-relaxed border-t border-oven-600/20 pt-4">
          {item.answer}
        </div>
      </div>
    </div>
  )
}
