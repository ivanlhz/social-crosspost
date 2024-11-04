import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { ThemeProvider } from '../presentation/components/theme-provider'
import { ThemeSwitcher } from '../presentation/components/ui/theme-switcher'
import { LanguageProvider } from '../presentation/context/LanguageContext'
import { LanguageSelector } from '../presentation/components/LanguageSelector'

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Social Crosspost',
  description: 'Post to Twitter and Threads simultaneously',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Suspense fallback={null}>
            <LanguageProvider>
              <Suspense fallback={null}>
                <ThemeSwitcher />
              </Suspense>
              <Suspense fallback={null}>
                <LanguageSelector />
              </Suspense>
              {children}
            </LanguageProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
