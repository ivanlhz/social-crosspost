import { NextRequest, NextResponse } from 'next/server';
import { OAuth } from 'oauth';

const THREADS_APP_ID = process.env.THREADS_APP_ID!;
const THREADS_API_SECRET = process.env.THREADS_API_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const oauth = new OAuth(
    'https://www.threads.net/oauth/request_token',
    'https://www.threads.net/oauth/access_token',
    THREADS_APP_ID,
    THREADS_API_SECRET,
    '1.0A',
    `${APP_URL}/api/auth/threads/callback`,
    'HMAC-SHA1'
);

interface AccessTokenResponse {
    accessToken: string;
    accessTokenSecret: string;
}

interface OAuthError {
    statusCode: number;
    data?: unknown;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const oauthToken = searchParams.get('oauth_token');
        const oauthVerifier = searchParams.get('oauth_verifier');

        if (!oauthToken || !oauthVerifier) {
            throw new Error('Missing oauth parameters');
        }

        const accessTokenPromise = (): Promise<AccessTokenResponse> => {
            return new Promise((resolve, reject) => {
                oauth.getOAuthAccessToken(
                    oauthToken,
                    '',
                    oauthVerifier,
                    (error: Error | OAuthError | null, accessToken?: string, accessTokenSecret?: string) => {
                        if (error || !accessToken || !accessTokenSecret) {
                            reject(error || new Error('Failed to get access token'));
                        } else {
                            resolve({ accessToken, accessTokenSecret });
                        }
                    }
                );
            });
        };

        const { accessToken, accessTokenSecret } = await accessTokenPromise();

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
            maxAge: 60 * 60 * 24 * 7, // 1 semana
            path: '/',
            domain: process.env.NODE_ENV === 'development' && origin.includes('ngrok-free.app')
                ? '.ngrok-free.app'
                : undefined
        };

        response.cookies.set('threads_access_token', accessToken, cookieOptions);
        response.cookies.set('threads_access_token_secret', accessTokenSecret, cookieOptions);

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
