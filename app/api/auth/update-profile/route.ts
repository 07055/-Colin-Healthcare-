import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone, city, location } = body

    const prisma = getPrisma()
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || '',
        phone: phone || '',
        city: city || '',
        location: location || '',
      }
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}