import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Obtener el origen de la solicitud
    const origin = request.headers.get('origin') || '';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

    // Lista de orígenes permitidos
    const allowedOrigins = [
        'http://localhost:3000',
        'https://localhost:3000',
        'https://api.twitter.com',
        'https://www.threads.net',
        appUrl,
        // Permitir URLs de ngrok en desarrollo
        ...(process.env.NODE_ENV === 'development' && origin.includes('ngrok-free.app')
            ? [origin]
            : []
        )
    ].filter((url): url is string => Boolean(url));

    // Verificar si el origen está permitido
    const isAllowedOrigin = allowedOrigins.includes(origin);

    // Usar el origen si está permitido, o el primer origen permitido como fallback
    const corsOrigin = isAllowedOrigin ? origin : (allowedOrigins[0] || 'http://localhost:3000');

    // Configurar los headers de CORS
    const headers = {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
    } as const;

    // Manejar las solicitudes OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 204,
            headers,
        });
    }

    // Para las rutas de callback de Twitter, permitir la redirección sin modificar
    if (request.nextUrl.pathname.startsWith('/api/auth/twitter/callback')) {
        const response = NextResponse.next();
        // Agregar solo los headers CORS necesarios para el callback
        response.headers.set('Access-Control-Allow-Origin', corsOrigin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        return response;
    }

    // Modificar la respuesta para incluir los headers CORS
    const response = NextResponse.next();

    // Agregar los headers CORS a la respuesta
    Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

// Configurar las rutas que deben pasar por el middleware
export const config = {
    matcher: [
        '/api/:path*',
        '/api/auth/twitter/callback'
    ],
};
