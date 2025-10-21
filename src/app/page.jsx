"use client"
import { useRouter } from "next/navigation"
import HomeNav from "./components/navbar/HomeNav"
import {
  Wallet,
  BarChart2,
  Shield,
  UserCheck,
  Clock,
  Activity,
  Bell,
  Repeat,
  Layers
} from "lucide-react"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    const loggedInUser = localStorage.getItem("loggedInUser")
    if (loggedInUser) router.push("/dashboard")
    else router.push("/login")
  }

  // Sample data for mini chart & table
  const sampleExpenses = [
    { name: "Groceries", amount: 50, category: "Food" },
    { name: "Transport", amount: 20, category: "Travel" },
    { name: "Subscription", amount: 30, category: "Bills" },
    { name: "Coffee", amount: 10, category: "Food" }
  ]

  const categories = {}
  sampleExpenses.forEach((e) => {
    if (categories[e.category]) categories[e.category] += e.amount
    else categories[e.category] = e.amount
  })

  const chartData = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F472B6"],
        borderWidth: 1
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
          boxHeight: 9, // adjust this for circle diameter
          boxWidth: 9   // keeps text close to the circle
        }
      }
    }
  }

  return (
    <>
    <HomeNav/>
    <div className="flex flex-col mt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-400 to-blue-600 text-white py-28 px-6 text-center relative overflow-hidden">
        <h1 className="text-5xl font-bold mb-4">Take Control of Your Expenses</h1>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Track spending, manage your budget, and plan your financial future—all in one place.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition transform hover:scale-105"
        >
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12 font-[Playwrite DE Grund+Guides]">Why Choose Our Expense Tracker?</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 lg:grid-cols-3 gap-8">
          {[{
            icon: Wallet, title: "Track Spending", desc: "Keep all your expenses organized in one easy-to-use platform."
          },{
            icon: BarChart2, title: "Analyze Trends", desc: "Visualize your spending patterns and plan ahead efficiently."
          },{
            icon: Shield, title: "Secure & Private", desc: "Your data is stored safely in your browser — fully private."
          },{
            icon: Bell, title: "Budget Alerts", desc: "Get notifications when spending exceeds your set limits."
          },{
            icon: Repeat, title: "Recurring Expenses", desc: "Track subscriptions and recurring payments automatically."
          },{
            icon: Layers, title: "Multi-category Analysis", desc: "Analyze spending per category and spot trends easily."
          }].map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="p-8 rounded-xl shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition transform ease-in-out hover:-translate-y-5">
                <Icon className="text-blue-600 w-16 h-16 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12">How It Works</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-6">
          {[{
            icon: UserCheck, title: "Sign Up", desc: "Create an account to start tracking your expenses."
          },{
            icon: Activity, title: "Add Expenses", desc: "Quickly add daily expenses and categorize them."
          },{
            icon: Clock, title: "View Summary", desc: "See all your expenses summarized in one view."
          },{
            icon: BarChart2, title: "Analyze Trends", desc: "Track patterns and make smarter financial decisions."
          },{
            icon: Shield, title: "Secure Data", desc: "All data stays private and secure in your browser."
          }].map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="dark:text-gray-500 bg-card p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
                <Icon className="text-blue-600 w-12 h-12 mb-4 mx-auto" />
                <h3 className="font-semibold mb-2 text-black dark:text-white">{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-background text-center">
        <h2 className="text-3xl font-semibold mb-12">Dashboard Preview</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Expense Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2">Item</th>
                    <th className="border-b px-4 py-2">Amount</th>
                    <th className="border-b px-4 py-2">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleExpenses.map((e, idx) => (
                    <tr key={idx}>
                      <td className="border-b px-4 py-2">{e.name}</td>
                      <td className="border-b px-4 py-2">${e.amount}</td>
                      <td className="border-b px-4 py-2">{e.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-card shadow">
            <h3 className="font-semibold mb-4">Expense Chart</h3>
            <div className="w-full h-48 mx-auto">
              <Pie data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12">What Our Users Say</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[{
            text: "This expense tracker completely changed how I manage my money. Simple and effective!",
            author: "Anna E."
          },{
            text: "I love seeing my spending trends. It helps me save more every month.",
            author: "James K."
          },{
            text: "Clean, easy to use, and very intuitive. Perfect for beginners and pros alike.",
            author: "Maria L."
          }].map((t, idx) => (
            <div key={idx} className="bg-card p-6 rounded-xl shadow">
              <p className="mb-4">{t.text}</p>
              <span className="font-semibold">— {t.author}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-background text-center">
        <h2 className="text-3xl font-semibold mb-12">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto text-left space-y-6">
          {[{
            q: "Is my data private?",
            a: "Yes! All your data is stored securely in your browser and never leaves it."
          },{
            q: "Can I track multiple categories?",
            a: "Absolutely! You can categorize your expenses any way you like."
          },{
            q: "Do I need an internet connection?",
            a: "No. Everything works offline because data is stored in your browser."
          }].map((faq, idx) => (
            <div key={idx} className="bg-card p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to Take Control?</h2>
        <p className="mb-8 max-w-xl mx-auto">Sign up now and start tracking your expenses today!</p>
        <button
          onClick={handleGetStarted}
          className="bg-white cursor-pointer text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition transform hover:scale-105"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        &copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.
      </footer>
    </div>
  </>
  )
}
