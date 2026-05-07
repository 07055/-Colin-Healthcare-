import Link from 'next/link';
import styles from './CategoryGrid.module.css';

const categories = [
    { name: 'Phones', icon: '📱', slug: 'phones' },
    { name: 'Electronics', icon: '💻', slug: 'electronics' },
    { name: 'Appliances', icon: '🔌', slug: 'appliances' },
    { name: 'Fashion', icon: '👕', slug: 'fashion' },
    { name: 'Beauty', icon: '💄', slug: 'beauty' },
    { name: 'Gaming', icon: '🎮', slug: 'gaming' },
    { name: 'Groceries', icon: '🍎', slug: 'groceries' },
    { name: 'Computing', icon: '🖥️', slug: 'computing' },
];

export default function CategoryGrid() {
    return (
        <div className={`section-card ${styles.grid}`}>
            {categories.map((cat) => (
                <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className={styles.item}>
                    <div className={styles.icon}>{cat.icon}</div>
                    <span className={styles.name}>{cat.name}</span>
                </Link>
            ))}
        </div>
    );
}
