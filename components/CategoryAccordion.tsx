'use client'

import { useState } from 'react'

export default function CategoryAccordion({
  categories,
  currentCategory,
}: {
  categories: string[]
  currentCategory?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="section-card" style={{ padding: '0' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.95rem',
          fontWeight: '700',
          color: '#2e7d32',
        }}
      >
        CATEGORIES ({categories.length + 1})
        <span style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>
      {open && (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 0.75rem 0.75rem', listStyle: 'none' }}>
          <li>
            <a
              href="/shop"
              style={{
                display: 'block',
                padding: '0.5rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                background: !currentCategory ? '#2e7d32' : 'transparent',
                color: !currentCategory ? '#fff' : '#333',
                fontWeight: !currentCategory ? '600' : '400',
                textDecoration: 'none',
              }}
            >
              All Products
            </a>
          </li>
          {categories.map((cat: string) => (
            <li key={cat}>
              <a
                href={`/shop?category=${encodeURIComponent(cat)}`}
                style={{
                  display: 'block',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  background: currentCategory === cat ? '#2e7d32' : 'transparent',
                  color: currentCategory === cat ? '#fff' : '#333',
                  fontWeight: currentCategory === cat ? '600' : '400',
                  textDecoration: 'none',
                }}
              >
                {cat}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}