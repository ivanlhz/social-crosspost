import { NextRequest, NextResponse } from 'next/server';
import { OAuth } from 'oauth';

const THREADS_APP_ID = process.env.THREADS_APP_ID!;
const THREADS_API_SECRET = process.env.THREADS_API_SECRET!;

interface ThreadsResponse {
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
    'https://www.threads.net/oauth/request_token',
    'https://www.threads.net/oauth/access_token',
    THREADS_APP_ID,
    THREADS_API_SECRET,
    '1.0A',
    null,
    'HMAC-SHA1'
);

export async function POST(request: NextRequest) {
    try {
        const accessToken = request.cookies.get('threads_access_token')?.value;
        const accessTokenSecret = request.cookies.get('threads_access_token_secret')?.value;

        if (!accessToken || !accessTokenSecret) {
            return NextResponse.json(
                { error: 'Not authenticated with Threads' },
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

        const postThreadPromise = (): Promise<ThreadsResponse> => {
            return new Promise((resolve, reject) => {
                const threadData = JSON.stringify({ text: content });
                const headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(threadData).toString()
                };

                oauth.post(
                    'https://www.threads.net/api/v1/text',
                    accessToken,
                    accessTokenSecret,
                    threadData,
                    headers['Content-Type'],
                    (error: Error | OAuthError | null, result?: string | Buffer) => {
                        if (error) {
                            console.error('Threads API Error:', error);
                            reject(error);
                            return;
                        }

                        if (!result) {
                            reject(new Error('No response from Threads'));
                            return;
                        }

                        try {
                            const data = typeof result === 'string' ? result : result.toString('utf-8');
                            const response = JSON.parse(data) as ThreadsResponse;
                            resolve(response);
                        } catch {
                            reject(new Error('Failed to parse Threads response'));
                        }
                    }
                );
            });
        };

        const response = await postThreadPromise();
        return NextResponse.json({
            success: true,
            post: response.data
        });
    } catch (error) {
        console.error('Error posting to Threads:', error);

        const errorMessage = error instanceof Error
            ? error.message
            : typeof error === 'object' && error !== null
                ? JSON.stringify(error)
                : 'An unexpected error occurred';

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to post to Threads',
                details: errorMessage
            },
            { status: 500 }
        );
    }
}
