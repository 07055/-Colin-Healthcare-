import Link from 'next/link';
import { cookies } from 'next/headers';
import { getPrisma } from '@/lib/prisma';
import styles from './Header.module.css';
import CartCount from './CartCount';

export default async function Header() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  const userRole = cookieStore.get('userRole')?.value

  let userName: string | null = null
  if (userId) {
    const prisma = getPrisma()
    const user = await prisma.user.findUnique({ where: { id: userId } })
    userName = user?.name || null
  }

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
          {userId ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link href="/profile" style={{ fontSize: '0.9rem', color: '#007bff', fontWeight: '600' }}>
                👤 {userName || 'Profile'}
              </Link>
              {userRole === 'ADMIN' && (
                <Link href="/admin" style={{ fontSize: '0.9rem', color: '#28a745', fontWeight: '600' }}>
                  🏥 Admin
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="/login" className={styles.actionItem}>Sign In</a>
              <a href="/register" className={styles.actionItem} style={{ background: '#007bff', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>Register</a>
            </div>
          )}

          <Link href="/cart" className={styles.actionItem}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span>Cart</span>
              <CartCount />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
