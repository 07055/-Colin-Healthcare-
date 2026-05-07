import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
    const params = await searchParams;
    const query = params.q;
    const category = params.category;

    let products: any[] = [];
    const categories = await prisma.product.findMany({
        select: { category: true },
        distinct: ['category']
    });

    try {
        const where: any = {};
        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' as any } },
                { description: { contains: query, mode: 'insensitive' as any } },
                { category: { contains: query, mode: 'insensitive' as any } },
            ];
        }
        if (category) {
            where.category = category;
        }

        products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("[ShopPage] Failed to fetch products:", error);
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                {/* Sidebar - Categories */}
                <div style={{ width: '220px', flexShrink: 0 }}>
                    <div className="section-card" style={{ padding: '1rem' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', color: '#f68b1e' }}>CATEGORIES</h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>
                                <a
                                    href="/shop"
                                    style={{
                                        display: 'block',
                                        padding: '0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                        background: !category ? '#f68b1e' : 'transparent',
                                        color: !category ? '#fff' : '#333',
                                        fontWeight: !category ? '600' : '400',
                                    }}
                                >
                                    All Products
                                </a>
                            </li>
                            {categories.map((cat: any) => (
                                <li key={cat.category}>
                                    <a
                                        href={`/shop?category=${encodeURIComponent(cat.category)}`}
                                        style={{
                                            display: 'block',
                                            padding: '0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.85rem',
                                            background: category === cat.category ? '#f68b1e' : 'transparent',
                                            color: category === cat.category ? '#fff' : '#333',
                                            fontWeight: category === cat.category ? '600' : '400',
                                        }}
                                    >
                                        {cat.category}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Products */}
                <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                            {query ? `Search: "${query}"` : category ? category : 'Shop All Products'}
                        </h1>
                        <p style={{ fontSize: '0.85rem', color: '#666' }}>{products.length} product{products.length !== 1 ? 's' : ''} found</p>
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
