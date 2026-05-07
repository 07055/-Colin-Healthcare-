'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './SlidingHero.module.css'

const slides = [
  {
    id: 1,
    title: 'Quality Healthcare Products',
    subtitle: 'Premium BF Suma health supplements delivered to your door',
    badge: '🏥 #1 Health Supplies in Kenya',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=1200',
    cta: 'SHOP NOW',
    ctaLink: '/shop'
  },
  {
    id: 2,
    title: 'Natural Skincare Solutions',
    subtitle: 'Discover Suma Grand skincare for healthy, glowing skin',
    badge: '✨ New Arrivals',
    image: 'https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=1200',
    cta: 'EXPLORE',
    ctaLink: '/shop?category=Skincare'
  },
  {
    id: 3,
    title: 'Boost Your Immunity',
    subtitle: 'Powerful supplements to strengthen your immune system',
    badge: '💪 Immune Support',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21df4aae?auto=format&fit=crop&q=80&w=1200',
    cta: 'LEARN MORE',
    ctaLink: '/shop?category=Supplements'
  }
]

export default function SlidingHero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const current = slides[currentSlide]

  return (
    <section className={styles.hero}>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})` }}
        />
      ))}

      <div className="container" style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
        <div className={styles.content}>
          <span className={styles.badge}>{current.badge}</span>
          <h1 className={styles.title}>{current.title}</h1>
          <p className={styles.description}>{current.subtitle}</p>
          <Link href={current.ctaLink} className={styles.cta}>
            {current.cta} →
          </Link>
        </div>
      </div>

      <div className={styles.dots}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
