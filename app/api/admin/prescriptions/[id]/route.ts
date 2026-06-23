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

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: { order: true }
    })

    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 })
    }

    if (body.status === 'APPROVED') {
      await prisma.prescription.update({
        where: { id },
        data: { status: 'APPROVED', reviewedAt: new Date(), notes: body.notes || null }
      })
      await prisma.order.update({
        where: { id: prescription.orderId },
        data: { status: 'PROCESSING' }
      })
    } else if (body.status === 'REJECTED') {
      await prisma.prescription.update({
        where: { id },
        data: { status: 'REJECTED', reviewedAt: new Date(), notes: body.notes || null }
      })
      await prisma.order.update({
        where: { id: prescription.orderId },
        data: { status: 'PENDING' }
      })
    } else {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updated = await prisma.prescription.findUnique({
      where: { id },
      include: {
        order: {
          select: { id: true, customerName: true, total: true, status: true, createdAt: true }
        }
      }
    })

    return NextResponse.json({ success: true, prescription: updated })
  } catch {
    return NextResponse.json({ error: 'Failed to update prescription' }, { status: 500 })
  }
}
