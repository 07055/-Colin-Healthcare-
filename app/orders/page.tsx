'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
  paymentMethod: string
  total: number
  items: OrderItem[]
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [notLoggedIn, setNotLoggedIn] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('not logged in')
        return res.json()
      })
      .then(data => {
        if (data.user) {
          setOrders(data.user.orders || [])
        } else {
          setNotLoggedIn(true)
        }
        setLoading(false)
      })
      .catch(() => {
        setNotLoggedIn(true)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (notLoggedIn) router.push('/login')
  }, [notLoggedIn, router])

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <div style={{ color: '#666' }}>Loading orders...</div>
      </div>
    )
  }

  if (notLoggedIn) return null

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>My Orders ({orders.length})</h1>

      {orders.length === 0 ? (
        <div className="section-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No orders yet</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>Start shopping to see your orders here</p>
          <Link href="/shop" className="btn-primary" style={{ display: 'inline-block', padding: '0.8rem 2rem' }}>BROWSE SHOP</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <div key={order.id} className="section-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', background: order.paymentStatus === 'PAID' ? '#e8f5e9' : '#fff3e0', color: order.paymentStatus === 'PAID' ? '#2e7d32' : '#e65100' }}>
                    {order.paymentStatus}
                  </span>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', background: order.status === 'DELIVERED' ? '#e8f5e9' : '#e3f2fd', color: order.status === 'DELIVERED' ? '#2e7d32' : '#1565c0' }}>
                    {order.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>{order.paymentMethod === 'CASH_ON_DELIVERY' ? 'COD' : 'Paystack'}</span>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span>{item.name} x {item.quantity}</span>
                    <span style={{ fontWeight: '600' }}>KSh {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #eee' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Total: KSh {order.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
