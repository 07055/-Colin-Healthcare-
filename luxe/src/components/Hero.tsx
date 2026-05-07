import Link from 'next/link';

export default function Hero() {
    return (
        <section className="container" style={{ padding: '2rem 0' }}>
            <div style={{ 
                borderRadius: '16px', 
                overflow: 'hidden', 
                position: 'relative', 
                height: '400px',
                background: 'linear-gradient(90deg, #0056b3 0%, #007bff 100%)'
            }}>
                <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0, 
                    bottom: 0, 
                    width: '60%', 
                    opacity: 0.9 
                }}>
                    <img 
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=2000" 
                        alt="Doctor" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                </div>
                
                <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    bottom: 0, 
                    width: '45%', 
                    padding: '4rem 3rem', 
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <span style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '50px', 
                        width: 'fit-content',
                        marginBottom: '1rem',
                        backdropFilter: 'blur(4px)'
                    }}>
                        🏥 #1 Medical Supplies in Kenya
                    </span>
                    <h1 style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '1rem' }}>
                        Quality Healthcare <br/> Supplies Delivered.
                    </h1>
                    <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
                        From syringes to stethoscopes, get professional-grade medical equipment delivered to your doorstep.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link href="/shop" className="btn-primary" style={{ 
                            background: 'white', 
                            color: 'var(--medical-blue)', 
                            fontWeight: '700',
                            padding: '1rem 2rem',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>
                            SHOP SUPPLIES →
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
