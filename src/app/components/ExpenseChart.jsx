"use client"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function ExpenseChart({ expenses, budget }) {
  // Group expenses by category
  const categories = {}
  expenses.forEach((e) => {
    if (categories[e.category]) categories[e.category] += Number(e.amount)
    else categories[e.category] = Number(e.amount)
  })

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categories),
        backgroundColor: [
          "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F472B6"
        ],
        borderWidth: 0,
        cutout: '50%',
      }
    ]
  }

  // ADD THIS LEGEND OPTION FOR CIRCLES
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#6a7282',
          boxHeight: 9, // adjust this for circle diameter
          boxWidth: 9   // keeps text close to the circle
        }
      }
    }
  }

  return (
    <div className="md:p-4 py-4 rounded-xl w-full shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
      <h2 className="text-xl font-semibold mb-4 text-center">Expenses Chart</h2>
      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center">No expenses yet</p>
      ) : (
        <div className="w-inherit h-64">
          <Pie data={data} options={options} />
        </div>
      )}
      {budget > 0 && <p className="mt-2 text-center">Monthly budget: {budget} XAF</p>}
    </div>
  )
}
