'use server'

import { revalidatePath } from 'next/cache'
import { getPrisma } from './prisma'
import { cookies } from 'next/headers'

export async function createOrder(formData: FormData) {
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const city = formData.get('city') as string
  const address = formData.get('address') as string
  const location = formData.get('location') as string
  const paymentMethod = formData.get('paymentMethod') as string
  const total = parseFloat(formData.get('total') as string)
  const items = JSON.parse(formData.get('items') as string)

  if (!fullName || !phone || !city || !address) {
    return { success: false, error: 'Please fill in all required fields' }
  }

  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value

  try {
    const prisma = getPrisma()

    const productIds = items.map((item: any) => item.id).filter(Boolean)
    let needsPrescription = false
    if (productIds.length > 0) {
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, prescriptionRequired: true }
      })
      needsPrescription = products.some((p: any) => p.prescriptionRequired)
    }

    const order = await prisma.order.create({
      data: {
        customerName: fullName,
        customerEmail: email || null,
        customerPhone: phone,
        city,
        address,
        location: location || null,
        total,
        deliveryFee: 200,
        paymentMethod: paymentMethod as any,
        paymentStatus: 'PENDING',
        status: needsPrescription ? 'PRESCRIPTION_REVIEW' : 'PENDING',
        userId: userId || null,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            productId: item.id || null,
          }))
        }
      }
    })

    revalidatePath('/admin')
    revalidatePath('/profile')
    return { success: true, orderId: order.id }
  } catch (error: any) {
    console.error('Order creation failed:', error?.message || error)
    if (error?.message?.includes('connect')) {
      return { success: false, error: 'Database connection error. Please try again.' }
    }
    if (error?.message?.includes('undefined_column') || error?.message?.includes('does not exist')) {
      return { success: false, error: 'System error. Please contact support.' }
    }
    return { success: false, error: 'Failed to create order. Please try again.' }
  }
}

export async function getOrders() {
  const prisma = getPrisma()
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true, user: true, prescription: true }
  })
}

export async function getOrderById(id: string) {
  const prisma = getPrisma()
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: true,
      prescription: true,
    }
  })
}