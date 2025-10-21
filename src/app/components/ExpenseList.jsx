"use client";
import React from "react";
import { Trash2 } from "lucide-react";

export default function ExpenseList({ expenses, onDeleteExpense, onDeleteAll }) {
  if (expenses.length === 0) {
    return <p className="text-center text-gray-500">No expenses yet.</p>;
  }

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-800">
          Expense Summary
        </h2>

        {/* Delete All Button */}
        <button
          onClick={onDeleteAll}
          className="flex items-center gap-1 px-3 py-1.5 text-red-500 dark:text-[#c1121f] hover:text-red-600 dark:hover:bg-[#223955] cursor-pointer text-sm rounded-md shadow-sm transition"
        >
          {/* <Trash2 size={16} /> */}
          Empty List
        </button>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-[#223955] text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Amount (XAF)</th>
              <th className="p-3">Category</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, index) => (
              <tr key={index} className="border-b border-black text-gray-500 hover:bg-gray-100 dark:hover:bg-[#223955]">
                <td className="p-3 border-b">{exp.name}</td>
                <td className="p-3 border-b">{exp.amount}</td>
                <td className="p-3 border-b">{exp.category}</td>
                <td className="p-3 border-b">{formatDate(exp.date)}</td>
                <td className="p-3 border-b  hover:bg-gray-100 dark:hover:bg-[#223955] text-center">
                  <button
                    onClick={() => onDeleteExpense(index)}
                    className="text-red-500 dark:text-[#c1121f] cursor-pointer hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {expenses.map((exp, index) => (
          <div
            key={index}
            className="border border-secondary rounded-lg shadow-sm p-3 relative"
          >
            <button
              onClick={() => onDeleteExpense(index)}
              className="absolute top-3 right-3 text-red-500 dark:text-[#c1121f] hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>

            <div className="text-sm">
              <p className="font-semibold">{exp.name}</p>
              <p className="text-gray-500">{exp.amount} XAF</p>
              <p className="text-gray-500">{exp.category}</p>
              <p className="text-gray-400 text-xs">{formatDate(exp.date)}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-right font-semibold mt-4 text-gray-700 dark:text-white">
        Total: {total.toFixed(2)} XAF
      </p>
    </div>
  );
}
