"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })
        if (error) throw error
        setSuccess("Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.")
        setLoading(false)
        return
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push(redirect)
        router.refresh()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra"
      if (msg.includes("Invalid login credentials")) setError("Email hoặc mật khẩu không đúng.")
      else if (msg.includes("User already registered")) setError("Email này đã được đăng ký.")
      else if (msg.includes("Password should be at least")) setError("Mật khẩu phải có ít nhất 6 ký tự.")
      else setError(msg)
      setLoading(false)
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

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

          {/* Mode toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); setSuccess("") }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === "login" ? "bg-white shadow-sm text-gray-900" : "text-gray-400"}`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); setSuccess("") }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === "register" ? "bg-white shadow-sm text-gray-900" : "text-gray-400"}`}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên của bạn</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Minh Anh"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                required
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-2xl font-black text-sm hover:bg-orange-600 disabled:opacity-60 active:scale-95 transition-all shadow-lg shadow-orange-200"
            >
              {loading ? "Đang xử lý..." : mode === "login" ? "Đăng nhập →" : "Tạo tài khoản →"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          <Link href="/" className="hover:text-orange-500 transition-colors">← Về trang chủ</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-pulse">🌸</div></div>}>
      <LoginForm />
    </Suspense>
  )
}
