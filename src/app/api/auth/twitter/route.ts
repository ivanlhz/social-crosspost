import { NextResponse } from 'next/server';
import { OAuth } from 'oauth';

interface RequestTokenResponse {
    token: string;
    tokenSecret: string;
    results: {
        oauth_token: string;
        oauth_token_secret: string;
        oauth_callback_confirmed: 'true' | 'false';
    };
}

// Tipo específico que coincide con el error de la librería OAuth
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

export async function GET() {
    try {
        const requestTokenPromise = (): Promise<RequestTokenResponse> => {
            return new Promise((resolve, reject) => {
                oauth.getOAuthRequestToken((
                    err: OAuthError | null,
                    oauth_token: string,
                    oauth_token_secret: string,
                    results?: { oauth_callback_confirmed: 'true' | 'false' }
                ) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            token: oauth_token,
                            tokenSecret: oauth_token_secret,
                            results: {
                                oauth_token,
                                oauth_token_secret,
                                oauth_callback_confirmed: results?.oauth_callback_confirmed || 'false'
                            }
                        });
                    }
                });
            });
        };

        const { token } = await requestTokenPromise();
        const authUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${token}`;

        return NextResponse.json({ url: authUrl });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error initiating Twitter auth:', error.message);
        }
        return NextResponse.json({ error: 'Failed to initiate authentication' }, { status: 500 });
    }
}