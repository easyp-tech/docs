import { getLLMText, source } from '@/lib/source'
import { i18n } from '@/lib/i18n'

export const revalidate = false

export async function GET(req: Request) {
  const url = new URL(req.url)
  const localeParam = url.searchParams.get('locale')
  const locales =
    localeParam && (i18n.languages as readonly string[]).includes(localeParam)
      ? [localeParam]
      : [i18n.defaultLanguage]

  const pages = source
    .getPages()
    .filter((p) => locales.includes(p.locale ?? i18n.defaultLanguage))

  const sections = await Promise.all(
    locales.map(async (locale) => {
      const forLocale = pages.filter(
        (p) => (p.locale ?? i18n.defaultLanguage) === locale,
      )
      const body = (
        await Promise.all(forLocale.map((p) => getLLMText(p)))
      ).join('\n\n')
      return `# Locale: ${locale}\n\n${body}`
    }),
  )

  return new Response(sections.join('\n\n---\n\n'))
}
