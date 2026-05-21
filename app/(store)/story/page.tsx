import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Sam's Suma Mart — your trusted source for quality medical supplies and healthcare products in Kenya. Our story, our promise.",
  openGraph: {
    title: "About Sam's Suma Mart",
    description: "Learn about Sam's Suma Mart — your trusted source for quality medical supplies and healthcare products in Kenya.",
  },
}

export default function StoryPage() {
    return (
        <div className="container" style={{ padding: '8rem 0', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem' }}>About Sam's Suma Mart</h1>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#444', marginBottom: '2rem' }}>
                SSM was founded to provide reliable, high-quality medical supplies and healthcare products
                to individuals, clinics, and hospitals across Kenya. We believe that access to proper
                medical equipment and supplies should be easy, affordable, and dependable.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666' }}>
                From surgical supplies to daily healthcare essentials, every product in our catalog
                is carefully selected to meet industry standards. We partner with trusted manufacturers
                to ensure you get genuine products at fair prices, delivered right to your doorstep.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666', marginTop: '2rem' }}>
                <strong>Our Promise:</strong> Quality products, fast delivery, and excellent customer service
                — because your health matters.
            </p>
        </div>
    );
}
