import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPrisma } from '@/lib/prisma'
import Link from 'next/link'
import styles from './dashboard.module.css'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value

  if (!userId) {
    redirect('/login')
  }

  const prisma = getPrisma()
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        include: { items: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>My Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Welcome back, {user.name}!</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* User Info */}
        <div className="section-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Profile Information</h2>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
            {user.city && <p><strong>City:</strong> {user.city}</p>}
            {user.location && <p><strong>Location:</strong> {user.location}</p>}
          </div>
        </div>

        {/* Orders */}
        <div className="section-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>My Orders ({user.orders.length})</h2>

          {user.orders.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
              No orders yet. <Link href="/shop" style={{ color: '#f68b1e' }}>Start shopping</Link>
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {user.orders.map((order: any) => (
                <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>#{order.id.slice(-8).toUpperCase()}</span>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      background: order.paymentStatus === 'PAID' ? '#e8f5e9' : '#ffebee',
                      color: order.paymentStatus === 'PAID' ? '#2e7d32' : '#c62828',
                    }}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                    {order.items.length} item(s) • KSh {order.total.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#999' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
