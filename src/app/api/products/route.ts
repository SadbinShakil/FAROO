import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const section = searchParams.get('section');
        const featured = searchParams.get('featured');

        let whereClause: any = {};

        if (category) {
            whereClause.category = category;
        }

        if (section) {
            whereClause.section = section;
        }

        const products = await prisma.product.findMany({
            where: whereClause,
            take: featured === 'true' ? 4 : undefined,
            orderBy: { createdAt: 'desc' }
        });

        // Parse JSON fields
        const parsedProducts = products.map((p: any) => ({
            ...p,
            sizes: JSON.parse(p.sizes || '[]'),
            colors: JSON.parse(p.colors || '[]')
        }));

        return NextResponse.json(parsedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.price) {
            return NextResponse.json({ error: 'Title and Price are required' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                title: body.title,
                price: parseFloat(body.price),
                category: body.category || 'General',
                section: body.section || 'women', // Default to women if not specified
                subcategory: body.subcategory || 'General',
                image: body.image || '/products/women-tunic-1.jpg', // Default placeholder
                description: body.description,
                sizes: JSON.stringify(body.sizes || []),
                colors: JSON.stringify(body.colors || []),
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
