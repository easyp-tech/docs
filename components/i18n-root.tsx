'use client'

import { RootProvider } from 'fumadocs-ui/provider/next'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, type ReactNode } from 'react'
import { i18n, i18nUI, type AppLocale } from '@/lib/i18n'
import { switchLocalePath } from '@/lib/locale-path'

const locales = i18n.languages.map((locale) => ({
  locale,
  name: locale === 'ru' ? 'Русский' : 'English',
}))

/**
 * Client RootProvider with locale-aware navigation.
 * Must be client so onLocaleChange can use usePathname/useRouter.
 */
export function I18nRootProvider({
  children,
  locale = i18n.defaultLanguage,
  disableNestedProviders = false,
}: {
  children: ReactNode
  locale?: AppLocale
  /** When nested under another RootProvider, turn off theme/search to avoid double providers */
  disableNestedProviders?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()

  const onLocaleChange = useCallback(
    (next: string) => {
      const target = switchLocalePath(next as AppLocale, pathname || '/')
      router.push(target)
    },
    [pathname, router],
  )

  return (
    <RootProvider
      theme={{ enabled: false }}
      search={disableNestedProviders ? { enabled: false } : undefined}
      i18n={{
        ...i18nUI.provider(locale),
        locales,
        onLocaleChange,
      }}
    >
      {children}
    </RootProvider>
  )
}
