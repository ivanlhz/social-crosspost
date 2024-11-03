'use client';

import { Github, Linkedin, Twitter, Globe, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/presentation/context/LanguageContext';

export function AuthorFooter() {
    const { messages } = useLanguage();

    const socialLinks = [
        {
            name: 'Website',
            url: 'https://ivanlopezdev.es',
            icon: Globe,
            hoverClass: 'hover:text-blue-500'
        },
        {
            name: 'Twitter',
            url: 'https://twitter.com/ivanlhz',
            icon: Twitter,
            hoverClass: 'hover:text-[#1DA1F2]'
        },
        {
            name: 'Threads',
            url: 'https://www.threads.net/@ivanlopezdev',
            icon: ExternalLink,
            hoverClass: 'hover:text-[#000000] dark:hover:text-white'
        },
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/iván-lópez-hdez/',
            icon: Linkedin,
            hoverClass: 'hover:text-[#0A66C2]'
        },
        {
            name: 'GitHub',
            url: 'https://github.com/ivanlhz/social-crosspost',
            icon: Github,
            hoverClass: 'hover:text-[#333] dark:hover:text-white'
        }
    ];

    return (
        <footer className="mt-8 text-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
                {socialLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`transition-colors duration-200 ${link.hoverClass}`}
                        title={link.name}
                    >
                        <link.icon className="w-5 h-5" />
                        <span className="sr-only">{link.name}</span>
                    </a>
                ))}
            </div>
            <p className="text-sm text-muted-foreground">
                {messages.footer.createdBy}{' '}
                <a
                    href="https://ivanlopezdev.es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:underline"
                >
                    Iván López Hdez
                </a>
            </p>
        </footer>
    );
}
