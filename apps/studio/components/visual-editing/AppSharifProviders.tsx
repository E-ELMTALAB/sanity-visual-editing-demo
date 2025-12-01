"use client"
import { CartProvider } from '@/contexts/cart-context'
import SupportWidget from '@/components/support-widget'

export default function AppSharifProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <SupportWidget />
    </CartProvider>
  )
}


