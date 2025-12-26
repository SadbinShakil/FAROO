import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { error: 'No file received.' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + '-' + file.name.replaceAll(' ', '_');

        // Ensure path exists - we created it with mkdir -p public/uploads
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        // If we strictly wanted to be safe we'd check/mkdir here too, but we did it in CLI

        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Error uploading file.' },
            { status: 500 }
        );
    }
}
