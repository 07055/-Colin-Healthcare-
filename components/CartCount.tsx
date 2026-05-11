'use client';

import { useCart } from '@/lib/CartContext';

export default function CartCount() {
    const { cartCount } = useCart();

    if (cartCount === 0) return null;

    return (
        <span style={{
            position: 'absolute',
            top: '-6px',
            right: '-8px',
            background: '#2e7d32',
            color: 'white',
            fontSize: '0.6rem',
            fontWeight: '700',
            padding: '0.1rem 0.35rem',
            borderRadius: '10px',
            lineHeight: 1.2,
            minWidth: '16px',
            textAlign: 'center',
        }}>
            {cartCount > 99 ? '99+' : cartCount}
        </span>
    );
}
