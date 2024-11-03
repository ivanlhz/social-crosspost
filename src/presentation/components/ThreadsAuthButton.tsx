'use client';

import React from 'react';
import { Button } from './ui/button';
import { useLanguage } from '../context/LanguageContext';

export function ThreadsAuthButton() {
    const { messages } = useLanguage();

    const handleAuth = async () => {
        try {
            const response = await fetch('/api/auth/threads');
            const data = await response.json();

            if (data.url) {
                // Open the authorization window in system browser as per Threads documentation
                window.open(data.url, '_system');
            } else {
                throw new Error('No authentication URL received');
            }
        } catch (error) {
            console.error('Error initiating Threads auth:', error);
            alert('Failed to initiate Threads authentication');
        }
    };

    return (
        <Button
            onClick={handleAuth}
            className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black"
        >
            {messages.Index.form.connectThreads}
        </Button>
    );
}
