import { NextRequest, NextResponse } from 'next/server';

const THREADS_APP_ID = process.env.THREADS_APP_ID!;
const THREADS_APP_SECRET = process.env.THREADS_API_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CALLBACK_URL = `${APP_URL}/api/auth/threads/callback`;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const error_reason = searchParams.get('error_reason');
        const error_description = searchParams.get('error_description');

        // Handle authorization denial
        if (error || error_reason || error_description) {
            console.error('Authorization denied:', { error, error_reason, error_description });
            const origin = request.headers.get('origin') || APP_URL;
            const redirectUrl = new URL('/', origin);
            redirectUrl.searchParams.set('auth', 'error');
            redirectUrl.searchParams.set('platform', 'threads');
            return NextResponse.redirect(redirectUrl);
        }

        if (!code) {
            throw new Error('No authorization code received');
        }

        // Exchange code for access token
        const tokenResponse = await fetch('https://graph.threads.net/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: THREADS_APP_ID,
                client_secret: THREADS_APP_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: CALLBACK_URL,
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json();

        // Determinar la URL base para la redirección
        const origin = request.headers.get('origin') || APP_URL;
        const redirectUrl = new URL('/', origin);
        redirectUrl.searchParams.set('auth', 'success');
        redirectUrl.searchParams.set('platform', 'threads');

        // Crear respuesta con cookies
        const response = NextResponse.redirect(redirectUrl);

        // Establecer cookies seguras
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
            domain: process.env.NODE_ENV === 'development' && origin.includes('ngrok-free.app')
                ? '.ngrok-free.app'
                : undefined
        };

        response.cookies.set('threads_access_token', tokenData.access_token, cookieOptions);
        response.cookies.set('threads_user_id', tokenData.user_id.toString(), cookieOptions);

        return response;
    } catch (error) {
        console.error('Error in Threads callback:', error);
        const origin = request.headers.get('origin') || APP_URL;
        const redirectUrl = new URL('/', origin);
        redirectUrl.searchParams.set('auth', 'error');
        redirectUrl.searchParams.set('platform', 'threads');

        return NextResponse.redirect(redirectUrl);
    }
}
