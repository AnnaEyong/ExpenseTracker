"use client"
import React from 'react'
import { PieChart } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"



export default function CategoryBreakDown() {

  const router = useRouter()
  const [user, setUser] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [budget, setBudget] = useState(0)
  const [alertMessage, setAlertMessage] = useState("")
  const [loaded, setLoaded] = useState(false)
  const [filter, setFilter] = useState("")
  const [search, setSearch] = useState("")

  // Load logged-in user, their expenses, and budget
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser")
    const users = JSON.parse(localStorage.getItem("users")) || []

    if (!loggedInUser) {
      router.push("/login")
      return
    }

    const currentUser = users.find((u) => u.name === loggedInUser)
    setUser(currentUser)
    setExpenses(currentUser?.expenses || [])
    setBudget(currentUser?.budget || 0)
    setLoaded(true)
  }, [router])

  // Save updated user data to localStorage
  const saveUserData = (updatedExpenses = expenses, updatedBudget = budget) => {
    if (!user) return
    const users = JSON.parse(localStorage.getItem("users")) || []
    const updatedUsers = users.map((u) =>
      u.name === user.name
        ? { ...u, expenses: updatedExpenses, budget: updatedBudget }
        : u
    )
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    setExpenses(updatedExpenses)
    setBudget(updatedBudget)
  }


  // Category breakdown
  const categoryBreakdown = expenses.reduce((acc, e) => {
    if (!acc[e.category]) acc[e.category] = 0
    acc[e.category] += Number(e.amount)
    return acc
  }, {})



  return (
    <div className="md:p-4 rounded-xl h-fit">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><PieChart className="w-5 h-5"/> Category Breakdown</h3>
            <ul className="text-sm">
              {Object.entries(categoryBreakdown).map(([cat, amt]) => (
                <li key={cat} className="flex justify-between border-b py-1">
                  <span>{cat}</span>
                  <span>₦{amt}</span>
                </li>
              ))}
              {Object.keys(categoryBreakdown).length === 0 && <li>No expenses yet</li>}
            </ul>
          </div>
  )
}
