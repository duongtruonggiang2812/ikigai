"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IKIGAI9_STATEMENTS, PILLARS, PillarKey, STATUS_OPTIONS } from "@/lib/questions"
import { QuizAnswers, UserProfile } from "@/lib/types"

type Phase = "profile" | "ikigai9" | PillarKey | "loading"

const PHASE_ORDER: Phase[] = ["profile", "ikigai9", "love", "strength", "mission", "income"]
const PROGRESS_STEPS: Phase[] = ["ikigai9", "love", "strength", "mission", "income"]

function ProgressBar({ phase }: { phase: Phase }) {
  const current = PROGRESS_STEPS.indexOf(phase as Phase)
  if (current === -1) return null
  return (
    <div className="flex gap-1.5 px-4 py-3">
      {PROGRESS_STEPS.map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${i <= current ? "bg-orange-500" : "bg-gray-200"}`}
        />
      ))}
    </div>
  )
}

const EMPTY_PROFILE: UserProfile = { name: "", birthYear: "", status: "", occupation: "", goal: "" }

export default function QuizFlow() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>("profile")
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE)
  const [answers, setAnswers] = useState<QuizAnswers>({
    profile: EMPTY_PROFILE,
    ikigai9: Array(9).fill(null),
    love: Array(5).fill(""),
    strength: Array(5).fill(""),
    mission: Array(5).fill(""),
    income: Array(5).fill(""),
  })
  const [error, setError] = useState("")

  function setIkigai9(index: number, value: number) {
    setAnswers((prev) => {
      const next = [...prev.ikigai9]
      next[index] = value
      return { ...prev, ikigai9: next }
    })
  }

  function setPillarAnswer(key: PillarKey, index: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev[key]]
      next[index] = value
      return { ...prev, [key]: next }
    })
  }

  function canAdvance(): boolean {
    if (phase === "profile") return profile.name.trim().length >= 2
    if (phase === "ikigai9") return answers.ikigai9.every((v) => v !== null)
    const key = phase as PillarKey
    return answers[key].filter((v) => v.trim().length > 0).length >= 2
  }

  function advance() {
    setError("")
    if (!canAdvance()) {
      if (phase === "profile") setError("Hãy nhập tên của bạn (ít nhất 2 ký tự).")
      else if (phase === "ikigai9") setError("Hãy chọn điểm cho tất cả 9 câu nhé.")
      else setError("Hãy trả lời ít nhất 2 câu hỏi để tiếp tục.")
      return
    }
    if (phase === "profile") {
      setAnswers((prev) => ({ ...prev, profile }))
    }
    const idx = PHASE_ORDER.indexOf(phase)
    if (idx < PHASE_ORDER.length - 1) {
      setPhase(PHASE_ORDER[idx + 1])
    } else {
      submit()
    }
  }

  async function submit() {
    setPhase("loading")
    try {
      const finalAnswers: QuizAnswers = { ...answers, profile }
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalAnswers),
      })
      if (!res.ok) throw new Error("API error")
      const result = await res.json()
      localStorage.setItem("ikigai_result", JSON.stringify(result))
      router.push("/result")
    } catch {
      setPhase("income")
      setError("Có lỗi xảy ra, vui lòng thử lại.")
    }
  }

  // ── LOADING ──
  if (phase === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="text-5xl mb-6 animate-pulse">🌸</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">AI đang phân tích...</h2>
          <p className="text-sm text-gray-500">Đang tạo báo cáo Ikigai của bạn, vài giây thôi nhé</p>
        </div>
      </div>
    )
  }

  // ── PROFILE ──
  if (phase === "profile") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">👋</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Trước khi bắt đầu</h1>
            <p className="text-sm text-gray-500">Cho mình biết thêm về bạn để báo cáo Ikigai được cá nhân hóa hơn</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Tên của bạn <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Ví dụ: Minh Anh"
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Birth year */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Năm sinh</label>
              <input
                type="text"
                value={profile.birthYear}
                onChange={(e) => setProfile({ ...profile, birthYear: e.target.value })}
                placeholder="Ví dụ: 2007"
                maxLength={4}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hiện tại bạn đang...</label>
              <select
                value={profile.status}
                onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">— Chọn giai đoạn của bạn —</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {profile.status.includes("làm") ? "Công việc hiện tại" : "Ngành học / Trường"}
              </label>
              <input
                type="text"
                value={profile.occupation}
                onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                placeholder="Ví dụ: Marketing tại startup, THPT Nguyễn Du..."
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Điều bạn muốn tìm ra qua bài quiz này?
              </label>
              <textarea
                value={profile.goal}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                placeholder="Ví dụ: Tôi muốn biết mình có nên chuyển sang ngành công nghệ không..."
                rows={2}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
              />
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-500 text-center">{error}</p>}

          <button
            onClick={advance}
            className="mt-5 w-full bg-orange-500 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-orange-600 transition-colors shadow-md shadow-orange-100"
          >
            Bắt đầu quiz →
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">
            Chỉ tên là bắt buộc · Thông tin được giữ bí mật
          </p>
        </div>
      </div>
    )
  }

  // ── IKIGAI-9 ──
  if (phase === "ikigai9") {
    const answered = answers.ikigai9.filter((v) => v !== null).length
    return (
      <div className="min-h-screen bg-white">
        <ProgressBar phase={phase} />
        <div className="max-w-lg mx-auto px-4 pb-24 pt-4">
          <div className="mb-6">
            <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Bước 1 · Ikigai-9</span>
            <h2 className="text-xl font-bold text-gray-900 mt-1">Mức độ Ikigai hiện tại</h2>
            <p className="text-sm text-gray-500 mt-1">
              Đánh giá từng câu từ 1 (không đồng ý) đến 7 (hoàn toàn đồng ý). ({answered}/9 đã chọn)
            </p>
          </div>

          <div className="space-y-5">
            {IKIGAI9_STATEMENTS.map((statement, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-medium text-gray-800 mb-3">
                  <span className="text-orange-500 font-bold mr-1">{i + 1}.</span>
                  {statement}
                </p>
                <div className="flex gap-1.5 justify-between">
                  {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                    <button
                      key={val}
                      onClick={() => setIkigai9(i, val)}
                      className={`flex-1 h-9 rounded-xl text-sm font-semibold transition-all ${
                        answers.ikigai9[i] === val
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-white border border-gray-200 text-gray-500 hover:border-orange-300"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-gray-400">Không đồng ý</span>
                  <span className="text-xs text-gray-400">Hoàn toàn đồng ý</span>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex justify-end">
            <button
              onClick={advance}
              className="bg-orange-500 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm"
            >
              Tiếp theo →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── 4 PILLARS ──
  const pillarIdx = ["love", "strength", "mission", "income"].indexOf(phase as string)
  const pillar = PILLARS[pillarIdx]
  const pillarAnswers = answers[phase as PillarKey]
  const filledCount = pillarAnswers.filter((v) => v.trim().length > 0).length

  return (
    <div className="min-h-screen bg-white">
      <ProgressBar phase={phase} />
      <div className="max-w-lg mx-auto px-4 pb-24 pt-4">
        <div className="mb-6">
          <span className={`text-xs font-semibold uppercase tracking-wider ${pillar.colorClass.text}`}>
            Bước {pillarIdx + 2} · {pillar.label}
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            {pillar.emoji} {pillar.label}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{pillar.description}</p>
        </div>

        <div className="space-y-4">
          {pillar.questions.map((q, i) => (
            <div key={i} className={`rounded-2xl border p-4 ${pillar.colorClass.bg} ${pillar.colorClass.border}`}>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                <span className={`font-bold mr-1 ${pillar.colorClass.text}`}>{i + 1}.</span>
                {q.text}
              </label>
              <p className={`text-xs mb-2 ${pillar.colorClass.hintText}`}>
                💬 {q.hint}
              </p>
              <textarea
                value={pillarAnswers[i]}
                onChange={(e) => setPillarAnswer(phase as PillarKey, i, e.target.value)}
                placeholder={q.placeholder}
                rows={2}
                className="w-full bg-white rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
              />
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">{filledCount}/5 câu đã trả lời</span>
          <button
            onClick={advance}
            className={`text-white px-8 py-2.5 rounded-xl font-semibold transition-colors text-sm ${pillar.colorClass.button}`}
          >
            {phase === "income" ? "Xem kết quả →" : "Tiếp theo →"}
          </button>
        </div>
      </div>
    </div>
  )
}
