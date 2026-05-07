import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let products: { slug: string; updatedAt: Date }[] = []

    try {
        products = await prisma.product.findMany({
            select: { slug: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' }
        })
    } catch (error) {
        console.error('Failed to fetch products for sitemap:', error)
    }

    const baseUrl = 'https://samassumamart.co.ke'

    const staticPages = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
        { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
        { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.5 },
        { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
        { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    ]

    const productPages = products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...staticPages, ...productPages]
}
