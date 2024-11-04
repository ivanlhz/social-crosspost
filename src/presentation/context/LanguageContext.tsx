'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../../messages/en.json';
import es from '../../messages/es.json';

type Language = 'en' | 'es';
type Messages = typeof en;

interface LanguageContextType {
    language: Language;
    messages: Messages;
    setLanguage: (lang: Language) => void;
}

const messages = { en, es };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const savedLanguage = localStorage?.getItem('language') as Language;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
            setLanguage(savedLanguage);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        if (typeof window !== 'undefined') {
            localStorage?.setItem('language', lang);
        }
    };

    // Prevent hydration mismatch by only rendering children after client-side hydration
    if (!isClient) {
        return null;
    }

    return (
        <LanguageContext.Provider
            value={{
                language,
                messages: messages[language],
                setLanguage: handleSetLanguage
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
