import { getPrisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getUserFromCookie() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  const userRole = cookieStore.get('userRole')?.value
  if (!userId) return null
  return { id: userId, role: userRole }
}

export default async function AdminPage() {
  const user = await getUserFromCookie()

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.svg" alt="SSM" style={{ height: '60px', margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Admin Access</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>Please sign in with admin credentials</p>
        </div>
        <div style={{ background: '#f0f4ff', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem', color: '#333' }}>Go to login page to sign in as admin</p>
          <a href="/login" className="btn-primary" style={{ display: 'inline-block', padding: '0.8rem 2rem' }}>
            GO TO LOGIN
          </a>
        </div>
      </div>
    )
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>Access Denied</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>You are not authorized to access the admin dashboard.</p>
        <a href="/" className="btn-primary" style={{ display: 'inline-block', padding: '0.8rem 2rem' }}>GO HOME</a>
      </div>
    )
  }

  const prisma = getPrisma()
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  })

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const totalRevenue = orders
    .filter((o: any) => o.paymentStatus === 'PAID')
    .reduce((sum: number, o: any) => sum + o.total, 0)

  const pendingOrders = orders.filter((o: any) => o.paymentStatus === 'PENDING').length

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>🏥 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#007bff', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Total Products</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{products.length}</p>
        </div>
        <div style={{ background: '#f68b1e', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Total Orders</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{orders.length}</p>
        </div>
        <div style={{ background: '#28a745', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Revenue (Paid)</p>
          <p style={{ fontSize: '1.8rem', fontWeight: '700' }}>KSh {totalRevenue.toLocaleString()}</p>
        </div>
        <div style={{ background: '#9c27b0', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Pending</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{pendingOrders}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="section-card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>📦 All Orders ({orders.length})</h2>

        {orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
            <p>No orders yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Order ID</th>
                  <th style={{ padding: '0.75rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem' }}>Contact</th>
                  <th style={{ padding: '0.75rem' }}>Location</th>
                  <th style={{ padding: '0.75rem' }}>Total</th>
                  <th style={{ padding: '0.75rem' }}>Payment</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: '600' }}>{order.id.slice(-8).toUpperCase()}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                      {order.user && <div style={{ fontSize: '0.75rem', color: '#888' }}>User: {order.user.name}</div>}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div>{order.customerPhone}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>{order.customerEmail || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div>{order.city}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>{order.address}</div>
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: '700' }}>KSh {order.total.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: order.paymentStatus === 'PAID' ? '#e8f5e9' : '#ffebee',
                        color: order.paymentStatus === 'PAID' ? '#2e7d32' : '#c62828',
                      }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: order.status === 'PENDING' ? '#fff3e0' : '#e3f2fd',
                        color: order.status === 'PENDING' ? '#e65100' : '#1565c0',
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
