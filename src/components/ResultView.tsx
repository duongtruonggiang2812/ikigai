"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { IkigaiResult } from "@/lib/types"
import VennDiagram from "./VennDiagram"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const LEVEL_STYLE: Record<string, string> = {
  Thấp: "bg-red-100 text-red-700 border-red-200",
  "Trung bình": "bg-yellow-100 text-yellow-700 border-yellow-200",
  Cao: "bg-green-100 text-green-700 border-green-200",
}

function FitBar({ score }: { score: number }) {
  const pct = Math.round((score / 10) * 100)
  const color = score >= 8 ? "bg-green-500" : score >= 6 ? "bg-orange-400" : "bg-gray-300"
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-500 w-8 text-right">{score}/10</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="font-bold text-gray-800 mb-4 text-sm">{title}</h2>
      {children}
    </section>
  )
}

export default function ResultView({ result: resultProp }: { result?: IkigaiResult }) {
  const [result, setResult] = useState<IkigaiResult | null>(resultProp ?? null)
  const [error, setError] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [saved, setSaved] = useState(!!resultProp)

  useEffect(() => {
    // If result passed as prop (from DB), skip localStorage
    if (resultProp) return
    try {
      const raw = localStorage.getItem("ikigai_result")
      if (!raw) { setError(true); return }
      setResult(JSON.parse(raw))
    } catch {
      setError(true)
    }
  }, [resultProp])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    // If user is logged in and result came from this session, it was already saved by API
    if (!resultProp) setSaved(false)
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-gray-500 mb-4">Không tìm thấy kết quả. Hãy làm quiz trước nhé.</p>
          <Link href="/quiz" className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600">
            Làm quiz
          </Link>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse">🌸</div>
      </div>
    )
  }

  const pillars = [
    { key: "love" as const, label: "Yêu thích", emoji: "❤️", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-500" },
    { key: "strength" as const, label: "Sở trường", emoji: "💪", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
    { key: "mission" as const, label: "Sứ mệnh", emoji: "🌍", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-500" },
    { key: "income" as const, label: "Hướng đi", emoji: "💡", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", dot: "bg-purple-500" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Save / Login banner */}
      {!resultProp && (
        <div className={`px-4 py-2.5 text-center text-xs font-semibold ${user ? "bg-green-500 text-white" : "bg-orange-100 text-orange-700"}`}>
          {user ? (
            <>✅ Kết quả đã được lưu vào tài khoản của bạn · <Link href="/dashboard" className="underline">Xem tất cả kết quả</Link></>
          ) : (
            <><Link href="/login" className="underline font-bold">Đăng nhập</Link> để lưu kết quả này và xem lại bất cứ lúc nào</>
          )}
        </div>
      )}

      {/* Hero header */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 text-white px-4 pt-12 pb-10">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-4xl mb-3">🌸</div>
          <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-1">BÁO CÁO IKIGAI</p>
          <h1 className="text-2xl font-bold mb-4">
            {result.userName !== "Bạn" ? `Xin chào, ${result.userName}!` : "Báo cáo Ikigai của bạn"}
          </h1>
          <div className="bg-white rounded-2xl px-4 py-4 text-left shadow-sm">
            <p className="text-xs font-semibold text-orange-400 mb-1.5 uppercase tracking-wide">✨ Ikigai của bạn</p>
            <p className="text-gray-800 text-sm leading-relaxed font-medium">&ldquo;{result.statement}&rdquo;</p>
          </div>

          {/* Ikigai-9 score */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="bg-white/20 rounded-full px-4 py-2 flex items-center gap-2">
              <span className="text-sm font-bold">{result.ikigai9Score}/63</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${LEVEL_STYLE[result.ikigai9Level] ?? "bg-white/30"}`}>
                {result.ikigai9Level}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* Ikigai-9 Analysis */}
        <Section title="⭐ Điểm Ikigai-9 của bạn">
          <div className="flex items-center gap-4 mb-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500">{result.ikigai9Score}</p>
              <p className="text-xs text-gray-400">/ 63 điểm</p>
            </div>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
                style={{ width: `${Math.round((result.ikigai9Score / 63) * 100)}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{result.ikigai9Analysis}</p>
        </Section>

        {/* Personality snapshot */}
        <Section title="🧠 Bức chân dung của bạn">
          <p className="text-sm text-gray-700 leading-relaxed mb-4">{result.personalitySnapshot}</p>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Giá trị cốt lõi</p>
            <div className="flex flex-wrap gap-2">
              {result.coreValues.map((v) => (
                <span key={v} className="bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* Venn Diagram */}
        <Section title="🔮 Biểu đồ Ikigai">
          <VennDiagram intersections={result.intersections} />
        </Section>

        {/* 4 Pillars deep dive */}
        <Section title="📊 Phân tích 4 trụ cột Ikigai">
          <div className="space-y-4">
            {pillars.map((p) => {
              const data = result[p.key]
              return (
                <div key={p.key} className={`rounded-xl border p-4 ${p.bg} ${p.border}`}>
                  <p className={`text-sm font-bold mb-2 ${p.text}`}>{p.emoji} {p.label}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {data.themes.map((t) => (
                      <span key={t} className="bg-white/80 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{data.insight}</p>
                </div>
              )
            })}
          </div>
        </Section>

        {/* Unique strengths + blind spots */}
        <Section title="🌟 Điểm đặc biệt & Điểm cần phát triển">
          <div className="mb-4">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">✅ Điểm đặc biệt của bạn</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-green-50 border border-green-100 rounded-xl p-3">
              {result.uniqueStrengths}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">⚠️ Điểm cần chú ý</p>
            <ul className="space-y-2">
              {result.blindSpots.map((bs, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <span className="text-amber-500 font-bold flex-shrink-0">{i + 1}.</span>
                  {bs}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Career suggestions with fit scores */}
        <Section title="🎯 Gợi ý nghề nghiệp phù hợp">
          <div className="space-y-3">
            {result.careers.map((c, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-3.5 bg-white">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-orange-500 text-white rounded-full text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">{c.title}</p>
                    <FitBar score={c.fitScore} />
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{c.reason}</p>
                    <p className="text-xs text-blue-600 mt-1">📈 {c.growth}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Action plan */}
        <Section title="📅 Kế hoạch hành động">
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">1–3 tháng tới</p>
              </div>
              <ul className="space-y-2">
                {result.actionPlan.shortTerm.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2.5">
                    <span className="flex-shrink-0 text-orange-500 font-bold">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">3–12 tháng tới</p>
              </div>
              <ul className="space-y-2">
                {result.actionPlan.midTerm.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                    <span className="flex-shrink-0 text-blue-500 font-bold">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wide">1 năm trở lên</p>
              </div>
              <ul className="space-y-2">
                {result.actionPlan.longTerm.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2.5">
                    <span className="flex-shrink-0 text-purple-500 font-bold">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Personal letter */}
        <section className="bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-3">💌 Gửi đến bạn</p>
          <p className="text-sm text-white leading-relaxed">{result.letter}</p>
        </section>

        {/* Retry */}
        <div className="text-center pb-6">
          <Link
            href="/quiz"
            className="inline-block text-sm text-gray-400 hover:text-orange-500 underline underline-offset-4 transition-colors"
          >
            Làm lại từ đầu
          </Link>
        </div>
      </div>
    </div>
  )
}
