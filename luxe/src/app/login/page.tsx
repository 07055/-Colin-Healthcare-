'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                router.refresh();
                router.push(result.role === 'ADMIN' ? '/admin' : '/');
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ 
            padding: '4rem 1rem', 
            maxWidth: '450px',
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{ 
                background: 'white', 
                padding: '2.5rem', 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                width: '100%',
                border: '1px solid #e0e0e0'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src="/logo.svg" alt="SSM" style={{ height: '50px', margin: '0 auto 1rem' }} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#0056b3' }}>Welcome Back</h1>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Sign in to your account</p>
                </div>

                {error && (
                    <div style={{ 
                        background: '#fee', 
                        color: '#c00', 
                        padding: '0.75rem', 
                        borderRadius: '6px', 
                        marginBottom: '1rem',
                        fontSize: '0.85rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@ssm.co.ke"
                            style={{ 
                                width: '100%', 
                                padding: '0.8rem', 
                                border: '1px solid #ddd', 
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: '#333' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{ 
                                width: '100%', 
                                padding: '0.8rem', 
                                border: '1px solid #ddd', 
                                borderRadius: '6px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ 
                            width: '100%', 
                            padding: '1rem', 
                            fontSize: '1rem', 
                            fontWeight: '700',
                            marginTop: '0.5rem'
                        }}
                    >
                        {loading ? 'Signing in...' : 'SIGN IN'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666', marginTop: '1.5rem' }}>
                    Don't have an account?{' '}
                    <Link href="/register" style={{ color: '#007bff', fontWeight: '600' }}>Register here</Link>
                </p>

                <div style={{ 
                    marginTop: '1.5rem', 
                    padding: '1rem', 
                    background: '#f8f9fa', 
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: '#666'
                }}>
                    <strong>Admin Login:</strong><br/>
                    Email: <code>admin@ssm.co.ke</code><br/>
                    Password: <code>admin123</code>
                </div>
            </div>
        </div>
    );
}
