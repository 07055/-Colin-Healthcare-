import { prisma } from './src/lib/prisma'

async function verify() {
    const name = "Hand-Knotted Wool Rug"
    const slug = "hand-knotted-wool-rug"
    const description = "A luxurious, minimalist hand-knotted wool rug in natural cream."
    const price = 1200
    const stock = 2
    const category = "Textiles"
    const images = "https://images.unsplash.com/photo-1543333309-844b95699428"

    try {
        // Clean up previous test if exists
        await prisma.product.deleteMany({ where: { slug } })

        const product = await prisma.product.create({
            data: { name, slug, description, price, stock, category, images }
        })
        console.log('Successfully created product:', product.name)

        const found = await prisma.product.findUnique({ where: { slug } })
        if (found) {
            console.log('Verification: Product found in DB.')
        } else {
            console.log('Verification failed: Product NOT found in DB.')
        }
    } catch (e) {
        console.error('Verification error:', e)
    }
}

verify()
