'use client';

import { useCart } from '@/lib/CartContext';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/actions';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [prescriptionNotes, setPrescriptionNotes] = useState('');

  const hasPrescriptionItems = cart.some(item => item.prescriptionRequired === true);
  const prescriptionItems = cart.filter(item => item.prescriptionRequired === true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const trxref = params.get('trxref')
    const reference = params.get('reference')
    if (trxref || reference) {
      setSuccess(`Payment successful! Reference: ${trxref || reference}. Your order is being processed.`)
    }
  }, [])

  function getFirstImage(images: any): string {
    if (typeof images === 'string') return images || '/placeholder.jpg';
    if (Array.isArray(images) && images.length > 0) return images[0];
    return '/placeholder.jpg';
  }

  if (cart.length === 0 && !success) {
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

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>, method: string) {
    const form = (e.currentTarget as HTMLButtonElement).form!
    setLoading(true);
    setError('');

    const fullName = (form.elements.namedItem('fullName') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const city = (form.elements.namedItem('city') as HTMLInputElement).value;
    const address = (form.elements.namedItem('address') as HTMLTextAreaElement).value;
    const location = (form.elements.namedItem('location') as HTMLInputElement).value;

    if (!fullName || !phone || !city || !address) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phone', phone);
    formData.append('email', email || '');
    formData.append('city', city);
    formData.append('address', address);
    formData.append('location', location || '');
    formData.append('paymentMethod', method);
    formData.append('total', String(grandTotal));
    formData.append('items', JSON.stringify(cart));

    const fileInput = document.getElementById('prescription-file') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (hasPrescriptionItems) {
      if (file) formData.append('prescription', file);
      formData.append('prescriptionNotes', prescriptionNotes || '');
    }

    const orderResult = await createOrder(formData);

    if (orderResult.success) {
      if (hasPrescriptionItems && file) {
        try {
          const presFormData = new FormData();
          presFormData.append('file', file);
          presFormData.append('orderId', orderResult.orderId!);
          presFormData.append('notes', prescriptionNotes || '');
          await fetch('/api/prescriptions/upload', { method: 'POST', body: presFormData });
        } catch (err: any) {
          console.error('Prescription upload failed:', err);
        }
      }

      clearCart();
      if (method === 'PAYSTACK') {
        try {
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 15000)

          const payResponse = await fetch('/api/paystack/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              email: email || 'customer@example.com',
              amount: grandTotal,
              metadata: { orderId: orderResult.orderId }
            })
          })

          clearTimeout(timeout)

          const payData = await payResponse.json();
          if (payData.authorization_url) {
            window.location.href = payData.authorization_url;
          } else {
            setError(payData.error || 'Payment initialization failed. Please try again.');
            setLoading(false);
          }
        } catch (err: any) {
          if (err.name === 'AbortError') {
            setError('Payment timed out. Please try again.');
          } else {
            setError('Payment failed. Please try again.');
          }
          setLoading(false);
        }
      } else {
        router.push(`/order-confirmation?id=${orderResult.orderId}`);
      }
    } else {
      setError(orderResult.error || 'Order creation failed');
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>Payment Successful!</h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>{success}</p>
        <p style={{ color: '#666', marginBottom: '2rem' }}>You will receive a confirmation call shortly.</p>
        <button className="btn-primary" onClick={() => router.push('/shop')}>Continue Shopping</button>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem' }}>Checkout</h1>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="checkout-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="section-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Delivery Information</h2>

            <form id="checkout-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Full Name *</label>
                <input type="text" name="fullName" required placeholder="Your full name" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Phone *</label>
                  <input type="tel" name="phone" required placeholder="0712 345 678" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Email</label>
                  <input type="email" name="email" placeholder="your@email.com" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>City *</label>
                <input type="text" name="city" required placeholder="e.g. Nairobi" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Area / Building</label>
                <input type="text" name="location" placeholder="e.g. Westlands, Kilimani, Ridgeways" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Street Address *</label>
                <textarea name="address" required rows={3} placeholder="Building name, house number, street, landmark..." style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>

              <button type="button" onClick={(e) => handleSubmit(e, 'CASH_ON_DELIVERY')} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Processing...' : `ORDER - CASH ON DELIVERY KSh ${grandTotal.toLocaleString()}`}
              </button>

            </form>
          </div>

          {hasPrescriptionItems && (
            <div className="section-card" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Prescription Upload</h2>

              <div style={{ background: '#fff3e0', border: '1px solid #ffb74d', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#e65100' }}>
                <strong>⚠️ Some items in your order require a prescription</strong>
                <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', fontSize: '0.8rem' }}>
                  {prescriptionItems.map(item => (
                    <li key={item.id}>{item.name} × {item.quantity}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Upload Prescription *</label>
                <input
                  id="prescription-file"
                  type="file"
                  accept="image/*,application/pdf"
                  style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Additional Notes</label>
                <textarea
                  value={prescriptionNotes}
                  onChange={(e) => setPrescriptionNotes(e.target.value)}
                  rows={3}
                  placeholder="Any additional information for the pharmacist..."
                  style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="section-card" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>ORDER SUMMARY</h2>
          {cart.map((item) => (
            <div key={item.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
              <div style={{ width: '60px', height: '60px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={getFirstImage(item.images)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: '500' }}>{item.name}</p>
                <p style={{ fontSize: '0.75rem', color: '#666' }}>Qty: {item.quantity}</p>
                {item.prescriptionRequired === true && (
                  <span style={{ display: 'inline-block', marginTop: '0.25rem', background: '#e53935', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '600' }}>📋 Prescription Required</span>
                )}
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>KSh {(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span>Subtotal</span><span>KSh {cartTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span>Delivery</span><span>KSh {deliveryFee}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #333' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Total</span>
              <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#2e7d32' }}>KSh {grandTotal.toLocaleString()}</span>
            </div>
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fff8e1', borderRadius: '6px', fontSize: '0.8rem', color: '#333', textAlign: 'center' }}>
              <strong>📱 Pay via M-Pesa</strong><br />
              Paybill: <strong>303030</strong> &nbsp;|&nbsp; Account: <strong>2052132897</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
