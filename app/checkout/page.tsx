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
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  function getFirstImage(images: any): string {
    if (typeof images === 'string') return images || '/placeholder.jpg';
    if (Array.isArray(images) && images.length > 0) return images[0];
    return '/placeholder.jpg';
  }

  function getLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLocationLoading(false);
      },
      () => {
        setError('Unable to get location. Please enter manually.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, method: string) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
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

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('phone', phone);
      formData.append('email', email || '');
      formData.append('city', city);
      formData.append('address', address);
      formData.append('location', location || '');
      if (lat && lng) {
        formData.append('lat', String(lat));
        formData.append('lng', String(lng));
      }
      formData.append('paymentMethod', method);
      formData.append('total', String(grandTotal));
      formData.append('items', JSON.stringify(cart));

      const orderResult = await createOrder(formData);

      if (orderResult.success) {
        if (method === 'CASH_ON_DELIVERY') {
          clearCart();
          router.push(`/order-confirmation?id=${orderResult.orderId}`);
        } else {
          const payResponse = await fetch('/api/paystack/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              email: email || 'customer@example.com',
              amount: grandTotal * 100,
              metadata: { orderId: orderResult.orderId }
            })
          });
          const payData = await payResponse.json();
          if (payData.authorization_url) {
            clearCart();
            window.location.href = payData.authorization_url;
          } else {
            setError(payData.error || 'Payment initialization failed');
          }
        }
      } else {
        setError(orderResult.error || 'Order creation failed');
      }
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

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

            <form onSubmit={(e) => handleSubmit(e, 'CASH_ON_DELIVERY')} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>City *</label>
                  <input type="text" name="city" required placeholder="e.g. Nairobi" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Area / Building</label>
                  <input type="text" name="location" placeholder="e.g. Westlands, Section 5" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Street Address *</label>
                <textarea name="address" required rows={3} placeholder="Building name, street, landmark..." style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>

              <div className="section-card" style={{ padding: '1rem', background: '#f8f9fa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Pin Location on Map</span>
                  <button type="button" onClick={getLocation} disabled={locationLoading} style={{ background: locationLoading ? '#ccc' : '#28a745', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>
                    {locationLoading ? 'Getting...' : 'Get My Location'}
                  </button>
                </div>
                {lat && lng ? (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
                      Location saved: {lat.toFixed(6)}, {lng.toFixed(6)}
                    </div>
                    <iframe
                      title="location"
                      width="100%"
                      height="180"
                      style={{ border: 0, borderRadius: '6px' }}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`}
                    />
                    <button type="button" onClick={() => { setLat(null); setLng(null); }} style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#c62828', fontSize: '0.75rem', cursor: 'pointer' }}>
                      Clear location
                    </button>
                  </div>
                ) : (
                  <div style={{ height: '100px', background: '#eee', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#999' }}>
                    Click "Get My Location" to pin your delivery spot on the map
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Processing...' : `ORDER WITH CASH ON DELIVERY - KSh ${grandTotal.toLocaleString()}`}
              </button>
            </form>

            <form onSubmit={(e) => handleSubmit(e, 'PAYSTACK')} style={{ marginTop: '0.5rem' }}>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', fontWeight: '700', background: '#282828', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Processing...' : `PAY WITH PAYSTACK - KSh ${grandTotal.toLocaleString()}`}
              </button>
            </form>
          </div>
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
              <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#007bff' }}>KSh {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}