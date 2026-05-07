import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function OrdersPage() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('session_token')?.value

    if (!userId) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1>Please <Link href="/login" style={{ color: '#f68b1e' }}>login</Link> to view your orders</h1>
            </div>
        )
    }

    const orders = await prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
    }) as any[]

    const statusColors: Record<string, string> = {
        PENDING: '#f68b1e',
        PROCESSING: '#2196F3',
        SHIPPED: '#9C27B0',
        DELIVERED: '#4CAF50',
        CANCELLED: '#f44336',
    }

    const paymentStatusColors: Record<string, string> = {
        UNPAID: '#f68b1e',
        PENDING: '#2196F3',
        PAID: '#4CAF50',
        FAILED: '#f44336',
    }

    const paymentLabels: Record<string, string> = {
        MPESA_PAYBILL: 'M-Pesa',
        ABSA: 'Absa',
        CASH_ON_DELIVERY: 'Cash on Delivery',
    }

    if (orders.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <div className="section-card" style={{ padding: '3rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Orders Yet</h1>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>Start shopping to see your orders here</p>
                    <Link href="/shop" className="btn-primary">Start Shopping</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>My Orders</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map((order: any) => (
                    <div key={order.id} className="section-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: '#666' }}>Order #{order.id.slice(-8).toUpperCase()}</p>
                                <p style={{ fontSize: '0.8rem', color: '#999' }}>
                                    {new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    background: `${statusColors[order.status]}20`,
                                    color: statusColors[order.status],
                                }}>
                                    {order.status}
                                </span>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    background: `${paymentStatusColors[order.paymentStatus]}20`,
                                    color: paymentStatusColors[order.paymentStatus],
                                }}>
                                    {paymentLabels[order.paymentMethod] || order.paymentMethod}
                                </span>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            {order.items.slice(0, 3).map((item: any) => (
                                <div key={item.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <div style={{ width: '50px', height: '50px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={item.product.images?.split(',')[0] || '/placeholder.jpg'} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.85rem', fontWeight: '500' }}>{item.product.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#666' }}>Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                            {order.items.length > 3 && (
                                <p style={{ fontSize: '0.8rem', color: '#666' }}>+{order.items.length - 3} more items</p>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>KSh {order.total.toLocaleString()}</span>
                            {order.phone && <span style={{ fontSize: '0.8rem', color: '#666' }}>📱 {order.phone}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
