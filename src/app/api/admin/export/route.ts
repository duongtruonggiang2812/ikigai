import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
  if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  // Fetch all results
  const admin = createAdminClient()
  const { data: results } = await admin
    .from("quiz_results")
    .select("id, user_name, user_email, ikigai9_score, ikigai9_level, created_at, result")
    .order("created_at", { ascending: false })

  if (!results) return NextResponse.json({ error: "No data" }, { status: 500 })

  // Build CSV
  const headers = [
    "ID", "Tên", "Email", "Điểm Ikigai-9", "Mức độ",
    "Ikigai Statement", "Điểm mạnh", "Giá trị cốt lõi", "Ngày làm",
  ]

  const rows = results.map((r) => [
    r.id,
    r.user_name || "",
    r.user_email || "",
    r.ikigai9_score,
    r.ikigai9_level,
    `"${(r.result?.statement || "").replace(/"/g, '""')}"`,
    `"${(r.result?.uniqueStrengths || "").replace(/"/g, '""')}"`,
    `"${(r.result?.coreValues || []).join(", ")}"`,
    new Date(r.created_at).toLocaleDateString("vi-VN"),
  ])

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
  const bom = "﻿" // UTF-8 BOM for Excel

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ikigai-results-${Date.now()}.csv"`,
    },
  })
}
