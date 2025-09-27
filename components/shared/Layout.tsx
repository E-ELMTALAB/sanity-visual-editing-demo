import { Footer } from 'components/global/Footer'
import { Navbar } from 'components/global/Navbar'
import IntroTemplate from 'intro-template'
import { SettingsPayload } from 'types'

const fallbackSettings: SettingsPayload = {
  menuItems: [],
  footer: [],
}

export interface LayoutProps {
  children: React.ReactNode
  settings: SettingsPayload | undefined
  preview?: boolean
}

export default function Layout({
  children,
  settings = fallbackSettings,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-100">
      <Navbar menuItems={settings?.menuItems} />
      <div className="mt-20 flex-grow px-4 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </div>
      <Footer footer={settings?.footer} />
      <IntroTemplate />
    </div>
  )
}
