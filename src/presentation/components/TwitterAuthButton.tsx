'use client';

import React from 'react';
import { Button } from './ui/button';
import { useLanguage } from '../context/LanguageContext';

export function TwitterAuthButton() {
    const { messages } = useLanguage()

    const handleAuth = async () => {
        try {
            const response = await fetch('/api/auth/twitter');
            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No authentication URL received');
            }
        } catch (error) {
            console.error('Error initiating Twitter auth:', error);
            alert('Failed to initiate Twitter authentication');
        }
    };

    return (
        <Button
            onClick={handleAuth}
            className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
        >
            {messages.form.connectTwitter}
        </Button>
    );
}
