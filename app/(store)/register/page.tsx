'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const city = formData.get('city') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, phone, city, password }),
      })

      const data = await res.json()

      if (data.success) {
        window.location.href = '/'
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img src="/logo.svg" alt="SSM" style={{ height: '60px', margin: '0 auto 1rem' }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Create Account</h1>
        <p style={{ color: '#666' }}>Join Sam&apos;s Suma Mart today</p>
      </div>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>Full Name</label>
          <input type="text" name="name" required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>Email Address</label>
          <input type="email" name="email" required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>Phone Number</label>
          <input type="tel" name="phone" required placeholder="07XX XXX XXX" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>City</label>
          <input type="text" name="city" required placeholder="e.g. Nairobi" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>Password</label>
          <input type="password" name="password" required minLength={6} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>Confirm Password</label>
          <input type="password" name="confirmPassword" required minLength={6} style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        Already have an account? <Link href="/login" style={{ color: '#2e7d32', fontWeight: '600' }}>Sign In</Link>
      </p>
    </div>
  )
}