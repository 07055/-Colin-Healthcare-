import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await prisma.user.upsert({
        where: { email: 'admin@ssm.co.ke' },
        update: {},
        create: {
            name: 'SSM Admin',
            email: 'admin@ssm.co.ke',
            phone: '0796388790',
            password: hashedPassword,
            role: 'ADMIN',
        }
    })
    console.log('Created Admin: admin@ssm.co.ke / admin123')

    // BF Suma Products
    const products = [
        {
            name: 'Suma Brain - 60 Capsules',
            slug: 'suma-brain',
            description: 'Premium brain health supplement. Supports cognitive function, memory, and mental clarity. Made from high-quality natural ingredients.',
            price: 2500,
            stock: 100,
            category: 'Brain Health',
            images: 'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=800',
            featured: true,
        },
        {
            name: 'Suma Root',
            slug: 'suma-root',
            description: 'Natural energy booster. Supports vitality, stamina, and overall wellness. Premium quality herbal supplement.',
            price: 2200,
            stock: 80,
            category: 'Energy & Vitality',
            images: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800',
            featured: true,
        },
        {
            name: 'Suma Powder',
            slug: 'suma-powder',
            description: 'Pure Suma root powder. Versatile wellness supplement that can be mixed with drinks or food. Rich in nutrients.',
            price: 1800,
            stock: 60,
            category: 'Supplements',
            images: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=800',
            featured: false,
        },
        {
            name: 'Perfect Eye Solution',
            slug: 'perfect-eye-solution',
            description: 'Eye health supplement. Supports healthy vision, reduces eye fatigue, and protects against digital strain.',
            price: 1500,
            stock: 120,
            category: 'Eye Health',
            images: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80&w=800',
            featured: true,
        },
        {
            name: 'Fenghuang Green Tea',
            slug: 'fenghuang-green-tea',
            description: 'Premium organic green tea. Rich in antioxidants, supports metabolism and overall health. Refreshing and energizing.',
            price: 1200,
            stock: 150,
            category: 'Teas & Drinks',
            images: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800',
            featured: true,
        },
        {
            name: 'Natural Royal Jelly',
            slug: 'natural-royal-jelly',
            description: 'Pure royal jelly supplement. Rich in vitamins and amino acids. Supports immune system and energy levels.',
            price: 3500,
            stock: 50,
            category: 'Honey & Propolis',
            images: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
            featured: true,
        },
        {
            name: 'Omega 3 Softgels',
            slug: 'omega-3-softgels',
            description: 'High-quality fish oil omega-3 supplement. Supports heart health, brain function, and joint mobility.',
            price: 2800,
            stock: 90,
            category: 'Heart Health',
            images: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=800',
            featured: false,
        },
        {
            name: 'Suma Plus Capsules',
            slug: 'suma-plus-capsules',
            description: 'Complete wellness formula. Combines multiple herbal extracts for optimal health support and energy.',
            price: 3200,
            stock: 70,
            category: 'Wellness',
            images: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&q=80&w=800',
            featured: false,
        },
        {
            name: 'Stethoscope Littmann Classic III',
            slug: 'stethoscope-littmann',
            description: 'Gold standard diagnostic stethoscope. High acoustic sensitivity with tunable diaphragm technology. Perfect for healthcare professionals.',
            price: 12500,
            stock: 15,
            category: 'Diagnostics',
            images: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
            featured: false,
        },
        {
            name: 'Digital Blood Pressure Monitor',
            slug: 'digital-bp-monitor',
            description: 'Automatic upper arm BP monitor with WHO color-coded classification. Large LCD display, memory function for 2 users.',
            price: 3200,
            stock: 40,
            category: 'Diagnostics',
            images: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
            featured: false,
        },
        {
            name: 'Digital Infrared Thermometer',
            slug: 'infrared-thermometer',
            description: 'Non-contact forehead thermometer. 1-second reading with fever alarm. Perfect for family use.',
            price: 1800,
            stock: 100,
            category: 'Diagnostics',
            images: 'https://images.unsplash.com/photo-1585842378054-ee2e82401749?auto=format&fit=crop&q=80&w=800',
            featured: false,
        },
        {
            name: 'Surgical Gloves Nitrile - Box of 100',
            slug: 'surgical-gloves',
            description: 'Premium powder-free nitrile gloves. Textured fingers for superior grip. Latex-free and safe for sensitive skin.',
            price: 850,
            stock: 500,
            category: 'PPE & Safety',
            images: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800',
            featured: false,
        },
        {
            name: 'Disposable Syringes 5ml - Box of 50',
            slug: 'syringes-5ml',
            description: 'Sterile single-use syringes with ultra-sharp needles. Minimal pain injection. Latex-free and individually wrapped.',
            price: 450,
            stock: 2000,
            category: 'Consumables',
            images: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800',
            featured: false,
        },
        {
            name: 'N95 Face Masks - Box of 20',
            slug: 'n95-face-masks',
            description: 'NIOSH approved N95 respirator masks. 95% filtration efficiency against airborne particles. Comfortable fit.',
            price: 1500,
            stock: 300,
            category: 'PPE & Safety',
            images: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=800',
            featured: false,
        },
        {
            name: 'Hand Sanitizer 500ml',
            slug: 'hand-sanitizer',
            description: '70% alcohol hand sanitizer gel. Kills 99.9% of germs. Moisturizing formula, no rinsing needed.',
            price: 350,
            stock: 500,
            category: 'Hygiene',
            images: 'https://images.unsplash.com/photo-1584745702726-d0eeab3bef12?auto=format&fit=crop&q=80&w=800',
            featured: false,
        },
        {
            name: 'IV Drip Stand with Wheels',
            slug: 'iv-stand',
            description: 'Heavy-duty stainless steel IV pole. 5-hook top, adjustable height, smooth-rolling casters. Hospital quality.',
            price: 3500,
            stock: 20,
            category: 'Equipment',
            images: 'https://images.unsplash.com/photo-1516549655169-df83a0929519?auto=format&fit=crop&q=80&w=800',
            featured: false,
        },
    ]

    for (const p of products) {
        await prisma.product.upsert({
            where: { slug: p.slug },
            update: {},
            create: {
                name: p.name,
                slug: p.slug,
                description: p.description,
                price: p.price,
                stock: p.stock || 0,
                category: p.category,
                images: p.images,
                featured: p.featured || false,
            }
        })
    }

    console.log(`Seeded ${products.length} products.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })