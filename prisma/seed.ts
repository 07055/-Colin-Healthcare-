import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

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

    // Load real products from data/products.json
    const productsPath = path.join(__dirname, '..', 'data', 'products.json')
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))

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