'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './register.module.css'

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(searchParams.error || '')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        // Cookie is set by the API route, now redirect to dashboard
        router.push('/dashboard')
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Create Account</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Join Sam's Suma Mart today</p>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {decodeURIComponent(error)}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Full Name *</label>
          <input type="text" name="name" required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Email Address *</label>
          <input type="email" name="email" required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Phone Number</label>
          <input type="tel" name="phone" placeholder="07XX XXX XXX" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>City</label>
          <input type="text" name="city" placeholder="e.g. Nairobi" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Location/Area</label>
          <input type="text" name="location" placeholder="e.g. Westlands" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Password *</label>
          <input type="password" name="password" required minLength={6} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Confirm Password *</label>
          <input type="password" name="confirmPassword" required minLength={6} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem' }}>
          {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        Already have an account? <a href="/login" style={{ color: '#f68b1e', fontWeight: '600' }}>Sign In</a>
      </p>
    </div>
  )
}
