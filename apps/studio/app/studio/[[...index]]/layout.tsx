/**
 * Layout for Sanity Studio to ensure it always uses LTR direction
 * This overrides the global RTL setting from the root layout
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

