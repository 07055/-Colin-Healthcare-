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
            <a href="https://wa.me/254796388790" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
            <a href="/story">Help</a>
          </div>
        </div>
      </div>

      <div className={styles.mainNav}>
        <div className={styles.logo}>
          <Link href="/">
            <img src="/logo.svg" alt="Sam's Suma Mart" style={{ height: '36px' }} />
          </Link>
        </div>

        <form action="/shop" className={styles.searchForm}>
          <input
            type="text"
            name="q"
            placeholder="Search medical products..."
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
