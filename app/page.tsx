import ProductGrid from "@/components/ProductGrid";
import Hero from "@/components/Hero";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  let products: any[] = [];
  let featuredProducts: any[] = [];

  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8
    });
    featuredProducts = await prisma.product.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
      take: 4
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <div>
      <Hero />

      <div className="container" style={{ padding: '2rem 0' }}>
        {featuredProducts.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>⭐ Featured Products</h2>
              <Link href="/shop" style={{ color: '#f68b1e', fontSize: '0.9rem', fontWeight: '600' }}>See All →</Link>
            </div>
            <ProductGrid products={featuredProducts} />
          </div>
        )}

        {products.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>🔥 Latest Products</h2>
              <Link href="/shop" style={{ color: '#f68b1e', fontSize: '0.9rem', fontWeight: '600' }}>See All →</Link>
            </div>
            <ProductGrid products={products} />
          </div>
        )}

        {products.length === 0 && featuredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
            <p>No products available yet. Check back soon!</p>
            <Link href="/shop" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Browse Shop</Link>
          </div>
        )}
      </div>
    </div>
  );
}
