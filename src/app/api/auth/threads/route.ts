import { NextResponse } from 'next/server';

const THREADS_APP_ID = process.env.THREADS_APP_ID!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CALLBACK_URL = `${APP_URL}/api/auth/threads/callback`;

export async function GET() {
    try {
        const authUrl = `https://threads.net/oauth/authorize?` +
            `client_id=${THREADS_APP_ID}` +
            `&redirect_uri=${encodeURIComponent(CALLBACK_URL)}` +
            `&scope=threads_basic,threads_content_publish` +
            `&response_type=code` +
            `&state=${Math.random().toString(36).substring(7)}`; // Random state for CSRF protection

        return NextResponse.json({ url: authUrl });
    } catch (error) {
        console.error('Error initiating Threads auth:', error);
        return NextResponse.json(
            { error: 'Failed to initiate authentication' },
            { status: 500 }
        );
    }
}
