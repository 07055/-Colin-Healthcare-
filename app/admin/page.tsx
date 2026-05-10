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

  if (!user || user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const prisma = getPrisma()
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  })

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const users = await prisma.user.findMany({
    where: { role: 'USER' },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, phone: true, city: true, createdAt: true, orders: { select: { id: true, total: true } } }
  })

  const totalRevenue = orders
    .filter((o: any) => o.paymentStatus === 'PAID')
    .reduce((sum: number, o: any) => sum + o.total, 0)

  const pendingOrders = orders.filter((o: any) => o.paymentStatus === 'PENDING').length

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>View Site</a>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#007bff', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Products</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{products.length}</p>
        </div>
        <div style={{ background: '#f68b1e', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Orders</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{orders.length}</p>
        </div>
        <div style={{ background: '#28a745', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Revenue</p>
          <p style={{ fontSize: '1.8rem', fontWeight: '700' }}>KSh {totalRevenue.toLocaleString()}</p>
        </div>
        <div style={{ background: '#9c27b0', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Customers</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{users.length}</p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="section-card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>Customers ({users.length})</h2>
        {users.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No customers yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Phone</th>
                  <th style={{ padding: '0.75rem' }}>City</th>
                  <th style={{ padding: '0.75rem' }}>Orders</th>
                  <th style={{ padding: '0.75rem' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>{u.name || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem' }}>{u.phone || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>{u.city || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ background: '#e3f2fd', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{u.orders.length}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#666' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="section-card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No orders yet.</div>
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
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: order.paymentStatus === 'PAID' ? '#e8f5e9' : '#ffebee', color: order.paymentStatus === 'PAID' ? '#2e7d32' : '#c62828' }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: order.status === 'PENDING' ? '#fff3e0' : '#e3f2fd', color: order.status === 'PENDING' ? '#e65100' : '#1565c0' }}>
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