import { redirect } from 'next/navigation'
import { getPrisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import styles from './login.module.css'

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  async function login(formData: FormData) {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      redirect('/login?error=Email+and+password+are+required')
    }

    try {
      const prisma = getPrisma()
      const user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        redirect('/login?error=Invalid+email+or+password')
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        redirect('/login?error=Invalid+email+or+password')
      }

      // Set a simple cookie for auth
      const cookieStore = await cookies()
      cookieStore.set('userId', user.id, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })

      redirect('/dashboard')
    } catch (error) {
      redirect('/login?error=Login+failed')
    }
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Welcome Back</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Sign in to your account</p>

      {searchParams.error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {decodeURIComponent(searchParams.error)}
        </div>
      )}

      <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Email Address *</label>
          <input type="email" name="email" required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Password *</label>
          <input type="password" name="password" required style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem' }}>
          SIGN IN
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        Don't have an account? <a href="/register" style={{ color: '#f68b1e', fontWeight: '600' }}>Create Account</a>
      </p>
    </div>
  )
}
