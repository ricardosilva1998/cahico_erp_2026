<script setup lang="ts">
import Logo from './logo/Logo.vue'
import AccountSection from './account/AccountSection.vue'
import { ref } from 'vue'
import { useTabManager } from '@/composables/useTabManager'
import { useRouter } from 'vue-router'

const { currentTab, setTab } = useTabManager()
const router = useRouter()
const mobileMenuOpen = ref(false)

const navItems = [
  { label: 'Home', tab: '' },
  { label: 'Collections', tab: 'Stock' },
  { label: 'Orders', tab: 'Orders' },
  { label: 'Materials', tab: 'Materials' },
  { label: 'Contact', tab: 'Contact' },
]

function handleNavClick(tab: string) {
  setTab(tab)
  if (tab === '') {
    router.push('/')
  }
  mobileMenuOpen.value = false
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <Logo />

      <nav class="header-nav desktop-only">
        <a
          v-for="item in navItems"
          :key="item.tab"
          :class="['nav-link', { active: currentTab === item.tab }]"
          @click="handleNavClick(item.tab)"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="header-right">
        <AccountSection />
      </div>

      <button
        class="mobile-toggle desktop-hide"
        @click="toggleMobileMenu"
        aria-label="Toggle menu"
      >
        <svg v-if="!mobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <nav v-if="mobileMenuOpen" class="mobile-nav">
      <a
        v-for="item in navItems"
        :key="item.tab"
        :class="['mobile-link', { active: currentTab === item.tab }]"
        @click="handleNavClick(item.tab)"
      >
        {{ item.label }}
      </a>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: $color-white;
  border-bottom: 1px solid $color-border;
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 64px;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  font-family: $font-headline;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: $color-text-secondary;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    color: $color-teal;
    background-color: rgba(23, 89, 118, 0.06);
  }

  &.active {
    color: $color-teal;
    font-weight: 700;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 1rem;
      right: 1rem;
      height: 2px;
      background-color: $color-teal;
      border-radius: 1px;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: $color-text-primary;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;

  &:hover {
    background-color: $color-bg-alt;
  }
}

.mobile-nav {
  display: none;
  flex-direction: column;
  padding: 0.5rem 1.5rem 1rem;
  border-top: 1px solid $color-border;
  background-color: $color-white;
}

.mobile-link {
  font-family: $font-headline;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: $color-text-secondary;
  text-decoration: none;
  padding: 0.75rem 0;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: color 0.2s;

  &:hover,
  &.active {
    color: $color-teal;
  }

  &:last-child {
    border-bottom: none;
  }
}

.desktop-hide {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .desktop-hide {
    display: flex;
  }

  .mobile-toggle {
    display: flex;
  }

  .mobile-nav {
    display: flex;
  }

  .header-right {
    margin-right: 0.5rem;
  }
}
</style>
