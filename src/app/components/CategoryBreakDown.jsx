"use client"
import React from "react"
import { PieChart } from "lucide-react"

export default function CategoryBreakDown({ expenses = [], categories = [] }) {
  const categoryIcons = categories.reduce((acc, cat) => {
    acc[cat.name] = cat.icon
    return acc
  }, {})

  const categoryBreakdown = expenses.reduce((acc, e) => {
    if (!acc[e.category]) {
      acc[e.category] = {
        total: 0,
        icon: e.categoryIcon || categoryIcons[e.category] || "",
      }
    }
    acc[e.category].total += Number(e.amount)
    return acc
  }, {})

  return (
    <div className="md:p-4 rounded-xl h-fit">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <PieChart className="w-5 h-5" /> Category Breakdown
      </h3>
      <ul className="text-sm">
        {Object.entries(categoryBreakdown).map(([cat, info]) => (
          <li key={cat} className="flex justify-between border-b py-1">
            <span>{info.icon ? `${info.icon} ${cat}` : cat}</span>
            <span className="font-semibold">{info.total} XAF</span>
          </li>
        ))}
        {Object.keys(categoryBreakdown).length === 0 && <li>No expenses yet</li>}
      </ul>
    </div>
  )
}
