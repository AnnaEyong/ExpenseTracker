"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

  const DEFAULT_DATA = {
    email: "",
    password: "",
  }

  const router = useRouter();
  const [login, setLogin] = useState(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];
      if (!payload) return null;
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(normalized));
    } catch {
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

     try {
      const request = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(login),
      });

      if (request.ok) {
          const response = await request.json();

          // console.log('====================================');
          // console.log(response);
          // console.log('====================================');

          const token = response.data.token;
          localStorage.removeItem("loggedInUser");
          localStorage.setItem('user', JSON.stringify({ token }));

          const decoded = decodeToken(token);
          const fallbackLoggedInUser = {
            email: decoded?.email || login.email,
            first_name: "",
            expenses: [],
            budget: 0,
          };
          localStorage.setItem("loggedInUser", JSON.stringify(fallbackLoggedInUser));

          const profileRequest = await fetch(`${API_BASE_URL}/user/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (profileRequest.ok) {
            const profileResponse = await profileRequest.json();
            const profileData = profileResponse?.data;

            if (profileData) {
              const dashboardCompatibleUser = {
                ...profileData,
                expenses: Array.isArray(profileData.expenses) ? profileData.expenses : [],
                budget: Number(profileData.budget) || 0,
              };
              localStorage.setItem("loggedInUser", JSON.stringify(dashboardCompatibleUser));
            }
          }

          alert(response.message || "Login successful!"); 
          setLogin(DEFAULT_DATA);
          router.push("/dashboard");
        } else {
          const errorData = await request.json();
          setError(errorData.message || "Login failed!");
        }

     } catch (error) {
      setError(error.message || "An error occurred during login. Please try again.");
     } finally {
      setIsLoading(false);
     }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={login.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Password Input with Eye Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={login.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

           {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  )
}