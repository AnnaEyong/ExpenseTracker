"use client"
import React from "react"
import { CalendarDays } from "lucide-react"

export default function WeeklyBreakdown({ expenses = [] }) {
  // Group expenses by ISO week (Mon–Sun)
  const weeklyBreakdown = expenses.reduce((acc, e) => {
    const date = new Date(e.date || new Date().toISOString())
    if (isNaN(date)) return acc

    // Find Monday of the week
    const day = date.getDay() // 0 = Sun
    const diff = (day === 0 ? -6 : 1 - day)
    const monday = new Date(date)
    monday.setDate(date.getDate() + diff)
    monday.setHours(0, 0, 0, 0)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const fmt = (d) =>
      d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })

    const weekKey = `${fmt(monday)} – ${fmt(sunday)}`
    const sortKey = monday.toISOString()

    if (!acc[weekKey]) acc[weekKey] = { total: 0, sortKey }
    acc[weekKey].total += Number(e.amount)
    return acc
  }, {})

  const sortedWeeks = Object.entries(weeklyBreakdown).sort(
    ([, a], [, b]) => new Date(a.sortKey) - new Date(b.sortKey)
  )

  return (
    <div className="md:p-4 rounded-xl h-fit">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <CalendarDays className="w-5 h-5" /> Weekly Breakdown
      </h3>
      <ul className="text-sm">
        {sortedWeeks.map(([week, { total }]) => (
          <li key={week} className="flex justify-between border-b py-1">
            <span>{week}</span>
            <span className="font-semibold">{total} XAF</span>
          </li>
        ))}
        {sortedWeeks.length === 0 && <li>No expenses yet</li>}
      </ul>
    </div>
  )
}
