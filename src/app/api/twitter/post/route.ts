import { NextRequest, NextResponse } from 'next/server';
import { OAuth } from 'oauth';

const TWITTER_API_KEY = process.env.TWITTER_API_KEY!;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET!;

interface TwitterResponse {
    data: {
        id: string;
        text: string;
    };
}

interface OAuthError {
    statusCode: number;
    data?: unknown;
}

const oauth = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    TWITTER_API_KEY,
    TWITTER_API_SECRET,
    '1.0A',
    null,
    'HMAC-SHA1'
);

export async function POST(request: NextRequest) {
    try {
        const accessToken = request.cookies.get('twitter_access_token')?.value;
        const accessTokenSecret = request.cookies.get('twitter_access_token_secret')?.value;

        if (!accessToken || !accessTokenSecret) {
            return NextResponse.json(
                { error: 'Not authenticated with Twitter' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json(
                { error: 'Content is required' },
                { status: 400 }
            );
        }

        const postTweetPromise = (): Promise<TwitterResponse> => {
            return new Promise((resolve, reject) => {
                const tweetData = JSON.stringify({ text: content });
                const headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(tweetData).toString()
                };

                oauth.post(
                    'https://api.twitter.com/2/tweets',
                    accessToken,
                    accessTokenSecret,
                    tweetData,
                    headers['Content-Type'],
                    (error: Error | OAuthError | null, result?: string | Buffer) => {
                        if (error) {
                            console.error('Twitter API Error:', error);
                            reject(error);
                            return;
                        }

                        if (!result) {
                            reject(new Error('No response from Twitter'));
                            return;
                        }

                        try {
                            const data = typeof result === 'string' ? result : result.toString('utf-8');
                            const response = JSON.parse(data) as TwitterResponse;
                            resolve(response);
                        } catch (parseError) {
                            console.error('Parse error:', parseError);
                            reject(new Error('Failed to parse Twitter response'));
                        }
                    }
                );
            });
        };

        const response = await postTweetPromise();
        return NextResponse.json({
            success: true,
            tweet: response.data
        });
    } catch (error) {
        console.error('Error posting to Twitter:', error);

        const errorMessage = error instanceof Error
            ? error.message
            : typeof error === 'object' && error !== null
                ? JSON.stringify(error)
                : 'An unexpected error occurred';

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to post tweet',
                details: errorMessage
            },
            { status: 500 }
        );
    }
}
