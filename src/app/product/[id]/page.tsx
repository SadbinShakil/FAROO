import { prisma } from '@/lib/prisma';
import ProductDetailsClient from './ProductDetailsClient';
import Link from 'next/link';
import styles from './page.module.css';

import { Metadata } from 'next';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const id = (await params).id;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        return { title: 'Product Not Found | Faroo' };
    }

    return {
        title: `${product.title} | Faroo`,
        description: product.description?.slice(0, 160) || `Buy ${product.title} at Faroo. Premium fashion for everyone.`,
        openGraph: {
            title: product.title,
            description: product.description || undefined,
            images: [product.image],
        },
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    // Fetch product
    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product) {
        return (
            <div className={styles.productPage}>
                <div className={styles.container}>
                    <h1>Product not found</h1>
                    <Link href="/shop">Return to shop</Link>
                </div>
            </div>
        );
    }

    // Parse product fields
    const parsedProduct = {
        ...product,
        sizes: JSON.parse(product.sizes || '[]'),
        colors: JSON.parse(product.colors || '[]'),
        images: JSON.parse(product.images || '[]')
    };

    // Fetch related products
    const relatedDbProducts = await prisma.product.findMany({
        where: {
            subcategory: product.subcategory,
            id: { not: product.id }
        },
        take: 4
    });

    const parsedRelatedProducts = relatedDbProducts.map((p: any) => ({
        ...p,
        sizes: JSON.parse(p.sizes || '[]'),
        colors: JSON.parse(p.colors || '[]'),
        images: JSON.parse(p.images || '[]')
    }));

    return (
        <ProductDetailsClient
            product={parsedProduct}
            relatedProducts={parsedRelatedProducts}
        />
    );
}
