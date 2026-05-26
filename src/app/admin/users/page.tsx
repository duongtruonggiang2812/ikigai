import { createAdminClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminUsersPage() {
  const supabase = createAdminClient()

  const { data: users } = await supabase
    .from("quiz_results")
    .select("id, user_id, user_name, user_email, ikigai9_score, ikigai9_level, created_at")
    .order("created_at", { ascending: false })

  // Group by user
  const userMap = new Map<string, typeof users>()
  users?.forEach((r) => {
    const key = r.user_id || r.user_email || "anonymous"
    if (!userMap.has(key)) userMap.set(key, [])
    userMap.get(key)!.push(r)
  })

  const userList = Array.from(userMap.entries())
    .map(([key, results]) => {
      const r0 = results![0]
      return {
        key,
        name: r0.user_name || "Ẩn danh",
        email: r0.user_email || "—",
        quizCount: results!.length,
        lastScore: r0.ikigai9_score,
        lastLevel: r0.ikigai9_level,
        lastDate: r0.created_at,
        latestId: r0.id,
      }
    })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Người dùng</h1>
          <p className="text-sm text-gray-500">{userList.length} người dùng đã làm quiz</p>
        </div>
        <a
          href="/api/admin/export"
          className="bg-gray-900 text-white text-xs px-4 py-2.5 rounded-xl font-bold hover:bg-gray-700 transition-colors"
        >
          ↓ Export CSV
        </a>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tên</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Quiz</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Điểm gần nhất</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Ngày gần nhất</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {userList.map((u) => {
                const date = new Date(u.lastDate).toLocaleDateString("vi-VN")
                const levelColor = u.lastLevel === "Cao" ? "bg-green-100 text-green-700" : u.lastLevel === "Trung bình" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                return (
                  <tr key={u.key} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-gray-800">{u.name}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{u.email}</td>
                    <td className="px-5 py-3 text-gray-700 font-bold">{u.quizCount}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-orange-500">{u.lastScore}/63</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor}`}>{u.lastLevel}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{date}</td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/results/${u.latestId}`} className="text-xs text-blue-600 hover:underline font-semibold">
                        Xem báo cáo →
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
