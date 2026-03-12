<script setup lang="ts">
import Logo from './logo/Logo.vue'
import AccountSection from './account/AccountSection.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { ref, computed } from 'vue'
import { useTabManager } from '@/composables/useTabManager'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { currentTab, setTab } = useTabManager()
const { theme, toggleTheme } = useTheme()
const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const mobileMenuOpen = ref(false)
const { t } = useI18n()

const navItems = computed(() => {
  const items = [
    { label: t('nav.home'), tab: '' },
    { label: t('nav.collections'), tab: 'Stock' },
    { label: t('nav.orders'), tab: 'Orders' },
    { label: t('nav.materials'), tab: 'Materials' },
    { label: t('nav.contact'), tab: 'Contact' },
  ]
  if (authStore.isAdmin) {
    items.push({ label: t('nav.admin'), tab: 'Admin' })
  }
  return items
})

function handleNavClick(tab: string) {
  setTab(tab)
  if (router.currentRoute.value.path !== '/') {
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

      <div class="header-actions desktop-only">
        <LanguageSwitcher />
        <button class="theme-toggle" @click="toggleTheme" :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
          <svg v-if="theme === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
        <button class="cart-btn" @click="router.push('/cart')" :aria-label="t('cart.title')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span v-if="cartStore.cartCount > 0" class="cart-badge">{{ cartStore.cartCount }}</span>
        </button>
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
      <div class="mobile-actions-row">
        <button class="cart-btn" @click="router.push('/cart'); mobileMenuOpen = false" :aria-label="t('cart.title')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span v-if="cartStore.cartCount > 0" class="cart-badge">{{ cartStore.cartCount }}</span>
        </button>
        <LanguageSwitcher />
        <AccountSection />
        <button class="theme-toggle" @click="toggleTheme" :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
          <svg v-if="theme === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
      </div>
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
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.3s, border-color 0.3s;
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
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    color: var(--color-teal);
    background-color: rgba(23, 89, 118, 0.06);
    background-color: color-mix(in srgb, var(--color-teal) 6%, transparent);
  }

  &.active {
    color: var(--color-teal);
    font-weight: 700;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 1rem;
      right: 1rem;
      height: 2px;
      background-color: var(--color-teal);
      border-radius: 1px;
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cart-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  transition: all 0.2s;
  min-width: 36px;
  min-height: 36px;

  &:hover {
    background-color: var(--color-bg-alt);
    color: var(--color-teal);
  }
}

.cart-badge {
  position: absolute;
  top: 0;
  right: -2px;
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 17px;
  height: 17px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  transition: all 0.2s;
  min-width: 36px;
  min-height: 36px;

  &:hover {
    background-color: var(--color-bg-alt);
    color: var(--color-teal);
  }
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--color-bg-alt);
  }
}

.mobile-nav {
  display: none;
  flex-direction: column;
  padding: 0.5rem 1.5rem 1rem;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-white);
}

.mobile-link {
  font-family: $font-headline;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.75rem 0;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition: color 0.2s;
  min-height: 44px;
  display: flex;
  align-items: center;

  &:hover,
  &.active {
    color: var(--color-teal);
  }

  &:last-child {
    border-bottom: none;
  }
}

.mobile-actions-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
  gap: 0.5rem;
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

  .header-inner {
    justify-content: center;
    position: relative;
  }

  .mobile-toggle {
    display: flex;
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .mobile-nav {
    display: flex;
  }
}

@media (max-width: 480px) {
  .header-inner {
    padding: 0 0.75rem;
    height: 56px;
  }

  .mobile-nav {
    padding: 0.5rem 1rem 1rem;
  }
}
</style>
