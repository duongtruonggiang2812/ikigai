import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import ResultView from "@/components/ResultView"

export default async function DashboardResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data } = await supabase
    .from("quiz_results")
    .select("result")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!data) notFound()

  return <ResultView result={data.result} />
}
