"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar/Navbar";
import {
  PieChart,
  BarChart3,
  CalendarRange,
  FileDown,
  DollarSign,
  List,
} from "lucide-react";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!loggedInUser) {
      router.push("/login");
      return;
    }

    const currentUser = users.find((u) => u.name === loggedInUser);
    setUser(currentUser);
    setExpenses(currentUser?.expenses || []);
  }, [router]);

  // ✅ Filter expenses (by name, category, or date) and date range
  const filteredExpenses = expenses.filter((e) => {
    const searchLower = search.toLowerCase();

    const matchesSearch =
      e.name.toLowerCase().includes(searchLower) ||
      e.category.toLowerCase().includes(searchLower) ||
      (e.date && e.date.toLowerCase().includes(searchLower));

    const expenseDate = new Date(e.date);
    const withinRange =
      (!startDate || expenseDate >= new Date(startDate)) &&
      (!endDate || expenseDate <= new Date(endDate));

    return matchesSearch && withinRange;
  });

  // ✅ Summary Calculations
  const totalSpent = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );
  const numTransactions = filteredExpenses.length;

  const categoryTotals = filteredExpenses.reduce((acc, e) => {
    if (!acc[e.category]) acc[e.category] = 0;
    acc[e.category] += Number(e.amount);
    return acc;
  }, {});

  const topCategory =
    Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const avgDaily =
    numTransactions > 0
      ? (
          totalSpent /
          new Set(filteredExpenses.map((e) => e.date)).size
        ).toFixed(2)
      : 0;

  // ✅ Chart Data
  const trendData = {
    labels: filteredExpenses.map((e) => e.date),
    datasets: [
      {
        label: "Daily Spending (₦)",
        data: filteredExpenses.map((e) => e.amount),
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.3,
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
        ],
      },
    ],
  };

  // ✅ Export CSV
  const handleExportCSV = () => {
    const csvRows = [
      ["Date", "Name", "Category", "Amount (₦)"],
      ...filteredExpenses.map((e) => [e.date, e.name, e.category, e.amount]),
    ];
    const blob = new Blob([csvRows.map((r) => r.join(",")).join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "expense_report.csv");
  };

  // ✅ Export PDF (fixed)
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Expense Report", 14, 16);
    autoTable(doc, {
      startY: 25,
      head: [["Date", "Name", "Category", "Amount (₦)"]],
      body: filteredExpenses.map((e) => [
        e.date,
        e.name,
        e.category,
        e.amount,
      ]),
    });
    doc.save("expense_report.pdf");
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading reports...
      </div>
    );

  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen py-10 px-3 md:px-18 lg:px-20 xl:px-40 pt-20">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <BarChart3 className="text-blue-600" /> Reports & Insights
            </h1>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-100"
              >
                <FileDown size={16} /> Export CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-100"
              >
                <FileDown size={16} /> Export PDF
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-lg p-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Search name, category, or date"
              className="border rounded-lg p-2 md:col-span-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <SummaryCard
              icon={<DollarSign />}
              label="Overall Amt Spent"
              value={`₦${totalSpent}`}
            />
            <SummaryCard
              icon={<List />}
              label="Overall Transactions"
              value={numTransactions}
            />
            <SummaryCard
              icon={<PieChart />}
              label="Top Category"
              value={topCategory}
            />
            <SummaryCard
              icon={<CalendarRange />}
              label="Avg Daily Spend"
              value={`₦${avgDaily}`}
            />
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div className="bg-card p-4 flex flex-col items-center rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
              <h3 className="font-semibold text-lg mb-2">Spending Trend</h3>
              <Line data={trendData} />
            </div>
            <div className="bg-card p-4 rounded-xl flex flex-col items-center shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
              <h3 className="font-semibold text-lg mb-2">Category Breakdown</h3>
              <div className="border-2 w-full h-64 flex justify-center">
                <Pie data={categoryData} />
              </div>
            </div>
          </div>

          {/* Expense Table */}
          <div className="bg-card p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] mt-8 overflow-x-auto">
            <h3 className="font-semibold mb-4">Expense History</h3>
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 dark:bg-[#223955]">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-right">Amount (₦)</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((e, i) => (
                  <tr
                    key={i}
                    className="border-b dark:hover:bg-[#223955] hover:bg-gray-50"
                  >
                    <td className="p-2">{e.date}</td>
                    <td className="p-2">{e.name}</td>
                    <td className="p-2">{e.category}</td>
                    <td className="p-2 text-right">{e.amount}</td>
                  </tr>
                ))}
                {filteredExpenses.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center text-gray-500 py-3"
                    >
                      No expenses found for this filter
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// ✅ Reusable Summary Card
function SummaryCard({ icon, label, value }) {
  return (
    <div className="bg-card rounded-xl p-4 flex flex-col items-center gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
      <div className="text-blue-600">{icon}</div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
