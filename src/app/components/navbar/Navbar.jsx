"use client";
import Link from 'next/link'
import React from "react";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { List } from "lucide-react"
import { useEffect } from 'react'
import { useState } from "react"

export default function Navbar({ user = { name: "Anna" } }) {
  const pathname = usePathname();

  // Helper to get the first letter of the user's name
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Reports", path: "/reports" },
    { name: "Profile", path: "/profile" },
  ];


  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/60 backdrop-blur-md shadow-sm z-50 border-b border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold text-blue-600">
              Expense<span className="text-gray-800 dark:text-gray-200">Tracker</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.path
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          

          {/* User + Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold">
                Hi, {user.name}
              </span>
              <span className="text-xs text-gray-500">Welcome back!</span>
            </div>

            {/* Profile Image / Initial */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-blue-600 text-white font-bold text-lg">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitial(user.name)
              )}
            </div>

              <List className='flex md:hidden'/>

                {/* SLIDEBAR */}
            {/* <div className={menu ${isOpen ? 'open' : ''}}>
                <div className='flex flex-col w-inherit'>
                    <Link href='/' onClick={handleClick} className='button pl-8 bg-[#1a1a1a] focus:bg-white/10 text-left cursor-pointer border-b-1 border-[#262626] flex gap-4 items-center'>Home</Link>
                    <Link href='/dashboard' onClick={handleClick} className='button pl-8 bg-[#1a1a1a] focus:bg-white/10 text-left cursor-pointer border-b-1 border-[#262626] flex gap-4 items-center'>Dashboard</Link>
                    <Link href='/profile' onClick={handleClick} className='button pl-8 bg-[#1a1a1a] focus:bg-white/10 text-left cursor-pointer border-b-1 border-[#262626] flex gap-4 items-center'>Profile</Link>
                    <Link href='/contact' onClick={handleClick} className='button pl-8 bg-[#1a1a1a] focus:bg-white/10 text-left cursor-pointer border-b-1 border-[#262626] flex gap-4 items-center'>Contact Us</Link>
                </div>
            </div> */}

            <ModeToggle />

            {/* <button
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition"
              onClick={() => alert("Logout clicked")}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}