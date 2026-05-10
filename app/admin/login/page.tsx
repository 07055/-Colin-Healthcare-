'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/admin')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '450px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img src="/logo.svg" alt="SSM" style={{ height: '60px', margin: '0 auto 1rem' }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Admin Portal</h1>
        <p style={{ color: '#666' }}>Enter admin password</p>
      </div>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>Admin Password</label>
          <input type="password" name="password" required placeholder="Enter admin password" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'VERIFYING...' : 'ACCESS DASHBOARD'}
        </button>
      </form>
    </div>
  )
}