'use client'

import { useState } from 'react'
import Link from 'next/link'

const STATUS_STEPS = ['PENDING', 'PRESCRIPTION_REVIEW', 'PROCESSING', 'SHIPPED', 'DELIVERED']

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface OrderData {
  id: string
  customerName: string
  customerPhone: string
  city: string
  address: string
  location?: string
  total: number
  deliveryFee: number
  status: string
  paymentStatus: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  prescription: { id: string; status: string; fileUrl: string; notes: string | null } | null
}

function StatusStepper({ currentStatus }: { currentStatus: string }) {
  const currentIdx = STATUS_STEPS.indexOf(currentStatus)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIdx
        const isCurrent = idx === currentIdx
        return (
          <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
            {idx > 0 && (
              <div style={{
                position: 'absolute', top: '14px', right: '50%', width: '100%',
                height: '3px', background: done ? '#2e7d32' : '#e0e0e0', zIndex: 0,
              }} />
            )}
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: done ? '#2e7d32' : isCurrent ? '#fff3e0' : '#f5f5f5',
              border: isCurrent && !done ? '2px solid #ff9800' : done ? '2px solid #2e7d32' : '2px solid #e0e0e0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: '700', color: done ? 'white' : isCurrent ? '#ff9800' : '#999',
              zIndex: 1, position: 'relative',
            }}>
              {done ? '✓' : idx + 1}
            </div>
            <span style={{
              fontSize: '0.6rem', textAlign: 'center', marginTop: '0.3rem',
              fontWeight: isCurrent ? '700' : '400',
              color: done ? '#2e7d32' : isCurrent ? '#ff9800' : '#999',
              maxWidth: '70px',
            }}>
              {step.replace(/_/g, ' ')}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!orderId.trim()) return

    setLoading(true)
    setError('')
    setOrder(null)
    setSearched(true)

    try {
      const res = await fetch(`/api/track-order?id=${encodeURIComponent(orderId.trim())}`)
      const data = await res.json()

      if (res.ok && data.order) {
        setOrder(data.order)
      } else {
        setError(data.error || 'Order not found')
      }
    } catch {
      setError('Failed to look up order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Track Your Order</h1>
      <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>
        Enter your order ID to see the current status.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          placeholder="Enter order ID (last 8 characters)"
          style={{ flex: 1, padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }}
        />
        <button
          type="submit"
          disabled={loading || !orderId.trim()}
          className="btn-primary"
          style={{ padding: '0.8rem 1.5rem', fontWeight: '700', opacity: loading || !orderId.trim() ? 0.7 : 1 }}
        >
          {loading ? 'SEARCHING...' : 'TRACK'}
        </button>
      </form>

      {error && (
        <div className="section-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p style={{ color: '#c62828', marginBottom: '1rem' }}>{error}</p>
          <p style={{ color: '#666', fontSize: '0.85rem' }}>
            Check your order confirmation email or receipt for the order ID.
          </p>
        </div>
      )}

      {loading && (
        <div className="section-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>Looking up your order...</p>
        </div>
      )}

      {order && !loading && (
        <div>
          <div className="section-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>Order #{order.id.slice(-8).toUpperCase()}</p>
                <p style={{ fontSize: '0.8rem', color: '#999' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', background: order.paymentStatus === 'PAID' ? '#e8f5e9' : '#fff3e0', color: order.paymentStatus === 'PAID' ? '#2e7d32' : '#e65100' }}>
                  {order.paymentStatus === 'PAID' ? '✅ Paid' : '⏳ ' + order.paymentStatus}
                </span>
                <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', background: order.status === 'DELIVERED' ? '#e8f5e9' : '#e3f2fd', color: order.status === 'DELIVERED' ? '#2e7d32' : '#1565c0' }}>
                  {order.status}
                </span>
              </div>
            </div>

            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem', color: '#2e7d32' }}>ORDER PROGRESS</h3>
            <StatusStepper currentStatus={order.status} />
          </div>

          <div className="section-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem', color: '#2e7d32' }}>ITEMS</h3>
            {order.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', paddingBottom: '0.75rem', borderBottom: '1px solid #eee' }}>
                <span>{item.name} x {item.quantity}</span>
                <span style={{ fontWeight: '600' }}>KSh {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.9rem' }}>
              <span>Delivery Fee</span>
              <span>KSh {order.deliveryFee.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #333' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Total</span>
              <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#2e7d32' }}>KSh {order.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="section-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem', color: '#2e7d32' }}>DELIVERY DETAILS</h3>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
              <p><strong>Name:</strong> {order.customerName}</p>
              <p><strong>Phone:</strong> {order.customerPhone}</p>
              <p><strong>City:</strong> {order.city}</p>
              <p><strong>Address:</strong> {order.address}</p>
              {order.location && <p><strong>Area:</strong> {order.location}</p>}
              <p><strong>Method:</strong> {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : order.paymentMethod}</p>
            </div>
          </div>

          {order.prescription && (
            <div className="section-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem', color: '#2e7d32' }}>PRESCRIPTION</h3>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                <p>
                  <strong>Status:</strong>{' '}
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', background: order.prescription.status === 'APPROVED' ? '#e8f5e9' : order.prescription.status === 'REJECTED' ? '#ffebee' : '#fff3e0', color: order.prescription.status === 'APPROVED' ? '#2e7d32' : order.prescription.status === 'REJECTED' ? '#c62828' : '#e65100' }}>
                    {order.prescription.status}
                  </span>
                </p>
                {order.prescription.notes && <p><strong>Notes:</strong> {order.prescription.notes}</p>}
              </div>
            </div>
          )}

          <Link href="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#2e7d32', fontWeight: '600', fontSize: '0.9rem' }}>
            ← Continue Shopping
          </Link>
        </div>
      )}

      {!order && !error && !loading && searched && (
        <div className="section-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>No order found with that ID.</p>
        </div>
      )}
    </div>
  )
}
