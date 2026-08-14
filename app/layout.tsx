import './global.css'
import { Inter, JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import { I18nRootProvider } from '@/components/i18n-root'
import { i18n } from '@/lib/i18n'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://easyp.tech'),
  title: {
    default: 'EasyP',
    template: '%s | EasyP',
  },
  description:
    'Modern Protocol Buffers toolkit — lint, generate, packages, breaking changes.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    // Dark-only: theme toggle is disabled, class is hardcoded.
    <html
      lang={i18n.defaultLanguage}
      className={`dark ${inter.variable} ${jetbrains.variable} ${inter.className}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col antialiased">
        <I18nRootProvider locale={i18n.defaultLanguage}>{children}</I18nRootProvider>
      </body>
    </html>
  )
}
