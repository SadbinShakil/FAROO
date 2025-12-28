import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        // Try to get file from FormData first (more robust)
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file received in FormData' }, { status: 400 });
        }

        // Direct blob upload
        const blob = await put(file.name, file, {
            access: 'public',
        });

        return NextResponse.json({
            success: true,
            url: blob.url
        });
    } catch (error: any) {
        console.error('Upload error details:', error);

        // Handle specific error for missing token
        const errorMessage = error.message || 'Error uploading file.';
        const isTokenMissing = errorMessage.includes('BLOB_READ_WRITE_TOKEN');

        return NextResponse.json(
            {
                error: isTokenMissing
                    ? 'Vercel Blob token is missing. Please add BLOB_READ_WRITE_TOKEN to your .env file.'
                    : errorMessage
            },
            { status: 500 }
        );
    }
}
