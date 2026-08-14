import { defineI18n } from 'fumadocs-core/i18n'
import { defineI18nUI } from 'fumadocs-ui/i18n'

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'ru'],
  hideLocale: 'default-locale',
  parser: 'dot',
  fallbackLanguage: 'en',
})

export const i18nUI = defineI18nUI(i18n, {
  en: {
    displayName: 'English',
  },
  ru: {
    displayName: 'Русский',
    search: 'Поиск',
    searchNoResult: 'Ничего не найдено',
    toc: 'На этой странице',
    tocNoHeadings: 'Нет заголовков',
    lastUpdate: 'Обновлено',
    chooseLanguage: 'Язык',
    nextPage: 'Далее',
    previousPage: 'Назад',
    chooseTheme: 'Тема',
    editOnGithub: 'Редактировать на GitHub',
  },
})

export type AppLocale = (typeof i18n.languages)[number]

export function isAppLocale(value: string): value is AppLocale {
  return (i18n.languages as readonly string[]).includes(value)
}
