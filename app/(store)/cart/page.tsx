'use client';

import { useCart } from '@/lib/CartContext';
import Link from 'next/link';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
                <div className="section-card" style={{ padding: '4rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your cart is empty!</h1>
                    <p style={{ color: 'var(--secondary-text)', marginBottom: '2rem' }}>Already have an account? Login to see your items.</p>
                    <Link href="/shop" className="btn-primary">START SHOPPING</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '1rem' }}>
            <div className="cart-layout">
                {/* Items List */}
                <div className="section-card" style={{ padding: '0' }}>
                    <h2 style={{ fontSize: '1.2rem', padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                        Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                    </h2>
                    {cart.map((item) => (
                        <div key={item.id} style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '1rem',
                            borderBottom: '1px solid var(--border-light)'
                        }}>
                            <div className="cart-item-image" style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
                                <img
                                    src={item.images?.[0] || '/placeholder.jpg'}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '0.25rem', flexWrap: 'wrap' }}>
                                    <h3 style={{ fontSize: '0.9rem', fontWeight: '400', wordBreak: 'break-word' }}>{item.name}</h3>
                                    <p style={{ fontSize: '1.1rem', fontWeight: '700', whiteSpace: 'nowrap' }}>KSh {(item.price * item.quantity).toLocaleString()}</p>
                                </div>

                                <p style={{ fontSize: '0.75rem', color: 'var(--jumia-orange)', marginBottom: '1rem' }}>Only 5 units left</p>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{ background: 'none', border: 'none', color: 'var(--jumia-orange)', fontSize: '0.8rem', fontWeight: '700' }}
                                    >
                                        🗑 REMOVE
                                    </button>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            style={{ background: 'var(--jumia-orange)', color: 'white', border: 'none', width: '24px', height: '24px', borderRadius: '4px' }}
                                        >
                                            -
                                        </button>
                                        <span style={{ fontWeight: '700' }}>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            style={{ background: 'var(--jumia-orange)', color: 'white', border: 'none', width: '24px', height: '24px', borderRadius: '4px' }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="section-card">
                        <h2 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>CART SUMMARY</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span>Subtotal</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>KSh {cartTotal.toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--secondary-text)', marginBottom: '1.5rem' }}>Delivery fees not included yet.</p>
                        <Link href="/checkout" className="btn-primary" style={{ width: '100%', padding: '1rem', display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                            CHECKOUT (KSh {cartTotal.toLocaleString()})
                        </Link>
                    </div>

                    <div className="section-card" style={{ fontSize: '0.8rem' }}>
                        <p style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Returns are easy</p>
                        <p style={{ color: 'var(--secondary-text)' }}>Free return within 15 days for Official Store items.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
