import { NextRequest, NextResponse } from 'next/server'

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || ''

export async function POST(request: NextRequest) {
  try {
    if (!PAYSTACK_SECRET) {
      return NextResponse.json({ error: 'Payment not configured. Please use Cash on Delivery.' }, { status: 500 })
    }

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
        callback_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
        metadata
      })
    })

    const data = await response.json()

    if (data.status) {
      return NextResponse.json({ authorization_url: data.data.authorization_url })
    }

    return NextResponse.json({ error: data.message }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 })
  }
}
