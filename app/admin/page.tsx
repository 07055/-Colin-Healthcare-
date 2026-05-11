'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string | null
  customerPhone: string
  city: string
  address: string
  location: string | null
  lat: number | null
  lng: number | null
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string
  createdAt: string
  items: OrderItem[]
  user: { email: string } | null
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  category: string
  featured: boolean
  images: string
  createdAt: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  city: string | null
  createdAt: string
  _count: { orders: number }
}

type PageView = 'dashboard' | 'orders' | 'customers' | 'products'

function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user && data.user.role === 'ADMIN') setAuthorized(true)
        else router.push('/admin/login')
      })
      .catch(() => router.push('/admin/login'))
  }, [router])

  if (!authorized) return null
  return <>{children}</>
}

export default function AdminPage() {
  const router = useRouter()
  const [view, setView] = useState<PageView>('dashboard')
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(data => {
      if (!data.user) router.push('/admin/login')
    })
    Promise.all([
      fetch('/api/admin/orders').then(r => r.json()),
      fetch('/api/admin/products').then(r => r.json()),
      fetch('/api/admin/customers').then(r => r.json()),
    ]).then(([ordersData, productsData, customersData]) => {
      setOrders(ordersData.orders || [])
      setProducts(productsData.products || [])
      setCustomers(customersData.customers || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [router])

  async function markDelivered(orderId: string) {
    await fetch(`/api/admin/orders/${orderId}`, { method: 'PATCH' })
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'DELIVERED' } : o))
  }

  async function deleteProduct(productId: string) {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
    setProducts(prev => prev.filter(p => p.id !== productId))
  }

  const totalRevenue = orders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + Number(o.total), 0)
  const pendingOrders = orders.filter(o => o.status === 'PENDING')

  if (loading) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>Loading dashboard...</div>
  }

  return (
    <AdminGuard>
      <div className="container" style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <a href="/" style={{ fontSize: '0.85rem', color: '#007bff' }}>View Site</a>
            <span style={{ color: '#ccc' }}>|</span>
            <button onClick={() => router.push('/')} style={{ fontSize: '0.85rem', color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}>Exit Admin</button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
          {(['dashboard', 'orders', 'customers', 'products'] as PageView[]).map(tab => (
            <button key={tab} onClick={() => setView(tab)} style={{
              padding: '0.5rem 1.2rem', border: 'none', borderRadius: '6px 6px 0 0',
              background: view === tab ? '#007bff' : 'transparent',
              color: view === tab ? 'white' : '#666',
              fontWeight: view === tab ? '700' : '400',
              cursor: 'pointer', fontSize: '0.9rem', textTransform: 'capitalize'
            }}>
              {tab === 'dashboard' ? 'Overview' : tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {view === 'dashboard' && (
          <>
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
                <p style={{ fontSize: '2rem', fontWeight: '700' }}>{customers.length}</p>
              </div>
            </div>

            <div className="section-card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>
                Pending Orders ({pendingOrders.length})
              </h2>
              {pendingOrders.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No pending orders.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {pendingOrders.slice(0, 5).map(order => (
                    <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#fff8e1', borderRadius: '6px' }}>
                      <div>
                        <span style={{ fontWeight: '600' }}>{order.customerName}</span>
                        <span style={{ color: '#666', marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                          KSh {Number(order.total).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#e65100' }}>{order.paymentMethod}</span>
                        <button onClick={() => markDelivered(order.id)} style={{ fontSize: '0.75rem', color: '#2e7d32', background: '#e8f5e9', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                          Mark Delivered
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Orders */}
        {view === 'orders' && (
          <div className="section-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>All Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}><p>No orders yet.</p></div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem' }}>#</th>
                      <th style={{ padding: '0.75rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem' }}>Contact</th>
                      <th style={{ padding: '0.75rem' }}>Delivery</th>
                      <th style={{ padding: '0.75rem' }}>Items</th>
                      <th style={{ padding: '0.75rem' }}>Total</th>
                      <th style={{ padding: '0.75rem' }}>Payment</th>
                      <th style={{ padding: '0.75rem' }}>Status</th>
                      <th style={{ padding: '0.75rem' }}>Action</th>
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
                        <td style={{ padding: '0.75rem' }}>{order.customerPhone}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <div>{order.city}</div>
                          <div style={{ fontSize: '0.75rem', color: '#666' }}>{order.address}</div>
                          {order.location && <div style={{ fontSize: '0.75rem', color: '#888' }}>{order.location}</div>}
                          {order.lat && order.lng && (
                            <a href={`https://www.google.com/maps?q=${order.lat},${order.lng}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#007bff' }}>📍 Map</a>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {order.items.map(item => (
                            <div key={item.id} style={{ fontSize: '0.8rem' }}>{item.name} x{item.quantity}</div>
                          ))}
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: '700' }}>KSh {Number(order.total).toLocaleString()}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: order.paymentStatus === 'PAID' ? '#e8f5e9' : '#fff3e0', color: order.paymentStatus === 'PAID' ? '#2e7d32' : '#e65100' }}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', background: order.status === 'DELIVERED' ? '#e8f5e9' : '#e3f2fd', color: order.status === 'DELIVERED' ? '#2e7d32' : '#1565c0' }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {order.status !== 'DELIVERED' && (
                            <button onClick={() => markDelivered(order.id)} style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                              Deliver
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Customers */}
        {view === 'customers' && (
          <div className="section-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>Registered Customers ({customers.length})</h2>
            {customers.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}><p>No customers yet.</p></div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem' }}>#</th>
                      <th style={{ padding: '0.75rem' }}>Name</th>
                      <th style={{ padding: '0.75rem' }}>Email</th>
                      <th style={{ padding: '0.75rem' }}>Phone</th>
                      <th style={{ padding: '0.75rem' }}>City</th>
                      <th style={{ padding: '0.75rem' }}>Orders</th>
                      <th style={{ padding: '0.75rem' }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c, i) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '0.75rem' }}>{i + 1}</td>
                        <td style={{ padding: '0.75rem', fontWeight: '600' }}>{c.name}</td>
                        <td style={{ padding: '0.75rem' }}>{c.email}</td>
                        <td style={{ padding: '0.75rem' }}>{c.phone || '-'}</td>
                        <td style={{ padding: '0.75rem' }}>{c.city || '-'}</td>
                        <td style={{ padding: '0.75rem' }}>{c._count?.orders || 0}</td>
                        <td style={{ padding: '0.75rem', color: '#666', fontSize: '0.8rem' }}>
                          {new Date(c.createdAt).toLocaleDateString('en-KE')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Products */}
        {view === 'products' && (
          <div>
            <ProductManager products={products} setProducts={setProducts} onDeleteProduct={deleteProduct} />
          </div>
        )}
      </div>
    </AdminGuard>
  )
}

function ProductManager({ products, setProducts, onDeleteProduct }: { products: Product[], setProducts: (p: Product[]) => void, onDeleteProduct: (id: string) => void }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', price: '', stock: '0', category: '', images: '', featured: false })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const categories = ['Brain Health', 'Energy', 'Supplements', 'Eye Health', 'Teas', 'Honey', 'Heart Health', 'Wellness', 'Diagnostics', 'PPE', 'Consumables', 'Hygiene', 'Equipment']

  function resetForm() {
    setForm({ name: '', slug: '', description: '', price: '', stock: '0', category: '', images: '', featured: false })
    setEditing(null)
    setError('')
  }

  function editProduct(p: Product) {
    setForm({ name: p.name, slug: p.slug, description: p.description, price: String(p.price), stock: String(p.stock), category: p.category, images: p.images, featured: p.featured })
    setEditing(p)
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (editing) {
        const res = await fetch(`/api/admin/products/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const data = await res.json()
        if (data.success) {
          setProducts(products.map(p => p.id === editing.id ? data.product : p))
          setShowForm(false)
          resetForm()
        } else setError(data.error || 'Update failed')
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const data = await res.json()
        if (data.success) {
          setProducts([data.product, ...products])
          setShowForm(false)
          resetForm()
        } else setError(data.error || 'Creation failed')
      }
    } catch {
      setError('Operation failed')
    } finally {
      setSaving(false)
    }
  }

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Products ({products.length})</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }} style={{ background: showForm ? '#666' : '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="section-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '1rem' }}>{editing ? 'Edit Product' : 'Add Product'}</h3>
          {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : generateSlug(e.target.value) })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Slug *</label>
              <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'monospace' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Description *</label>
              <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Price (KSh) *</label>
              <input required type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Category *</label>
              <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Image URL</label>
              <input value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
              <label htmlFor="featured" style={{ fontSize: '0.9rem' }}>Featured Product</label>
            </div>
          </div>
          <button type="submit" disabled={saving} style={{ marginTop: '1rem', background: '#007bff', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'SAVING...' : editing ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
          </button>
        </form>
      )}

      <div className="section-card" style={{ padding: '1.5rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Name</th>
                <th style={{ padding: '0.75rem' }}>Category</th>
                <th style={{ padding: '0.75rem' }}>Price</th>
                <th style={{ padding: '0.75rem' }}>Stock</th>
                <th style={{ padding: '0.75rem' }}>Featured</th>
                <th style={{ padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '600' }}>{p.name}</td>
                  <td style={{ padding: '0.75rem' }}>{p.category}</td>
                  <td style={{ padding: '0.75rem' }}>KSh {Number(p.price).toLocaleString()}</td>
                  <td style={{ padding: '0.75rem' }}>{p.stock}</td>
                  <td style={{ padding: '0.75rem' }}>{p.featured ? '⭐' : '-'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button onClick={() => editProduct(p)} style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.75rem' }}>
                      Edit
                    </button>
                    <button onClick={() => onDeleteProduct(p.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
