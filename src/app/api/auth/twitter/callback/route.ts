import { NextRequest, NextResponse } from 'next/server';
import { OAuth } from 'oauth';

const TWITTER_API_KEY = process.env.TWITTER_API_KEY!;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const oauth = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    TWITTER_API_KEY,
    TWITTER_API_SECRET,
    '1.0A',
    `${APP_URL}/api/auth/twitter/callback`,
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

        // Crear respuesta con cookies
        const response = NextResponse.redirect(redirectUrl);

        // Establecer cookies seguras
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            maxAge: 60 * 60 * 24 * 7, // 1 semana
            path: '/',
            // Permitir que las cookies sean accesibles en el dominio de ngrok en desarrollo
            domain: process.env.NODE_ENV === 'development' && origin.includes('ngrok-free.app')
                ? '.ngrok-free.app'
                : undefined
        };

        response.cookies.set('twitter_access_token', accessToken, cookieOptions);
        response.cookies.set('twitter_access_token_secret', accessTokenSecret, cookieOptions);

        return response;
    } catch (error) {
        console.error('Error in Twitter callback:', error);

        // Determinar la URL base para la redirección de error
        const origin = request.headers.get('origin') || APP_URL;
        const redirectUrl = new URL('/', origin);
        redirectUrl.searchParams.set('auth', 'error');

        return NextResponse.redirect(redirectUrl);
    }
}
