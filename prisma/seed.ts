import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return `${salt}:${hash}`
}

async function main() {
    console.log('Seeding database...')

    // Create Admin User
    await prisma.user.upsert({
        where: { email: 'admin@ssm.co.ke' },
        update: {},
        create: {
            email: 'admin@ssm.co.ke',
            name: 'SSM Admin',
            phone: '0796388790',
            password: hashPassword('admin123'),
            role: 'ADMIN',
        }
    })

    const products = [
        {
            name: 'Littmann Classic III Stethoscope',
            slug: 'littmann-stethoscope',
            description: 'Gold standard in auscultation. High acoustic sensitivity with tunable diaphragm technology.',
            price: 12500,
            stock: 25,
            category: 'Diagnostics',
            images: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Disposable Syringes 5ml (Box of 50)',
            slug: 'syringes-5ml',
            description: 'Sterile, single-use syringes with ultra-sharp needles for minimal pain. Latex-free.',
            price: 450,
            stock: 2000,
            category: 'Consumables',
            images: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Digital Blood Pressure Monitor',
            slug: 'digital-bp-monitor',
            description: 'Automatic upper arm BP monitor with WHO color-coded classification and large LCD display.',
            price: 3200,
            stock: 40,
            category: 'Diagnostics',
            images: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Surgical Gloves Nitrile (Box of 100)',
            slug: 'surgical-gloves',
            description: 'Powder-free, textured fingers for superior grip. Safe for latex-sensitive users.',
            price: 850,
            stock: 500,
            category: 'PPE & Safety',
            images: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Stainless Steel Scalpel Set',
            slug: 'scalpel-set',
            description: 'Professional surgical scalpel with ergonomic handle and high-carbon steel blades.',
            price: 2500,
            stock: 15,
            category: 'Instruments',
            images: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Hospital Bedside Commode',
            slug: 'bedside-commode',
            description: 'Adjustable height, foldable frame with splash guard and easy-clean bucket.',
            price: 4500,
            stock: 10,
            category: 'Patient Care',
            images: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Digital Infrared Thermometer',
            slug: 'infrared-thermometer',
            description: 'Non-contact forehead thermometer with 1-second reading and fever alarm.',
            price: 1800,
            stock: 100,
            category: 'Diagnostics',
            images: 'https://images.unsplash.com/photo-1585842378054-ee2e82401749?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'IV Drip Stand with Wheels',
            slug: 'iv-stand',
            description: 'Heavy-duty stainless steel pole with 5-hook top and adjustable height.',
            price: 3500,
            stock: 20,
            category: 'Equipment',
            images: 'https://images.unsplash.com/photo-1516549655169-df83a0929519?auto=format&fit=crop&q=80&w=800',
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
                stock: p.stock,
                category: p.category,
                images: p.images,
                featured: true,
            }
        })
    }

    console.log(`Seeded ${products.length} hospital products.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
