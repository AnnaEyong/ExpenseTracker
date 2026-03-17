"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ExpenseForm from "../components/ExpenseForm"
import ExpenseList from "../components/ExpenseList"
import BudgetSetter from "../components/BudgetSetter"
import AlertNotification from "../components/AlertNotification"
import ExpenseChart from "../components/ExpenseChart"
import WeeklyBreakdown from "../components/WeeklyBreakdown"
import CategoryBreakDown from "../components/CategoryBreakDown"
import toast, { Toaster } from "react-hot-toast"
import { WalletCards, DollarSign, List } from "lucide-react"
import Navbar from "../components/navbar/Navbar"

export default function Dashboard() {
  const router = useRouter()
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"
  const [user, setUser] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [budget, setBudget] = useState(0)
  const [alertMessage, setAlertMessage] = useState("")
  const [loaded, setLoaded] = useState(false)
  const [filter, setFilter] = useState("")
  const [search, setSearch] = useState("")

  // Load logged-in user, categories and expenses from backend
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const authData = localStorage.getItem("user")
        const token = authData ? JSON.parse(authData)?.token : null

        if (!token) {
          router.push("/login")
          return
        }

        const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!profileResponse.ok) {
          router.push("/login")
          return
        }

        const profilePayload = await profileResponse.json()
        const profileUser = profilePayload?.data
        if (!profileUser) {
          router.push("/login")
          return
        }

        const normalizedUser = {
          ...profileUser,
          id: profileUser._id || profileUser.id,
          firstName: profileUser.first_name || "",
        }

        const categoriesResponse = await fetch(`${API_BASE_URL}/category/find`)
        const categoriesPayload = categoriesResponse.ok ? await categoriesResponse.json() : { data: [] }
        const categoryList = Array.isArray(categoriesPayload?.data) ? categoriesPayload.data : []
        setCategories(categoryList)

        const expensesResponse = await fetch(
          `${API_BASE_URL}/expense/find?user=${normalizedUser.id}`
        )
        const expensesPayload = expensesResponse.ok ? await expensesResponse.json() : { data: [] }
        const expenseList = Array.isArray(expensesPayload?.data) ? expensesPayload.data : []

        const categoryMap = new Map(
          categoryList.map((cat) => [String(cat._id), { name: cat.name, icon: cat.icon }])
        )
        const normalizedExpenses = expenseList.map((exp) => {
          const categoryId = typeof exp.category === "object" ? exp.category?._id : exp.category
          const categoryMetaFromExpense =
            typeof exp.category === "object"
              ? {
                  name: exp.category?.name,
                  icon: exp.category?.icon,
                }
              : null
          const categoryMeta = categoryMetaFromExpense || categoryMap.get(String(categoryId)) || {}
          const categoryName = categoryMeta.name || "Others"

          return {
            id: exp._id || exp.id,
            name: exp.title,
            amount: Number(exp.amount) || 0,
            category: categoryName,
            categoryId: categoryId || null,
            categoryIcon: categoryMeta.icon || "",
            date: exp.createdAt || exp.date || new Date().toISOString(),
          }
        })

        setUser(normalizedUser)
        setExpenses(normalizedExpenses)
        setBudget(Number(profileUser.budget) || 0)
        setLoaded(true)
      } catch {
        router.push("/login")
      }
    }

    loadDashboardData()
  }, [router, API_BASE_URL])

  // FIXED — Save user data to both users and loggedInUser
  const saveUserData = (updatedExpenses = expenses, updatedBudget = budget) => {
    if (!user) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((u) =>
      u.email === user.email
        ? { ...u, expenses: updatedExpenses, budget: updatedBudget }
        : u
    );

    // Save updated users
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Update logged-in user
    const updatedLoggedInUser = updatedUsers.find(u => u.email === user.email);
    localStorage.setItem("loggedInUser", JSON.stringify(updatedLoggedInUser));

    // Update UI state
    setUser(updatedLoggedInUser);
    setExpenses(updatedExpenses);
    setBudget(updatedBudget);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser")
    router.push("/login")
  }

  // Add expense (backend)
  const handleAddExpense = async (expense) => {
    try {
      const authData = localStorage.getItem("user")
      const token = authData ? JSON.parse(authData)?.token : null
      const userId = user?._id || user?.id

      if (!token || !userId) {
        toast.error("Please login again")
        router.push("/login")
        return false
      }

      const matchingCategory = categories.find((cat) => cat.name === expense.category)
      if (!matchingCategory?._id) {
        toast.error("Selected category is not available")
        return false
      }

      const payload = {
        title: expense.name,
        amount: Number(expense.amount),
        category: matchingCategory._id,
        user: userId,
      }

      const response = await fetch(`${API_BASE_URL}/expense/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const body = await response.json()
      if (!response.ok) {
        toast.error(body?.message || "Failed to add expense")
        return false
      }

      const createdExpense = body?.data || {}
      const newExpense = {
        id: createdExpense._id || createdExpense.id,
        name: createdExpense.title || expense.name,
        amount: Number(createdExpense.amount || expense.amount) || 0,
        category: expense.category,
        categoryId: createdExpense.category || matchingCategory._id,
        categoryIcon: matchingCategory.icon || "",
        date: createdExpense.createdAt || new Date().toISOString(),
      }

      const updatedExpenses = [...expenses, newExpense]
      setExpenses(updatedExpenses)
      const total = updatedExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

      if (budget > 0 && total > budget * 0.8 && total <= budget) {
        toast.warning("⚠ Approaching budget limit!")
      } else if (budget > 0 && total > budget) {
        toast.error("🚨 Budget exceeded!")
      }

      return true
    } catch {
      toast.error("Failed to add expense")
      return false
    }
  }

  // Alert update logic
  useEffect(() => {
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    if (budget === 0) {
      setAlertMessage("")
    } else if (total > budget) {
      setAlertMessage("Budget exceeded! 🚨")
    } else if (total == budget) {
      setAlertMessage("Budget reached! ⚠")
    } else if (total > budget * 0.8) {
      setAlertMessage("Approaching budget limit ⚠")
    } else {
      setAlertMessage("")
    }
  }, [expenses, budget])

  // Filtered & searched expenses
  const filteredExpenses = expenses.filter((e) => {
      const query = search.toLowerCase();

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

  // Totals
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const remainingBudget = budget - totalExpenses
  const numExpenses = expenses.length

  // if (!loaded) {
  //   return (
  //     <div className="flex items-center justify-center h-screen text-gray-600">
  //       Loading dashboard...
  //     </div>
  //   )
  // }

  return (
    <>
      <Navbar user={user} />

      <div className="min-h-screen bg-background py-10 px-3 md:px-10 lg:px-25 xl:px-50 pt-20">
        <Toaster position="top-right" reverseOrder={false} />

        {/* Mobile Alert */}
        <div className='md:hidden grid grid-cols-1 mb-[-10px]'>
          {alertMessage && <AlertNotification message={alertMessage}/>}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 max-w-4xl mx-auto">
          <div className="p-4 bg-card rounded-xl flex flex-col items-center gap-1  shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <h3 className="text-md text-gray-500 font-semibold">Total Expense</h3>
            <p className="font-bold text-lg">{totalExpenses} XAF</p>
          </div>

          <div className="p-4 bg-card rounded-xl flex flex-col items-center gap-1  shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
            <WalletCards className="w-8 h-8 text-yellow-400" />
            <h3 className="text-md text-gray-500 font-semibold">Current Balance</h3>
            <p className="font-bold text-lg">{remainingBudget} XAF</p>
          </div>

          <div className="p-4 bg-card rounded-xl flex flex-col items-center gap-1 shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
            <List className="w-8 h-8 text-purple-600" />
            <h3 className="text-md text-gray-500 font-semibold">Number of Expenses</h3>
            <p className="font-bold text-lg">{numExpenses}</p>
          </div>
        </div>

        {/* Main dashboard container */}
        <div className="max-w-4xl bg-card mx-auto rounded-xl p-6 space-y-6  shadow-[0_8px_30px_rgba(0,0,0,0.1)]">

          <BudgetSetter
            budget={budget}
            setBudget={(newBudget) => saveUserData(expenses, newBudget)}
          />

          <div className='hidden md:grid grid-cols-1 mb-[-5px]'>
            {alertMessage && <AlertNotification message={alertMessage}/>}
          </div>

          <ExpenseForm
            onAddExpense={handleAddExpense}
            categories={categories}
          />

          {/* Search + Filter (Desktop) */}
          <div className="hidden md:flex flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name, category, or date"
              className="border rounded-lg p-2 flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border rounded-lg p-2 bg-card"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {["Food", "Transport", "Shopping", "Bills", "Internet", "Others"].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Chart + Breakdown */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">

            {/* Breakdown */}
            <div className='grid grid-cols-1 gap-6 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]'>
              {/* Category Breakdown */}
              <CategoryBreakDown expenses={expenses} categories={categories} />

              {/* Weekly Breakdown */}
              <WeeklyBreakdown expenses={expenses} />

              {/* Search + Filter (Mobile) */}
              <div className="flex flex-col md:hidden gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search by name, category, or date"
                  className="border rounded-lg p-2 flex-1"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="border rounded-lg p-2 bg-card"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {["Food", "Transport", "Shopping", "Bills", "Internet", "Others"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chart */}
            <ExpenseChart expenses={filteredExpenses} budget={budget} />
          </div>

          {/* Expense List */}
          <ExpenseList
            expenses={filteredExpenses}
            categories={categories}
            onDeleteExpense={(newArray) => {
              saveUserData(newArray, budget)
            }}
            onEditExpense={(updatedExpenses) => {
              saveUserData(updatedExpenses, budget)
            }}
          />

        </div>
      </div>
    </>
  )
}