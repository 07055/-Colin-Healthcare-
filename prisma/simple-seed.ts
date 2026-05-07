// Simple seed script - run with: npx tsx prisma/simple-seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: "Suma Grand Cleanser",
    slug: "suma-grand-cleanser",
    category: "Skincare",
    description: "Gentle facial cleanser suitable for all skin types.",
    price: 3450,
    stock: 100,
    images: JSON.stringify(["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"]),
    featured: false,
    ingredients: "Niacinamide, lactobacillus/soymilk ferment filtrate",
    benefits: "Nourishes and firms skin",
    usage: "Apply morning and evening",
    stockUnit: "Tube",
    inStock: true,
  },
  {
    name: "NMN Sharp Mind Capsules",
    slug: "nmn-sharp-mind-capsules",
    category: "NMN Collection",
    description: "Premium brain health formula with NMN + Resveratrol.",
    price: 24830,
    stock: 50,
    images: JSON.stringify(["https://images.unsplash.com/photo-1550572018-73b3e3a4f4b?auto=format&fit=crop&q=80&w=800"]),
    featured: true,
    ingredients: "NMN, Resveratrol, Ginkgo Biloba",
    benefits: "Genetic repair, brain health",
    usage: "2 capsules per day",
    stockUnit: "Box of 60 capsules",
    inStock: true,
  },
  {
    name: "Suma Grand Cream",
    slug: "suma-grand-cream",
    category: "Skincare",
    description: "Rich anti-aging cream that deeply nourishes skin.",
    price: 5300,
    stock: 100,
    images: JSON.stringify(["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"]),
    featured: true,
    ingredients: "Niacinamide, peptides, astaxanthin",
    benefits: "Restores firmness, anti-aging",
    usage: "Apply morning and evening",
    stockUnit: "Jar",
    inStock: true,
  },
  {
    name: "Xpower Man Plus Capsules",
    slug: "xpower-man-plus-capsules",
    category: "Men's Health",
    description: "US Patent formula for men's vitality and performance.",
    price: 6530,
    stock: 100,
    images: JSON.stringify(["https://images.unsplash.com/photo-1544005313-94ddf0286cd2?auto=format&fit=crop&q=80&w=800"]),
    featured: false,
    ingredients: "Maca, epimedium, L-arginine",
    benefits: "Improves vitality and performance",
    usage: "1-2 capsules daily",
    stockUnit: "Bottle of 30 capsules",
    inStock: true,
  },
  {
    name: "FemiCare Feminine Cleanser",
    slug: "femicare-feminine-cleanser",
    category: "Women's Health",
    description: "Antibacterial feminine cleanser for women.",
    price: 1840,
    stock: 100,
    images: JSON.stringify(["https://images.unsplash.com/photo-1556228578-0c98aaae08e1?auto=format&fit=crop&q=80&w=800"]),
    featured: false,
    ingredients: "Natural essential oils, vitamins",
    benefits: "Reinforces resistance against infection",
    usage: "Wash once a day for 7-10 days",
    stockUnit: "180ml bottle",
    inStock: true,
  }
]

async function main() {
  console.log('Starting simple seed...')
  
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
    console.log(`✓ ${product.name}`)
  }
  
  console.log(`✅ Seeded ${products.length} products!`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
