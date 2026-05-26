import Link from "next/link"

const PILLARS = [
  { emoji: "❤️", label: "Yêu thích", desc: "Điều bạn đam mê, làm mà quên thời gian", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
  { emoji: "💪", label: "Sở trường", desc: "Điều bạn làm tốt hơn người khác", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  { emoji: "🌍", label: "Sứ mệnh", desc: "Điều thế giới đang cần đến bạn", bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
  { emoji: "💡", label: "Hướng đi", desc: "Điều có thể tạo ra thu nhập bền vững", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
]

const STEPS = [
  { num: "1", emoji: "📝", title: "Trả lời quiz ~10 phút", desc: "24 câu hỏi được thiết kế để khám phá con người thật — không có câu trả lời đúng hay sai" },
  { num: "2", emoji: "🤖", title: "AI phân tích chuyên sâu", desc: "Trí tuệ nhân tạo kết hợp triết lý Ikigai Nhật Bản và tâm lý học để tạo báo cáo hoàn toàn cá nhân hóa" },
  { num: "3", emoji: "🌸", title: "Nhận báo cáo chi tiết", desc: "Tính cách, điểm mạnh, 6 gợi ý nghề nghiệp, kế hoạch hành động và thư cá nhân từ AI" },
]

const REPORT_SECTIONS = [
  { icon: "⭐", label: "Điểm Ikigai-9" },
  { icon: "🧠", label: "Chân dung tính cách" },
  { icon: "🔮", label: "Biểu đồ Venn" },
  { icon: "📊", label: "Phân tích 4 trụ cột" },
  { icon: "🌟", label: "Điểm mạnh độc đáo" },
  { icon: "🎯", label: "6 gợi ý nghề nghiệp" },
  { icon: "📅", label: "Kế hoạch hành động" },
  { icon: "💌", label: "Thư cá nhân từ AI" },
]

const AUDIENCES = [
  { emoji: "🎒", title: "Học sinh cấp 3", desc: "Băn khoăn chọn ngành đại học, muốn biết mình phù hợp với lĩnh vực nào" },
  { emoji: "🎓", title: "Sinh viên", desc: "Lo lắng sau khi ra trường sẽ làm gì, liệu ngành mình học có đúng không" },
  { emoji: "💼", title: "Người đi làm", desc: "Cảm thấy công việc hiện tại thiếu ý nghĩa, muốn tìm hướng đi mới" },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 text-white">
        {/* Floating background orbs */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute top-1/2 -right-16 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-orange-300/20 rounded-full blur-2xl animate-float pointer-events-none" />

        <div className="relative max-w-lg mx-auto px-4 pt-20 pb-16 text-center">
          <p className="text-5xl font-light tracking-[0.3em] text-white/30 mb-4 animate-fade-up">生き甲斐</p>
          <h1 className="text-5xl font-black leading-[1.1] mb-5 animate-fade-up">
            Bạn sinh ra<br />để làm gì?
          </h1>
          <p className="text-white/80 text-base leading-relaxed mb-8 max-w-sm mx-auto animate-fade-up">
            Khám phá Ikigai — triết lý Nhật Bản giúp bạn tìm ra điểm giao thoa
            giữa <strong className="text-white">đam mê</strong>, <strong className="text-white">tài năng</strong>,
            {" "}<strong className="text-white">sứ mệnh</strong> và <strong className="text-white">hướng đi</strong> của cuộc đời.
          </p>

          <div className="animate-fade-up">
            <Link
              href="/quiz"
              className="btn-shimmer inline-block bg-white text-orange-500 px-10 py-4 rounded-2xl font-black text-base hover:bg-orange-50 transition-all shadow-2xl shadow-orange-900/20 hover:scale-105 active:scale-95"
            >
              Khám phá Ikigai của bạn →
            </Link>
          </div>

          {/* Stat pills */}
          <div className="flex items-center justify-center gap-4 mt-8 animate-fade-up">
            <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-semibold text-white/90">⏱ ~10 phút</div>
            <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-semibold text-white/90">🤖 AI phân tích</div>
            <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-semibold text-white/90">🎁 Miễn phí</div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 800 32" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0,32 C200,0 600,0 800,32 L800,32 L0,32 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="px-4 py-14">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2 text-center">Ikigai là gì?</p>
          <h2 className="text-2xl font-black text-gray-900 mb-3 text-center">Lý do để thức dậy mỗi sáng</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8 text-center max-w-sm mx-auto">
            Ikigai nằm ở điểm giao thoa của 4 yếu tố — nơi bạn{" "}
            <strong className="text-gray-700">vừa yêu thích, vừa giỏi, vừa có ích, vừa bền vững</strong>.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {PILLARS.map((p) => (
              <div
                key={p.label}
                className={`rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-default ${p.bg} ${p.border}`}
              >
                <div className="text-2xl mb-2">{p.emoji}</div>
                <p className={`font-black text-sm mb-1 ${p.text}`}>{p.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-black text-orange-500">IKIGAI</span> là điểm nơi cả 4 gặp nhau —
              công việc không còn là gánh nặng, cuộc sống có hướng đi rõ ràng.
            </p>
          </div>
        </div>
      </section>

      {/* ── REPORT PREVIEW ── */}
      <section className="bg-gray-50 px-4 py-14">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2 text-center">Báo cáo của bạn</p>
          <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">Cá nhân hóa hoàn toàn</h2>
          <p className="text-sm text-gray-500 mb-8 text-center">8 phần phân tích chuyên sâu — không ai giống ai</p>

          {/* Mock result card */}
          <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 p-[3px] shadow-2xl shadow-orange-300/40 mb-6">
            <div className="bg-white rounded-[22px] overflow-hidden">
              <div className="bg-gradient-to-br from-orange-500 to-amber-400 px-5 pt-7 pb-6 text-white text-center">
                <div className="text-3xl mb-2">🌸</div>
                <p className="text-xs text-white/70 font-bold uppercase tracking-widest mb-1">BÁO CÁO IKIGAI</p>
                <p className="font-black text-xl mb-4">Xin chào, Minh Anh!</p>
                <div className="bg-white rounded-2xl px-4 py-3 text-left shadow-sm">
                  <p className="text-xs text-orange-400 font-bold mb-1.5 uppercase tracking-wide">✨ Ikigai của bạn</p>
                  <p className="text-gray-800 text-xs leading-relaxed font-medium">
                    &ldquo;Ikigai của Minh Anh là dùng tư duy sáng tạo và khả năng phân tích
                    để xây dựng những sản phẩm có tác động xã hội thực sự.&rdquo;
                  </p>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <span className="text-sm font-black">52/63</span>
                  <span className="text-xs bg-green-400 text-white px-2.5 py-0.5 rounded-full font-bold">Cao</span>
                </div>
              </div>
              <div className="px-4 py-4 space-y-3">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                  <span className="text-base">🎯</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-700">UX Designer / Product Manager</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-4/5 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-xs text-gray-400 font-bold">9/10</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 px-1">
                  {["Sáng tạo", "Tư duy hệ thống", "Đồng cảm sâu", "Học nhanh"].map((v) => (
                    <span key={v} className="bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {v}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center pb-1">+ 7 phần phân tích nữa...</p>
              </div>
            </div>
          </div>

          {/* 8 sections grid */}
          <div className="grid grid-cols-2 gap-2">
            {REPORT_SECTIONS.map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-3 py-2.5 flex items-center gap-2.5 shadow-sm">
                <span className="text-lg">{s.icon}</span>
                <span className="text-xs font-bold text-gray-700">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-4 py-14">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2 text-center">Cách hoạt động</p>
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">3 bước đơn giản</h2>
          <div className="space-y-4">
            {STEPS.map((s) => (
              <div key={s.num} className="flex gap-4 items-start bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex-shrink-0 w-11 h-11 bg-orange-500 text-white rounded-2xl flex items-center justify-center font-black text-base shadow-lg shadow-orange-200">
                  {s.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{s.emoji}</span>
                    <p className="font-black text-gray-800 text-sm">{s.title}</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR WHO ── */}
      <section className="bg-gray-50 px-4 py-14">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2 text-center">Dành cho ai?</p>
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">Bạn đang ở giai đoạn nào?</h2>
          <div className="space-y-3">
            {AUDIENCES.map((g) => (
              <div
                key={g.title}
                className="flex gap-4 items-start bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:border-orange-200 hover:shadow-md transition-all duration-200"
              >
                <span className="text-2xl">{g.emoji}</span>
                <div>
                  <p className="font-black text-gray-800 text-sm mb-0.5">{g.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 px-4 py-16 text-center">
        <div className="absolute -top-8 right-4 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-0 -left-8 w-48 h-48 bg-amber-300/15 rounded-full blur-3xl animate-float-slow pointer-events-none" />
        <div className="relative max-w-lg mx-auto">
          <div className="text-5xl mb-5">🌸</div>
          <h2 className="text-2xl font-black text-white mb-3">Sẵn sàng tìm Ikigai của bạn?</h2>
          <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
            Chỉ 10 phút — nhưng có thể thay đổi cách bạn nhìn về bản thân và tương lai.
          </p>
          <Link
            href="/quiz"
            className="btn-shimmer inline-block bg-white text-orange-500 px-10 py-4 rounded-2xl font-black text-base hover:bg-orange-50 transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
            Bắt đầu ngay →
          </Link>
          <p className="mt-5 text-white/50 text-xs">Miễn phí · Không cần đăng ký · Kết quả ngay lập tức</p>
        </div>
      </section>

    </main>
  )
}
