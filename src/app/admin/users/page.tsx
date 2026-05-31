import { createAdminClient } from "@/lib/supabase/server"
import UserTable from "./UserTable"

export default async function AdminUsersPage() {
  const supabase = createAdminClient()

  const [
    { data: profiles },
    { data: authData },
    { data: quizCounts },
  ] = await Promise.all([
    supabase.from("profiles").select("id, name, is_admin, created_at").order("created_at", { ascending: false }),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from("quiz_results").select("user_id").not("user_id", "is", null),
  ])

  const authUsers = authData?.users || []

  const userList = (profiles || []).map((p) => {
    const authUser = authUsers.find((u) => u.id === p.id)
    const quizCount = quizCounts?.filter((q) => q.user_id === p.id).length || 0
    return {
      id: p.id,
      name: p.name || authUser?.user_metadata?.name || "—",
      email: authUser?.email || "—",
      isAdmin: p.is_admin,
      quizCount,
      joinedAt: p.created_at,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Người dùng</h1>
          <p className="text-sm text-gray-500">{userList.length} tài khoản đã đăng ký</p>
        </div>
        <a
          href="/api/admin/export"
          className="bg-gray-900 text-white text-xs px-4 py-2.5 rounded-xl font-bold hover:bg-gray-700 transition-colors"
        >
          ↓ Export CSV
        </a>
      </div>

      <UserTable users={userList} />
    </div>
  )
}
