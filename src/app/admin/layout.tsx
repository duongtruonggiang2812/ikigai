import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?redirect=/admin")

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, name")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <div className="text-4xl mb-4">🚫</div>
          <p className="text-gray-700 font-bold mb-2">Không có quyền truy cập</p>
          <p className="text-gray-500 text-sm mb-4">Trang này chỉ dành cho admin.</p>
          <Link href="/" className="text-orange-500 underline text-sm">Về trang chủ</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin nav */}
      <header className="bg-gray-900 text-white px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-black text-orange-400">⚡ Admin</Link>
            <Link href="/admin" className="text-xs text-gray-400 hover:text-white transition-colors">Tổng quan</Link>
            <Link href="/admin/users" className="text-xs text-gray-400 hover:text-white transition-colors">Người dùng</Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{profile.name || user.email}</span>
            <Link href="/" className="text-xs text-gray-500 hover:text-white transition-colors">← Trang chủ</Link>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
