import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptions } from '@/lib/layout.shared'
import { isAppLocale } from '@/lib/i18n'

/** Standalone pages outside the docs tree (/plugins, /roadmap, /privacy), in both languages. */
export default async function MarketingLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isAppLocale(lang)) notFound()

  return <HomeLayout {...baseOptions(lang)}>{children}</HomeLayout>
}
