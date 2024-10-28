import { NextResponse } from 'next/server';
import { OAuth } from 'oauth';

// Definimos el tipo de error de OAuth
type OAuthError = Error | {
    statusCode: number;
    data?: unknown;
    message?: string;
    name?: string;
}

const TWITTER_API_KEY = process.env.TWITTER_API_KEY!;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET!;
const CALLBACK_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`;

const oauth = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    TWITTER_API_KEY,
    TWITTER_API_SECRET,
    '1.0A',
    CALLBACK_URL,
    'HMAC-SHA1'
);

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const oauthToken = url.searchParams.get('oauth_token');
        const oauthVerifier = url.searchParams.get('oauth_verifier');

        if (!oauthToken || !oauthVerifier) {
            throw new Error('Missing oauth parameters');
        }

        const accessTokenPromise = (): Promise<{ accessToken: string; accessTokenSecret: string }> => {
            return new Promise((resolve, reject) => {
                oauth.getOAuthAccessToken(
                    oauthToken,
                    '',
                    oauthVerifier,
                    (err: OAuthError | null, accessToken: string, accessTokenSecret: string) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ accessToken, accessTokenSecret });
                        }
                    }
                );
            });
        };

        const { accessToken, accessTokenSecret } = await accessTokenPromise();

        // En una aplicación real, aquí guardarías los tokens en una base de datos
        // y establecerías una sesión para el usuario

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?auth=success`);
    } catch (error) {
        console.error('Error in Twitter callback:', error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?auth=error`);
    }
}