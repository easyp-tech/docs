import { NextRequest, NextResponse, type NextFetchEvent } from 'next/server'
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation'
import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware'
import { docsContentRoute, docsRoute } from '@/lib/shared'
import { i18n } from '@/lib/i18n'

const i18nMiddleware = createI18nMiddleware(i18n)

const { rewrite: rewriteDocsEn } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
)
const { rewrite: rewriteSuffixEn } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
)

/** Paths that should go through Fumadocs locale rewrite/redirect. */
function isDocsPath(pathname: string): boolean {
  if (pathname === docsRoute || pathname.startsWith(`${docsRoute}/`)) return true
  for (const lang of i18n.languages) {
    const prefix = `/${lang}${docsRoute}`
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return true
  }
  return false
}

/**
 * Markdown negotiation: keep locale for non-default languages.
 * EN:  /docs/foo.md           → /llms.mdx/docs/foo/content.md
 * RU:  /ru/docs/foo.md        → /llms.mdx/docs/ru/foo/content.md
 */
function markdownRewrite(pathname: string): string | null {
  // /ru/docs/... or /docs/...
  for (const lang of i18n.languages) {
    if (lang === i18n.defaultLanguage) continue
    const prefix = `/${lang}${docsRoute}`
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      const rest = pathname.slice(prefix.length) // '' or '/foo' or '/foo.md'
      if (rest.endsWith('.md')) {
        const path = rest.slice(0, -3) || ''
        return `${docsContentRoute}/${lang}${path}/content.md`.replace(/\/+/g, '/')
      }
      // Accept: text/markdown without .md suffix handled below via isMarkdownPreferred
      return null // signal locale-specific bare path
    }
  }

  // EN .md suffix
  const enSuffix = rewriteSuffixEn(pathname)
  if (enSuffix) return enSuffix
  return null
}

function markdownBareRewrite(pathname: string): string | null {
  for (const lang of i18n.languages) {
    if (lang === i18n.defaultLanguage) continue
    const prefix = `/${lang}${docsRoute}`
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      const rest = pathname.slice(prefix.length) || ''
      const path = rest === '' ? '' : rest
      return `${docsContentRoute}/${lang}${path}/content.md`.replace(/\/+/g, '/')
    }
  }
const en = rewriteDocsEn(pathname)
  return en || null
}

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname

  const mdSuffix = markdownRewrite(pathname)
  if (mdSuffix) {
    return NextResponse.rewrite(new URL(mdSuffix, request.nextUrl))
  }

  if (isMarkdownPreferred(request) && isDocsPath(pathname)) {
    const rewritten = markdownBareRewrite(pathname)
    if (rewritten) {
      return NextResponse.rewrite(new URL(rewritten, request.nextUrl))
    }
  }

  if (isDocsPath(pathname)) {
    return i18nMiddleware(request, event)
  }

  return NextResponse.next()
}
