import { CustomPortableText } from 'components/shared/CustomPortableText'

interface HeaderProps {
  centered?: boolean
  description?: any[]
  title?: string
}
export function Header(props: HeaderProps) {
  const { title, description, centered = false } = props
  if (!description && !title) {
    return null
  }
  return (
    <div className={`${centered ? 'text-center' : 'w-full lg:w-3/4'}`}>
      {/* Title */}
      <div className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-5xl">
        {title}
      </div>
      {/* Description */}
      {description && (
        <div className="mt-4 font-serif text-xl text-gray-300 md:text-2xl">
          <CustomPortableText value={description} />
        </div>
      )}
    </div>
  )
}
