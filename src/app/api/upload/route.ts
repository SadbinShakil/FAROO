import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename) {
            return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
        }

        if (!request.body) {
            return NextResponse.json({ error: 'No file body received' }, { status: 400 });
        }

        // Direct blob upload is more efficient on Vercel
        const blob = await put(filename, request.body, {
            access: 'public',
        });

        return NextResponse.json({
            success: true,
            url: blob.url
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Error uploading file.' },
            { status: 500 }
        );
    }
}
