<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const dropdownOpen = ref(false)
const dropdownEl = ref<HTMLElement | null>(null)
let closeTimeout: ReturnType<typeof setTimeout> | null = null

function openDropdown() {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  dropdownOpen.value = true
}

function scheduleClose() {
  closeTimeout = setTimeout(() => {
    dropdownOpen.value = false
  }, 200)
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownEl.value && !dropdownEl.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function goToLogin() {
  router.push('/login')
}

function navigateToSection(section: string) {
  dropdownOpen.value = false
  router.push({ path: '/profile', query: { section } })
}

async function handleLogout() {
  dropdownOpen.value = false
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="account-section">
    <template v-if="authStore.isAuthenticated">
      <div
        ref="dropdownEl"
        class="account-wrapper"
        @mouseenter="openDropdown"
        @mouseleave="scheduleClose"
      >
        <button class="avatar-btn" @click="toggleDropdown" :aria-label="t('profile.editProfile')">
          <img
            v-if="authStore.userAvatarUrl"
            :src="authStore.userAvatarUrl"
            :alt="authStore.userDisplayName"
            class="avatar"
          />
          <div v-else class="avatar avatar-default">
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
              <path
                d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                fill="currentColor"
              />
            </svg>
          </div>
        </button>

        <Transition name="dropdown">
          <div v-if="dropdownOpen" class="dropdown-card">
            <div class="dropdown-user">
              <img
                v-if="authStore.userAvatarUrl"
                :src="authStore.userAvatarUrl"
                :alt="authStore.userDisplayName"
                class="dropdown-avatar"
              />
              <div v-else class="dropdown-avatar dropdown-avatar-default">
                <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                  <path
                    d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div class="dropdown-user-info">
                <span class="dropdown-name">{{ authStore.userDisplayName }}</span>
                <span class="dropdown-email">{{ authStore.userEmail }}</span>
              </div>
            </div>

            <div class="dropdown-divider" />

            <button class="dropdown-item" @click="navigateToSection('edit')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              {{ t('profile.editProfile') }}
            </button>
            <button class="dropdown-item" @click="navigateToSection('payments')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
              {{ t('profile.paymentMethods') }}
            </button>
            <button class="dropdown-item" @click="navigateToSection('favorites')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
              {{ t('profile.favorites') }}
            </button>
            <button class="dropdown-item" @click="navigateToSection('orders')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              {{ t('profile.myOrders') }}
            </button>
            <button class="dropdown-item" @click="navigateToSection('history')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {{ t('profile.purchaseHistory') }}
            </button>

            <div class="dropdown-divider" />

            <button class="dropdown-item dropdown-item--logout" @click="handleLogout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              {{ t('profile.logout') }}
            </button>
          </div>
        </Transition>
      </div>
    </template>
    <template v-else>
      <div class="guest-section">
        <div class="avatar avatar-guest" @click="goToLogin" :title="t('auth.signIn')">
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true">
            <path
              d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
              fill="currentColor"
            />
          </svg>
        </div>
        <button class="login-btn" @click="goToLogin">{{ t('auth.login') }}</button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.account-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0 0.5rem;
}

.account-wrapper {
  position: relative;
}

.avatar-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--color-gold);
  object-fit: cover;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-gold) 25%, transparent);
  }
}

.avatar-default {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-alt);
  color: var(--color-text-secondary);
}

/* Dropdown */
.dropdown-card {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 260px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  z-index: 200;
  padding: 0.5rem 0;
  overflow: hidden;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.dropdown-user {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--color-gold);
  object-fit: cover;
  flex-shrink: 0;
}

.dropdown-avatar-default {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-alt);
  color: var(--color-text-secondary);
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dropdown-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-email {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 0.25rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  background: none;
  border: none;
  padding: 0.55rem 1rem;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color 0.15s;
  text-align: left;

  svg {
    color: var(--color-text-secondary);
    flex-shrink: 0;
  }

  &:hover {
    background-color: color-mix(in srgb, var(--color-teal) 6%, transparent);

    svg {
      color: var(--color-teal);
    }
  }

  &--logout {
    color: var(--color-error);

    svg {
      color: var(--color-error);
    }

    &:hover {
      background-color: color-mix(in srgb, var(--color-error) 6%, transparent);
    }
  }
}

/* Guest */
.guest-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar-guest {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-alt);
  color: var(--color-tan);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: color-mix(in srgb, var(--color-teal) 8%, transparent);
    color: var(--color-teal);
  }
}

.login-btn {
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-family: $font-headline;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-teal-dark);
  }
}
</style>
