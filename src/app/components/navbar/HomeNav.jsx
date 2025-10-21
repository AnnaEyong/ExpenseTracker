"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import Link from 'next/link';


export default function Navbar({ user = { name: "Anna" } }) {
  const pathname = usePathname();

  // Helper to get the first letter of the user's name
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 backdrop-blur-md shadow-sm z-50 border-b border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">
              Expense<span className="text-gray-800 dark:text-gray-200">Tracker</span>
            </span>
          </div>

          
            <div className='flex gap-2 items-center'>
                <Link href='signup' className='cursor-pointer'>SignUp</Link>
                <Link href='login' className='cursor-pointer'>Login</Link>
                <ModeToggle/>
            </div>

            {/* <button
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition"
              onClick={() => alert("Logout clicked")}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button> */}
          </div>
        </div>
    </nav>
  );
}
