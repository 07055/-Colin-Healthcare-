import { notFound } from 'next/navigation'
import { getPrisma } from '@/lib/prisma'
import ProductDetail from '@/components/ProductDetail'

interface ProductPageProps {
  params: Promise<{ slug: string }>
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