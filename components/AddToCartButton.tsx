'use client';

import { useCart } from '@/lib/CartContext';

export default function AddToCartButton({ product }: { product: any }) {
    const { addToCart } = useCart();

    return (
        <button
            onClick={() => addToCart(product)}
            className="btn-primary"
            style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
        >
            🛒 ADD TO CART
        </button>
    );
}
