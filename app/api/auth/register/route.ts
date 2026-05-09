import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, city, location, password } = body

    console.log('Registration attempt:', { name, email, phone, city, location })

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || '',
        city: city || '',
        location: location || '',
        password: hashedPassword,
      }
    })

    console.log('User created:', user.id)

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ 
      error: error.message || 'Registration failed',
      details: error.code 
    }, { status: 500 })
  }
}