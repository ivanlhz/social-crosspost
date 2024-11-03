import { NextResponse } from 'next/server';
import { OAuth } from 'oauth';

const THREADS_APP_ID = process.env.THREADS_APP_ID!;
const THREADS_API_SECRET = process.env.THREADS_API_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CALLBACK_URL = `${APP_URL}/api/auth/threads/callback`;

const oauth = new OAuth(
    'https://www.threads.net/oauth/request_token',
    'https://www.threads.net/oauth/access_token',
    THREADS_APP_ID,
    THREADS_API_SECRET,
    '1.0A',
    CALLBACK_URL,
    'HMAC-SHA1'
);

interface OAuthResponse {
    token: string;
    tokenSecret: string;
    results?: {
        oauth_token: string;
        oauth_token_secret: string;
        oauth_callback_confirmed: 'true' | 'false';
    };
}

interface OAuthError {
    statusCode: number;
    data?: unknown;
}

export async function GET() {
    try {
        const requestTokenPromise = (): Promise<OAuthResponse> => {
            return new Promise((resolve, reject) => {
                oauth.getOAuthRequestToken(
                    (err: Error | OAuthError | null, token?: string, tokenSecret?: string, results?: OAuthResponse['results']) => {
                        if (err || !token || !tokenSecret) {
                            reject(err || new Error('Failed to get request token'));
                            return;
                        }
                        resolve({ token, tokenSecret, results });
                    }
                );
            });
        };

        const { token } = await requestTokenPromise();
        const authUrl = `https://www.threads.net/oauth/authenticate?oauth_token=${token}`;

        return NextResponse.json({ url: authUrl });
    } catch (error) {
        console.error('Error initiating Threads auth:', error);
        return NextResponse.json(
            { error: 'Failed to initiate authentication' },
            { status: 500 }
        );
    }
}
