import { getLLMText, getPageMarkdownUrl, source } from '@/lib/source'
import { notFound } from 'next/navigation'
import { i18n, isAppLocale, type AppLocale } from '@/lib/i18n'

export const revalidate = false

function resolvePage(slug: string[] | undefined) {
  const parts = slug ?? []
  // trailing content.md
  const withoutFile =
    parts.length > 0 && parts[parts.length - 1] === 'content.md'
      ? parts.slice(0, -1)
      : parts

  let lang: AppLocale = i18n.defaultLanguage
  let pageSlugs = withoutFile

  if (withoutFile.length > 0 && isAppLocale(withoutFile[0])) {
    lang = withoutFile[0]
    pageSlugs = withoutFile.slice(1)
  }

  return source.getPage(pageSlugs, lang)
}

export async function GET(
  _req: Request,
  { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>,
) {
  const { slug } = await params
  const page = resolvePage(slug)
  if (!page) notFound()

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  })
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageMarkdownUrl(page).segments,
  }))
}
