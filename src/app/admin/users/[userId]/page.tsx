import { createAdminClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import AdminToggle from "./AdminToggle"

export default async function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const supabase = createAdminClient()

  const [
    { data: profile },
    { data: authUser },
    { data: quizResults },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.auth.admin.getUserById(userId),
    supabase
      .from("quiz_results")
      .select("id, ikigai9_score, ikigai9_level, created_at, result")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ])

  if (!profile) notFound()

  const email = authUser?.user?.email || "—"
  const lastSignIn = authUser?.user?.last_sign_in_at
  const provider = authUser?.user?.app_metadata?.provider || "email"

  const avgScore = quizResults?.length
    ? Math.round(quizResults.reduce((s, r) => s + (r.ikigai9_score || 0), 0) / quizResults.length)
    : null

  const bestScore = quizResults?.length
    ? Math.max(...quizResults.map((r) => r.ikigai9_score || 0))
    : null

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link href="/admin/users" className="text-sm text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1">
        ← Danh sách người dùng
      </Link>

      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl font-black text-orange-600 shrink-0">
              {profile.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">{profile.name || "Chưa có tên"}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                {profile.is_admin && (
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">⚡ Admin</span>
                )}
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full capitalize">{provider}</span>
              </div>
            </div>
          </div>
          <AdminToggle userId={userId} isAdmin={profile.is_admin} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-1">Ngày đăng ký</p>
            <p className="text-sm font-bold text-gray-800">
              {new Date(profile.created_at).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Đăng nhập gần nhất</p>
            <p className="text-sm font-bold text-gray-800">
              {lastSignIn ? new Date(lastSignIn).toLocaleDateString("vi-VN") : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Điểm trung bình</p>
            <p className="text-sm font-bold text-orange-500">
              {avgScore !== null ? `${avgScore}/63` : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Điểm cao nhất</p>
            <p className="text-sm font-bold text-green-600">
              {bestScore !== null ? `${bestScore}/63` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Quiz history */}
      <div>
        <h2 className="text-lg font-black text-gray-900 mb-3">
          Lịch sử quiz
          {quizResults && quizResults.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-400">({quizResults.length} bài)</span>
          )}
        </h2>

        {!quizResults || quizResults.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-2xl mb-2">📝</p>
            <p className="text-gray-400 text-sm">Người dùng này chưa làm quiz nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quizResults.map((r, i) => {
              const levelColor =
                r.ikigai9_level === "Cao"
                  ? "bg-green-100 text-green-700"
                  : r.ikigai9_level === "Trung bình"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              const statement = r.result?.statement
              const strengths = r.result?.uniqueStrengths

              return (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500 shrink-0">
                      #{quizResults.length - i}
                    </div>

                    <div className="flex-1 min-w-0">
                      {statement && (
                        <p className="text-sm text-gray-700 italic truncate">
                          &ldquo;{statement}&rdquo;
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(r.created_at).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-black text-orange-500 text-sm">{r.ikigai9_score}/63</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor}`}>
                        {r.ikigai9_level}
                      </span>
                      <Link
                        href={`/admin/results/${r.id}`}
                        className="text-xs text-blue-600 hover:underline font-semibold ml-1"
                      >
                        Xem báo cáo →
                      </Link>
                    </div>
                  </div>

                  {strengths && (
                    <p className="mt-2 ml-11 text-xs text-gray-500 line-clamp-1">
                      💪 {strengths}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
