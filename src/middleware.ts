import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const adminAuth = request.cookies.get('admin_session');
    const { pathname } = request.nextUrl;

    // Protect admin routes
    if (pathname.startsWith('/admin') && pathname !== '/admin') {
        if (!adminAuth || adminAuth.value !== 'true') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    // Protect sensitive API routes
    // Allow POST /api/orders (placement) and GET /api/orders/track (customer tracking)
    const isPublicOrderApi = (pathname === '/api/orders' && request.method === 'POST') ||
        (pathname.startsWith('/api/orders/track'));

    if (pathname.startsWith('/api/admin') || (pathname.startsWith('/api/orders') && !isPublicOrderApi)) {
        if (!adminAuth || adminAuth.value !== 'true') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*', '/api/orders/:path*'],
};
