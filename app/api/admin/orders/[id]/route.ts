import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get('userRole')?.value
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const prisma = getPrisma()

    const data: Record<string, string> = {}
    if (body.paymentStatus) data.paymentStatus = body.paymentStatus
    if (body.status) data.status = body.status
    if (Object.keys(data).length === 0) data.status = 'DELIVERED'

    const order = await prisma.order.update({
      where: { id },
      data,
    })

    return NextResponse.json({ success: true, order })
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
