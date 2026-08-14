import { source } from '@/lib/source'
import { createFromSource } from 'fumadocs-core/search/server'

export const { GET } = createFromSource(source, {
  // Orama language per locale (createFromSource uses loader._i18n when present)
  localeMap: {
    en: 'english',
    ru: 'russian',
  },
})
