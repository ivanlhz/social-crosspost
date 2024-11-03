'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { SocialPlatform } from '@/domain/interfaces/ISocialPost';
import { TwitterService } from '@/infrastructure/services/TwitterService';
import { ThreadsService } from '@/infrastructure/services/ThreadsService';
import { TwitterAuthButton } from './TwitterAuthButton';
import { ThreadsAuthButton } from './ThreadsAuthButton';
import { useLanguage } from '@/presentation/context/LanguageContext';

export function SocialPostForm() {
    const { messages } = useLanguage();
    const [content, setContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [isTwitterAuthenticated, setIsTwitterAuthenticated] = useState(false);
    const [isThreadsAuthenticated, setIsThreadsAuthenticated] = useState(false);
    const [selectedPlatforms, setSelectedPlatforms] = useState<Set<SocialPlatform>>(
        new Set([SocialPlatform.TWITTER, SocialPlatform.THREADS])
    );

    const twitterService = new TwitterService();
    const threadsService = new ThreadsService();

    useEffect(() => {
        const checkAuth = async () => {
            const isTwitterAuth = await twitterService.isAuthenticated();
            const isThreadsAuth = await threadsService.isAuthenticated();

            setIsTwitterAuthenticated(isTwitterAuth);
            setIsThreadsAuthenticated(isThreadsAuth);

            if (twitterService.checkAuthCallback()) {
                setIsTwitterAuthenticated(true);
            }
            if (threadsService.checkAuthCallback()) {
                setIsThreadsAuthenticated(true);
            }
        };

        checkAuth();
    }, []);

    const togglePlatform = (platform: SocialPlatform) => {
        const newPlatforms = new Set(selectedPlatforms);
        if (newPlatforms.has(platform)) {
            newPlatforms.delete(platform);
        } else {
            if (platform === SocialPlatform.TWITTER && !isTwitterAuthenticated) {
                twitterService.authenticate();
                return;
            }
            if (platform === SocialPlatform.THREADS && !isThreadsAuthenticated) {
                threadsService.authenticate();
                return;
            }
            newPlatforms.add(platform);
        }
        setSelectedPlatforms(newPlatforms);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsPosting(true);
        try {
            const postPromises: Promise<boolean>[] = [];

            if (selectedPlatforms.has(SocialPlatform.TWITTER)) {
                if (!isTwitterAuthenticated) {
                    throw new Error('Not authenticated with Twitter');
                }
                postPromises.push(twitterService.post(content));
            }
            if (selectedPlatforms.has(SocialPlatform.THREADS)) {
                if (!isThreadsAuthenticated) {
                    throw new Error('Not authenticated with Threads');
                }
                postPromises.push(threadsService.post(content));
            }

            const results = await Promise.all(postPromises);
            const allSuccessful = results.every(result => result);

            if (allSuccessful) {
                setContent('');
                alert('Posted successfully!');
            } else {
                alert('Some posts failed to publish. Please try again.');
            }
        } catch (error) {
            console.error('Error posting:', error);
            alert('Error posting content. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="space-y-2">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={messages.form.placeholder}
                    className="min-h-[120px] bg-background text-foreground"
                />
                <div className="flex gap-2">
                    {!isTwitterAuthenticated ? (
                        <TwitterAuthButton />
                    ) : (
                        <Button
                            type="button"
                            variant={selectedPlatforms.has(SocialPlatform.TWITTER) ? 'default' : 'outline'}
                            onClick={() => togglePlatform(SocialPlatform.TWITTER)}
                            className="dark:hover:bg-slate-800"
                        >
                            Twitter
                        </Button>
                    )}
                    {!isThreadsAuthenticated ? (
                        <ThreadsAuthButton />
                    ) : (
                        <Button
                            type="button"
                            variant={selectedPlatforms.has(SocialPlatform.THREADS) ? 'default' : 'outline'}
                            onClick={() => togglePlatform(SocialPlatform.THREADS)}
                            className="dark:hover:bg-slate-800"
                        >
                            Threads
                        </Button>
                    )}
                </div>
            </div>
            <Button
                type="submit"
                className="w-full"
                disabled={isPosting || !content.trim() || selectedPlatforms.size === 0}
            >
                {isPosting ? messages.form.posting : messages.form.postButton}
            </Button>
        </form>
    );
}
