import { getPrisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface OrderWithItems {
  id: string
  createdAt: Date
  status: string
  paymentStatus: string
  total: number
  customerPhone: string
  items: { id: string; name: string; price: number; quantity: number }[]
}

interface UserWithOrders {
  id: string
  name: string | null
  email: string
  phone: string | null
  city: string | null
  orders: OrderWithItems[]
}

export default async function ProfilePage() {
  let userId: string | undefined
  try {
    const cookieStore = await cookies()
    userId = cookieStore.get('userId')?.value
  } catch {
    redirect('/login')
  }

  if (!userId) {
    redirect('/login')
  }

  let user: UserWithOrders | null = null
  try {
    const prisma = getPrisma()
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: { items: true }
        }
      }
    }) as UserWithOrders | null
  } catch (err) {
    console.error('Profile page error:', err)
  }

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ width: '280px', flexShrink: 0 }}>
          <div className="section-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem', fontWeight: '700' }}>
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{user.name}</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>{user.email}</p>
            {user.phone && <p style={{ fontSize: '0.85rem', color: '#666' }}>📱 {user.phone}</p>}
            {user.city && <p style={{ fontSize: '0.85rem', color: '#666' }}>📍 {user.city}</p>}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>My Orders ({user.orders.length})</h1>

          {user.orders.length === 0 ? (
            <div className="section-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No orders yet</h2>
              <p style={{ color: '#666', marginBottom: '1.5rem' }}>Start shopping to see your orders here</p>
              <a href="/shop" className="btn-primary" style={{ display: 'inline-block', padding: '0.8rem 2rem' }}>
                BROWSE SHOP
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {user.orders.map((order) => (
                <div key={order.id} className="section-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', color: '#666' }}>Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', background: order.paymentStatus === 'PAID' ? '#e8f5e9' : '#fff3e0', color: order.paymentStatus === 'PAID' ? '#2e7d32' : '#e65100' }}>
                        {order.paymentStatus}
                      </span>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', background: '#e3f2fd', color: '#1565c0' }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    {order.items.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span>{item.name} × {item.quantity}</span>
                        <span style={{ fontWeight: '600' }}>KSh {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #eee' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Total: KSh {order.total.toLocaleString()}</span>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>📱 {order.customerPhone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}