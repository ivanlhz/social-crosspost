import { ISocialMediaService } from '@/domain/interfaces/ISocialPost';

interface ThreadsPostResponse {
    success: boolean;
    post?: {
        id: string;
        text: string;
    };
    error?: string;
    details?: string;
}

export class ThreadsService implements ISocialMediaService {
    private apiKey: string;
    private apiSecret: string;

    constructor() {
        this.apiKey = process.env.THREADS_APP_ID || '';
        this.apiSecret = process.env.THREADS_API_SECRET || '';
    }

    async post(content: string): Promise<boolean> {
        try {
            const response = await fetch('/api/threads/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
                credentials: 'include', // Importante: incluir cookies en la solicitud
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Threads API error:', errorData);
                throw new Error(errorData.error || 'Failed to post to Threads');
            }

            const data: ThreadsPostResponse = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error posting to Threads:', error);
            return false;
        }
    }

    async isAuthenticated(): Promise<boolean> {
        try {
            // Verificar si hay cookies de autenticación
            const cookies = document.cookie.split(';');
            const hasAccessToken = cookies.some(cookie =>
                cookie.trim().startsWith('threads_access_token=')
            );
            const hasAccessTokenSecret = cookies.some(cookie =>
                cookie.trim().startsWith('threads_access_token_secret=')
            );

            return hasAccessToken && hasAccessTokenSecret;
        } catch (error) {
            console.error('Error checking Threads authentication:', error);
            return false;
        }
    }

    async authenticate(): Promise<void> {
        try {
            const response = await fetch('/api/auth/threads', {
                credentials: 'include', // Importante: incluir cookies en la solicitud
            });

            if (!response.ok) {
                throw new Error('Failed to initiate Threads authentication');
            }

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No authentication URL received');
            }
        } catch (error) {
            console.error('Error authenticating with Threads:', error);
            throw error;
        }
    }

    // Método para verificar el estado de autenticación desde la URL
    checkAuthCallback(): boolean {
        const urlParams = new URLSearchParams(window.location.search);
        const authStatus = urlParams.get('auth');
        const platform = urlParams.get('platform');
        return authStatus === 'success' && platform === 'threads';
    }
}
