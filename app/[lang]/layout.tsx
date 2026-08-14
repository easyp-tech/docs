import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { I18nRootProvider } from '@/components/i18n-root'
import { DocumentLang } from '@/components/document-lang'
import { i18n, isAppLocale, type AppLocale } from '@/lib/i18n'

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang: raw } = await params
  if (!isAppLocale(raw)) notFound()
  const lang = raw as AppLocale

  return (
    <I18nRootProvider locale={lang} disableNestedProviders>
      <DocumentLang lang={lang} />
      {children}
    </I18nRootProvider>
  )
}
