import Link from 'next/link';
import { cookies } from 'next/headers';
import { getPrisma } from '@/lib/prisma';
import styles from './Header.module.css';
import CartCount from './CartCount';

export default async function Header() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value

  let userName: string | null = null
  if (userId) {
    const prisma = getPrisma()
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } })
    userName = user?.name || null
  }

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <span>🇰🇪 Kenya</span>
          <div className={styles.topBarLinks}>
            <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
            <a href="/story">Help</a>
          </div>
        </div>
      </div>

      <div className={styles.mainNav}>
        <div className={styles.logo}>
          <Link href="/" style={{ textDecoration: 'none', color: '#fff', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            CH
          </Link>
        </div>

        <form action="/shop" className={styles.searchForm}>
          <input
            type="text"
            name="q"
            placeholder="Search medicines & health products..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn} aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        <div className={styles.actions}>
          {userId ? (
            <Link href="/profile" className={styles.actionItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className={styles.actionLabel}>Hi, {userName?.split(' ')[0] || 'Profile'}</span>
            </Link>
          ) : (
            <Link href="/login" className={styles.actionItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className={styles.actionLabel}>Account</span>
            </Link>
          )}

          <Link href="/prescriptions/upload" className={styles.actionItem} style={{ textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span className={styles.actionLabel}>Rx Upload</span>
          </Link>

          <Link href="/cart" className={styles.actionItem}>
            <div style={{ position: 'relative' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <CartCount />
            </div>
            <span className={styles.actionLabel}>Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
