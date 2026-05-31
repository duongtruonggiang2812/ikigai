"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.")
      return
    }
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess("Đặt lại mật khẩu thành công!")
      setTimeout(() => router.push("/dashboard"), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full animate-fade-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <p className="text-3xl font-light text-orange-300 tracking-widest">生き甲斐</p>
            <p className="text-xl font-black text-gray-900">Ikigai</p>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-black text-gray-900 mb-1">Đặt lại mật khẩu</h2>
          <p className="text-xs text-gray-400 mb-5">Nhập mật khẩu mới cho tài khoản của bạn.</p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-4 text-sm text-green-700 text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="font-bold">{success}</p>
              <p className="text-xs mt-1 text-green-500">Đang chuyển hướng...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ít nhất 6 ký tự"
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-xs"
                    tabIndex={-1}
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
                {/* Strength indicator */}
                {password.length > 0 && (
                  <div className="mt-1.5 flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          password.length >= i * 3
                            ? i <= 1 ? "bg-red-400" : i <= 2 ? "bg-yellow-400" : i <= 3 ? "bg-blue-400" : "bg-green-400"
                            : "bg-gray-100"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">
                      {password.length < 4 ? "Quá ngắn" : password.length < 7 ? "Yếu" : password.length < 10 ? "Trung bình" : "Mạnh"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    required
                    className={`w-full bg-white border rounded-xl px-3 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                      confirm && confirm !== password
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : confirm && confirm === password
                        ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                        : "border-gray-300 focus:border-orange-400 focus:ring-orange-100"
                    }`}
                  />
                  {confirm && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                      {confirm === password ? "✓" : "✗"}
                    </span>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="w-full bg-orange-500 text-white py-3 rounded-2xl font-black text-sm hover:bg-orange-600 disabled:opacity-60 active:scale-95 transition-all shadow-lg shadow-orange-200"
              >
                {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu →"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          <Link href="/login" className="hover:text-orange-500 transition-colors">← Về trang đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
