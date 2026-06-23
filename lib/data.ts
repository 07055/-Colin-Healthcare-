import rawProducts from '@/data/products.json'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  images: string
  category: string
  featured: boolean
}

function makeId(slug: string): string {
  return 'p_' + slug.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').toLowerCase()
}

const allProducts: Product[] = (rawProducts as any[]).map(p => ({
  ...p,
  id: makeId(p.slug),
}))

export function getProducts(): Product[] {
  return allProducts
}

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find(p => p.slug === slug)
}

export function getProductsByCategory(category?: string | null): Product[] {
  if (!category) return allProducts
  return allProducts.filter(p => p.category === category)
}

export function getCategories(): string[] {
  return [...new Set(allProducts.map(p => p.category))]
}

export function getFeaturedProducts(): Product[] {
  return allProducts.filter(p => p.featured)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return allProducts.filter(
    p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
  )
}
