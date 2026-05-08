'use client'

import { useCart } from '@/lib/CartContext'
import { useState } from 'react'
import Link from 'next/link'
import styles from './ProductCard.module.css'

interface ProductDetailProps {
  product: any
  relatedProducts: any[]
}

export default function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <Link href="/shop" style={{ color: '#f68b1e', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Shop
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '1rem' }}>
        {/* Product Image */}
        <div style={{ background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden' }}>
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </div>

        {/* Product Details */}
        <div>
          <span style={{ fontSize: '0.8rem', color: '#f68b1e', fontWeight: '600' }}>{product.category}</span>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0.5rem 0' }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f68b1e' }}>KSh {product.price.toLocaleString()}</span>
            <span style={{ fontSize: '1.2rem', color: '#999', textDecoration: 'line-through' }}>KSh {(product.price * 1.25).toLocaleString()}</span>
            <span style={{ background: '#4caf50', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>-25%</span>
          </div>

          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '2rem' }}>{product.description}</p>

          {product.ingredients && (
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>Ingredients</h3>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>{product.ingredients}</p>
            </div>
          )}

          {product.benefits && (
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>Benefits</h3>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>{product.benefits}</p>
            </div>
          )}

          {product.usage && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>How to Use</h3>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>{product.usage}</p>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700' }}
          >
            {added ? '✓ ADDED TO CART' : 'ADD TO CART'}
          </button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem' }}>Related Products</h2>
          <div className={styles.grid}>
            {relatedProducts.map((prod: any) => (
              <Link key={prod.id} href={`/products/${prod.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.card}>
                  <div className={styles.imageContainer}>
                    <img src={prod.images?.[0] || '/placeholder.jpg'} alt={prod.name} className={styles.image} />
                  </div>
                  <div className={styles.details}>
                    <div className={styles.name}>{prod.name}</div>
                    <div className={styles.priceContainer}>
                      <span className={styles.priceNew}>KSh {prod.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
