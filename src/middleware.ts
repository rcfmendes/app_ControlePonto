import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_key');

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    const isPublicPath = pathname === '/login' || pathname === '/api/auth/login';

    if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
        return NextResponse.next();
    }

    if (isPublicPath) {
        if (token) {
            try {
                await jwtVerify(token, JWT_SECRET);
                return NextResponse.redirect(new URL('/', request.url));
            } catch (error) { }
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.next();
    } catch (error) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth_token');
        return response;
    }
}

export const config = {
    matcher: ['/((?!api/auth/login|_next/static|_next/image|favicon.ico).*)'],
};
