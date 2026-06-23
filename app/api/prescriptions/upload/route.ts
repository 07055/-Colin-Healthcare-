import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    const formData = await request.formData()
    const patientName = formData.get('patientName') as string
    const notes = formData.get('notes') as string
    const orderId = formData.get('orderId') as string

    if (!patientName) {
      return NextResponse.json({ error: 'Patient name is required' }, { status: 400 })
    }

    const prisma = getPrisma()

    const prescription = await prisma.prescription.create({
      data: {
        orderId: orderId || `standalone-${Date.now()}`,
        fileUrl: `/uploads/prescriptions/placeholder`,
        fileType: 'image',
        notes: notes || null,
      }
    })

    return NextResponse.json({
      success: true,
      prescriptionId: prescription.id,
      reference: prescription.id.slice(-8).toUpperCase()
    })
  } catch (error: any) {
    console.error('Prescription upload error:', error)
    return NextResponse.json({ error: 'Failed to upload prescription' }, { status: 500 })
  }
}
