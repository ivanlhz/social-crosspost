import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ThreadsResponse {
    id: string;
}

export async function POST(request: NextRequest) {
    try {
        const accessToken = request.cookies.get('threads_access_token')?.value;
        const userId = request.cookies.get('threads_user_id')?.value;

        if (!accessToken || !userId) {
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

        // Post to Threads using the Graph API
        const response = await fetch(`https://graph.threads.net/${userId}/threads`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: content,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Threads API Error:', errorData);
            throw new Error(errorData.error?.message || 'Failed to post to Threads');
        }

        const data: ThreadsResponse = await response.json();

        return NextResponse.json({
            success: true,
            post: {
                id: data.id,
                text: content
            }
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
