import { redirect } from 'next/navigation'
import { getPrisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '450px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img src="/logo.svg" alt="SSM" style={{ height: '60px', margin: '0 auto 1rem' }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Welcome Back</h1>
        <p style={{ color: '#666' }}>Sign in to your account</p>
      </div>

      {params.error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
          {decodeURIComponent(params.error)}
        </div>
      )}

      <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>Email Address</label>
          <input type="email" name="email" required placeholder="admin@ssm.co.ke" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>Password</label>
          <input type="password" name="password" required placeholder="••••••••" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' }} />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem' }}>
          SIGN IN
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        Don't have an account? <a href="/register" style={{ color: '#007bff', fontWeight: '600' }}>Create Account</a>
      </p>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f4ff', borderRadius: '8px', textAlign: 'center', fontSize: '0.8rem', color: '#333' }}>
        <strong>Admin Login:</strong><br/>
        Email: <code style={{ background: '#e0e0e0', padding: '2px 6px', borderRadius: '4px' }}>admin@ssm.co.ke</code><br/>
        Password: <code style={{ background: '#e0e0e0', padding: '2px 6px', borderRadius: '4px' }}>admin123</code>
      </div>
    </div>
  )
}
