/**
 * Layout for Sanity Studio inside the `sharifgpt-website` app
 * Forces LTR regardless of global RTL site layout
 */

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div 
      dir="ltr" 
      style={{ 
        direction: 'ltr',
        width: '100%',
        height: '100vh',
        overflow: 'auto'
      }}
    >
      {children}
    </div>
  )
}


