import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import SupportWidget from "../components/support-widget"
import { CartProvider } from "../contexts/cart-context"
import dynamic from 'next/dynamic'

const AppVisualEditing = dynamic(
  () => import('../components/visual-editing/AppVisualEditing'), 
  { ssr: false }
)

export const metadata: Metadata = {
  title: "SharifGPT - صفحه اصلی",
  description: "ارائه دهنده برترین دوره‌ها و محصولات دیجیتال مبتنی بر هوش مصنوعی",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">
        <CartProvider>
          {children}
          <SupportWidget />
        </CartProvider>
        <AppVisualEditing />
      </body>
    </html>
  )
}
