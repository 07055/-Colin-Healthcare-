import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createProduct, deleteProduct } from '@/lib/actions'
import ProductChart from '@/components/ProductChart'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('session_token')?.value

  if (!userId) redirect('/login')

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user?.role !== 'ADMIN') {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1>Unauthorized</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    )
  }

  let products: any[] = []
  let orders: any[] = []
  try {
    products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  } catch (error) {
    console.error("Failed to fetch data:", error)
  }

  const totalRevenue = orders
    .filter((o: any) => o.paymentStatus === 'PAID')
    .reduce((sum: number, o: any) => sum + o.total, 0)

  const pendingOrders = orders.filter((o: any) => o.status === 'PENDING').length

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>🏥 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f68b1e', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Total Products</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{products.length}</p>
        </div>
        <div style={{ background: '#2196F3', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Total Orders</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{orders.length}</p>
        </div>
        <div style={{ background: '#4CAF50', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Revenue (Paid)</p>
          <p style={{ fontSize: '1.8rem', fontWeight: '700' }}>KSh {totalRevenue.toLocaleString()}</p>
        </div>
        <div style={{ background: '#9C27B0', color: 'white', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.3rem' }}>Pending Processing</p>
          <p style={{ fontSize: '2rem', fontWeight: '700' }}>{pendingOrders}</p>
        </div>
      </div>

      {/* Recent Orders Section - Now More Prominent */}
      <div className="section-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>📦 Recent Orders</h2>
          <Link href="/orders" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>View All Orders</Link>
        </div>

        {orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <p>No orders yet. Start selling!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Order ID</th>
                  <th style={{ padding: '0.75rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem' }}>City</th>
                  <th style={{ padding: '0.75rem' }}>Total</th>
                  <th style={{ padding: '0.75rem' }}>Payment</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: '600' }}>{order.id.slice(-8).toUpperCase()}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div>{order.phone || 'Guest'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>{order.userId ? 'Registered' : 'Guest'}</div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{order.city || '-'}</td>
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
                    <td style={{ padding: '0.75rem', color: '#666' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Form Container */}
        <div className="section-card" style={{ width: '100%', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>➕ Add New Product</h2>
          <form action={createProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" name="name" required placeholder="Product Name" style={{ padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
            <textarea name="description" required rows={3} placeholder="Description" style={{ padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <input type="number" name="price" step="0.01" required placeholder="Price (KSh)" style={{ padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              <input type="number" name="stock" defaultValue={0} required placeholder="Stock" style={{ padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            
            <input type="text" name="category" required placeholder="Category" style={{ padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
            
            <div style={{ border: '2px dashed #ddd', padding: '2rem', textAlign: 'center', borderRadius: '4px', background: '#f9f9f9' }}>
                <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Upload Product Image</p>
                <input type="file" name="imageFile" accept="image/*" required style={{ maxWidth: '100%' }} />
            </div>
            
            <button type="submit" className="btn-primary" style={{ padding: '0.8rem', fontWeight: '700', width: '100%' }}>ADD PRODUCT</button>
          </form>
        </div>

        {/* Product List */}
        <div style={{ width: '100%' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>📦 Inventory ({products.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {products.map((product: any) => (
              <div key={product.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', background: '#fff', border: '1px solid #eee', borderRadius: '8px' }}>
                <div style={{ height: '150px', width: '100%', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                  <img src={product.images?.split(',')[0] || '/placeholder.jpg'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{product.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#666' }}>{product.category}</p>
                  </div>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button type="submit" style={{ background: '#ff4444', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}>Delete</button>
                  </form>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f68b1e' }}>KSh {product.price.toFixed(2)}</p>
                  <p style={{ fontSize: '0.75rem', color: product.stock < 10 ? 'red' : '#999' }}>Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
