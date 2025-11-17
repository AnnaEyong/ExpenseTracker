"use client"
export default function AlertNotification({ message }) {
  let bgColor = "bg-yellow-200/60 text-yellow-900"

  if (message.includes("exceeded")) {
    bgColor = "bg-red-200 text-red-800"
  } else if (message.includes("met")) {
    bgColor = "bg-green-200 text-green-800"
  }

  return (
    <div className={`${bgColor} p-4 rounded-lg mb-6 font-semibold`}>
      {message}
    </div>
  )
}
