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
    images: string | string[];
    prescriptionRequired?: boolean;
}

function getFirstImage(images: string | string[]): string {
    if (Array.isArray(images)) {
        return images[0] || '/placeholder.jpg';
    }
    if (typeof images === 'string' && images) {
        return images;
    }
    return '/placeholder.jpg';
}

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const firstImage = getFirstImage(product.images || '');

    return (
        <div className={styles.card}>
            <Link href={`/products/${product.slug}`} className={styles.imageContainer}>
                <img
                    src={firstImage}
                    alt={product.name}
                    className={styles.image}
                />
                {product.prescriptionRequired && <div className={styles.rxBadge}>Rx</div>}
            </Link>

            <div className={styles.details}>
                <div className={styles.name}>{product.name}</div>
                <div className={styles.priceContainer}>
                    <span className={styles.priceNew}>KSh {product.price.toLocaleString()}</span>
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
