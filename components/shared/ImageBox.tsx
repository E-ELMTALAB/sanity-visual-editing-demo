import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'

interface ImageBoxProps {
  image?: { asset?: any }
  alt?: string
  width?: number
  height?: number
  size?: string
  classesWrapper?: string
}

export default function ImageBox({
  image,
  alt = 'Cover image',
  width = 3500,
  height = 2000,
  size = '100vw',
  classesWrapper,
}: ImageBoxProps) {
  const imageUrl =
    image && urlForImage(image)?.height(height).width(width).fit('crop').url()

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-xl bg-gray-800/50 ring-1 ring-white/10 ${classesWrapper}`}
    >
      {imageUrl && (
        <Image
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          alt={alt}
          width={width}
          height={height}
          sizes={size}
          src={imageUrl}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
    </div>
  )
}
