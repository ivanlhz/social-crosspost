import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/presentation/components/theme-provider'
import { ThemeSwitcher } from '@/presentation/components/ui/theme-switcher'

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
          <ThemeSwitcher />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
