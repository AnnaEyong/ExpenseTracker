"use client";
import React, { useEffect, useState } from "react";

export default function ExpenseForm({ onAddExpense, categories = [] }) {
  const categoryOptions = categories.length
    ? categories
    : [
        { name: "Food", icon: "🍽️" },
        { name: "Transport", icon: "🚌" },
        { name: "Shopping", icon: "🛍️" },
        { name: "Bills", icon: "🧾" },
        { name: "Internet", icon: "🌐" },
        { name: "Others", icon: "📦" },
      ];
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]?.name || "Food");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!categoryOptions.length) return;
    if (!categoryOptions.some((cat) => cat.name === category)) {
      setCategory(categoryOptions[0].name);
    }
  }, [categoryOptions, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !amount) {
      alert("Please fill in all fields");
      return;
    }

    const newExpense = {
      name,
      amount: parseFloat(amount),
      category,
      date: new Date().toLocaleDateString(),
    };

    try {
      setIsSubmitting(true);
      const success = await onAddExpense(newExpense);
      if (!success) return;

      setName("");
      setAmount("");
      setCategory(categoryOptions[0]?.name || "Food");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mb-6 border-b pb-6"
    >
      <div>
        <label className="block text-gray-700 dark:text-white font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg p-2"
          placeholder="e.g. Lunch at KFC"
        />
      </div>

      <div>
        <label className="block text-gray-700 dark:text-white font-medium mb-1">Amount (XAF)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-lg p-2"
          placeholder="e.g. 2000"
        />
      </div>

      <div>
        <label className="block text-gray-700 dark:text-white font-medium mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-card border rounded-lg p-2"
        >
          {categoryOptions.map((cat) => (
            <option key={cat._id || cat.name} value={cat.name}>
              {cat.icon ? `${cat.icon} ${cat.name}` : cat.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {isSubmitting ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}
