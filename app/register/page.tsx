import { redirect } from 'next/navigation'
import { getPrisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import styles from './register.module.css'

export default function RegisterPage() {
  async function register(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const city = formData.get('city') as string
    const location = formData.get('location') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!name || !email || !password) {
      return { error: 'Name, email and password are required' }
    }

    if (password !== confirmPassword) {
      return { error: 'Passwords do not match' }
    }

    try {
      const prisma = getPrisma()
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        return { error: 'Email already registered' }
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user.create({
        data: {
          name,
          email,
          phone,
          city,
          location,
          password: hashedPassword,
        }
      })

      redirect('/login?registered=true')
    } catch (error) {
      return { error: 'Registration failed. Please try again.' }
    }
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Create Account</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Join Sam's Suma Mart today</p>

      <form action={register} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700', marginTop: '0.5rem' }}>
          CREATE ACCOUNT
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
        Already have an account? <a href="/login" style={{ color: '#f68b1e', fontWeight: '600' }}>Sign In</a>
      </p>
    </div>
  )
}
