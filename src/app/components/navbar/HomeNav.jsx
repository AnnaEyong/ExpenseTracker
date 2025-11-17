"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";

export default function Navbar({ user = { name: "Anna" } }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-background backdrop-blur-md  border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Expense<span className="text-gray-800 dark:text-gray-200">Tracker</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-3 items-center">

            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer text-black dark:text-white dark:bg-black/10 border-1 dark:hover:bg-white/20 rounded-full transition ease-in-out duration-500 hover:text-indigo-600 dark:hover:text-black py-1 px-4"
            >
              SignUp
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer text-black dark:text-white dark:bg-black/10 border-1 dark:hover:bg-white/20 rounded-full transition ease-in-out duration-500 hover:text-indigo-600 dark:hover:text-black py-1 px-4"
            >
              Login
            </Link>

            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden flex items-center justify-center gap-3 py-4 animate-fadeIn">

            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer text-black dark:text-white dark:bg-black/10 border-1 dark:hover:bg-white/20 rounded-full transition ease-in-out duration-500 hover:text-indigo-600 dark:hover:text-black py-1 px-4"
            >
              SignUp
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer text-black dark:text-white dark:bg-black/10 border-1 dark:hover:bg-white/20 rounded-full transition ease-in-out duration-500 hover:text-indigo-600 dark:hover:text-black py-1 px-4"
            >
              Login
            </Link>

            <div className="px-2">
              <ModeToggle />
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}
