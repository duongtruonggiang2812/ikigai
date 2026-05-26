"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-light text-orange-400 tracking-widest">生き甲斐</span>
          <span className="font-black text-gray-900 text-sm">Ikigai</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-gray-600 hover:text-orange-500 transition-colors"
              >
                Kết quả của tôi
              </Link>
              <button
                onClick={signOut}
                className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
