import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
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
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PW97M4XV');`,
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PW97M4XV"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <CartProvider>
          {children}
          <SupportWidget />
        </CartProvider>
        <AppVisualEditing />
      </body>
    </html>
  )
}
