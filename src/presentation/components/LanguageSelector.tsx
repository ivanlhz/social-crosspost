'use client';

import { useLanguage } from '@/presentation/context/LanguageContext';
import { Languages } from 'lucide-react';
import { Button } from './ui/button';

export function LanguageSelector() {
    const { language, setLanguage, messages } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'es' : 'en');
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="fixed top-4 left-4 flex items-center gap-2"
        >
            <Languages className="h-4 w-4" />
            <span>{messages.languages[language]}</span>
        </Button>
    );
}
