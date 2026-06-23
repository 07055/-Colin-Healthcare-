import { notFound } from 'next/navigation'
import { getProductBySlug, getProductsByCategory } from '@/lib/data'
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
  const product = getProductBySlug(slug)
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
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4)

  return <ProductDetail product={product} relatedProducts={relatedProducts} />
}