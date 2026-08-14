import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { appName, gitConfig } from './shared'
import type { AppLocale } from './i18n'
import { i18n } from './i18n'
import { EasyPLogo } from '@/components/easyp-logo'

export function baseOptions(locale: AppLocale = i18n.defaultLanguage): BaseLayoutProps {
  const docsBase = locale === i18n.defaultLanguage ? '/docs' : `/${locale}/docs`
  const blogUrl = `${docsBase}/blog/finally-give-up-gin-echo`

  return {
    // Pass plain config only — the full defineI18n() API includes functions
    // and cannot be serialized into Client Components (DocsLayout).
    i18n: {
      defaultLanguage: i18n.defaultLanguage,
      languages: [...i18n.languages],
      hideLocale: i18n.hideLocale,
      parser: i18n.parser,
      fallbackLanguage: i18n.fallbackLanguage,
    },
    nav: {
      title: (
        <span className="flex items-center gap-2.5 font-semibold tracking-tight">
          {/* Same mark as production easyp.tech Navbar: EP badge */}
          <EasyPLogo size={32} className="size-8 shrink-0" />
          <span>{appName}</span>
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        text: locale === 'ru' ? 'Документация' : 'Docs',
        url: docsBase,
        active: 'nested-url',
      },
      {
        text: locale === 'ru' ? 'Блог' : 'Blog',
        url: blogUrl,
      },
      {
        text: (
          <span 
            className="group relative flex items-center cursor-not-allowed" 
            title={locale === 'ru' ? 'Скоро запустится' : 'Coming soon'}
          >
            <span className="line-through opacity-50 decoration-2">{locale === 'ru' ? 'Консоль' : 'Console'}</span>
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-fd-primary px-2 py-1 text-xs font-medium text-fd-primary-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 pointer-events-none">
              {locale === 'ru' ? 'Скоро запустится' : 'Coming soon'}
            </span>
          </span>
        ),
        url: '#',
      },
    ],
  }
}
