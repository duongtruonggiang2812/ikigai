import { createAdminClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [
    { count: totalUsers },
    { count: totalResults },
    { data: recentResults },
    { data: levelStats },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("quiz_results").select("*", { count: "exact", head: true }),
    supabase
      .from("quiz_results")
      .select("id, user_name, user_email, ikigai9_score, ikigai9_level, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("quiz_results")
      .select("ikigai9_level, ikigai9_score"),
  ])

  const avgScore = levelStats?.length
    ? Math.round(levelStats.reduce((s, r) => s + (r.ikigai9_score || 0), 0) / levelStats.length)
    : 0

  const levelCount = {
    Cao: levelStats?.filter((r) => r.ikigai9_level === "Cao").length || 0,
    "Trung bình": levelStats?.filter((r) => r.ikigai9_level === "Trung bình").length || 0,
    Thấp: levelStats?.filter((r) => r.ikigai9_level === "Thấp").length || 0,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Tổng quan</h1>
        <p className="text-sm text-gray-500">Dữ liệu thời gian thực từ Supabase</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Người dùng", value: totalUsers ?? 0, icon: "👤", color: "text-blue-600" },
          { label: "Bài quiz", value: totalResults ?? 0, icon: "📊", color: "text-orange-600" },
          { label: "Điểm TB Ikigai-9", value: `${avgScore}/63`, icon: "⭐", color: "text-amber-600" },
          { label: "Tỷ lệ Cao", value: totalResults ? `${Math.round((levelCount.Cao / totalResults) * 100)}%` : "—", icon: "🟢", color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Level distribution */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-black text-gray-800 mb-4">Phân bố mức độ Ikigai-9</h2>
        <div className="space-y-3">
          {(["Cao", "Trung bình", "Thấp"] as const).map((level) => {
            const count = levelCount[level]
            const pct = totalResults ? Math.round((count / totalResults) * 100) : 0
            const color = level === "Cao" ? "bg-green-500" : level === "Trung bình" ? "bg-yellow-400" : "bg-red-400"
            const textColor = level === "Cao" ? "text-green-700" : level === "Trung bình" ? "text-yellow-700" : "text-red-700"
            return (
              <div key={level} className="flex items-center gap-3">
                <span className={`text-xs font-bold w-20 ${textColor}`}>{level}</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{count} ({pct}%)</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent quizzes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-800">Quiz gần nhất</h2>
          <div className="flex gap-3">
            <Link href="/admin/users" className="text-xs text-orange-500 font-bold hover:underline">
              Xem tất cả →
            </Link>
            <a
              href="/api/admin/export"
              className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-gray-700 transition-colors"
            >
              ↓ Export CSV
            </a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tên</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Điểm</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Mức</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Ngày</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentResults?.map((r) => {
                const date = new Date(r.created_at).toLocaleDateString("vi-VN")
                const levelColor = r.ikigai9_level === "Cao" ? "bg-green-100 text-green-700" : r.ikigai9_level === "Trung bình" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-gray-800">{r.user_name || "—"}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{r.user_email || "—"}</td>
                    <td className="px-5 py-3 font-black text-orange-500">{r.ikigai9_score}/63</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor}`}>{r.ikigai9_level}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{date}</td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/results/${r.id}`} className="text-xs text-blue-600 hover:underline font-semibold">
                        Xem →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
