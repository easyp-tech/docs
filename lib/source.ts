import { docs } from 'collections/server'
import { loader } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { docsContentRoute, docsImageRoute, docsRoute } from './shared'
import { i18n } from './i18n'

// See https://fumadocs.dev/docs/headless/source-api
export const source = loader({
  baseUrl: docsRoute,
  i18n,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
})

type Page = (typeof source)['$inferPage']

function localePrefix(page: Page): string {
  const locale = page.locale ?? i18n.defaultLanguage
  if (locale === i18n.defaultLanguage) return ''
  return `/${locale}`
}

export function getPageImage(page: Page) {
  const locale = page.locale ?? i18n.defaultLanguage
  const segments =
    locale === i18n.defaultLanguage
      ? [...page.slugs, 'image.png']
      : [locale, ...page.slugs, 'image.png']

  return {
    segments,
    locale,
    url: `${docsImageRoute}${localePrefix(page)}/${[...page.slugs, 'image.png'].join('/')}`.replace(
      /\/+/g,
      '/',
    ),
  }
}

export function getPageMarkdownUrl(page: Page) {
  const locale = page.locale ?? i18n.defaultLanguage
  const segments =
    locale === i18n.defaultLanguage
      ? [...page.slugs, 'content.md']
      : [locale, ...page.slugs, 'content.md']

  return {
    segments,
    locale,
    url: `${docsContentRoute}${localePrefix(page)}/${[...page.slugs, 'content.md'].join('/')}`.replace(
      /\/+/g,
      '/',
    ),
  }
}

export async function getLLMText(page: Page) {
  const processed = await page.data.getText('processed')

  return `# ${page.data.title} (${page.url})

${processed}`
}
