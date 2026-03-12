import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'cahico_theme'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

const theme = ref<Theme>(getInitialTheme())

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem(STORAGE_KEY, t)
}

// Apply on load
applyTheme(theme.value)

watch(theme, applyTheme)

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const isDark = () => theme.value === 'dark'

  return {
    theme,
    toggleTheme,
    isDark,
  }
}
