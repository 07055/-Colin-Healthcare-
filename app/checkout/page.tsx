'use client';

import { useCart } from '@/lib/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/actions';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PAYSTACK');

  if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
                <h1>Your cart is empty</h1>
                <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => router.push('/shop')}>
                    Start Shopping
                </button>
            </div>
        );
    }

    const deliveryFee = 200;
    const grandTotal = cartTotal + deliveryFee;

    const handlePayment = async (e: React.FormEvent<HTMLFormElement>, method: string) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const form = e.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            fullName: HTMLInputElement;
            phone: HTMLInputElement;
            email: HTMLInputElement;
            city: HTMLInputElement;
            address: HTMLTextAreaElement;
        };

        const fullName = formElements.fullName.value;
        const phone = formElements.phone.value;
        const email = formElements.email.value;
        const city = formElements.city.value;
        const address = formElements.address.value;

        if (!fullName || !phone || !city || !address) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('city', city);
            formData.append('address', address);
            formData.append('paymentMethod', method);
            formData.append('total', String(grandTotal));
            formData.append('items', JSON.stringify(cart));

            const orderResult = await createOrder(formData);

            if (orderResult.success) {
                clearCart();
                router.push(`/order-confirmation?id=${orderResult.orderId}`);
            } else {
                setError(orderResult.error || 'Order creation failed');
            }
        } catch (err) {
            setError('Order failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

        const fullName = formElements.fullName.value;
        const phone = formElements.phone.value;
        const email = formElements.email.value;
        const city = formElements.city.value;
        const address = formElements.address.value;

        if (!fullName || !phone || !city || !address) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('city', city);
            formData.append('address', address);
            formData.append('paymentMethod', 'PAYSTACK');
            formData.append('total', String(grandTotal));
            formData.append('items', JSON.stringify(cart));

            const result = await createOrder(formData);

            if (result.success) {
                const payResponse = await fetch('/api/paystack/initialize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email || 'customer@example.com',
                        amount: grandTotal,
                        metadata: { orderId: result.orderId }
                    })
                });

                const payData = await payResponse.json();

                if (payData.authorization_url) {
                    clearCart();
                    window.location.href = payData.authorization_url;
                } else {
                    setError(payData.error || 'Payment initialization failed');
                }
            } else {
                setError(result.error || 'Order creation failed');
            }
        } catch (err) {
            setError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>Checkout</h1>

            {error && (
                <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="section-card" style={{ padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Delivery Information</h2>

                        <form onSubmit={handlePaystackPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Full Name *</label>
                                <input type="text" name="fullName" required style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Phone Number *</label>
                                <input type="tel" name="phone" required placeholder="0712 345 678" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Email Address</label>
                                <input type="email" name="email" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>City *</label>
                                    <input type="text" name="city" required style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Delivery Address *</label>
                                <textarea name="address" required rows={3} placeholder="Street address, building, apartment..." style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                            </div>

                            <div className="section-card" style={{ padding: '1.5rem', marginTop: '1rem', background: '#f8f9fa' }}>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Payment Method</h2>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                                    Secure payment powered by Paystack. Pay via M-Pesa, Visa, Mastercard, or bank transfer.
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ background: '#fff', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem' }}>📱 M-Pesa</span>
                                    <span style={{ background: '#fff', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem' }}>💳 Visa</span>
                                    <span style={{ background: '#fff', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem' }}>💳 Mastercard</span>
                                    <span style={{ background: '#fff', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.8rem' }}>🏦 Bank</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="btn-primary"
                                disabled={loading}
                                onClick={(e) => handlePayment(e as any, 'CASH_ON_DELIVERY')}
                                style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem' }}
                            >
                                {loading ? 'Processing...' : `CASH ON DELIVERY - KSh ${grandTotal.toLocaleString()}`}
                            </button>

                            <button
                                type="button"
                                className="btn-primary"
                                disabled={loading}
                                onClick={(e) => handlePayment(e as any, 'PAYSTACK')}
                                style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem', background: '#6772e5' }}
                            >
                                {loading ? 'Processing...' : `PAY WITH PAYSTACK - KSh ${grandTotal.toLocaleString()}`}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="section-card" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>ORDER SUMMARY</h2>

                    {cart.map((item) => (
                        <div key={item.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                            <div style={{ width: '60px', height: '60px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: '500' }}>{item.name}</p>
                                <p style={{ fontSize: '0.75rem', color: '#666' }}>Qty: {item.quantity}</p>
                            </div>
                            <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>KSh {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                    ))}

                    <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Subtotal</span>
                            <span>KSh {cartTotal.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Delivery Fee</span>
                            <span>KSh {deliveryFee.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #333' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Total</span>
                            <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#f68b1e' }}>KSh {grandTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
