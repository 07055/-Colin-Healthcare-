import Link from 'next/link'
import AdminLogoutButton from '@/components/AdminLogoutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header style={{
        background: '#181818', color: '#fff', padding: '0.75rem 0',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/admin" style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff' }}>
            ⚙️ SSM Admin
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.85rem' }}>
            <Link href="/" style={{ color: '#aaa' }}>View Store</Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
