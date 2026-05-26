"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IKIGAI9_STATEMENTS, PILLARS, PillarKey, STATUS_OPTIONS } from "@/lib/questions"
import { QuizAnswers, UserProfile } from "@/lib/types"

type Phase = "profile" | "ikigai9" | PillarKey | "loading"

const PHASE_ORDER: Phase[] = ["profile", "ikigai9", "love", "strength", "mission", "income"]
const PROGRESS_STEPS: Phase[] = ["ikigai9", "love", "strength", "mission", "income"]

const LOADING_MSGS = [
  "Đang đọc câu trả lời của bạn...",
  "Phân tích 4 trụ cột Ikigai...",
  "Tìm điểm giao thoa đặc biệt...",
  "Gợi ý nghề nghiệp phù hợp...",
  "Viết thư cá nhân cho bạn...",
  "Hoàn thiện báo cáo...",
]

// Static color classes for Ikigai-9 scale (1–7)
const SCALE_SELECTED = [
  "",
  "bg-red-500 text-white border-red-500 shadow-lg shadow-red-200",
  "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-200",
  "bg-amber-400 text-white border-amber-400 shadow-lg shadow-amber-200",
  "bg-yellow-400 text-white border-yellow-400 shadow-lg shadow-yellow-200",
  "bg-lime-500 text-white border-lime-500 shadow-lg shadow-lime-200",
  "bg-green-500 text-white border-green-500 shadow-lg shadow-green-200",
  "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200",
]

const PHASE_LABELS: Partial<Record<Phase, string>> = {
  ikigai9: "Ikigai-9",
  love: "Yêu thích",
  strength: "Sở trường",
  mission: "Sứ mệnh",
  income: "Hướng đi",
}

function ProgressBar({ phase }: { phase: Phase }) {
  const current = PROGRESS_STEPS.indexOf(phase as Phase)
  if (current === -1) return null
  return (
    <div className="px-4 pt-3 pb-1">
      <div className="flex gap-1.5 mb-1.5">
        {PROGRESS_STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= current ? "bg-orange-500" : "bg-gray-100"}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 text-right">
        Bước {current + 1}/{PROGRESS_STEPS.length} · {PHASE_LABELS[phase]}
      </p>
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
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)

  // Cycle loading messages
  useEffect(() => {
    if (phase !== "loading") return
    const id = setInterval(() => setLoadingMsgIdx((p) => (p + 1) % LOADING_MSGS.length), 2400)
    return () => clearInterval(id)
  }, [phase])

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

  function goBack() {
    setError("")
    const idx = PHASE_ORDER.indexOf(phase)
    if (idx > 0) setPhase(PHASE_ORDER[idx - 1])
  }

  function advance() {
    setError("")
    if (!canAdvance()) {
      if (phase === "profile") setError("Hãy nhập tên của bạn (ít nhất 2 ký tự).")
      else if (phase === "ikigai9") setError("Hãy chọn điểm cho tất cả 9 câu nhé.")
      else setError("Hãy trả lời ít nhất 2 câu hỏi để tiếp tục.")
      return
    }
    if (phase === "profile") setAnswers((prev) => ({ ...prev, profile }))
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 px-4">
        <div className="text-center max-w-xs animate-fade-up">
          <div className="text-6xl mb-6 animate-bounce">🌸</div>
          <h2 className="text-xl font-black text-gray-800 mb-2">AI đang phân tích...</h2>
          <p className="text-sm text-orange-500 font-semibold mb-8 min-h-[20px] transition-all duration-500">
            {LOADING_MSGS[loadingMsgIdx]}
          </p>
          {/* Step dots */}
          <div className="flex justify-center gap-2 mb-6">
            {LOADING_MSGS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === loadingMsgIdx
                    ? "w-6 h-2.5 bg-orange-500"
                    : i < loadingMsgIdx
                    ? "w-2.5 h-2.5 bg-orange-300"
                    : "w-2.5 h-2.5 bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400">Thường mất 15–30 giây</p>
        </div>
      </div>
    )
  }

  // ── PROFILE ──
  if (phase === "profile") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full animate-fade-up">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">👋</div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">Trước khi bắt đầu</h1>
            <p className="text-sm text-gray-500">Cho mình biết thêm về bạn để báo cáo Ikigai được cá nhân hóa hơn</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
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

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Năm sinh</label>
              <input
                type="text"
                value={profile.birthYear}
                onChange={(e) => setProfile({ ...profile, birthYear: e.target.value })}
                placeholder="Ví dụ: 2007"
                maxLength={4}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Hiện tại bạn đang...</label>
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

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
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

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
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
            className="mt-5 w-full bg-orange-500 text-white py-3.5 rounded-2xl font-black text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-200"
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
        <div key={phase} className="max-w-lg mx-auto px-4 pb-28 pt-4 animate-fade-up">
          <div className="mb-6">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">Bước 1 · Ikigai-9</span>
            <h2 className="text-xl font-black text-gray-900 mt-1">Mức độ Ikigai hiện tại</h2>
            <p className="text-sm text-gray-500 mt-1">
              Đánh giá từng câu từ 1 (không đồng ý) → 7 (hoàn toàn đồng ý)
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${(answered / 9) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-orange-500 w-12 text-right">{answered}/9</span>
            </div>
          </div>

          <div className="space-y-4">
            {IKIGAI9_STATEMENTS.map((statement, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-semibold text-gray-800 mb-3">
                  <span className="text-orange-500 font-black mr-1">{i + 1}.</span>
                  {statement}
                </p>
                {/* Color scale buttons */}
                <div className="flex gap-1 justify-between">
                  {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                    <button
                      key={val}
                      onClick={() => setIkigai9(i, val)}
                      className={`flex-1 h-10 rounded-xl text-sm font-black transition-all duration-150 border ${
                        answers.ikigai9[i] === val
                          ? SCALE_SELECTED[val]
                          : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
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
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t px-4 py-3 flex items-center justify-between">
          <button
            onClick={goBack}
            className="text-gray-400 hover:text-gray-600 text-sm font-semibold flex items-center gap-1 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            ← Quay lại
          </button>
          <button
            onClick={advance}
            className="bg-orange-500 text-white px-8 py-2.5 rounded-xl font-black hover:bg-orange-600 active:scale-95 transition-all text-sm"
          >
            Tiếp theo →
          </button>
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
      <div key={phase} className="max-w-lg mx-auto px-4 pb-28 pt-4 animate-fade-up">
        <div className="mb-6">
          <span className={`text-xs font-bold uppercase tracking-wider ${pillar.colorClass.text}`}>
            Bước {pillarIdx + 2} · {pillar.label}
          </span>
          <h2 className="text-xl font-black text-gray-900 mt-1">
            {pillar.emoji} {pillar.label}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{pillar.description}</p>
        </div>

        <div className="space-y-4">
          {pillar.questions.map((q, i) => (
            <div key={i} className={`rounded-2xl border p-4 ${pillar.colorClass.bg} ${pillar.colorClass.border}`}>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                <span className={`font-black mr-1 ${pillar.colorClass.text}`}>{i + 1}.</span>
                {q.text}
              </label>
              <p className={`text-xs mb-2.5 ${pillar.colorClass.hintText}`}>
                💬 {q.hint}
              </p>
              <textarea
                value={pillarAnswers[i]}
                onChange={(e) => setPillarAnswer(phase as PillarKey, i, e.target.value)}
                placeholder={q.placeholder}
                rows={2}
                className="w-full bg-white rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
              />
              {pillarAnswers[i].length > 0 && (
                <p className="text-xs text-gray-400 text-right mt-1">{pillarAnswers[i].length} ký tự</p>
              )}
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="text-gray-400 hover:text-gray-600 text-sm font-semibold flex items-center gap-1 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            ← Quay lại
          </button>
          <span className="text-xs text-gray-400">{filledCount}/5 câu</span>
        </div>
        <button
          onClick={advance}
          className={`text-white px-8 py-2.5 rounded-xl font-black active:scale-95 transition-all text-sm ${pillar.colorClass.button}`}
        >
          {phase === "income" ? "Xem kết quả ✨" : "Tiếp theo →"}
        </button>
      </div>
    </div>
  )
}
