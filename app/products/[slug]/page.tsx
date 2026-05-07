import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import { getProductBySlug } from '@/lib/products';

export default function ProductPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    const product = getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const oldPrice = product.price * 1.25;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 300px',
                gap: '1rem',
                alignItems: 'start'
            }}>
                {/* Main Product Info */}
                <div className="section-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
                        <img
                            src={product.images[0] || '/placeholder.jpg'}
                            alt={product.name}
                            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                        />
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--link)', marginBottom: '0.5rem' }}>Brand: Generic</h4>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '400', marginBottom: '1rem' }}>{product.name}</h1>
                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontSize: '1.8rem', fontWeight: '700' }}>KSh {product.price.toLocaleString()}</span>
                                <span style={{ textDecoration: 'line-through', color: 'var(--secondary-text)' }}>KSh {oldPrice.toLocaleString()}</span>
                                <span className="badge-orange">-25%</span>
                            </div>
                            <p style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: '0.5rem' }}>In Stock</p>
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <AddToCartButton product={JSON.parse(JSON.stringify(product))} />
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="section-card">
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem' }}>DELIVERY & RETURNS</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span>📍</span>
                            <div style={{ fontSize: '0.8rem' }}>
                                <p style={{ fontWeight: '700' }}>Delivery Information</p>
                                <p>Shipped from overseas. Normally delivered between 9-15 business days.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span>🔄</span>
                            <div style={{ fontSize: '0.8rem' }}>
                                <p style={{ fontWeight: '700' }}>Return Policy</p>
                                <p>Free return within 15 days for Official Store items and 7 days for other items.</p>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

            {/* Description Section */}
            <div className="section-card" style={{ marginTop: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1rem' }}>Product Details</h2>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {product.description}
                </div>
            </div>
        </div>
    );
}
