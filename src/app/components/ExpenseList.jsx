
"use client";
import React, { useState, useEffect } from "react";
import { Trash2, FileDown } from "lucide-react";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExpenseList({ expenses: initialExpenses, onDeleteExpense, onEditExpense }) {
  // Hooks
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedExpense, setEditedExpense] = useState({ name: "", amount: "", category: "", date: "" });

  //  Sync with initialExpenses from parent
  useEffect(() => {
    setExpenses(initialExpenses || []);
  }, [initialExpenses]);

  //  Auto-save
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

 const handleConfirmDelete = () => {
  let loggedInUserString = localStorage.getItem("loggedInUser");
  if (!loggedInUserString) return;

  let loggedInUser;
  // Safely parse the stored JSON object, falling back if it's just the email string
  try {
    loggedInUser = JSON.parse(loggedInUserString);
  } catch (error) {
    // Fallback: assume the stored value is just the email string
    loggedInUser = { email: loggedInUserString, expenses: [] }; 
    // We can pre-set expenses here to avoid needing to spread later, 
    // but the original logic is also fine.
  }

  // Ensure we have an email property to match against
  if (!loggedInUser || !loggedInUser.email) return;

  // 1. Update the 'users' list in localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const updatedUsers = users.map(u => 
    u.email === loggedInUser.email ? { ...u, expenses: [] } : u
  );
  localStorage.setItem("users", JSON.stringify(updatedUsers));

  // 2. Update the 'loggedInUser' item in localStorage
  const updatedLoggedInUser = { ...loggedInUser, expenses: [] };
  localStorage.setItem("loggedInUser", JSON.stringify(updatedLoggedInUser));

  // 3. Update component state and sync parent
  setExpenses([]);
  setShowConfirm(false);
  if (onDeleteExpense) onDeleteExpense([]); // sync parent
};

  //  Delete single expense (reverse index because we display reversed)
  const handleDelete = (index) => {
  const updated = expenses.filter((_, i) => i !== index);
  setExpenses(updated);
  if (onDeleteExpense) onDeleteExpense(updated);
};


  //  Edit logic
  const handleEditClick = (index) => {
    const realIndex = expenses.length - 1 - index;
    setEditingIndex(realIndex);
    setEditedExpense({ ...expenses[realIndex] });
  };

  const handleSaveEdit = () => {
    const updatedExpenses = [...expenses];
    updatedExpenses[editingIndex] = { ...editedExpense };
    setExpenses(updatedExpenses);
    if (onEditExpense) onEditExpense(updatedExpenses);
    setEditingIndex(null);
  };

  const handleEditChange = (field, value) => {
    setEditedExpense(prev => ({ ...prev, [field]: value }));
  };

  //  Export
  const handleExportCSV = () => {
    const csvRows = [
      ["Date", "Name", "Category", "Amount (XAF)"],
      ...expenses.map(e => [formatDateTime(e.date), e.name, e.category, e.amount])
    ];
    const blob = new Blob([csvRows.map(r => r.join(",")).join("\n")], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "expense_report.csv");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Expense Report", 14, 16);
    autoTable(doc, {
      startY: 25,
      head: [["Date", "Name", "Category", "Amount (XAF)"]],
      body: expenses.map(e => [formatDateTime(e.date), e.name, e.category, e.amount])
    });
    doc.save("expense_report.pdf");
  };


  return (
    <div className="w-full relative pt-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 md:gap-0 mb-3">
        <h2 className="text-2xl font-bold">Your Expenses</h2>

        <div className="flex justify-between items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-blue-700 text-white hover:opacity-80 cursor-pointer text-sm rounded-md flex items-center gap-2 shadow-md transition transform ease-in-out duration-300 hover:scale-105"
          >
            <FileDown size={16} className="hidden md:flex" /> Export CSV
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3 py-1.5 bg-blue-700 text-white hover:opacity-80 cursor-pointer text-sm rounded-md flex items-center gap-2 shadow-md transition transform ease-in-out duration-300 hover:scale-105"
          >
            <FileDown size={16} className="hidden md:flex" /> Export PDF
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="px-3 py-1.5 bg-[#c1121f] text-white cursor-pointer text-sm rounded-md flex items-center gap-2 shadow-md transition transform ease-in-out duration-300 hover:scale-105"
          >
            Empty List
          </button>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Empty Expense List?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-5">
              This will permanently delete all your expenses. Are you sure?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 cursor-pointer rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 cursor-pointer rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              >
                Empty List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
              Edit Expense
            </h3>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                value={editedExpense.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                className="border rounded-md px-3 py-2 text-sm w-full"
              />
              <input
                type="number"
                placeholder="Amount"
                value={editedExpense.amount}
                onChange={(e) => handleEditChange("amount", parseFloat(e.target.value))}
                className="border rounded-md px-3 py-2 text-sm w-full"
              />
              <input
                type="text"
                placeholder="Category"
                value={editedExpense.category}
                onChange={(e) => handleEditChange("category", e.target.value)}
                className="border rounded-md px-3 py-2 text-sm w-full"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditingIndex(null)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-400 cursor-pointer rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white rounded-md text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-3 font-semibold text-sm">Name</th>
              <th className="p-3 font-semibold text-sm">Amount (XAF)</th>
              <th className="p-3 font-semibold text-sm">Date & Time</th>
              <th className="p-3 font-semibold text-sm">Category</th>
              <th className="p-3 font-semibold text-sm text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, index) => (
              <tr key={index} className="border-b text-sm">
                <td className="p-3">{exp.name}</td>
                <td className="p-3">{exp.amount}</td>
                <td className="p-3">{formatDateTime(exp.date)}</td>
                <td className="p-3">{exp.category}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(index)}
                    className="cursor-pointer bg-red-400/10 px-3 py-.5 text-red-600 font-medium"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditClick(index)}
                    className="cursor-pointer bg-purple-500/10 px-5 py-.5 text-purple-600 font-medium ml-3"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Layout */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {expenses.map((exp, index) => (
          <div
            key={index}
            className="bg-card shadow-md rounded-lg p-3 relative"
          >
            <button
              onClick={() => handleDelete(index)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>

            <div className="text-sm">
              <p className="font-semibold">{exp.name}</p>
              <p className="text-gray-500">{exp.amount} XAF</p>
              <p className="text-gray-500">{exp.category}</p>
              <p className="text-gray-400 text-xs">{formatDateTime(exp.date)}</p>
            </div>

            <button
              onClick={() => handleEditClick(index)}
              className="mt-2 text-purple-600 text-sm underline"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      <p className="text-right font-bold mt-4 text-green-600">
        Total: {total.toFixed(2)} XAF
      </p>
    </div>
  );
}