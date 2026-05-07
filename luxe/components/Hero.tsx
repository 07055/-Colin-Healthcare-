import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className="container" style={{ padding: '1rem 0', marginBottom: '2rem' }}>
            <div className={styles.hero}>
                <div className={styles.content}>
                    <span className={styles.badge}>
                        🏥 #1 Medical Supplies in Kenya
                    </span>
                    <h1 className={styles.title}>
                        Quality Healthcare Supplies Delivered.
                    </h1>
                    <p className={styles.description}>
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
                        }}>
                            SHOP SUPPLIES →
                        </Link>
                    </div>
                </div>
                <div className={styles.imageWrapper}>
                    <img
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800"
                        alt="Doctor"
                        className={styles.image}
                    />
                </div>
            </div>
        </section>
    );
}
