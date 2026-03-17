"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MetricCard from "../components/MetricCard";
import Navbar from "../components/navbar/Navbar";
import BarChart from "../components/BarChart";

const ChartPlaceholder = ({ title, data, type }) => {
  let content;

  if (type === "line" && data) {
    const latestValue = data.data.length ? data.data[data.data.length - 1] : 0;
    content = (
      <div className="p-4  text-sm text-gray-400">
        <p>
          Trend points: {data.labels.length} (Latest cumulative expense: {Math.round(latestValue).toLocaleString()} XAF)
        </p>
        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
          Expense Trend Snapshot
        </div>
      </div>
    );
  } else if (type === "donut" && data) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    content = (
      <div className="p-4 text-sm h-53">
        <p className="text-gray-400">Total Expenses: {total.toLocaleString()} XAF</p>
        <ul className="mt-2 space-y-1">
          {data.map((item) => (
            <li key={item.name} className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color || "#9CA3AF" }}></span>
                {item.name}
              </span>
              <span className="font-semibold">{item.value.toLocaleString()} XAF</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-white">{title}</h3>
      {content}
    </div>
  );
};

export default function AnalyticsDashboard() {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        const authData = localStorage.getItem("user");
        const token = authData ? JSON.parse(authData)?.token : null;

        if (!token) {
          router.push("/login");
          return;
        }

        const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) {
          router.push("/login");
          return;
        }

        const profilePayload = await profileResponse.json();
        const profileUser = profilePayload?.data;

        if (!profileUser) {
          router.push("/login");
          return;
        }

        const normalizedUser = {
          ...profileUser,
          id: profileUser._id || profileUser.id,
          firstName: profileUser.first_name || "",
        };

        const categoriesResponse = await fetch(`${API_BASE_URL}/category/find`);
        const categoriesPayload = categoriesResponse.ok ? await categoriesResponse.json() : { data: [] };
        const categoryList = Array.isArray(categoriesPayload?.data) ? categoriesPayload.data : [];

        const expensesResponse = await fetch(`${API_BASE_URL}/expense/find?user=${normalizedUser.id}`);
        const expensesPayload = expensesResponse.ok ? await expensesResponse.json() : { data: [] };
        const expenseList = Array.isArray(expensesPayload?.data) ? expensesPayload.data : [];

        const categoryMap = new Map(categoryList.map((cat) => [String(cat._id), { name: cat.name, color: cat.color }]));
        const normalizedExpenses = expenseList.map((expenseItem) => {
          const categoryId = typeof expenseItem.category === "object" ? expenseItem.category?._id : expenseItem.category;
          const categoryMeta =
            (typeof expenseItem.category === "object" && expenseItem.category
              ? { name: expenseItem.category.name, color: expenseItem.category.color }
              : null) || categoryMap.get(String(categoryId)) || { name: "Others", color: "#9CA3AF" };

          return {
            id: expenseItem._id || expenseItem.id,
            amount: Number(expenseItem.amount) || 0,
            category: categoryMeta.name,
            categoryColor: categoryMeta.color || "#9CA3AF",
            date: expenseItem.createdAt || expenseItem.date || new Date().toISOString(),
          };
        });

        setUser(normalizedUser);
        setBudget(Number(profileUser.budget) || 0);
        setCategories(categoryList);
        setExpenses(normalizedExpenses);
      } catch {
        router.push("/login");
      }
    };

    loadAnalyticsData();
  }, [router, API_BASE_URL]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const previousMonth = previousMonthDate.getMonth();
  const previousYear = previousMonthDate.getFullYear();

  const currentMonthExpenses = expenses.filter((expenseItem) => {
    const date = new Date(expenseItem.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const previousMonthExpenses = expenses.filter((expenseItem) => {
    const date = new Date(expenseItem.date);
    return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
  });

  const totalExpenses = expenses.reduce((sum, expenseItem) => sum + expenseItem.amount, 0);
  const currentMonthTotal = currentMonthExpenses.reduce((sum, expenseItem) => sum + expenseItem.amount, 0);
  const previousMonthTotal = previousMonthExpenses.reduce((sum, expenseItem) => sum + expenseItem.amount, 0);
  const remainingBalance = budget - totalExpenses;

  const monthDeltaPercent = previousMonthTotal
    ? Number((((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100).toFixed(1))
    : currentMonthTotal > 0
      ? 100
      : 0;

  const metricCards = [
    {
      title: "Total balance",
      value: remainingBalance,
      changePercent: Math.abs(monthDeltaPercent),
      changeValue: expenses.length,
      description: "Balance after all recorded expenses",
      isPositive: remainingBalance >= 0,
    },
    {
      title: "Budget",
      value: budget,
      changePercent: 0,
      changeValue: currentMonthExpenses.length,
      description: "Current configured budget",
      isPositive: true,
    },
    {
      title: "Expense",
      value: totalExpenses,
      changePercent: Math.abs(monthDeltaPercent),
      changeValue: currentMonthExpenses.length,
      description: "Total spending across all time",
      isPositive: false,
    },
  ];

  const lineChartData = useMemo(() => {
    const sorted = [...expenses]
      .filter((expenseItem) => expenseItem.date)
      .sort((firstItem, secondItem) => new Date(firstItem.date) - new Date(secondItem.date));

    let cumulative = 0;
    const labels = [];
    const data = [];

    sorted.forEach((expenseItem) => {
      cumulative += expenseItem.amount;
      const date = new Date(expenseItem.date);
      labels.push(`${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`);
      data.push(cumulative);
    });

    return { labels, data };
  }, [expenses]);

  const donutChartData = useMemo(() => {
    const bucket = {};
    expenses.forEach((expenseItem) => {
      if (!bucket[expenseItem.category]) {
        bucket[expenseItem.category] = { value: 0, color: expenseItem.categoryColor || "#9CA3AF" };
      }
      bucket[expenseItem.category].value += expenseItem.amount;
    });

    return Object.entries(bucket).map(([name, value]) => ({ name, ...value }));
  }, [expenses]);

  const barChartData = useMemo(() => {
    const points = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(currentYear, currentMonth - offset, 1);
      const month = date.toLocaleString("en-US", { month: "short" });
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      const monthExpense = expenses
        .filter((expenseItem) => {
          const expenseDate = new Date(expenseItem.date);
          return expenseDate.getMonth() === monthIndex && expenseDate.getFullYear() === year;
        })
        .reduce((sum, expenseItem) => sum + expenseItem.amount, 0);

      points.push({
        month,
        budget,
        expense: monthExpense,
      });
    }
    return points;
  }, [expenses, budget, currentMonth, currentYear]);

  return (
    <>
      <Navbar user={user} />
      <main className="mt-5 max-w-5xl mx-auto">
        <div className="px-4 py-20">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-gray-500 mt-1">Detailed overview of your financial situation</p>
            </div>
            <div className="flex space-x-4">
              <select className="p-2 border rounded-lg text-sm shadow bg-background" defaultValue="This month">
                <option>This month</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-6 mb-8">
            {metricCards.map((card) => (
              <MetricCard key={card.title} {...card} />
            ))}
          </div>

          <div className="bg-card rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="col-span-2 h-full">
                <ChartPlaceholder title="Total expense trend" data={lineChartData} type="line" />
              </div>
              <div className="col-span-1 h-full">
                <ChartPlaceholder title="Category statistics" data={donutChartData} type="donut" />
              </div>
            </div>

            <BarChart dataPoints={barChartData} />
          </div>
        </div>
      </main>
    </>
  );
}