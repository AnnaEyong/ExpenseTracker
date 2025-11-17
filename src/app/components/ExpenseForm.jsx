"use client";
import { Hamburger, CarTaxiFront, Wifi, ShoppingCart, Receipt } from "lucide-react";
import React, { useState } from "react";

export default function ExpenseForm({ onAddExpense }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const handleSubmit = (e) => {
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

    onAddExpense(newExpense);
    setName("");
    setAmount("");
    setCategory("Food");
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
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Internet</option>
          <option>Others</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Add Expense
      </button>
    </form>
  );
}
