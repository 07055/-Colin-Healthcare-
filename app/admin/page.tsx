import { getPrisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminPage({ searchParams }: { searchParams: { password?: string } }) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'samsuma2024'

  if (searchParams.password !== adminPassword) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>Admin Access</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Enter admin password to continue</p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            required
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button
            type="submit"
            formAction={`/admin?password=${adminPassword}`}
            className="btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700' }}
          >
            ACCESS DASHBOARD
          </button>
        </form>
      </div>
    )
  }

  const prisma = getPrisma()
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true, user: true }
  })

  const totalRevenue = orders
    .filter((o: any) => o.paymentStatus === 'PAID')
    .reduce((sum: number, o: any) => sum + o.total, 0)

  const totalOrders = orders.length
  const paidOrders = orders.filter((o: any) => o.paymentStatus === 'PAID').length
  const pendingOrders = orders.filter((o: any) => o.paymentStatus === 'PENDING').length

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>🏥 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f68b1e', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Total Orders</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{totalOrders}</p>
        </div>
        <div style={{ background: '#4caf50', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Paid Orders</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{paidOrders}</p>
        </div>
        <div style={{ background: '#2196F3', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Revenue (Paid)</p>
          <p style={{ fontSize: '1.8rem', fontWeight: '700' }}>KSh {totalRevenue.toLocaleString()}</p>
        </div>
        <div style={{ background: '#ff9800', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Pending</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{pendingOrders}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="section-card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>All Orders ({totalOrders})</h2>

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
                  <th style={{ padding: '0.75rem' }}>Items</th>
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
                    <td style={{ padding: '0.75rem' }}>
                      {order.items.map((item: any) => (
                        <div key={item.id} style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                          {item.name} x{item.quantity} (KSh {item.price})
                        </div>
                      ))}
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
