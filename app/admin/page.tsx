import { getPrisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  const userRole = cookieStore.get('userRole')?.value

  if (!userId || userRole !== 'ADMIN') {
    redirect('/admin/login')
  }

  const prisma = getPrisma()
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true, items: true }
  })

  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  const users = await prisma.user.findMany({
    where: { role: 'USER' },
    orderBy: { createdAt: 'desc' }
  })

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + Number(o.total), 0)

  const pendingOrders = orders.filter(o => o.paymentStatus === 'PENDING').length

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>admin@ssm.co.ke</span>
          <a href="/" style={{ fontSize: '0.85rem', color: '#007bff' }}>View Site</a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
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

      <div className="section-card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>
          Orders ({orders.length})
          {pendingOrders > 0 && <span style={{ marginLeft: '0.5rem', background: '#ffebee', color: '#c62828', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>{pendingOrders} pending</span>}
        </h2>

        {orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
            <p>No orders yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>#</th>
                  <th style={{ padding: '0.75rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem' }}>Contact</th>
                  <th style={{ padding: '0.75rem' }}>Delivery Location</th>
                  <th style={{ padding: '0.75rem' }}>Items</th>
                  <th style={{ padding: '0.75rem' }}>Total</th>
                  <th style={{ padding: '0.75rem' }}>Payment</th>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem' }}>{i + 1}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                      {order.user && <div style={{ fontSize: '0.75rem', color: '#888' }}>{order.user.email}</div>}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div>{order.customerPhone}</div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div>{order.city}</div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>{order.address}</div>
                      {order.location && <div style={{ fontSize: '0.75rem', color: '#888' }}>{order.location}</div>}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {order.items.map(item => (
                        <div key={item.id} style={{ fontSize: '0.8rem' }}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: '700' }}>
                      KSh {Number(order.total).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: order.paymentStatus === 'PAID' ? '#e8f5e9' : '#fff3e0',
                        color: order.paymentStatus === 'PAID' ? '#2e7d32' : '#e65100',
                      }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#666', fontSize: '0.8rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-KE')}
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