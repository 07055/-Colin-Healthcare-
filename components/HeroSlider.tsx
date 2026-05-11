'use client'

import { useState, useEffect } from 'react'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=500&fit=crop&fm=jpg',
    emoji: '🩺',
    title: 'Doctor-Recommended Skincare',
    subtitle: 'Professional medical-grade products for healthy, radiant skin',
    cta: 'SHOP SKINCARE',
    href: '/shop?q=skincare',
  },
  {
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop&fm=jpg',
    emoji: '🦵',
    title: 'Knee & Joint Pain Relief',
    subtitle: 'Effective solutions for arthritis, inflammation & daily discomfort',
    cta: 'SHOP PAIN RELIEF',
    href: '/shop?q=joint',
  },
  {
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&h=500&fit=crop&fm=jpg',
    emoji: '✨',
    title: 'Before & After Skincare',
    subtitle: 'See the transformation — acne treatment, brightening & anti-aging',
    cta: 'SHOP NOW',
    href: '/shop',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length)
        setTransitioning(false)
      }, 300)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[current]

  return (
    <div style={{
      position: 'relative',
      color: 'white',
      minHeight: 'clamp(300px, 50vw, 420px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      overflow: 'hidden',
      backgroundImage: `url(${slide.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'background-image 0.5s ease',
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 0,
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '3rem 1rem',
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'translateY(10px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{slide.emoji}</div>
        <h1 style={{ fontSize: 'clamp(1.3rem, 5vw, 2.5rem)', fontWeight: '800', marginBottom: '1rem' }}>{slide.title}</h1>
        <p style={{ fontSize: 'clamp(0.85rem, 3vw, 1.2rem)', marginBottom: '2rem', opacity: 0.9 }}>{slide.subtitle}</p>
        <a href={slide.href} className="btn-primary" style={{ background: 'white', color: '#0056b3', padding: '1rem 2rem', fontSize: '1rem', display: 'inline-block', textDecoration: 'none', fontWeight: '700', borderRadius: '4px' }}>
          {slide.cta} →
        </a>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 2 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setTransitioning(true); setTimeout(() => { setCurrent(i); setTransitioning(false) }, 300) }}
            style={{
              width: '12px', height: '12px', borderRadius: '50%', border: 'none',
              background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer', padding: 0, transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}