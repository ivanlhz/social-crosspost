import { ISocialMediaService } from '@/domain/interfaces/ISocialPost';

interface TwitterPostResponse {
    success: boolean;
    tweet?: {
        id: string;
        text: string;
    };
    error?: string;
    details?: string;
}

export class TwitterService implements ISocialMediaService {
    private apiKey: string;
    private apiSecret: string;

    constructor() {
        this.apiKey = process.env.TWITTER_API_KEY || '';
        this.apiSecret = process.env.TWITTER_API_SECRET || '';
    }

    async post(content: string): Promise<boolean> {
        try {
            const response = await fetch('/api/twitter/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
                credentials: 'include', // Importante: incluir cookies en la solicitud
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Twitter API error:', errorData);
                throw new Error(errorData.error || 'Failed to post to Twitter');
            }

            const data: TwitterPostResponse = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error posting to Twitter:', error);
            return false;
        }
    }

    async isAuthenticated(): Promise<boolean> {
        try {
            // Verificar si hay cookies de autenticación
            const cookies = document.cookie.split(';');
            const hasAccessToken = cookies.some(cookie =>
                cookie.trim().startsWith('twitter_access_token=')
            );
            const hasAccessTokenSecret = cookies.some(cookie =>
                cookie.trim().startsWith('twitter_access_token_secret=')
            );

            return hasAccessToken && hasAccessTokenSecret;
        } catch (error) {
            console.error('Error checking Twitter authentication:', error);
            return false;
        }
    }

    async authenticate(): Promise<void> {
        try {
            const response = await fetch('/api/auth/twitter', {
                credentials: 'include', // Importante: incluir cookies en la solicitud
            });

            if (!response.ok) {
                throw new Error('Failed to initiate Twitter authentication');
            }

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No authentication URL received');
            }
        } catch (error) {
            console.error('Error authenticating with Twitter:', error);
            throw error;
        }
    }

    // Método para verificar el estado de autenticación desde la URL
    checkAuthCallback(): boolean {
        const urlParams = new URLSearchParams(window.location.search);
        const authStatus = urlParams.get('auth');
        return authStatus === 'success';
    }
}
