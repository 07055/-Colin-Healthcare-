'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './profile.module.css'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  createdAt: string
  status: string
  paymentStatus: string
  total: number
  customerPhone: string
  items: OrderItem[]
}

interface UserData {
  id: string
  name: string | null
  email: string
  phone: string | null
  city: string | null
  location: string | null
  orders: Order[]
}

function OrderCard({ order }: { order: Order }) {
  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <div>
          <p className={styles.orderId}>Order #{order.id.slice(-8).toUpperCase()}</p>
          <p className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className={styles.badges}>
          <span className={order.paymentStatus === 'PAID' ? styles.paidBadge : styles.pendingBadge}>
            {order.paymentStatus}
          </span>
          <span className={styles.statusBadge}>{order.status}</span>
        </div>
      </div>
      <div className={styles.orderItems}>
        {order.items.map((item) => (
          <div key={item.id} className={styles.orderItem}>
            <span>{item.name} × {item.quantity}</span>
            <span className={styles.itemPrice}>KSh {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className={styles.orderFooter}>
        <span className={styles.total}>Total: KSh {order.total.toLocaleString()}</span>
        <span className={styles.phone}>📱 {order.customerPhone}</span>
      </div>
    </div>
  )
}

function UpdateProfileForm({ user, onUpdate }: { user: UserData; onUpdate: (u: UserData) => void }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const city = formData.get('city') as string
    const location = formData.get('location') as string

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, city, location }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('Profile updated!')
        onUpdate({ ...user, name, phone, city, location })
      } else {
        setError(data.error || 'Update failed')
      }
    } catch {
      setError('Update failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.editCard}>
      <h3 className={styles.sectionTitle}>UPDATE PROFILE</h3>
      {success && <div className={styles.successMsg}>{success}</div>}
      {error && <div className={styles.errorMsg}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.editForm}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input type="text" name="name" defaultValue={user.name || ''} required />
        </div>
        <div className={styles.formGroup}>
          <label>Phone</label>
          <input type="tel" name="phone" defaultValue={user.phone || ''} />
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>City</label>
            <input type="text" name="city" defaultValue={user.city || ''} />
          </div>
          <div className={styles.formGroup}>
            <label>Location</label>
            <input type="text" name="location" defaultValue={user.location || ''} />
          </div>
        </div>
        <button type="submit" disabled={loading} className={styles.saveBtn}>
          {loading ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notLoggedIn, setNotLoggedIn] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('not logged in')
        return res.json()
      })
      .then(data => {
        setUser(data.user)
        setLoading(false)
      })
      .catch(() => {
        setNotLoggedIn(true)
        setLoading(false)
      })
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Loading profile...</p>
      </div>
    )
  }

  if (notLoggedIn || !user) {
    router.push('/login')
    return null
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ width: '280px', flexShrink: 0 }}>
          <div className="section-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: '#007bff', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem', fontSize: '2rem', fontWeight: '700'
            }}>
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{user.name}</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>{user.email}</p>
            {user.phone && <p style={{ fontSize: '0.85rem', color: '#666' }}>📱 {user.phone}</p>}
            {user.city && <p style={{ fontSize: '0.85rem', color: '#666' }}>📍 {user.city}</p>}
            <button
              onClick={handleLogout}
              style={{
                marginTop: '1rem', background: '#dc3545', color: 'white',
                border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px',
                cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem'
              }}
            >
              LOGOUT
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>My Profile</h1>
          <UpdateProfileForm user={user} onUpdate={setUser} />

          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '1.5rem 0 1rem' }}>My Orders ({user.orders.length})</h2>
          {user.orders.length === 0 ? (
            <div className="section-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No orders yet</h3>
              <p style={{ color: '#666', marginBottom: '1.5rem' }}>Start shopping to see your orders here</p>
              <a href="/shop" className="btn-primary" style={{ display: 'inline-block', padding: '0.8rem 2rem' }}>BROWSE SHOP</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {user.orders.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}