import { ReactNode } from 'react'

interface DynamicHeadingProps {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: ReactNode
  className?: string
  id?: string
}

export default function DynamicHeading({ tag, children, className, id }: DynamicHeadingProps) {
  const Tag = tag as keyof JSX.IntrinsicElements
  
  return (
    <Tag className={className} id={id}>
      {children}
    </Tag>
  )
}
