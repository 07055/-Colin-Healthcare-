import { notFound } from 'next/navigation'
import { getPrisma } from '@/lib/prisma'
import ProductDetail from '@/components/ProductDetail'
import type { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

function getFirstImage(images: any): string {
  if (typeof images === 'string') return images || '/placeholder.jpg'
  if (Array.isArray(images) && images.length > 0) return images[0]
  return '/placeholder.jpg'
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const prisma = getPrisma()
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) return {}
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: getFirstImage(product.images) }],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const prisma = getPrisma()

  const product = await prisma.product.findUnique({
    where: { slug }
  })

  if (!product) {
    notFound()
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id }
    },
    take: 4
  })

  return <ProductDetail product={product} relatedProducts={relatedProducts} />
}