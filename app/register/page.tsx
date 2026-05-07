'use client';

import { useState } from 'react';
import { registerUser } from '@/lib/actions';
import Link from 'next/link';

export default function RegisterPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError('');

        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await registerUser(formData);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '450px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Create Account</h1>
                <p style={{ color: '#666' }}>Join SSM for exclusive deals</p>
            </div>

            {error && (
                <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    {error}
                </div>
            )}

            <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="section-card" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Personal Information</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Full Name *</label>
                            <input type="text" name="name" required style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Email Address *</label>
                            <input type="email" name="email" required style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Phone Number *</label>
                            <input type="tel" name="phone" required placeholder="0712 345 678" style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                    </div>
                </div>

                <div className="section-card" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Password</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Password *</label>
                            <input type="password" name="password" required minLength={6} style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Confirm Password *</label>
                            <input type="password" name="confirmPassword" required minLength={6} style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700' }}
                >
                    {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                    Already have an account? <Link href="/login" style={{ color: '#f68b1e', fontWeight: '600' }}>Sign In</Link>
                </p>
            </form>
        </div>
    );
}
