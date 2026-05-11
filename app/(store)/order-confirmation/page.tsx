import { notFound } from 'next/navigation'
import { getOrders } from '@/lib/actions'

export default async function OrderConfirmationPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams

  if (!id) notFound()

  const orders = await getOrders()
  const order = orders.find((o: any) => o.id === id)

  if (!order) notFound()

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
        <span style={{ padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', background: order.paymentMethod === 'CASH_ON_DELIVERY' ? '#fff3e0' : '#e3f2fd', color: order.paymentMethod === 'CASH_ON_DELIVERY' ? '#e65100' : '#1565c0' }}>
          {order.paymentMethod === 'CASH_ON_DELIVERY' ? '💵 Cash on Delivery' : '💳 Paystack'}
        </span>
        <span style={{ marginLeft: '0.5rem', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', background: order.paymentStatus === 'PAID' ? '#e8f5e9' : '#fff3e0', color: order.paymentStatus === 'PAID' ? '#2e7d32' : '#e65100' }}>
          {order.paymentStatus === 'PAID' ? '✅ Paid' : '⏳ Payment Pending'}
        </span>
      </p>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        You will receive a confirmation call shortly. Delivery within 24-48 hours.
      </p>
      <a href="/shop" className="btn-primary" style={{ padding: '0.8rem 2rem', textDecoration: 'none', display: 'inline-block' }}>
        Continue Shopping
      </a>
    </div>
  )
}
