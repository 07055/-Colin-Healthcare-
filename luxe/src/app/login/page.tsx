'use client';

import { loginUser } from "@/lib/actions";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [error, setError] = useState('');

    const handleSubmit = async (formData: FormData) => {
        setError('');
        try {
            await loginUser(formData);
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '400px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Welcome Back</h1>
                <p style={{ color: '#666' }}>Sign in to your account</p>
            </div>

            {error && (
                <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    {error}
                </div>
            )}

            <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="section-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label htmlFor="email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                style={{ width: '100%', padding: '0.7rem', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700' }}
                >
                    SIGN IN
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                    Don't have an account? <Link href="/register" style={{ color: '#f68b1e', fontWeight: '600' }}>Create one</Link>
                </p>
            </form>
        </div>
    );
}
