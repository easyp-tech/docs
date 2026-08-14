import { i18n, type AppLocale, isAppLocale } from './i18n'
import { docsRoute } from './shared'

/** Strip a leading /{locale} segment if it is a known app locale. */
export function stripLocalePrefix(pathname: string): {
  locale: AppLocale | null
  path: string
} {
  const segs = pathname.split('/').filter(Boolean)
  if (segs.length > 0 && isAppLocale(segs[0])) {
    const locale = segs[0]
    const rest = '/' + segs.slice(1).join('/')
    return { locale, path: rest === '/' ? '/' : rest.replace(/\/$/, '') || '/' }
  }
  return { locale: null, path: pathname === '' ? '/' : pathname }
}

/** True if path is docs (with or without locale prefix already stripped). */
export function isDocsPathname(pathname: string): boolean {
  const { path } = stripLocalePrefix(pathname)
  return path === docsRoute || path.startsWith(`${docsRoute}/`)
}

/**
 * Build the public URL for a locale + docs path (path must start with /docs or be /).
 * Respects hideLocale: 'default-locale' (no /en prefix).
 */
export function hrefForLocale(locale: AppLocale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (locale === i18n.defaultLanguage) {
    return normalized === '' ? '/' : normalized
  }
  // non-default: /ru + path
  if (normalized === '/') return `/${locale}`
  return `/${locale}${normalized}`
}

/**
 * Map current browser pathname to the equivalent URL in `next` locale.
 * - Docs paths: preserve slug under /docs or /ru/docs
 * - Home / other: go to /docs (en) or /ru/docs (ru) — never bare /ru
 */
export function switchLocalePath(next: AppLocale, pathname: string): string {
  const { path } = stripLocalePrefix(pathname)

  if (path === docsRoute || path.startsWith(`${docsRoute}/`)) {
    return hrefForLocale(next, path)
  }

  // Home or non-docs → docs hub in that language
  return hrefForLocale(next, docsRoute)
}
