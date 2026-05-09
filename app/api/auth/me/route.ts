import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        location: user.location,
        orders: user.orders.map(o => ({
          id: o.id,
          createdAt: o.createdAt.toISOString(),
          status: o.status,
          paymentStatus: o.paymentStatus,
          total: o.total,
          customerPhone: o.customerPhone,
          items: o.items.map(i => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          }))
        }))
      }
    })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}