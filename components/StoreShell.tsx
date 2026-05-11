'use client'

import { usePathname } from 'next/navigation'

export default function StoreShell({
  children,
  header,
  footer,
  whatsapp,
}: {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  whatsapp: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      {header}
      <main style={{ minHeight: '80vh' }}>{children}</main>
      {footer}
      {whatsapp}
    </>
  )
}
