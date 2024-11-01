import { Github, Linkedin, Twitter, Globe } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';

export const ThreadsIcon = () => <Image
    className="h-4 w-4 dark:invert"
    src="/threads.svg"
    alt="threads logo"
    width="20"
    height="20"
/>

export function AuthorFooter() {
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
            icon: ThreadsIcon,
            hoverClass: 'text-gray-500 dark:text-gray-400 dark:hover:text-white hover:text-gray-900'
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
                    <Link
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`transition-colors duration-200 ${link.hoverClass}`}
                        title={link.name}
                    >
                        <link.icon className="w-5 h-5" />
                        <span className="sr-only">{link.name}</span>
                    </Link>
                ))}
            </div>
            <p className="text-sm text-muted-foreground">
                Created by{' '}
                <Link
                    href="https://ivanlopezdev.es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:underline"
                >
                    Iván López Hdez
                </Link>
            </p>
        </footer>
    );
}
