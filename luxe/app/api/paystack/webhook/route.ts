import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || ''

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const event = body.event

        if (event === 'charge.success') {
            const data = body.data
            const txRef = data.reference
            const amount = data.amount / 100
            const email = data.customer.email

            const order = await prisma.order.findFirst({
                where: {
                    AND: [
                        { total: amount },
                        {
                            OR: [
                                { userId: null },
                                { user: { email } }
                            ]
                        }
                    ]
                },
                orderBy: { createdAt: 'desc' }
            })

            if (order) {
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        paymentStatus: 'PAID',
                        transactionRef: txRef,
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

export async function GET() {
    return NextResponse.json({ status: 'Paystack webhook endpoint active' })
}
