import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOrders } from '@/lib/actions'

const STATUS_STEPS = ['PENDING', 'PRESCRIPTION_REVIEW', 'PROCESSING', 'SHIPPED', 'DELIVERED']

function StatusStepper({ currentStatus }: { currentStatus: string }) {
  const currentIdx = STATUS_STEPS.indexOf(currentStatus)
  if (currentIdx < 0) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', marginBottom: '1.5rem' }}>
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

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  PRESCRIPTION_REVIEW: 'Prescription Review',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

const PAYMENT_LABELS: Record<string, string> = {
  CASH_ON_DELIVERY: '💵 Cash on Delivery',
  PAYSTACK: '💳 Paystack',
  MPESA: '📱 M-Pesa',
}

export default async function OrderConfirmationPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams

  if (!id) notFound()

  const orders = await getOrders()
  const order = orders.find((o: any) => o.id === id)

  if (!order) notFound()

  const needsRx = order.status === 'PRESCRIPTION_REVIEW'

  return (
    <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>Order Placed Successfully!</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Order ID: <strong>{order.id.slice(-8).toUpperCase()}</strong>
      </p>
      <p style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>
        Total: KSh {order.total.toLocaleString()}
      </p>
      <p style={{ marginBottom: '0.5rem' }}>
        <span style={{ padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', background: order.paymentMethod === 'CASH_ON_DELIVERY' ? '#fff3e0' : order.paymentMethod === 'MPESA' ? '#e8f5e9' : '#e3f2fd', color: order.paymentMethod === 'CASH_ON_DELIVERY' ? '#e65100' : order.paymentMethod === 'MPESA' ? '#2e7d32' : '#1565c0' }}>
          {PAYMENT_LABELS[order.paymentMethod] || '💳 ' + order.paymentMethod}
        </span>
        <span style={{ marginLeft: '0.5rem', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', background: order.paymentStatus === 'PAID' ? '#e8f5e9' : '#fff3e0', color: order.paymentStatus === 'PAID' ? '#2e7d32' : '#e65100' }}>
          {order.paymentStatus === 'PAID' ? '✅ Paid' : '⏳ Payment Pending'}
        </span>
      </p>

      <div className="section-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem', color: '#2e7d32' }}>ORDER STATUS</h3>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.75rem' }}>
          Current: <strong>{STATUS_LABELS[order.status] || order.status}</strong>
        </p>
        <StatusStepper currentStatus={order.status} />
      </div>

      {needsRx && (
        <div style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: '#fff3e0', borderRadius: '8px', fontSize: '0.9rem', color: '#e65100', marginBottom: '1.5rem' }}>
          <strong>⚕️ Prescription Review Required</strong><br />
          <span style={{ fontSize: '0.8rem' }}>Your order contains prescription items. We will review your prescription shortly.</span>
        </div>
      )}

      {order.paymentMethod === 'MPESA' && (
        <div style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: '#fff8e1', borderRadius: '8px', fontSize: '0.9rem', color: '#333', marginBottom: '1.5rem' }}>
          <strong>📱 Pay via M-Pesa</strong><br />
          Paybill: <strong>303030</strong> &nbsp;|&nbsp; Account: <strong>2052132897</strong>
        </div>
      )}

      <p style={{ color: '#666', marginBottom: '2rem' }}>
        You will receive a confirmation call shortly. Delivery within 24-48 hours.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href={`/track-order?id=${order.id.slice(-8)}`} className="btn-primary" style={{ padding: '0.8rem 2rem', textDecoration: 'none', display: 'inline-block' }}>
          📍 Track Order
        </Link>
        <Link href="/shop" className="btn-primary" style={{ padding: '0.8rem 2rem', textDecoration: 'none', display: 'inline-block', background: '#555' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
