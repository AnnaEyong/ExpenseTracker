"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    if (loggedInUser?.expenses) {
      setExpenses(loggedInUser.expenses);
    } else {
      const saved = JSON.parse(localStorage.getItem("expenses") || "[]");
      setExpenses(saved);
    }
  }, []);

  // Save and sync globally
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));

    let loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) return;
    try {
      loggedInUser = JSON.parse(loggedInUser);
    } catch {
      loggedInUser = { email: loggedInUser };
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map(u =>
      u.email === loggedInUser.email ? { ...u, expenses } : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("loggedInUser", JSON.stringify({ ...loggedInUser, expenses }));
  }, [expenses]);

  return (
    <ExpenseContext.Provider value={{ expenses, setExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
