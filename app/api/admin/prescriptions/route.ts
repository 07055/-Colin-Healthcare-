import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userRole = cookieStore.get('userRole')?.value
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prisma = getPrisma()
    const prescriptions = await prisma.prescription.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: { id: true, customerName: true, total: true, status: true, createdAt: true }
        }
      }
    })

    return NextResponse.json({ prescriptions })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 })
  }
}
