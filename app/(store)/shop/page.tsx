import ProductGrid from "@/components/ProductGrid";
import CategoryAccordion from "@/components/CategoryAccordion";
import { getProductsByCategory, getCategories, searchProducts } from "@/lib/data";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our full catalog of medicines, health products, and pharmaceutical supplies. Find prescription medicines, OTC drugs, and more.",
  openGraph: {
    title: "Shop All Products | Colin Healthcare",
    description: "Browse our full catalog of medicines, health products, and pharmaceutical supplies.",
  },
}

import Link from 'next/link'

const CATEGORY_TYPES = ['OTC', 'Wellness', 'Devices', 'Prescription', 'Maternity', 'Personal Care'] as const

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; categoryType?: string }> }) {
    const params = await searchParams;
    const query = params.q;
    const category = params.category;

    const categories = getCategories()
    let products = query ? searchProducts(query) : getProductsByCategory(category)

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="shop-layout">
                {/* Sidebar - Categories */}
                <div className="shop-sidebar">
                    <CategoryAccordion categories={categories} currentCategory={category} />
                </div>

                {/* Products */}
                <div className="shop-main">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                            {query ? `Search: "${query}"` : categoryType ? categoryType : category ? category : 'Shop All Products'}
                        </h1>
                        <p style={{ fontSize: '0.85rem', color: '#666' }}>{products.length} product{products.length !== 1 ? 's' : ''} found</p>
                    </div>

                    {/* Category Type Filters */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        {CATEGORY_TYPES.map((type) => {
                            const isActive = categoryType?.toLowerCase() === type.toLowerCase()
                            return (
                                <Link
                                    key={type}
                                    href={isActive ? '/shop' : `/shop?categoryType=${type.toLowerCase()}`}
                                    style={{
                                        padding: '0.4rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: isActive ? '700' : '500',
                                        background: isActive ? '#2e7d32' : '#f5f5f5',
                                        color: isActive ? 'white' : '#333',
                                        textDecoration: 'none',
                                        border: isActive ? 'none' : '1px solid #ddd',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {type}
                                </Link>
                            )
                        })}
                    </div>

                    {products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <div className="section-card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                            <p style={{ color: '#666' }}>No products found. Try a different search or category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
