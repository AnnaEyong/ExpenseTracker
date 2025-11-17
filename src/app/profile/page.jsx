"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "../components/navbar/Navbar"
import toast, { Toaster } from "react-hot-toast"
import { Pencil, Eye, EyeOff } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({})
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profilePicPreview, setProfilePicPreview] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Load user on mount
  useEffect(() => {
    let storedUser = localStorage.getItem("loggedInUser")
    const users = JSON.parse(localStorage.getItem("users")) || []

    try {
      storedUser = JSON.parse(storedUser)
    } catch {
      storedUser = { email: storedUser }
    }

    if (!storedUser || !storedUser.email) {
      router.push("/login")
      return
    }

    const currentUser = users.find(u => u.email === storedUser.email)
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setFormData(currentUser)
    setProfilePicPreview(currentUser.profilePic || null)
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

const handleProfilePic = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const imgDataUrl = reader.result // Base64 Data URL

      // 1. Create Image object to get dimensions
      const img = new Image()
      img.onload = () => {
        const MAX_SIZE = 200 // Max width/height in pixels
        let width = img.width
        let height = img.height

        // Calculate the new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width
            width = MAX_SIZE
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height
            height = MAX_SIZE
          }
        }

        // 2. Create a canvas element
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")

        // 3. Draw the image onto the canvas at the new dimensions
        ctx.drawImage(img, 0, 0, width, height)

        // 4. Compress and get the final Base64 string (JPEG quality 0.8)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8)

        // Update state with the compressed image
        setProfilePicPreview(compressedDataUrl)
        setFormData((prev) => ({ ...prev, profilePic: compressedDataUrl }))
      }
      img.src = imgDataUrl
    }
    reader.readAsDataURL(file)
  }

  // FIXED handleSave
  const handleSave = (e) => {
    e.preventDefault()

    const users = JSON.parse(localStorage.getItem("users") || "[]")

    const updatedUser = {
      ...formData,
      profilePic: profilePicPreview || formData.profilePic,
      password: password || formData.password,
    }

    const updatedUsers = users.map(u =>
      u.email === user.email ? updatedUser : u
    )

    //  Update both user lists
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser))
    setUser(updatedUser)

    //  Sync across tabs/pages
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("userUpdated", { detail: updatedUser }))
    }

    toast.success("Profile updated successfully!")
    router.push("/dashboard")
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser")
    router.push("/")
  }

  const handleConfirmDelete = () => {
    const users = JSON.parse(localStorage.getItem("users")) || []
    const remainingUsers = users.filter((u) => u.email !== user.email)
    localStorage.setItem("users", JSON.stringify(remainingUsers))
    localStorage.removeItem("loggedInUser")
    setShowDeleteModal(false)
    toast.success("Account deleted successfully!")
    router.push("/")
  }

  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-300">
  //       Loading profile...
  //     </div>
  //   )
  // }

  return (
    <>
      <Navbar user={user} />
      <Toaster position="top-right" />
      <div className="min-h-screen py-10 px-4 pt-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6">
          <h2 className="text-2xl text-center font-semibold text-gray-800 dark:text-gray-100">
            Your Profile
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Profile Picture */}
            <div className="flex items-center justify-center gap-4">
              <div className="relative w-24 h-24">
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-3xl font-bold text-white overflow-hidden shadow-md">
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (formData.firstName || user.firstName || "U").charAt(0).toUpperCase()
                  )}
                </div>
                <label
                  htmlFor="profilePicInput"
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-md border-1 border-white dark:border-gray-800"
                  title="Change profile picture"
                >
                  <Pencil size={16} />
                </label>
                <input
                  id="profilePicInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePic}
                />
              </div>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            {/* Email */}
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

            {/* Budget */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Monthly Budget (XAF)</label>
              <input
                type="number"
                name="budget"
                value={formData.budget || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* About */}
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

            {/* Password */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Contact Info */}
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

            {/* Frequent Categories */}
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

            {/* Actions */}
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
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full transition-all"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Confirm Account Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-5">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 cursor-pointer py-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 cursor-pointer py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
