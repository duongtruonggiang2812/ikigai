import { createClient, createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params

  // Auth check — must be admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()
  if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  // Update target user's is_admin
  const { is_admin } = await request.json()
  const admin = createAdminClient()
  const { error } = await admin
    .from("profiles")
    .update({ is_admin: Boolean(is_admin) })
    .eq("id", userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
