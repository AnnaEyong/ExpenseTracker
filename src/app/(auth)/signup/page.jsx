"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const DEFAULT_DATA = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  }
  const router = useRouter();
  const [formData, setFormData] = useState(DEFAULT_DATA );
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
     console.log("Form Data:", formData);

     try {
      const request = await fetch("http://localhost:5050/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (request.ok) {
        const response = await request.json();
        alert(response.message || "Signup successful.");
      }

      setFormData(DEFAULT_DATA );
      router.push("/login");
     } catch (error) {
      alert("Error: ", error.message || "An error occurred during signup. Please try again.");
     } finally {
      setIsLoading(false);
     }
  }

  return (
    <div className="reltive h-screen flex items-center justify-center bg-background p-4 md:p-0">
      <div className="bg-card trasparent-xl mx-4 p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up Your <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Expense<span className="text-gray-800 dark:text-gray-200">Tracker</span>
            </span></h2>

        {/* {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>} */}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="first_name"
              placeholder="John"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="+237 6XX XXX XXX"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="John@1234"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showConfirmPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}
