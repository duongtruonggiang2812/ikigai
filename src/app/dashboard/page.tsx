import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?redirect=/dashboard")

  const { data: results } = await supabase
    .from("quiz_results")
    .select("id, user_name, ikigai9_score, ikigai9_level, result, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const profile = { name: results?.[0]?.user_name || user.email?.split("@")[0] || "Bạn" }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-400 text-white px-4 pt-10 pb-8">
        <div className="max-w-lg mx-auto">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Tài khoản</p>
          <h1 className="text-2xl font-black mb-1">Xin chào, {profile.name}!</h1>
          <p className="text-white/80 text-sm">
            {results?.length
              ? `Bạn đã hoàn thành ${results.length} bài quiz Ikigai`
              : "Bạn chưa có kết quả nào — hãy làm quiz!"}
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* CTA if no results */}
        {(!results || results.length === 0) && (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
            <div className="text-4xl mb-3">🌸</div>
            <p className="text-gray-600 text-sm mb-4">Bạn chưa có kết quả Ikigai nào được lưu.</p>
            <Link
              href="/quiz"
              className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
            >
              Làm quiz ngay →
            </Link>
          </div>
        )}

        {/* Results list */}
        {results?.map((r, i) => {
          const date = new Date(r.created_at).toLocaleDateString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric",
          })
          const statement = r.result?.statement || ""
          const levelColor =
            r.ikigai9_level === "Cao" ? "bg-green-100 text-green-700" :
            r.ikigai9_level === "Trung bình" ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-700"

          return (
            <Link key={r.id} href={`/dashboard/result/${r.id}`} className="block">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{date}</p>
                    {i === 0 && (
                      <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full">Mới nhất</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-black text-gray-800">{r.ikigai9_score}/63</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor}`}>
                      {r.ikigai9_level}
                    </span>
                  </div>
                </div>
                {statement && (
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 italic">
                    &ldquo;{statement}&rdquo;
                  </p>
                )}
                <p className="text-xs text-orange-500 font-semibold mt-2">Xem báo cáo đầy đủ →</p>
              </div>
            </Link>
          )
        })}

        {/* Do quiz again */}
        {results && results.length > 0 && (
          <div className="text-center pt-2 pb-6">
            <Link
              href="/quiz"
              className="text-sm text-gray-400 hover:text-orange-500 underline underline-offset-4 transition-colors"
            >
              Làm quiz lại để so sánh
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
