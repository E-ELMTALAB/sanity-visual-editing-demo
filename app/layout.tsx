import 'tailwindcss/tailwind.css'

import { IBM_Plex_Mono, Inter, PT_Serif } from 'next/font/google'
import { Geist, Geist_Mono } from 'geist/font'
import dynamic from 'next/dynamic'
const AppVisualEditing = dynamic(() => import('components/visual-editing/AppVisualEditing'), { ssr: false })
const AppSharifProviders = dynamic(() => import('components/visual-editing/AppSharifProviders'), { ssr: false })
import '../styles/sharifgpt.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const serif = PT_Serif({
  variable: '--font-serif',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  weight: ['400', '700'],
})
const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  // @todo: understand why extrabold (800) isn't being respected when explicitly specified in this weight array
  // weight: ['500', '700', '800'],
})
const mono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['500', '700'],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${Geist.variable} ${Geist_Mono.variable} ${mono.variable} ${sans.variable} ${serif.variable}`}
    >
      <body>
        <AppSharifProviders>{children}</AppSharifProviders>
        <AppVisualEditing />
      </body>
    </html>
  )
}
