import { getPageImage, source } from '@/lib/source'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import { generate as DefaultImage } from 'fumadocs-ui/og'
import { appName } from '@/lib/shared'
import { i18n, isAppLocale, type AppLocale } from '@/lib/i18n'

export const revalidate = false

function resolvePage(slug: string[]) {
  const withoutFile =
    slug.length > 0 && slug[slug.length - 1] === 'image.png'
      ? slug.slice(0, -1)
      : slug

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
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params
  const page = resolvePage(slug)
  if (!page) notFound()

  return new ImageResponse(
    (
      <DefaultImage
        title={page.data.title}
        description={page.data.description}
        site={appName}
      />
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }))
}
