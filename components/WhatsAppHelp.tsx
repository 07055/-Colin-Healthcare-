'use client'

import { useState } from 'react'
import styles from './WhatsAppHelp.module.css'

export default function WhatsAppHelp() {
  const [open, setOpen] = useState(false)

  const handleHelp = () => {
    const message = encodeURIComponent('Hi! I need help with my order on Sam\'s Suma Mart.')
    window.open(`https://wa.me/254700000000?text=${message}`, '_blank')
    setOpen(false)
  }

  return (
    <div className={styles.container}>
      {open && (
        <div className={styles.popup}>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: '600' }}>Need Help?</p>
          <button onClick={handleHelp} className={styles.btn}>
            Chat on WhatsApp
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={styles.fab}
        aria-label="Need Help"
      >
        ?
      </button>
    </div>
  )
}
