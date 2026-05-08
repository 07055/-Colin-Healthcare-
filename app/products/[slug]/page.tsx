import { notFound } from 'next/navigation'
import { getProductBySlug, products } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'

interface ProductPageProps {
  params: { slug: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return <ProductDetail product={product} relatedProducts={relatedProducts} />
}
