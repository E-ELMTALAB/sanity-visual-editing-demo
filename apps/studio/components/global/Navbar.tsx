import { resolveHref } from 'lib/sanity.links'
import Link from 'next/link'
import { MenuItem } from 'types'

interface NavbarProps {
  menuItems?: MenuItem[]
}

export function Navbar({ menuItems }: NavbarProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-gray-900/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-10 md:py-5 lg:px-16 xl:px-24 2xl:px-32">
        <Link
          key="home"
          className={`rounded-md bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-lg font-extrabold text-transparent transition-colors hover:from-indigo-300 hover:to-fuchsia-300 md:text-xl`}
          href={'/'}
        >
          Studio Starter
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {menuItems &&
            menuItems.map((menuItem) => {
              const href = resolveHref(menuItem?._type, menuItem?.slug)
              if (!href) {
                return null
              }
              const isHome = menuItem?._type === 'home'
              return (
                <Link
                  key={href}
                  className={`rounded-md px-2 py-1 text-base transition-colors md:text-lg ${
                    isHome
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  href={href}
                >
                  {menuItem.title}
                </Link>
              )
            })}
        </nav>
      </div>
    </div>
  )
}
