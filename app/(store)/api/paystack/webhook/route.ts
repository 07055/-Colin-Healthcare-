import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || ''

export async function POST(request: NextRequest) {
    try {
      const body = await request.json()

      const hash = crypto.createHmac('sha256', PAYSTACK_SECRET).update(JSON.stringify(body)).digest('hex')
      const signature = request.headers.get('x-paystack-signature')
      if (hash !== signature) {
        return NextResponse.json({ status: 'invalid' }, { status: 401 })
      }

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
