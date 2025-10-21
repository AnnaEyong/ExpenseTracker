"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "../components/navbar/Navbar"
import toast, { Toaster } from "react-hot-toast"
import { Pencil } from "lucide-react"


export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)        // current persisted user
  const [formData, setFormData] = useState({})  // editable form (local)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profilePicPreview, setProfilePicPreview] = useState(null) // preview only

  // load persisted user and populate formData (only once on mount)
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser")
    const users = JSON.parse(localStorage.getItem("users")) || []

    if (!loggedInUser) {
      router.push("/login")
      return
    }

    const currentUser = users.find(u => u.name === loggedInUser)
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)         // persisted user (used for Navbar prop)
    setFormData(currentUser)     // copy into editable form
    setProfilePicPreview(currentUser.profilePic || null) // preview initial
  }, [router])

  // form inputs (name, email, budget, about, phone, etc.)
  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // PROFILE PICTURE UPLOAD -> LOCAL PREVIEW ONLY
  // IMPORTANT: DO NOT call setUser, do not write localStorage, do not dispatch event here
  const handleProfilePic = e => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const imgData = reader.result
      setProfilePicPreview(imgData)               // preview on profile page
      setFormData(prev => ({ ...prev, profilePic: imgData })) // include in form so Save persists it
      // ---- NO setUser(), NO localStorage write, NO window.dispatchEvent() here ----
    }
    reader.readAsDataURL(file)
  }

  // SAVE: validate, persist to localStorage, update user state, dispatch event, redirect
  const handleSave = e => {
    e.preventDefault()

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    const users = JSON.parse(localStorage.getItem("users")) || []

    const updatedUser = {
      ...formData,
      profilePic: profilePicPreview || formData.profilePic,
      password: password || formData.password
    }

    // persist
    const updatedUsers = users.map(u => (u.name === user.name ? updatedUser : u))
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    localStorage.setItem("loggedInUser", updatedUser.name)

    // update in-page persisted user state
    setUser(updatedUser)

    // notify other components (Navbar) — ONLY HERE (on Save)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("userUpdated", { detail: updatedUser }))
    }

    // redirect to dashboard
    router.push("/dashboard")
  }

  const handleDeleteAccount = () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return
    const users = JSON.parse(localStorage.getItem("users")) || []
    const remainingUsers = users.filter(u => u.name !== user.name)
    localStorage.setItem("users", JSON.stringify(remainingUsers))
    localStorage.removeItem("loggedInUser")
    router.push("/login")
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser")
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-300">
        Loading profile...
      </div>
    )
  }

  return (
    <>
      {/* pass persisted user to Navbar (it will update on the custom event) */}
      <Navbar user={user} />
      <Toaster position="top-right" />
      <div className="min-h-screen py-10 px-4 pt-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Your Profile
          </h2>

          <form onSubmit={handleSave} className="space-y-4">

            {/* Profile Picture (circle with edit icon) */}
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              {/* Circle preview */}
              <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-3xl font-bold text-white overflow-hidden shadow-md">
                {profilePicPreview ? (
                  <img
                    src={profilePicPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (formData.name || user.name || "U").charAt(0).toUpperCase()
                )}
              </div>
              
              {/* Edit icon (bottom-right overlay) */}
              <label
                htmlFor="profilePicInput"
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-md border-2 border-white dark:border-gray-800"
                title="Change profile picture"
              >
                <Pencil size={16} />
              </label>
              
              {/* Hidden input */}
              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePic}
              />
            </div>
          </div>


            {/* NAME */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* BUDGET */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Monthly Budget (₦)</label>
              <input
                type="number"
                name="budget"
                value={formData.budget || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* ABOUT */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">About Me</label>
              <textarea
                name="about"
                rows="3"
                value={formData.about || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              ></textarea>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* CONFIRM */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* CONTACT INFO */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* FREQUENT CATEGORIES */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Frequent Categories (comma separated)</label>
              <input
                type="text"
                name="frequentCategories"
                value={formData.frequentCategories || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition-all"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg w-full transition-all"
              >
                Logout
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full transition-all"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
