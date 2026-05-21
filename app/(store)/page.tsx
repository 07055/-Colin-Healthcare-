import ProductGrid from "@/components/ProductGrid";
import HeroSlider from "@/components/HeroSlider";
import { getPrisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Sam's Suma Mart (SSM) | Medical Supplies & Healthcare Products",
  description: "Shop quality medical supplies, healthcare products, and BF Suma products in Kenya. Fast delivery across Nairobi and all counties.",
  openGraph: {
    title: "Sam's Suma Mart (SSM) | Medical Supplies & Healthcare Products",
    description: "Shop quality medical supplies, healthcare products, and BF Suma products in Kenya. Fast delivery across Nairobi and all counties.",
  },
}

export default async function Home() {
  const prisma = getPrisma()

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 8,
    where: { featured: false }
  })

  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 4,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <HeroSlider />

      <div className="container" style={{ padding: '2rem 0' }}>
        {featuredProducts.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>⭐ Featured Products</h2>
              <a href="/shop" style={{ color: '#2e7d32', fontSize: '0.9rem', fontWeight: '600' }}>See All →</a>
            </div>
            <ProductGrid products={featuredProducts} />
          </div>
        )}

        {products.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>🔥 Latest Products</h2>
              <a href="/shop" style={{ color: '#2e7d32', fontSize: '0.9rem', fontWeight: '600' }}>See All →</a>
            </div>
            <ProductGrid products={products} />
          </div>
        )}

        {products.length === 0 && featuredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <p style={{ marginBottom: '1.5rem' }}>No products available yet.</p>
            <a href="/shop" className="btn-primary" style={{ display: 'inline-block' }}>Browse Shop</a>
          </div>
        )}
      </div>
    </div>
  );
}
