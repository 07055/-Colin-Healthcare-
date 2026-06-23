'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PrescriptionUploadPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/prescriptions/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setReference(data.reference)
        setSuccess(true)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>Prescription Submitted!</h1>
        <p style={{ color: '#666', marginBottom: '0.5rem' }}>
          Reference: <strong>{reference}</strong>
        </p>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Our pharmacy team will review your prescription shortly.
        </p>
        <Link href="/shop" className="btn-primary" style={{ padding: '0.8rem 2rem', textDecoration: 'none', display: 'inline-block' }}>
          Browse Medicines
        </Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Upload Prescription</h1>
      <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>
        Send us your prescription and we will prepare your order.
      </p>

      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="section-card" style={{ padding: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>
              Patient Name *
            </label>
            <input
              type="text"
              name="patientName"
              required
              placeholder="Full name on prescription"
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }}
            />
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>
              Upload Prescription *
            </label>
            <input
              type="file"
              name="file"
              required
              accept="image/*,.pdf"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }}
            />
            <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.3rem' }}>
              Accepted: Images (JPG, PNG) or PDF files
            </p>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>
              Notes (optional)
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Any additional instructions or notes..."
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700', marginTop: '1.5rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'UPLOADING...' : 'SUBMIT PRESCRIPTION'}
          </button>
        </div>
      </form>

      <div className="section-card" style={{ padding: '1.5rem', marginTop: '1rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#2e7d32', fontWeight: '600' }}>Sign in</Link>
          {' '}to track your prescriptions.
        </p>
        <Link href="/shop" style={{ display: 'inline-block', marginTop: '0.75rem', color: '#2e7d32', fontSize: '0.9rem', fontWeight: '600' }}>
          ← Browse Shop
        </Link>
      </div>
    </div>
  )
}
