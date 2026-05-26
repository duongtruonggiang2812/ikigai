import OpenAI from "openai"
import { createServerClient } from "@supabase/ssr"
import { ANALYZE_SYSTEM_PROMPT } from "@/lib/prompts"
import { IKIGAI9_STATEMENTS, PILLARS } from "@/lib/questions"
import { QuizAnswers } from "@/lib/types"
import { type NextRequest } from "next/server"

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
})

function buildUserMessage(answers: QuizAnswers): string {
  const { profile } = answers
  const ikigai9Score = answers.ikigai9.map((v) => v ?? 4).reduce((a, b) => a + b, 0)

  const lines: string[] = [
    "=== THÔNG TIN CÁ NHÂN ===",
    `Tên: ${profile.name || "Không cung cấp"}`,
    `Năm sinh: ${profile.birthYear || "Không cung cấp"}`,
    `Giai đoạn sống: ${profile.status || "Không cung cấp"}`,
    `Ngành học / Công việc: ${profile.occupation || "Không cung cấp"}`,
    `Điều muốn khám phá qua Ikigai: ${profile.goal || "Không cung cấp"}`,
    "",
    "=== IKIGAI-9 ASSESSMENT ===",
    `Tổng điểm: ${ikigai9Score}/63`,
    "",
  ]

  IKIGAI9_STATEMENTS.forEach((stmt, i) => {
    lines.push(`${i + 1}. "${stmt}" → ${answers.ikigai9[i] ?? 4}/7`)
  })

  for (const pillar of PILLARS) {
    lines.push("")
    lines.push(`=== ${pillar.label.toUpperCase()} — ${pillar.description} ===`)
    pillar.questions.forEach((q, i) => {
      const ans = answers[pillar.key][i]?.trim() || "(để trống)"
      lines.push(`Câu hỏi: ${q.text}`)
      lines.push(`Trả lời: ${ans}`)
    })
  }

  return lines.join("\n")
}

export async function POST(request: NextRequest) {
  const answers: QuizAnswers = await request.json()

  // AI analysis
  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    max_tokens: 4096,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: ANALYZE_SYSTEM_PROMPT },
      { role: "user", content: buildUserMessage(answers) },
    ],
  })

  const content = response.choices[0]?.message?.content ?? "{}"
  const result = JSON.parse(content)

  // Save to DB if user is logged in
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} } }
    )
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.from("quiz_results").insert({
        user_id: user.id,
        user_email: user.email,
        user_name: answers.profile.name || result.userName,
        ikigai9_score: result.ikigai9Score,
        ikigai9_level: result.ikigai9Level,
        answers,
        result,
      })
    }
  } catch {
    // Non-critical: don't fail the request if DB save fails
  }

  return Response.json(result)
}
