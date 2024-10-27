export interface ISocialPost {
    content: string;
    platforms: SocialPlatform[];
}

export enum SocialPlatform {
    TWITTER = 'TWITTER',
    THREADS = 'THREADS'
}

export interface ISocialMediaService {
    post(content: string): Promise<boolean>;
    isAuthenticated(): Promise<boolean>;
    authenticate(): Promise<void>;
}
