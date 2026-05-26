export const IKIGAI9_STATEMENTS = [
  "Tôi có lý do để sống",
  "Cuộc sống của tôi có ý nghĩa",
  "Tôi cảm thấy có mục đích trong cuộc sống",
  "Việc học/công việc của tôi có ý nghĩa với tôi",
  "Tôi cảm thấy sống động với những gì tôi đang làm",
  "Tôi tin rằng sự tồn tại của tôi quan trọng với ai đó",
  "Cuộc sống của tôi đầy đủ và hạnh phúc",
  "Tôi cảm thấy cuộc sống có giá trị",
  "Tôi có những lý do rõ ràng để thức dậy mỗi sáng",
]

export type PillarKey = "love" | "strength" | "mission" | "income"

export interface QuizQuestion {
  text: string
  hint: string
  placeholder: string
}

export interface PillarConfig {
  key: PillarKey
  label: string
  emoji: string
  description: string
  colorClass: {
    bg: string
    border: string
    text: string
    button: string
    hintText: string
  }
  questions: QuizQuestion[]
}

export const PILLARS: PillarConfig[] = [
  {
    key: "love",
    label: "Yêu thích",
    emoji: "❤️",
    description: "Những điều bạn thực sự đam mê — làm vì thích, không cần ai nhắc",
    colorClass: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      button: "bg-orange-500 hover:bg-orange-600",
      hintText: "text-orange-500",
    },
    questions: [
      {
        text: "Hồi nhỏ, bạn hay làm gì mà không ai cần nhắc nhở?",
        hint: "Tự nhiên bạn cứ làm hoài — vẽ, đọc, lắp ghép, chơi nhạc, lập trình...",
        placeholder: "Ví dụ: Tôi hay vẽ tranh suốt ngày, mẹ không cần nhắc...",
      },
      {
        text: "Hoạt động nào khiến bạn nhìn đồng hồ và không tin đã qua 2–3 tiếng?",
        hint: "Lúc làm điều đó, thời gian như biến mất — bạn quên ăn, quên điện thoại",
        placeholder: "Ví dụ: Khi chơi game chiến thuật, tôi ngồi 4 tiếng không hay...",
      },
      {
        text: "Bạn sẵn sàng bỏ tiền túi hoặc thức khuya để theo đuổi điều gì?",
        hint: "Dù không ai yêu cầu, bạn vẫn tự đầu tư thời gian và tiền bạc",
        placeholder: "Ví dụ: Tôi mua sách về tâm lý học dù không học môn đó...",
      },
      {
        text: "Chủ đề nào bạn có thể nói hàng giờ mà không cần chuẩn bị trước?",
        hint: "Ai hỏi về chủ đề này là bạn 'sáng mắt lên', nói không ngừng được",
        placeholder: "Ví dụ: Lịch sử các nền văn minh cổ đại, tôi nói được cả buổi...",
      },
      {
        text: "Khi được tự do làm bất cứ điều gì một ngày, bạn thường chọn làm gì?",
        hint: "Không deadline, không áp lực — bạn sẽ tự nhiên chọn làm gì đầu tiên?",
        placeholder: "Ví dụ: Tôi sẽ ra quán cà phê, mở laptop, viết truyện cả ngày...",
      },
    ],
  },
  {
    key: "strength",
    label: "Sở trường",
    emoji: "💪",
    description: "Những điều bạn làm tốt hơn người khác — đôi khi bạn không nhận ra",
    colorClass: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      button: "bg-blue-500 hover:bg-blue-600",
      hintText: "text-blue-500",
    },
    questions: [
      {
        text: "Bạn bè hoặc gia đình thường nhờ bạn giúp việc gì?",
        hint: "Khi họ cần ai đó, tên bạn xuất hiện đầu tiên trong đầu họ — vì lý do gì?",
        placeholder: "Ví dụ: Bạn bè hay nhờ tôi thiết kế poster, xử lý máy tính...",
      },
      {
        text: "Việc gì bạn làm nhanh hơn hoặc tốt hơn người bình thường mà không cần cố gắng nhiều?",
        hint: "Bạn cảm thấy 'việc này bình thường mà' nhưng người khác lại thấy khó",
        placeholder: "Ví dụ: Tôi đọc tài liệu tiếng Anh rất nhanh, người khác thấy khó...",
      },
      {
        text: "Thành tích hoặc kỹ năng nào bạn tự hào nhất từ trước đến nay?",
        hint: "Giải thưởng, dự án hoàn thành, kỹ năng đạt được — bất kỳ thứ gì bạn tự hào",
        placeholder: "Ví dụ: Tôi đã tự học guitar và chơi được bài khó trong 3 tháng...",
      },
      {
        text: "Môn học, môn thể thao, hoặc hoạt động nào bạn giỏi hơn hẳn so với bạn bè?",
        hint: "Không cần hoàn hảo, chỉ cần tốt hơn mức trung bình một cách tự nhiên",
        placeholder: "Ví dụ: Toán và logic, tôi giải nhanh hơn cả lớp mà không ôn nhiều...",
      },
      {
        text: "Kỹ năng hoặc đặc điểm nào của bạn mà ít người xung quanh có?",
        hint: "Đôi khi là khả năng bạn cho là 'bình thường' nhưng người khác không có",
        placeholder: "Ví dụ: Tôi nhớ chi tiết rất tốt, hoặc tôi có thể hiểu cảm xúc người khác...",
      },
    ],
  },
  {
    key: "mission",
    label: "Sứ mệnh",
    emoji: "🌍",
    description: "Điều thế giới cần — vấn đề bạn muốn góp phần giải quyết",
    colorClass: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      button: "bg-green-500 hover:bg-green-600",
      hintText: "text-green-600",
    },
    questions: [
      {
        text: "Điều gì trong cuộc sống hiện tại khiến bạn cảm thấy bức xúc và muốn ai đó sửa nó?",
        hint: "Đọc tin tức, thấy ngoài đường, hay trong trường — điều gì làm bạn khó chịu nhất?",
        placeholder: "Ví dụ: Thấy học sinh nghèo không có điều kiện học tốt như người thành phố...",
      },
      {
        text: "Nếu bạn có thể giúp đỡ một nhóm người cụ thể, đó sẽ là ai?",
        hint: "Trẻ em, người già, người khuyết tật, học sinh, người lao động... Ai khiến bạn muốn giúp nhất?",
        placeholder: "Ví dụ: Trẻ em vùng nông thôn không có thầy cô giỏi dạy...",
      },
      {
        text: "Bạn muốn người khác nhớ đến bạn vì điều gì sau 20 năm nữa?",
        hint: "'Người này đã giúp tôi...' hoặc 'Nhờ có người này mà...' — câu đó kết thúc như thế nào?",
        placeholder: "Ví dụ: Tôi muốn được nhớ là người đã giúp nhiều bạn trẻ tìm được hướng đi...",
      },
      {
        text: "Nếu tiền không phải vấn đề, bạn muốn dành thời gian làm điều gì để giúp ích xã hội?",
        hint: "Không cần nghề nghiệp cụ thể — hãy nghĩ về TÁC ĐỘNG bạn muốn tạo ra",
        placeholder: "Ví dụ: Dạy kỹ năng sống miễn phí cho trẻ em có hoàn cảnh khó khăn...",
      },
      {
        text: "Vấn đề nào bạn cảm thấy PHẢI được giải quyết — không ai làm là bạn bực bội?",
        hint: "Môi trường, giáo dục, sức khỏe, bình đẳng, công nghệ... điều gì bạn quan tâm nhất?",
        placeholder: "Ví dụ: Rất ít người dạy trẻ em cách tư duy phản biện từ nhỏ...",
      },
    ],
  },
  {
    key: "income",
    label: "Hướng đi",
    emoji: "💡",
    description: "Điều bạn có thể kiếm sống được — tạo ra giá trị mà người khác sẵn sàng trả tiền",
    colorClass: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      button: "bg-purple-500 hover:bg-purple-600",
      hintText: "text-purple-500",
    },
    questions: [
      {
        text: "Đã ai từng trả tiền, tặng quà, hoặc cảm ơn bạn vì một kỹ năng/dịch vụ cụ thể chưa?",
        hint: "Dù chỉ một lần — thiết kế, viết bài, dạy kèm, sửa máy, tư vấn... bất kỳ thứ gì",
        placeholder: "Ví dụ: Bạn cùng lớp trả tiền để tôi chỉnh sửa ảnh cho họ...",
      },
      {
        text: "Kỹ năng nào của bạn mà nếu ai đó cần, họ sẵn sàng tìm và trả tiền để thuê?",
        hint: "Lập trình, viết lách, thiết kế, dạy học, tư vấn, chụp ảnh, dịch thuật...",
        placeholder: "Ví dụ: Tôi viết nội dung tốt, nghĩ công ty hay cá nhân sẽ thuê...",
      },
      {
        text: "Ngành nghề hoặc lĩnh vực nào bạn nghĩ phù hợp với mình và có triển vọng?",
        hint: "Không cần chắc chắn — liệt kê 2-3 lĩnh vực bạn thấy thú vị và có cơ hội việc làm",
        placeholder: "Ví dụ: Công nghệ thông tin, marketing, giáo dục, thiết kế...",
      },
      {
        text: "Trong 10 năm tới, bạn hình dung mình đang làm gì để tạo ra thu nhập?",
        hint: "Không cần đúng hoàn toàn — chỉ cần một hình ảnh tương lai bạn thấy phù hợp",
        placeholder: "Ví dụ: Tôi đang chạy một kênh YouTube về khoa học và kiếm tiền từ đó...",
      },
      {
        text: "Nếu bạn tạo ra một sản phẩm hoặc dịch vụ, đó sẽ là gì và ai sẽ mua?",
        hint: "Khóa học, ứng dụng, dịch vụ tư vấn, nội dung, sản phẩm thủ công... Bạn bán gì?",
        placeholder: "Ví dụ: Khóa học vẽ online cho người mới bắt đầu, học phí 500k...",
      },
    ],
  },
]

export const STATUS_OPTIONS = [
  "Học sinh cấp 2 / cấp 3",
  "Sinh viên đại học / cao đẳng",
  "Vừa tốt nghiệp, đang tìm việc",
  "Đang đi làm",
  "Đang muốn chuyển ngành / nghề",
  "Khác",
]
