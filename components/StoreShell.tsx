'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import { CartProvider } from '@/lib/CartContext'
import WhatsAppHelp from './WhatsAppHelp'

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <CartProvider>
      <Header />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <Footer />
      <WhatsAppHelp />
    </CartProvider>
  )
}
