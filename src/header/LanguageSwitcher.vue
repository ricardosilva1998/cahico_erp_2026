<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, onUnmounted } from 'vue'

const { locale } = useI18n()

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
  { code: 'zh', label: 'ZH' },
  { code: 'de', label: 'DE' },
]

const open = ref(false)
const containerRef = ref<HTMLElement | null>(null)

function selectLanguage(code: string) {
  locale.value = code
  localStorage.setItem('cahico_locale', code)
  open.value = false
}

function toggleDropdown() {
  open.value = !open.value
}

function handleClickOutside(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

const currentLabel = () => languages.find(l => l.code === locale.value)?.label ?? 'EN'
</script>

<template>
  <div class="lang-switcher" ref="containerRef">
    <button class="lang-btn" @click="toggleDropdown" :aria-expanded="open">
      <span class="globe-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </span>
      {{ currentLabel() }}
      <svg class="chevron" :class="{ rotated: open }" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <div v-if="open" class="lang-dropdown">
      <button
        v-for="lang in languages"
        :key="lang.code"
        :class="['lang-option', { active: locale === lang.code }]"
        @click="selectLanguage(lang.code)"
      >
        {{ lang.label }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lang-switcher {
  position: relative;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  font-family: $font-headline;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: var(--color-teal);
    border-color: var(--color-teal);
  }
}

.globe-icon {
  display: flex;
  align-items: center;
  opacity: 0.7;
}

.chevron {
  transition: transform 0.2s;

  &.rotated {
    transform: rotate(180deg);
  }
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: var(--shadow-card-hover);
  padding: 0.3rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.15rem;
  z-index: 200;
  min-width: 120px;
}

.lang-option {
  font-family: $font-headline;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  border-radius: 5px;
  padding: 0.4rem 0.5rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;

  &:hover {
    background-color: rgba(23, 89, 118, 0.07);
    background-color: color-mix(in srgb, var(--color-teal) 7%, transparent);
    color: var(--color-teal);
  }

  &.active {
    background-color: var(--color-teal);
    color: var(--color-text-on-dark);
  }
}
</style>
