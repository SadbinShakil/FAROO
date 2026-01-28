import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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

        // ADMIN ACTION: Update Status & Fulfillment
        if ((body.status || body.trackingNumber || body.courierName) && !body.action) {
            const updatedOrder = await prisma.order.update({
                where: { orderNumber },
                data: {
                    status: body.status || undefined,
                    trackingNumber: body.trackingNumber,
                    courierName: body.courierName,
                    // If moving to delivered, we might want to update payment status too for COD
                    paymentStatus: body.status === 'delivered' ? 'paid' : undefined
                } as any
            });

            // Send Shipping Email Update if applicable
            if (body.status === 'shipped' || (body.trackingNumber && order.status === 'shipped')) {
                try {
                    const { sendShippingUpdateEmail } = await import('@/lib/email');
                    await sendShippingUpdateEmail({
                        orderNumber: (updatedOrder as any).orderNumber,
                        customerName: (updatedOrder as any).customerName,
                        customerEmail: (updatedOrder as any).customerEmail,
                        total: (updatedOrder as any).total,
                        status: (updatedOrder as any).status,
                        trackingNumber: (updatedOrder as any).trackingNumber || undefined,
                        courierName: (updatedOrder as any).courierName || undefined
                    });
                } catch (emailError) {
                    console.error('Failed to send shipping update email:', emailError);
                }
            }

            return NextResponse.json(updatedOrder);
        }

        // CUSTOMER ACTIONS: Subject to 30-minute rule
        const createdAt = new Date(order.createdAt).getTime();
        const now = new Date().getTime();
        const diffInMinutes = (now - createdAt) / 1000 / 60;

        if (diffInMinutes > 1440 && process.env.NODE_ENV === 'production') { // Example: 24h for some leeway, but keep logic
            // Keep original 30 min logic for the user-facing part if you want
        }

        // Re-implementing the 30-min check for actions like 'cancel' or 'update_address'
        if (body.action) {
            if (diffInMinutes > 30) {
                return NextResponse.json({ error: 'Order modification period has expired' }, { status: 403 });
            }
            if (order.status !== 'pending') {
                return NextResponse.json({ error: 'Order is already processing' }, { status: 403 });
            }
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
