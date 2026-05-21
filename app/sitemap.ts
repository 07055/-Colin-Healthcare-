import type { MetadataRoute } from 'next'
import { getPrisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prisma = getPrisma()
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
  })

  const baseUrl = 'https://samsumamart.co.ke'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/story`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ]

  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...productPages]
}
