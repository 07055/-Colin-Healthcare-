'use client'

import { useState, useEffect } from 'react'

const slides = [
  {
    gradient: 'linear-gradient(135deg, #0056b3, #007bff)',
    emoji: '🩺',
    title: 'Doctor-Recommended Skincare',
    subtitle: 'Professional medical-grade products for healthy, radiant skin',
    cta: 'SHOP SKINCARE',
    href: '/shop?q=skincare',
  },
  {
    gradient: 'linear-gradient(135deg, #1a237e, #283593)',
    emoji: '🦵',
    title: 'Knee & Joint Pain Relief',
    subtitle: 'Effective solutions for arthritis, inflammation & daily discomfort',
    cta: 'SHOP PAIN RELIEF',
    href: '/shop?q=joint',
  },
  {
    gradient: 'linear-gradient(135deg, #4a148c, #7b1fa2)',
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
      background: slide.gradient,
      color: 'white',
      padding: '4rem 2rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.4s ease',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'translateY(10px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{slide.emoji}</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>{slide.title}</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>{slide.subtitle}</p>
        <a href={slide.href} className="btn-primary" style={{ background: 'white', color: slide.gradient.includes('0056b3') ? '#0056b3' : slide.gradient.includes('1a237e') ? '#1a237e' : '#4a148c', padding: '1rem 2rem', fontSize: '1rem', display: 'inline-block', textDecoration: 'none', fontWeight: '700', borderRadius: '4px' }}>
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
              width: '10px', height: '10px', borderRadius: '50%', border: 'none',
              background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer', padding: 0, transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}