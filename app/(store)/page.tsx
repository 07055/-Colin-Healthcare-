import ProductGrid from "@/components/ProductGrid";
import { getProducts, getFeaturedProducts } from "@/lib/data";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Colin Healthcare (CH) | Online Pharmacy Kenya",
  description: "Kenya's trusted online pharmacy. Order quality medicines, wellness products & medical devices online. Free delivery in Nairobi & all counties.",
  openGraph: {
    title: "Colin Healthcare (CH) | Online Pharmacy Kenya",
    description: "Kenya's trusted online pharmacy. Order quality medicines, wellness products & medical devices online. Free delivery in Nairobi & all counties.",
  },
}

const categories = [
  { icon: "💊", name: "OTC Medicines", href: "/shop?categoryType=otc" },
  { icon: "🌿", name: "Wellness", href: "/shop?categoryType=wellness" },
  { icon: "🩺", name: "Medical Devices", href: "/shop?categoryType=devices" },
  { icon: "📋", name: "Prescription", href: "/shop?categoryType=prescription" },
]

const steps = [
  { icon: "📱", title: "Browse & Order", subtitle: "Search medicines or upload your prescription" },
  { icon: "👨‍⚕️", title: "Pharmacist Review", subtitle: "Our pharmacists verify your order" },
  { icon: "🚚", title: "Fast Delivery", subtitle: "Delivered to your doorstep within 24-48hrs" },
]

export default async function Home() {
  const all = getProducts()
  const featuredProducts = getFeaturedProducts().slice(0, 4)
  const products = all.filter(p => !p.featured).slice(0, 8)

  return (
    <div>
      <section
        style={{
          background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
          padding: "4rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h1
            style={{
              color: "#fff",
              fontSize: "2rem",
              fontWeight: "800",
              marginBottom: "0.75rem",
            }}
          >
            Your Trusted Online Pharmacy
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "1.05rem",
              maxWidth: "520px",
              margin: "0 auto 2rem",
              lineHeight: "1.6",
            }}
          >
            Quality medicines, wellness products & medical devices delivered to
            your doorstep.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/shop"
              style={{
                background: "#fff",
                color: "#2e7d32",
                fontWeight: "700",
                padding: "0.75rem 2rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              Browse Medicines
            </a>
            <a
              href="/prescriptions/upload"
              style={{
                background: "#fff",
                color: "#2e7d32",
                fontWeight: "700",
                padding: "0.75rem 2rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              Upload Prescription
            </a>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: "2rem 0" }}>
        <section style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "1rem",
            }}
          >
            {categories.map((cat) => (
                <a
                  key={cat.name}
                  href={cat.href}
                  className="cat-card"
                  style={{
                  background: "#2e7d32",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "1.5rem 1rem",
                  textDecoration: "none",
                  textAlign: "center",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}

              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  {cat.icon}
                </div>
                <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>
                  {cat.name}
                </div>
              </a>
            ))}
          </div>
        </section>

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
          <div style={{ marginBottom: '2.5rem' }}>
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

        <section style={{ marginTop: "2rem" }}>
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            How It Works
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {steps.map((step, i) => (
              <div
                key={step.title}
                style={{
                  textAlign: "center",
                  padding: "1.5rem 1rem",
                  borderRadius: "12px",
                  background: "#f9fafb",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                  {step.icon}
                </div>
                <div style={{ fontWeight: "700", fontSize: "1rem", marginBottom: "0.25rem" }}>
                  Step {i + 1}: {step.title}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#555", lineHeight: "1.4" }}>
                  {step.subtitle}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
