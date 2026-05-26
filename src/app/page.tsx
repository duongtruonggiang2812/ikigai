import Link from "next/link"

const PILLARS = [
  { emoji: "❤️", label: "Yêu thích", desc: "Điều bạn đam mê, làm mà quên thời gian", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
  { emoji: "💪", label: "Sở trường", desc: "Điều bạn làm tốt hơn người khác", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  { emoji: "🌍", label: "Sứ mệnh", desc: "Điều thế giới đang cần đến bạn", bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
  { emoji: "💡", label: "Hướng đi", desc: "Điều có thể tạo ra thu nhập cho bạn", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
]

const STEPS = [
  { num: "1", title: "Trả lời quiz ~10 phút", desc: "24 câu hỏi được thiết kế để khám phá con người thật của bạn — không có câu trả lời đúng hay sai", emoji: "📝" },
  { num: "2", title: "AI phân tích chuyên sâu", desc: "Trí tuệ nhân tạo kết hợp triết lý Ikigai Nhật Bản và tâm lý học để tạo ra báo cáo hoàn toàn cá nhân hóa", emoji: "🤖" },
  { num: "3", title: "Nhận báo cáo chi tiết", desc: "Bản phân tích đầy đủ về tính cách, điểm mạnh, gợi ý nghề nghiệp và kế hoạch hành động rõ ràng", emoji: "🌸" },
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

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 text-white">
        <div className="max-w-lg mx-auto px-4 pt-16 pb-14 text-center">
          <p className="text-4xl font-light tracking-widest text-white/60 mb-2">生き甲斐</p>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Bạn sinh ra để<br />làm điều gì?
          </h1>
          <p className="text-white/80 text-base leading-relaxed mb-8 max-w-sm mx-auto">
            Khám phá Ikigai — triết lý Nhật Bản giúp bạn tìm ra điểm giao thoa
            giữa đam mê, tài năng, sứ mệnh và hướng đi phù hợp với bản thân.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-white text-orange-500 px-10 py-3.5 rounded-2xl font-bold text-base hover:bg-orange-50 transition-colors shadow-lg"
          >
            Bắt đầu khám phá miễn phí →
          </Link>
          <p className="mt-4 text-white/60 text-xs">~10 phút · Không cần đăng ký · Hoàn toàn miễn phí</p>
        </div>
      </section>

      {/* ── WHAT IS IKIGAI ── */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Ikigai là gì?</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lý do để thức dậy mỗi sáng</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            Người Nhật tin rằng mỗi người đều có một <strong>Ikigai</strong> — ý nghĩa sống riêng biệt.
            Khi bạn tìm được nó, công việc không còn là gánh nặng, và cuộc sống trở nên có hướng đi rõ ràng hơn.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PILLARS.map((p) => (
              <div key={p.label} className={`rounded-2xl border p-4 text-left ${p.bg} ${p.border}`}>
                <div className="text-2xl mb-2">{p.emoji}</div>
                <div className={`font-bold text-sm mb-1 ${p.text}`}>{p.label}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{p.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-white rounded-2xl border border-orange-200 p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-bold text-orange-500">Ikigai</span> nằm ở điểm giao thoa của cả 4 yếu tố.
              Đó là nơi bạn <em>vừa yêu thích, vừa giỏi, vừa có ích, vừa bền vững</em> về tài chính.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-4 py-12">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2 text-center">Cách hoạt động</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">3 bước đơn giản</h2>
          <div className="space-y-4">
            {STEPS.map((s) => (
              <div key={s.num} className="flex gap-4 items-start bg-gray-50 rounded-2xl p-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {s.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{s.emoji}</span>
                    <p className="font-bold text-gray-800 text-sm">{s.title}</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REPORT PREVIEW ── */}
      <section className="bg-gray-50 px-4 py-12">
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2 text-center">Báo cáo của bạn gồm</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">8 phần phân tích chuyên sâu</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Được cá nhân hóa hoàn toàn dựa trên câu trả lời của bạn</p>
          <div className="grid grid-cols-2 gap-2.5">
            {REPORT_SECTIONS.map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
                <span className="text-xl">{s.icon}</span>
                <span className="text-sm font-semibold text-gray-700">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR WHO ── */}
      <section className="px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Dành cho ai?</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bạn đang ở giai đoạn nào?</h2>
          <div className="space-y-3 text-left">
            {[
              { emoji: "🎒", title: "Học sinh cấp 3", desc: "Băn khoăn chọn ngành đại học, muốn biết mình phù hợp với lĩnh vực nào" },
              { emoji: "🎓", title: "Sinh viên", desc: "Lo lắng sau khi ra trường sẽ làm gì, liệu ngành mình học có đúng không" },
              { emoji: "💼", title: "Người đi làm", desc: "Cảm thấy công việc hiện tại thiếu ý nghĩa, muốn tìm hướng đi mới" },
            ].map((g) => (
              <div key={g.title} className="flex gap-4 items-start border border-gray-100 rounded-2xl p-4 bg-white shadow-sm">
                <span className="text-2xl">{g.emoji}</span>
                <div>
                  <p className="font-bold text-gray-800 text-sm mb-0.5">{g.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-gradient-to-br from-orange-500 to-amber-400 px-4 py-14 text-center">
        <div className="max-w-lg mx-auto">
          <div className="text-4xl mb-4">🌸</div>
          <h2 className="text-2xl font-bold text-white mb-3">Sẵn sàng khám phá Ikigai của bạn?</h2>
          <p className="text-white/80 text-sm mb-8 leading-relaxed">
            Chỉ mất 10 phút — nhưng có thể thay đổi cách bạn nhìn về bản thân và tương lai.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-white text-orange-500 px-10 py-3.5 rounded-2xl font-bold text-base hover:bg-orange-50 transition-colors shadow-lg"
          >
            Bắt đầu ngay →
          </Link>
          <p className="mt-4 text-white/60 text-xs">Miễn phí · Không cần đăng ký · Kết quả ngay lập tức</p>
        </div>
      </section>

    </main>
  )
}
