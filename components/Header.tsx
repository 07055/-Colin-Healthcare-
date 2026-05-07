import Link from 'next/link';
import styles from './Header.module.css';
import CartCount from './CartCount';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>📞 Call us: <strong>+254 796 388 790</strong> | Medical Supplies for Clinics & Homes</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Quality Guarantee</span>
            <a href="https://wa.me/254796388790" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: '600' }}>💬 WhatsApp</a>
          </div>
        </div>
      </div>

      <div className={`container ${styles.mainNav}`}>
        <div className={styles.logo}>
          <Link href="/">
            <img src="/logo.svg" alt="Sam's Suma Mart" style={{ height: '40px' }} />
          </Link>
        </div>

        <form action="/shop" className={styles.searchForm}>
          <input
            type="text"
            name="q"
            placeholder="Search products, brands and categories"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn}>SEARCH</button>
        </form>

        <div className={styles.actions}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/login" className={styles.actionItem}>
              <span>Sign In</span>
            </Link>
            <Link href="/register" className={styles.actionItem} style={{ color: 'var(--jumia-orange)' }}>
              <span>Register</span>
            </Link>
          </div>

          <Link href="/cart" className={styles.actionItem}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>Cart</span>
              <CartCount />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
