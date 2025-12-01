import type { PortableTextBlock } from '@portabletext/types'
import { CustomPortableText } from 'components/shared/CustomPortableText'

export function Footer({ footer }: { footer: PortableTextBlock[] }) {
  return (
    <footer className="bottom-0 w-full bg-gray-950/60 px-6 py-10 text-center text-gray-300 backdrop-blur md:px-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        {footer && (
          <CustomPortableText
            paragraphClasses="text-md md:text-lg"
            value={footer}
          />
        )}
        <div className="mt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} Your Site. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
