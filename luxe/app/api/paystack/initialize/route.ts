import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || ''

export async function POST(request: NextRequest) {
    try {
        const { email, amount, metadata } = await request.json()

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                amount: Math.round(amount * 100),
                callback_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/order-confirmation?orderId=${metadata?.orderId}`,
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Order ID",
                            variable_name: "order_id",
                            value: metadata?.orderId
                        }
                    ]
                }
            })
        })

        const data = await response.json()

        if (data.status) {
            return NextResponse.json({ authorization_url: data.data.authorization_url, access_code: data.data.access_code })
        }

        return NextResponse.json({ error: data.message }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 })
    }
}
