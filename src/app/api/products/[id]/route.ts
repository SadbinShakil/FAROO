import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const body = await request.json();

        const product = await prisma.product.update({
            where: { id },
            data: {
                sku: body.sku,
                title: body.title,
                price: body.price ? parseFloat(body.price) : undefined,
                category: body.category,
                section: body.section,
                subcategory: body.subcategory,
                image: body.image,
                description: body.description,
                sizes: body.sizes ? JSON.stringify(body.sizes) : undefined,
                colors: body.colors ? JSON.stringify(body.colors) : undefined,
                images: body.images ? JSON.stringify(body.images) : undefined,
                stock: body.stock !== undefined ? parseInt(body.stock.toString()) : undefined,
            } as any
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
