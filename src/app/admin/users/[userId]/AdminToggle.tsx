"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminToggle({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const [admin, setAdmin] = useState(isAdmin)
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const router = useRouter()

  async function handleToggle() {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 3000)
      return
    }
    setLoading(true)
    setConfirm(false)
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_admin: !admin }),
    })
    if (res.ok) {
      setAdmin(!admin)
      router.refresh()
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold text-gray-400 animate-pulse">
        Đang cập nhật...
      </div>
    )
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Xác nhận {admin ? "xóa" : "cấp"} quyền admin?</span>
        <button
          onClick={handleToggle}
          className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
        >
          Xác nhận
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors"
        >
          Hủy
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        admin
          ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {admin ? "⚡ Admin — Xóa quyền" : "Cấp quyền Admin"}
    </button>
  )
}
