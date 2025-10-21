"use client"
export default function BudgetSetter({ budget, setBudget }) {
  const handleChange = (e) => {
    setBudget(Number(e.target.value))
  }

  return (
    <div className="bg-card p-6 rounded-xl shadow mb-6">
      <h2 className="mb-2 italic text-sm text-gray-500">Edit monthly budget on Profile</h2>
      
      {budget > 0 && <p className="mt-2 font-bold text-lg md:text-md">Current budget: {budget} XAF</p>}
    </div>
  )
}
