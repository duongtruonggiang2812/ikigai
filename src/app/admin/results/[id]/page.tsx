import { createAdminClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import ResultView from "@/components/ResultView"
import Link from "next/link"

export default async function AdminResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data } = await supabase
    .from("quiz_results")
    .select("result, user_name, user_email, ikigai9_score, ikigai9_level, created_at")
    .eq("id", id)
    .single()

  if (!data) notFound()

  const date = new Date(data.created_at).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  })

  return (
    <div>
      {/* Admin context bar */}
      <div className="bg-gray-800 text-white px-4 py-3 mb-0 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <Link href="/admin/users" className="text-gray-400 hover:text-white">← Danh sách</Link>
          <span className="text-gray-400">|</span>
          <span className="font-semibold">{data.user_name || "Ẩn danh"}</span>
          <span className="text-gray-400">{data.user_email}</span>
          <span className="text-gray-400">{date}</span>
        </div>
        <span className="font-black text-orange-400">{data.ikigai9_score}/63 · {data.ikigai9_level}</span>
      </div>
      <ResultView result={data.result} />
    </div>
  )
}
