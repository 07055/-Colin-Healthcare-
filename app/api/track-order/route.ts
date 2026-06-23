import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const prisma = getPrisma()

    const orders = await prisma.order.findMany({
      include: {
        items: true,
        prescription: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const order = orders.find((o: any) =>
      o.id.toLowerCase().endsWith(id.toLowerCase())
    )

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      order: {
        id: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        city: order.city,
        address: order.address,
        location: order.location,
        total: Number(order.total),
        deliveryFee: Number(order.deliveryFee),
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: order.updatedAt?.toISOString() || new Date().toISOString(),
        items: (order.items || []).map((i: any) => ({
          id: i.id,
          name: i.name,
          price: Number(i.price),
          quantity: Number(i.quantity),
        })),
        prescription: order.prescription ? {
          id: order.prescription.id,
          status: order.prescription.status,
          fileUrl: order.prescription.fileUrl,
          notes: order.prescription.notes,
        } : null,
      }
    })
  } catch (error: any) {
    console.error('Track order error:', error)
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 })
  }
}
