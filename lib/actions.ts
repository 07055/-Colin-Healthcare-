'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getPrisma } from './prisma'

export async function createOrder(formData: FormData) {
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const city = formData.get('city') as string
  const address = formData.get('address') as string
  const paymentMethod = formData.get('paymentMethod') as string
  const total = parseFloat(formData.get('total') as string)
  const items = JSON.parse(formData.get('items') as string)

  if (!fullName || !phone || !city || !address) {
    return { success: false, error: 'Please fill in all required fields' }
  }

  try {
    const prisma = getPrisma()
    const order = await prisma.order.create({
      data: {
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        city,
        address,
        total,
        paymentMethod: paymentMethod as any,
        paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'UNPAID' : 'PENDING',
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }))
        }
      }
    })

      revalidatePath('/admin')
    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Order creation failed:', error)
    return { success: false, error: 'Failed to create order' }
  }
}

export async function getOrders() {
  const prisma = getPrisma()
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  })
}
