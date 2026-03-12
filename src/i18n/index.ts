import { createI18n } from 'vue-i18n'
import en from './locales/en'
import fr from './locales/fr'
import es from './locales/es'
import pt from './locales/pt'
import zh from './locales/zh'
import de from './locales/de'

const savedLocale = localStorage.getItem('cahico_locale') ?? 'en'

const validLocales = ['en', 'fr', 'es', 'pt', 'zh', 'de']
const locale = validLocales.includes(savedLocale) ? savedLocale : 'en'

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
    es,
    pt,
    zh,
    de,
  },
})

export default i18n
