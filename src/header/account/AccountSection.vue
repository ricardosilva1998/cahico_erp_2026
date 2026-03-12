<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

function goToLogin() {
  router.push('/login')
}

function goToProfile() {
  router.push('/profile')
}
</script>

<template>
  <div class="account-section">
    <template v-if="authStore.isAuthenticated">
      <div class="account-user" @click="goToProfile">
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
        <span class="account-name">{{ authStore.userDisplayName }}</span>
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

.account-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid $color-gold;
  object-fit: cover;
}

.avatar-default {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-bg-alt;
  color: $color-text-secondary;
}

.account-name {
  font-size: 0.85rem;
  color: $color-text-primary;
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.guest-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar-guest {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-bg-alt;
  color: $color-tan;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: rgba(23, 89, 118, 0.08);
    color: $color-teal;
  }
}

.login-btn {
  background-color: $color-teal;
  color: $color-text-on-dark;
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
    background-color: $color-primary-dark;
  }
}
</style>
