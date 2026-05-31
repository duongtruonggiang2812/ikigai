import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Ikigai · Tìm lý do để thức dậy mỗi sáng",
  description: "Khám phá Ikigai của bạn — điều bạn yêu thích, điều bạn giỏi, điều thế giới cần và điều bạn có thể kiếm sống.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Header />
        {children}
      </body>
    </html>
  )
}
