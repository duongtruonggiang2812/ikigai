interface Intersections {
  passion: string
  profession: string
  vocation: string
  calling: string
}

interface VennDiagramProps {
  intersections?: Intersections
}

export default function VennDiagram({ intersections }: VennDiagramProps) {
  return (
    <div className="w-full">
      {/* SVG */}
      <div className="relative w-full max-w-xs mx-auto">
        <svg viewBox="0 0 320 320" className="w-full">
          <circle cx="130" cy="130" r="110" fill="#FED7AA" fillOpacity="0.55" stroke="#FB923C" strokeWidth="1.5" />
          <circle cx="190" cy="130" r="110" fill="#BFDBFE" fillOpacity="0.55" stroke="#60A5FA" strokeWidth="1.5" />
          <circle cx="190" cy="190" r="110" fill="#E9D5FF" fillOpacity="0.55" stroke="#C084FC" strokeWidth="1.5" />
          <circle cx="130" cy="190" r="110" fill="#BBF7D0" fillOpacity="0.55" stroke="#4ADE80" strokeWidth="1.5" />
          <text x="52" y="72" textAnchor="middle" fontSize="11" fontWeight="600" fill="#C2410C">❤️ Yêu thích</text>
          <text x="270" y="72" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1D4ED8">💪 Sở trường</text>
          <text x="270" y="265" textAnchor="middle" fontSize="11" fontWeight="600" fill="#7E22CE">💡 Hướng đi</text>
          <text x="52" y="265" textAnchor="middle" fontSize="11" fontWeight="600" fill="#15803D">🌍 Sứ mệnh</text>
          <text x="160" y="100" textAnchor="middle" fontSize="9" fill="#92400E">Đam mê</text>
          <text x="215" y="163" textAnchor="middle" fontSize="9" fill="#4C1D95">Nghề nghiệp</text>
          <text x="160" y="228" textAnchor="middle" fontSize="9" fill="#14532D">Thiên chức</text>
          <text x="106" y="163" textAnchor="middle" fontSize="9" fill="#052E16">Lý tưởng</text>
          <circle cx="160" cy="160" r="28" fill="white" fillOpacity="0.9" />
          <text x="160" y="156" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1C1917">IKIGAI</text>
          <text x="160" y="169" textAnchor="middle" fontSize="8" fill="#78716C">生き甲斐</text>
        </svg>
      </div>

      {/* Intersection descriptions */}
      {intersections && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-xs font-bold text-amber-700 mb-1">🔥 Đam mê</p>
            <p className="text-xs text-gray-600 leading-relaxed">{intersections.passion}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs font-bold text-blue-700 mb-1">💼 Nghề nghiệp</p>
            <p className="text-xs text-gray-600 leading-relaxed">{intersections.profession}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <p className="text-xs font-bold text-green-700 mb-1">🌱 Thiên chức</p>
            <p className="text-xs text-gray-600 leading-relaxed">{intersections.vocation}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
            <p className="text-xs font-bold text-purple-700 mb-1">✨ Lý tưởng</p>
            <p className="text-xs text-gray-600 leading-relaxed">{intersections.calling}</p>
          </div>
        </div>
      )}
    </div>
  )
}
