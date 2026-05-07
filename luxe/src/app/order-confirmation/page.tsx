'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id') || searchParams.get('orderId');
    const trxref = searchParams.get('trxref');
    const reference = searchParams.get('reference');
    const [status, setStatus] = useState<'checking' | 'success' | 'failed' | null>(null);

    useEffect(() => {
        if (trxref || reference) {
            setStatus('success');
        }
    }, [trxref, reference]);

    return (
        <>
            {orderId && (
                <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>Order ID</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{orderId}</p>
                    {(trxref || reference) && (
                        <p style={{ fontSize: '0.8rem', color: '#4CAF50', marginTop: '0.5rem' }}>Payment confirmed ✓</p>
                    )}
                </div>
            )}

            <div style={{ background: '#e8f5e9', padding: '1rem', borderRadius: '4px', marginBottom: '2rem', textAlign: 'left' }}>
                <p style={{ fontWeight: '700', marginBottom: '0.5rem' }}>What happens next?</p>
                <ul style={{ fontSize: '0.85rem', color: '#555', paddingLeft: '1.5rem' }}>
                    <li>You will receive an SMS confirmation shortly</li>
                    <li>We will process your order within 24 hours</li>
                    <li>Track your order status in your account</li>
                </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link href="/shop" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                    Continue Shopping
                </Link>
                <Link href="/orders" className="btn-primary" style={{ padding: '0.75rem 2rem', background: '#333' }}>
                    View My Orders
                </Link>
                <a
                    href={`https://wa.me/254796388790?text=Hi! I just placed order ${orderId || ''} and need help.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ padding: '0.75rem 2rem', background: '#25D366' }}
                >
                    Chat on WhatsApp
                </a>
            </div>
        </>
    );
}

export default function OrderConfirmationPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: '600px' }}>
            <div className="section-card" style={{ padding: '3rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>Order Placed Successfully!</h1>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Thank you for shopping with SSM</p>

                <Suspense fallback={<div>Loading...</div>}>
                    <OrderConfirmationContent />
                </Suspense>
            </div>
        </div>
    );
}
