import { createI18n } from 'vue-i18n'
import en from './locales/en'
import fr from './locales/fr'
import es from './locales/es'
import pt from './locales/pt'
import zh from './locales/zh'
import de from './locales/de'
import { generateProductMessages } from '@/data/productI18n'

const savedLocale = localStorage.getItem('cahico_locale') ?? 'en'

const validLocales = ['en', 'fr', 'es', 'pt', 'zh', 'de'] as const

const locale = (validLocales as readonly string[]).includes(savedLocale) ? savedLocale : 'en'

// Merge generated product translations into each locale
// without overwriting hand-written entries for the original 6 products
function mergeProductMessages<T extends Record<string, unknown>>(base: T, loc: string): T {
  const generated = generateProductMessages(loc)
  const existing = (base.product ?? {}) as Record<string, unknown>
  return {
    ...base,
    product: {
      ...existing,
      ...Object.fromEntries(
        Object.entries(generated).filter(([key]) => !(key in existing)),
      ),
    },
  }
}

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  messages: {
    en: mergeProductMessages(en, 'en'),
    fr: mergeProductMessages(fr, 'fr'),
    es: mergeProductMessages(es, 'es'),
    pt: mergeProductMessages(pt, 'pt'),
    zh: mergeProductMessages(zh, 'zh'),
    de: mergeProductMessages(de, 'de'),
  },
})

export default i18n
