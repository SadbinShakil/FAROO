import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    const orderNumber = (await params).orderNumber;

    if (!orderNumber) {
        return NextResponse.json({ error: 'Order number is required' }, { status: 400 });
    }

    try {
        const order = await prisma.order.findUnique({
            where: { orderNumber },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    const orderNumber = (await params).orderNumber;
    const body = await request.json();

    try {
        const order = await prisma.order.findUnique({
            where: { orderNumber },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check if order is editable (e.g. within 30 mins)
        const createdAt = new Date(order.createdAt).getTime();
        const now = new Date().getTime();
        const diffInMinutes = (now - createdAt) / 1000 / 60;

        if (diffInMinutes > 30) {
            return NextResponse.json({ error: 'Order modification period has expired' }, { status: 403 });
        }

        if (order.status !== 'pending') {
            return NextResponse.json({ error: 'Order is already processing and cannot be modified' }, { status: 403 });
        }

        // Handle Cancellation
        if (body.action === 'cancel') {
            const updatedOrder = await prisma.order.update({
                where: { orderNumber },
                data: { status: 'cancelled' }
            });
            return NextResponse.json(updatedOrder);
        }

        // Handle Address Update
        if (body.action === 'update_address' && body.shippingAddress) {
            const updatedOrder = await prisma.order.update({
                where: { orderNumber },
                data: {
                    shippingStreet: body.shippingAddress.street,
                    shippingCity: body.shippingAddress.city,
                    shippingState: body.shippingAddress.state,
                    shippingPincode: body.shippingAddress.pincode,
                }
            });
            return NextResponse.json(updatedOrder);
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
