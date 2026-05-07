import { getOrders } from '@/lib/actions'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const orders = await getOrders()

  const totalRevenue = orders
    .filter((o: any) => o.paymentStatus === 'PAID')
    .reduce((sum: number, o: any) => sum + o.total, 0)

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>🏥 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f68b1e', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Total Orders</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{orders.length}</p>
        </div>
        <div style={{ background: '#2196F3', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Revenue (Paid)</p>
          <p style={{ fontSize: '1.8rem', fontWeight: '700' }}>KSh {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="section-card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>Recent Orders</h2>

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
                  <th style={{ padding: '0.75rem' }}>City</th>
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
                      <div>{order.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>{order.customerPhone}</div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{order.city}</td>
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
