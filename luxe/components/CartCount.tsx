'use client';

import { useCart } from '@/lib/CartContext';

export default function CartCount() {
    const { cartCount } = useCart();

    if (cartCount === 0) return null;

    return (
        <span style={{
            background: 'var(--jumia-orange)',
            color: 'white',
            fontSize: '0.65rem',
            padding: '0.1rem 0.4rem',
            borderRadius: '10px',
            marginLeft: '4px'
        }}>
            {cartCount}
        </span>
    );
}
