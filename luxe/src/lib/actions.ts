'use strict'
'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { uploadToCloudinary } from './cloudinary'
import crypto from 'crypto'

function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return `${salt}:${hash}`
}

function verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':')
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return hash === verifyHash
}

function generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex')
}

async function getUserId(): Promise<string | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get('session_token')?.value
    if (!token) return null

    const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true }
    })

    if (!session || session.expiresAt < new Date()) {
        return null
    }

    return session.userId
}

async function createSession(userId: string): Promise<string> {
    const token = generateSessionToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    await prisma.session.create({
        data: {
            userId,
            token,
            expiresAt
        }
    })

    return token
}

async function deleteSession(token: string) {
    await prisma.session.deleteMany({
        where: { token }
    })
}

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const password = formData.get('password') as string

    if (!name || !email || !phone || !password) {
        throw new Error('All fields are required')
    }

    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        throw new Error('Email already registered')
    }

    const hashedPassword = hashPassword(password)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            phone,
            password: hashedPassword,
            role: 'USER',
        }
    })

    const token = await createSession(user.id)

    const cookieStore = await cookies()
    cookieStore.set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    })

    redirect('/')
}

export async function loginUser(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        throw new Error('Invalid credentials')
    }

    const isValid = user.password.includes(':')
        ? verifyPassword(password, user.password)
        : password === user.password

    if (!isValid) {
        throw new Error('Invalid credentials')
    }

    const token = await createSession(user.id)

    const cookieStore = await cookies()
    cookieStore.set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    })

    redirect('/')
}

export async function logoutUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session_token')?.value
    if (token) {
        await deleteSession(token)
    }
    cookieStore.delete('session_token')
    redirect('/')
}

export async function createProduct(formData: FormData) {
    const userId = await getUserId()
    if (!userId) redirect('/login')

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const priceValue = formData.get('price') as string
    const stockValue = formData.get('stock') as string
    const category = formData.get('category') as string

    const price = parseFloat(priceValue)
    const stock = parseInt(stockValue)

    if (!name || !description || isNaN(price)) {
        throw new Error('Missing required fields')
    }

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

    // Handle multiple images
    const imageFiles = formData.getAll('imageFiles') as File[]
    const imageUrls: string[] = []

    for (const file of imageFiles) {
        if (file.size > 0) {
            try {
                const url = await uploadToCloudinary(file)
                imageUrls.push(url)
            } catch (error) {
                console.error('Upload failed:', error)
                throw new Error('Failed to upload image to Cloudinary')
            }
        }
    }

    if (imageUrls.length === 0) {
        throw new Error('At least one image is required')
    }

    await prisma.product.create({
        data: {
            name,
            slug,
            description,
            price,
            stock,
            category,
            images: JSON.stringify(imageUrls),
        }
    })

    revalidatePath('/shop')
    revalidatePath('/')
    redirect('/shop')
}

export async function deleteProduct(formData: FormData) {
    const userId = await getUserId()
    if (!userId) redirect('/login')

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    const id = formData.get('id') as string
    if (!id) throw new Error('Product ID is required')

    await prisma.product.delete({ where: { id } })

    revalidatePath('/shop')
    revalidatePath('/')
    revalidatePath('/admin')
}

export async function checkoutOrder(formData: FormData) {
    const userId = await getUserId()

    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const city = formData.get('city') as string
    const address = formData.get('address') as string
    const deliveryNotes = formData.get('deliveryNotes') as string
    const paymentMethod = formData.get('paymentMethod') as string
    const totalStr = formData.get('total') as string
    const itemsStr = formData.get('items') as string

    if (!fullName || !phone || !city || !address) {
        return { success: false, error: 'Please fill in all required fields' }
    }

    let items: any[]
    try {
        items = JSON.parse(itemsStr)
    } catch {
        return { success: false, error: 'Invalid cart data' }
    }

    if (!items || items.length === 0) {
        return { success: false, error: 'Cart is empty' }
    }

    const total = parseFloat(totalStr)

    let order
    try {
        order = await prisma.order.create({
            data: {
                userId: userId || null,
                total,
                address,
                phone,
                city,
                deliveryNotes: deliveryNotes || null,
                paymentMethod: paymentMethod as any,
                paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'UNPAID' : 'PENDING',
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    }))
                }
            }
        })
    } catch (error) {
        console.error('Order creation failed:', error)
        return { success: false, error: 'Failed to create order' }
    }

    revalidatePath('/admin')
    return { success: true, orderId: order.id }
}

export async function getUserOrders() {
    const userId = await getUserId()
    if (!userId) return []

    return prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
    })
}

export async function getOrderById(orderId: string) {
    const userId = await getUserId()
    if (!userId) return null

    return prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } }
    })
}
