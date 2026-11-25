import type { MetadataRoute } from 'next'
import { source } from '@/lib/source'
import { i18n, type AppLocale } from '@/lib/i18n'
import { hrefForLocale } from '@/lib/locale-path'
import { localizedPages } from '@/lib/shared'

const origin = 'https://easyp.tech'

function languages(paths: Partial<Record<AppLocale, string>>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [lang, path] of Object.entries(paths)) if (path) out[lang] = origin + path
  return out
}

/** /sitemap.xml for search engines: home, standalone pages and every docs page in each language it exists in. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [{ url: `${origin}/` }]

  for (const page of localizedPages) {
    const paths = Object.fromEntries(i18n.languages.map((lang) => [lang, hrefForLocale(lang, page)]))
    for (const lang of i18n.languages) {
      entries.push({ url: origin + paths[lang], alternates: { languages: languages(paths) } })
    }
  }

  for (const lang of i18n.languages) {
    for (const page of source.getPages(lang)) {
      // With fallbackLanguage, a missing translation is served in English; list only real ones.
      if ((page.locale ?? i18n.defaultLanguage) !== lang) continue
      const paths: Partial<Record<AppLocale, string>> = {}
      for (const other of i18n.languages) {
        const translated = source.getPage(page.slugs, other)
        if (translated && (translated.locale ?? i18n.defaultLanguage) === other) paths[other] = translated.url
      }
      entries.push({ url: origin + page.url, alternates: { languages: languages(paths) } })
    }
  }

  return entries
}
