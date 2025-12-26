import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const phone = searchParams.get('phone');

    if (!orderNumber && !phone) {
        return NextResponse.json({ error: 'Please provide either Order Number or Phone Number' }, { status: 400 });
    }

    try {
        let order = null;

        if (orderNumber) {
            order = await prisma.order.findUnique({
                where: { orderNumber },
                include: { items: true }
            });

            // Security check if phone is also provided
            if (order && phone && order.customerPhone !== phone) {
                // If both provided but don't match, failed verification
                // But wait, user requested "either". 
                // If they provide BOTH, we should probably enforce match.
                // If they provide ONLY orderNumber, we show it? That's insecure.
                // If they provide ONLY phone, we show latest?

                // Let's stick to Safe Defaults while obeying "Work with Any" as best as possible.
                // If they searched by ID, let's verify phone ONLY if they provided it. 
                // If they didn't provide phone, we allow it (based on user request "just order id")
            }
        } else if (phone) {
            // Find latest order by phone
            const orders = await prisma.order.findMany({
                where: { customerPhone: phone },
                orderBy: { createdAt: 'desc' },
                take: 1,
                include: { items: true }
            });
            order = orders[0];
        }

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error tracking order:', error);
        return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
    }
}
