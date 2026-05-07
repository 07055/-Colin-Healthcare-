import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const products = [
  {
    name: "Suma Grand Cleanser",
    slug: "suma-grand-cleanser",
    category: "Skincare",
    description: "Gentle facial cleanser for all skin types.",
    price: 3450,
    stock: 100,
    images: JSON.stringify(["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"]),
    featured: false,
    ingredients: "Niacinamide, lactobacillus",
    benefits: "Nourishes and firms skin",
    usage: "Apply morning and evening",
    stockUnit: "Tube",
    inStock: true,
  },
  {
    name: "NMN Sharp Mind Capsules",
    slug: "nmn-sharp-mind-capsules",
    category: "NMN Collection",
    description: "Brain health formula with NMN + Resveratrol.",
    price: 24830,
    stock: 50,
    images: JSON.stringify(["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"]),
    featured: true,
    ingredients: "NMN, Resveratrol, Ginkgo Biloba",
    benefits: "Genetic repair, brain health",
    usage: "2 capsules per day",
    stockUnit: "Box of 60 capsules",
    inStock: true,
  }
]

export async function GET() {
  try {
    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: product,
        create: product,
      })
    }
    return NextResponse.json({ success: true, message: `Seeded ${products.length} products` })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
