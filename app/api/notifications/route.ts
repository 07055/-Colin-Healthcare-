import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ notifications: [] })
    }

    const prisma = getPrisma()

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      notifications: notifications.map((n: any) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        orderId: n.orderId,
        createdAt: n.createdAt?.toISOString() || new Date().toISOString(),
      }))
    })
  } catch (error: any) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json({ notifications: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { notificationId } = body

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 })
    }

    const prisma = getPrisma()

    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Notification update error:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}
