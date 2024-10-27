'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { SocialPlatform } from '@/domain/interfaces/ISocialPost';
import { TwitterService } from '@/infrastructure/services/TwitterService';
import { ThreadsService } from '@/infrastructure/services/ThreadsService';

export function SocialPostForm() {
    const [content, setContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [selectedPlatforms, setSelectedPlatforms] = useState<Set<SocialPlatform>>(
        new Set([SocialPlatform.TWITTER, SocialPlatform.THREADS])
    );

    const twitterService = new TwitterService();
    const threadsService = new ThreadsService();

    const togglePlatform = (platform: SocialPlatform) => {
        const newPlatforms = new Set(selectedPlatforms);
        if (newPlatforms.has(platform)) {
            newPlatforms.delete(platform);
        } else {
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
                postPromises.push(twitterService.post(content));
            }
            if (selectedPlatforms.has(SocialPlatform.THREADS)) {
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
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto p-4">
            <div className="space-y-2">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="min-h-[120px] bg-background text-foreground"
                />
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant={selectedPlatforms.has(SocialPlatform.TWITTER) ? 'default' : 'outline'}
                        onClick={() => togglePlatform(SocialPlatform.TWITTER)}
                        className="dark:hover:bg-slate-800"
                    >
                        Twitter
                    </Button>
                    <Button
                        type="button"
                        variant={selectedPlatforms.has(SocialPlatform.THREADS) ? 'default' : 'outline'}
                        onClick={() => togglePlatform(SocialPlatform.THREADS)}
                        className="dark:hover:bg-slate-800"
                    >
                        Threads
                    </Button>
                </div>
            </div>
            <Button
                type="submit"
                className="w-full"
                disabled={isPosting || !content.trim() || selectedPlatforms.size === 0}
            >
                {isPosting ? 'Posting...' : 'Post'}
            </Button>
        </form>
    );
}
