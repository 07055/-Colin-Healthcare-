import Link from 'next/link';

export default function Hero() {
    return (
        <section className="container" style={{ padding: '1rem 0', marginBottom: '2rem' }}>
            <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #0056b3 0%, #007bff 100%)',
                padding: '3rem 2rem',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                '@media (min-width: 768px)': {
                    flexDirection: 'row',
                    padding: '4rem 3rem',
                    alignItems: 'center'
                }
            }}>
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <span style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '0.5rem 1rem',
                        borderRadius: '50px',
                        width: 'fit-content',
                        backdropFilter: 'blur(4px)',
                        fontSize: '0.9rem'
                    }}>
                        🏥 #1 Medical Supplies in Kenya
                    </span>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1.2, margin: 0, '@media (min-width: 768px)': { fontSize: '2.8rem' } }}>
                        Quality Healthcare Supplies Delivered.
                    </h1>
                    <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0 }}>
                        From syringes to stethoscopes, get professional-grade medical equipment delivered to your doorstep.
                    </p>
                    <div>
                        <Link href="/shop" className="btn-primary" style={{
                            background: 'white',
                            color: 'var(--medical-blue)',
                            fontWeight: '700',
                            padding: '0.8rem 1.5rem',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            borderRadius: '8px',
                            '@media (min-width: 768px)': { padding: '1rem 2rem' }
                        }}>
                            SHOP SUPPLIES →
                        </Link>
                    </div>
                </div>
                <div style={{ flex: '1', display: 'flex', justifyContent: 'center', marginTop: '1rem', '@media (min-width: 768px)': { marginTop: 0 } }}>
                    <img
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800"
                        alt="Doctor"
                        style={{ width: '100%', maxWidth: '400px', height: 'auto', borderRadius: '12px' }}
                    />
                </div>
            </div>
        </section>
    );
}
