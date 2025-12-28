import { PrismaClient } from '@prisma/client'
import { PRODUCTS } from '../src/data/products'
import { ORDERS } from '../src/data/orders'
import { DISCOUNTS } from '../src/data/discounts'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Seed Products
    for (const product of PRODUCTS) {
        await prisma.product.upsert({
            where: { id: product.id },
            update: {
                title: product.title,
                price: product.price,
                category: product.category,
                section: product.section,
                subcategory: product.subcategory,
                image: product.image,
                description: product.description,
                sizes: JSON.stringify(product.sizes || []),
                colors: JSON.stringify(product.colors || []),
            },
            create: {
                id: product.id,
                title: product.title,
                price: product.price,
                category: product.category,
                section: product.section,
                subcategory: product.subcategory,
                image: product.image,
                description: product.description,
                sizes: JSON.stringify(product.sizes || []),
                colors: JSON.stringify(product.colors || []),
            }
        })
    }

    // Seed Discounts
    for (const discount of DISCOUNTS) {
        await prisma.discount.upsert({
            where: { code: discount.code },
            update: {},
            create: {
                id: discount.id,
                code: discount.code,
                type: discount.type,
                value: discount.value,
                description: discount.description,
                validFrom: discount.validFrom,
                validUntil: discount.validUntil,
                minPurchase: discount.minPurchase,
                maxDiscount: discount.maxDiscount,
                active: discount.active,
                usageCount: discount.usageCount,
                maxUsage: discount.maxUsage,
            }
        })
    }

    // Seed Orders
    for (const order of ORDERS) {
        // We need to ensure products exist before creating orders with relations
        // Since we seeded products above, it should be fine.

        // Check if order exists
        const exists = await prisma.order.findUnique({ where: { orderNumber: order.orderNumber } })
        if (exists) continue

        await prisma.order.create({
            data: {
                id: order.id,
                orderNumber: order.orderNumber,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                customerPhone: order.customerPhone,
                subtotal: order.subtotal,
                discount: order.discount,
                discountCode: order.discountCode,
                shipping: order.shipping,
                total: order.total,
                status: order.status,
                paymentStatus: order.paymentStatus,
                paymentMethod: order.paymentMethod,
                shippingStreet: order.shippingAddress.street,
                shippingCity: order.shippingAddress.city,
                shippingState: order.shippingAddress.state,
                shippingPincode: order.shippingAddress.pincode,
                shippingCountry: order.shippingAddress.country,
                notes: order.notes,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                items: {
                    create: order.items.map(item => ({
                        // We use connect to link to existing products
                        product: { connect: { id: item.productId } },
                        productTitle: item.productTitle,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size,
                        color: item.color
                    }))
                }
            }
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
