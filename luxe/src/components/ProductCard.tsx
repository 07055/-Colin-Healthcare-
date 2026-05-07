'use client';

import Link from 'next/link';
import styles from './ProductCard.module.css';
import { useCart } from '@/lib/CartContext';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    category: string;
    images: string;
}

function getFirstImage(images: string): string {
    try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0];
        }
    } catch {
        // If not JSON, treat as single image URL
    }
    return images || '/placeholder.jpg';
}

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const oldPrice = product.price * 1.25; // Mock discount
    const firstImage = getFirstImage(product.images);

    return (
        <div className={styles.card}>
            <Link href={`/products/${product.slug}`} className={styles.imageContainer}>
                <img
                    src={firstImage}
                    alt={product.name}
                    className={styles.image}
                />
                <div className={styles.discountBadge}>-25%</div>
            </Link>

            <div className={styles.details}>
                <div className={styles.name}>{product.name}</div>
                <div className={styles.priceContainer}>
                    <span className={styles.priceNew}>KSh {product.price.toLocaleString()}</span>
                    <span className={styles.priceOld}>KSh {oldPrice.toLocaleString()}</span>
                </div>
                <div className={styles.rating}>
                    ★★★★★ <span style={{ fontSize: '0.7rem', color: '#757575' }}>(12)</span>
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                }}
                className={styles.atcBtn}
            >
                ADD TO CART
            </button>
        </div>
    );
}
