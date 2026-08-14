'use client'

import { useEffect } from 'react'
import { i18n } from '@/lib/i18n'

/** Sets document.documentElement.lang for the active docs locale (root html is fixed at build). */
export function DocumentLang({ lang }: { lang: string }) {
  useEffect(() => {
    const prev = document.documentElement.lang
    document.documentElement.lang = lang
    return () => {
      document.documentElement.lang = prev || i18n.defaultLanguage
    }
  }, [lang])

  return null
}
