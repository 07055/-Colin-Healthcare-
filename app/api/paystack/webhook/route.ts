import { NextRequest, NextResponse } from 'next/server'

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || ''

const getPrisma = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not configured')
  }
  const { prisma } = require('@/lib/prisma')
  return prisma
}

export async function POST(request: NextRequest) {
    try {
      const body = await request.json()
      const event = body.event

      if (event === 'charge.success') {
        const data = body.data
        const orderId = data.metadata?.orderId

        if (orderId) {
          const prisma = getPrisma()
          await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'PAID',
            transactionRef: data.reference,
          }
        })
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Paystack webhook error:', error)
    return NextResponse.json({ status: 'ok' })
  }
}
