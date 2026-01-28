import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { code, cartTotal } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
        }

        const discount = await prisma.discount.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!discount || !discount.active) {
            return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 400 });
        }

        const now = new Date();
        if (now < discount.validFrom || now > discount.validUntil) {
            return NextResponse.json({ error: 'Promo code is not currently valid' }, { status: 400 });
        }

        if (discount.maxUsage && discount.usageCount >= discount.maxUsage) {
            return NextResponse.json({ error: 'Promo code usage limit reached' }, { status: 400 });
        }

        if (discount.minPurchase && cartTotal < discount.minPurchase) {
            return NextResponse.json({ error: `Minimum purchase of ৳${discount.minPurchase} required` }, { status: 400 });
        }

        // Calculate discount amount
        let discountAmount = 0;
        if (discount.type === 'percentage') {
            discountAmount = (cartTotal * discount.value) / 100;
            if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
                discountAmount = discount.maxDiscount;
            }
        } else {
            discountAmount = discount.value;
        }

        return NextResponse.json({
            success: true,
            code: discount.code,
            amount: discountAmount,
            type: discount.type,
            value: discount.value
        });

    } catch (error) {
        console.error('Discount validation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
