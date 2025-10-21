"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ExpenseForm from "../components/ExpenseForm"
import ExpenseList from "../components/ExpenseList"
import BudgetSetter from "../components/BudgetSetter"
import AlertNotification from "../components/AlertNotification"
import ExpenseChart from "../components/ExpenseChart"
import toast, { Toaster } from "react-hot-toast"
import { WalletCards, DollarSign, List, PieChart } from "lucide-react"
import Navbar from "../components/navbar/Navbar"

export default function Dashboard() {
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser")
    router.push("/login")
  }

  // Handle expense add with toast notifications
  const handleAddExpense = (expense) => {
    const updatedExpenses = [...expenses, expense]
    saveUserData(updatedExpenses, budget)

    const total = updatedExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

    if (budget > 0 && total > budget * 0.8 && total <= budget) {
      toast.warning("⚠ Approaching budget limit!")
    } else if (budget > 0 && total > budget) {
      toast.error("🚨 Budget exceeded!")
    }
  }

  // Update alert message whenever expenses or budget change
  useEffect(() => {
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    if (budget === 0) {
      setAlertMessage("")
    } else if (total > budget) {
      setAlertMessage("Budget exceeded! 🚨")
    } else if (total > budget * 0.8) {
      setAlertMessage("Approaching budget limit ⚠")
    } else {
      setAlertMessage("")
    }
  }, [expenses, budget])

  // Filtered & searched expenses 
  const filteredExpenses = expenses
    .filter((e) => {
      const query = search.toLowerCase();

      // Format date as DD/MM/YY
      let formattedDate = "";
      if (e.date) {
        const d = new Date(e.date);
        if (!isNaN(d)) {
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = String(d.getFullYear()).slice(-2);
          formattedDate = `${day}/${month}/${year}`;
        } else {
          formattedDate = e.date;
        }
      }

      return (
        e.name.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query) ||
        formattedDate.includes(query)
      );
    })
    .filter((e) => (filter === "" ? true : e.category === filter));

  // Calculate totals for summary cards
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const remainingBudget = budget - totalExpenses
  const numExpenses = expenses.length

  // Category breakdown
  const categoryBreakdown = expenses.reduce((acc, e) => {
    if (!acc[e.category]) acc[e.category] = 0
    acc[e.category] += Number(e.amount)
    return acc
  }, {})

  // DAILY BREAKDOWN
  const dailyBreakdown = expenses.reduce((acc, e) => {
    const dateKey = e.date || new Date().toISOString().split("T")[0]
    if (!acc[dateKey]) acc[dateKey] = 0
    acc[dateKey] += Number(e.amount)
    return acc
  }, {})

  // Sort by date ascending
  const sortedDailyBreakdown = Object.entries(dailyBreakdown).sort(
    ([a], [b]) => new Date(a) - new Date(b)
  )

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading dashboard...
      </div>
    )
  }

  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen bg-background py-10 px-3 md:px-10 lg:px-25 xl:px-50 pt-20">
        <Toaster position="top-right" reverseOrder={false} />

        {/* Monthly Summary Cards */}
        <div className='px-6 md:hidden grid grid-cols-1 mb-[-10px]'>
          {alertMessage && <AlertNotification message={alertMessage}/>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:px-0 gap-4 mb-6 max-w-4xl mx-auto">
          <div className="p-4 bg-card rounded-xl flex flex-col items-center gap-1 shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <h3 className="text-md md:text-sm text-gray-500 font-semibold">Total Expenses</h3>
            <p className="font-bold text-lg md:text-md">{totalExpenses} XAF</p>
          </div>

          <div className=" p-4 bg-card rounded-xl flex flex-col items-center gap-1 shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
            <WalletCards className="w-8 h-8 text-green-600" />
            <h3 className="text-md md:text-sm text-gray-500 font-semibold">Remaining Budget</h3>
            <p className="font-bold text-lg md:text-md">{remainingBudget} XAF</p>
          </div>

          <div className=" p-4 bg-card rounded-xl flex flex-col items-center gap-1 shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
            <List className="w-8 h-8 text-purple-600" />
            <h3 className="text-md md:text-sm text-gray-500 font-semibold">Number of Expenses</h3>
            <p className="font-bold text-lg md:text-md">{numExpenses}</p>
          </div>
        </div>

        <div className="max-w-4xl bg-card mx-auto rounded-xl p-6 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
          <BudgetSetter
            budget={budget}
            setBudget={(newBudget) => saveUserData(expenses, newBudget)}
          />

          <div className='hidden md:grid grid-cols-1 mb-[-5px]'>
            {alertMessage && <AlertNotification message={alertMessage}/>}
          </div>

          <ExpenseForm onAddExpense={handleAddExpense} />

          {/* Filter & Search */}
          <div className="hidden md:flex flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name, category, or date"
              className="border rounded-lg p-2 flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border rounded-lg p-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {["Food", "Transport", "Shopping", "Bills", "Others"].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Expense Chart & Category Breakdown */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">

          {/* BREAKDOWNS */}
          <div className='grid grid-cols-1 gap-6 md:gap-0'>
             {/* Category Breakdown */}
              <div className="md:p-4 rounded-xl h-fit">
                <h3 className="font-semibold  mb-2 flex items-center gap-2">
                  <PieChart className="w-5 h-5"/> Category Breakdown
                </h3>
                <ul className="text-sm">
                  {Object.entries(categoryBreakdown).map(([cat, amt]) => (
                    <li key={cat} className="flex justify-between border-b py-1">
                      <span>{cat}</span>
                      <span>{amt} XAF</span>
                    </li>
                  ))}
                  {Object.keys(categoryBreakdown).length === 0 && <li>No expenses yet</li>}
                </ul>
              </div>
            

            {/* Daily Breakdown */}
            <div className="md:p-4 md:mt-[-80px] rounded-xl h-fit">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <List className="w-5 h-5"/> Daily Breakdown
              </h3>
              <ul className="text-sm">
                {sortedDailyBreakdown.map(([date, amt]) => (
                  <li key={date} className="flex justify-between border-b py-1">
                    <span>{date}</span>
                    <span>{amt} XAF</span>
                  </li>
                ))}
                {sortedDailyBreakdown.length === 0 && <li>No expenses yet</li>}
              </ul>
            </div>

            {/* Filter & Search Responsive screen*/}
          <div className="flex flex-col md:hidden gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name, category, or date"
              className="border rounded-lg p-2 flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border rounded-lg p-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {["Food", "Transport", "Shopping", "Bills", "Others"].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          </div>

          {/* EXPENSE CHART */}
          <ExpenseChart expenses={filteredExpenses} budget={budget} />
        </div>

          <ExpenseList
            expenses={filteredExpenses}
            onDeleteExpense={(index) => {
              const updated = expenses.filter((_, i) => i !== index)
              saveUserData(updated, budget)
            }}
          />
        </div>
      </div>
    </>
  )
}
