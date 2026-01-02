
import { IBM_Plex_Mono, Inter, PT_Serif } from 'next/font/google'
import Script from 'next/script'
import dynamic from 'next/dynamic'
const AppVisualEditing = dynamic(() => import('components/visual-editing/AppVisualEditing'), { ssr: false })
const AppSharifProviders = dynamic(() => import('components/visual-editing/AppSharifProviders'), { ssr: false })
import 'styles/index.css'
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
      className={`${mono.variable} ${sans.variable} ${serif.variable}`}
    >
      <body>
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="beforeInteractive"
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
        <AppSharifProviders>{children}</AppSharifProviders>
        <AppVisualEditing />
      </body>
    </html>
  )
}
