"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const foundUser = users.find((u) => u.email === stored);
        if (foundUser) setUser(foundUser);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    router.push("/");
  };

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
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold text-blue-600">
              Expense
              <span className="text-gray-800 dark:text-gray-200">
                Tracker
              </span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.path
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User + Mode Toggle + Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold">
                    Hi, {user.firstName}👋
                  </span>
                  <span className="text-xs text-gray-500">Welcome back!</span>
                </div>
                <Link
                  href="/profile"
                  className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-blue-600 text-white font-semibold text-lg"
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitial(user.firstName)
                  )}
                </Link>
              </>
            ) : (
              <span className="text-sm text-gray-500">Hi, Guest</span>
            )}

            <ModeToggle />

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden md:flex cursor-pointer bg-indigo-300/50 dark:bg-blue-600 dark:text-white font-bold px-3 py-1.5 rounded-md transition-all"
              >
                Logout
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {/* <span className="sr-only">Open menu</span> */}
              {menuOpen ? (
                <X className="w-6 h-6 transition-transform duration-300" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with smooth transition */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col justify-center items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm font-medium transition-colors ${
                pathname === link.path
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full text-left bg-blue-600 hover:bg-primary text-white px-3 py-1.5 rounded-md transition-all"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
