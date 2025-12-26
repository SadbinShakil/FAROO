import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: true
            }
        });

        // Transform for frontend interface
        const transformedOrders = orders.map((order: any) => ({
            ...order,
            shippingAddress: {
                street: order.shippingStreet,
                city: order.shippingCity,
                state: order.shippingState,
                pincode: order.shippingPincode,
                country: order.shippingCountry
            }
        }));

        return NextResponse.json(transformedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.items || body.items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }
        if (!body.shippingAddress) {
            return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
        }

        // Generate Order Number
        const count = await prisma.order.count();
        const orderNumber = `ORD-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        // Calculate totals
        const subtotal = body.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const shipping = 100; // Flat rate for now
        const total = subtotal + shipping;

        const order = await prisma.order.create({
            data: {
                orderNumber,
                customerName: body.customerName,
                customerEmail: body.customerEmail,
                customerPhone: body.customerPhone,
                subtotal,
                discount: 0,
                shipping,
                total,
                status: 'pending',
                paymentStatus: 'pending',
                paymentMethod: body.paymentMethod || 'cod',
                notes: body.notes,
                shippingStreet: body.shippingAddress.street,
                shippingCity: body.shippingAddress.city,
                shippingState: body.shippingAddress.state,
                shippingPincode: body.shippingAddress.pincode,
                shippingCountry: body.shippingAddress.country || 'Bangladesh',
                items: {
                    create: body.items.map((item: any) => ({
                        productId: item.productId,
                        productTitle: item.productTitle,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size
                    }))
                }
            },
            include: {
                items: true
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
