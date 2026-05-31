"use client"

import { useState } from "react"
import Link from "next/link"

type User = {
  id: string
  name: string
  email: string
  isAdmin: boolean
  quizCount: number
  joinedAt: string
}

export default function UserTable({ users }: { users: User[] }) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "admin" | "user">("all")

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === "all" || (filter === "admin" ? u.isAdmin : !u.isAdmin)
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-4">
      {/* Search + filter bar */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white"
          />
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {(["all", "admin", "user"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {f === "all" ? "Tất cả" : f === "admin" ? "Admin" : "User"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tên</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Vai trò</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Quiz</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Đăng ký</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-black text-orange-600 shrink-0">
                          {u.name !== "—" ? u.name[0].toUpperCase() : "?"}
                        </div>
                        <span className="font-semibold text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{u.email}</td>
                    <td className="px-5 py-3">
                      {u.isAdmin ? (
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">⚡ Admin</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">User</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-bold text-gray-700">{u.quizCount}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {new Date(u.joinedAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="text-xs text-blue-600 hover:underline font-semibold whitespace-nowrap"
                      >
                        Chi tiết →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-right">
        Hiển thị {filtered.length}/{users.length} người dùng
      </p>
    </div>
  )
}
