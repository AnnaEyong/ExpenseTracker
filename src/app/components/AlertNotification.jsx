"use client"
export default function AlertNotification({ message }) {
  let bgColor = "bg-yellow-200 text-yellow-800"

  if (message.includes("exceeded")) {
    bgColor = "bg-red-200 text-red-800"
  }

  return (
    <div className={`${bgColor} p-4 rounded-xl mb-6 font-semibold`}>
      {message}
    </div>
  )
}
