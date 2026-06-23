import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Colin Healthcare — your trusted source for quality medicines and health products in Kenya. Our story, our promise.",
  openGraph: {
    title: "About Colin Healthcare",
    description: "Learn about Colin Healthcare — your trusted source for quality medicines and health products in Kenya.",
  },
}

export default function StoryPage() {
    return (
        <div className="container" style={{ padding: '8rem 0', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem' }}>About Colin Healthcare</h1>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#444', marginBottom: '2rem' }}>
                CH was founded to provide reliable, high-quality medicines and health products
                to individuals, clinics, and hospitals across Kenya. We believe that access to proper
                medication and pharmaceutical supplies should be easy, affordable, and dependable.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666' }}>
                From prescription medicines to daily health essentials, every product in our catalog
                is carefully selected to meet pharmaceutical standards. We partner with trusted manufacturers
                to ensure you get genuine products at fair prices, delivered right to your doorstep.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666', marginTop: '2rem' }}>
                <strong>Our Promise:</strong> Quality products, fast delivery, and excellent customer service
                — because your health matters.
            </p>
        </div>
    );
}
