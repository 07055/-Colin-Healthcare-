import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ user: null })
    }

    const prisma = getPrisma()
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: { items: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        role: user.role,
        name: user.name || '',
        email: user.email,
        phone: user.phone || '',
        city: user.city || '',
        location: user.location || '',
        orders: user.orders.map(o => ({
          id: o.id,
          createdAt: o.createdAt ? o.createdAt.toISOString() : new Date().toISOString(),
          status: o.status || 'PENDING',
          paymentStatus: o.paymentStatus || 'PENDING',
          total: Number(o.total) || 0,
          customerPhone: o.customerPhone || '',
          items: (o.items || []).map(i => ({
            id: i.id,
            name: i.name || 'Unknown',
            price: Number(i.price) || 0,
            quantity: Number(i.quantity) || 1,
          }))
        }))
      }
    })
  } catch (err) {
    console.error('/api/auth/me error:', err)
    return NextResponse.json({ user: null })
  }
}