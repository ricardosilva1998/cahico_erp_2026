<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MyOrders from './sections/MyOrders.vue'
import PaymentMethods from './sections/PaymentMethods.vue'
import EditProfile from './sections/EditProfile.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

type SectionKey = 'orders' | 'payments' | 'edit' | 'favorites' | 'history'
const activeSection = ref<SectionKey>('orders')

const sections = computed(() => [
  { key: 'orders' as const, label: t('profile.myOrders') },
  { key: 'payments' as const, label: t('profile.paymentMethods') },
  { key: 'favorites' as const, label: t('profile.favorites') },
  { key: 'history' as const, label: t('profile.purchaseHistory') },
  { key: 'edit' as const, label: t('profile.editProfile') },
])

const validSections: SectionKey[] = ['orders', 'payments', 'edit', 'favorites', 'history']

function applySectionFromQuery() {
  const q = route.query.section as string | undefined
  if (q && validSections.includes(q as SectionKey)) {
    activeSection.value = q as SectionKey
  }
}

onMounted(applySectionFromQuery)
watch(() => route.query.section, applySectionFromQuery)

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="profile-header">
        <img
          v-if="authStore.userAvatarUrl"
          :src="authStore.userAvatarUrl"
          :alt="authStore.userDisplayName"
          class="profile-avatar"
        />
        <div v-else class="profile-avatar profile-avatar-default">
          <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
            <path
              d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ authStore.userDisplayName }}</h1>
          <p class="profile-email">{{ authStore.userEmail }}</p>
        </div>
        <button class="logout-btn" @click="handleLogout">{{ t('profile.logout') }}</button>
      </div>

      <nav class="profile-nav">
        <button
          v-for="section in sections"
          :key="section.key"
          :class="['nav-btn', { active: activeSection === section.key }]"
          @click="activeSection = section.key"
        >
          {{ section.label }}
        </button>
      </nav>

      <div class="profile-content">
        <MyOrders v-if="activeSection === 'orders'" />
        <PaymentMethods v-else-if="activeSection === 'payments'" />
        <EditProfile v-else-if="activeSection === 'edit'" />
        <div v-else-if="activeSection === 'favorites'" class="placeholder-section">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <p>{{ t('profile.favorites') }}</p>
          <span class="placeholder-hint">Coming soon</span>
        </div>
        <div v-else-if="activeSection === 'history'" class="placeholder-section">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <p>{{ t('profile.purchaseHistory') }}</p>
          <span class="placeholder-hint">Coming soon</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.profile-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.profile-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-card);
  transition: background-color 0.3s, border-color 0.3s;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background-color: var(--color-bg-section);
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.3s, border-color 0.3s;
}

.profile-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid var(--color-gold);
  object-fit: cover;
  flex-shrink: 0;
}

.profile-avatar-default {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-alt);
  color: var(--color-text-primary);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-family: $font-headline;
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin: 0;
}

.profile-email {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0.15rem 0 0;
}

.logout-btn {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-error);
    color: var(--color-error);
  }
}

.profile-nav {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  padding: 0 1rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.nav-btn {
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  min-height: 44px;

  &:hover {
    color: var(--color-text-primary);
  }

  &.active {
    color: var(--color-teal);
    border-bottom-color: var(--color-teal);
    font-weight: 600;
  }
}

.profile-content {
  padding: 1.5rem 2rem;
}

.placeholder-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);

  svg {
    opacity: 0.3;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.25rem;
  }

  .placeholder-hint {
    font-size: 0.85rem;
    opacity: 0.6;
  }
}

@media (max-width: 600px) {
  .profile-page {
    padding: 0;
    margin: 1rem auto;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
  }

  .profile-content {
    padding: 1.25rem;
  }

  .profile-card {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
}
</style>
