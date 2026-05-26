import OpenAI from "openai"
import { ANALYZE_SYSTEM_PROMPT } from "@/lib/prompts"
import { IKIGAI9_STATEMENTS, PILLARS } from "@/lib/questions"
import { QuizAnswers } from "@/lib/types"

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

export async function POST(request: Request) {
  const answers: QuizAnswers = await request.json()

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

  return Response.json(result)
}
