import { prisma } from '@/lib/prisma';
import ShopClient from './ShopClient';
import { Suspense } from 'react';

// Force dynamic rendering so new products appear immediately
export const dynamic = 'force-dynamic';

export default async function ShopPage() {
    const dbProducts = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const products = dbProducts.map((p: any) => ({
        ...p,
        sizes: JSON.parse(p.sizes || '[]'),
        colors: JSON.parse(p.colors || '[]')
    }));

    return (
        <Suspense fallback={<div>Loading shop...</div>}>
            <ShopClient initialProducts={products} />
        </Suspense>
    );
}
