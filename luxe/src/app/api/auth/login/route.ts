import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

function verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':')
    const verifyHash = Buffer.from(
        require('crypto')
            .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    ).toString('hex')
    return hash === verifyHash
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
        }

        const isValid = user.password.includes(':')
            ? verifyPassword(password, user.password)
            : password === user.password

        if (!isValid) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
        }

        const cookieStore = await cookies()
        cookieStore.set('session_token', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return NextResponse.json({ success: true, role: user.role })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
    }
}
