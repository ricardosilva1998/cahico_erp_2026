<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import MyOrders from './sections/MyOrders.vue'
import PaymentMethods from './sections/PaymentMethods.vue'
import EditProfile from './sections/EditProfile.vue'

const authStore = useAuthStore()
const activeSection = ref<'orders' | 'payments' | 'edit'>('orders')

const sections = [
  { key: 'orders' as const, label: 'My Orders' },
  { key: 'payments' as const, label: 'Payment Methods' },
  { key: 'edit' as const, label: 'Edit Profile' },
]
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
        <button class="logout-btn" @click="authStore.logout()">Logout</button>
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
  background: white;
  border: 1px solid $color-border;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(61, 43, 31, 0.08);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background-color: $color-beige;
  border-bottom: 1px solid $color-border;
}

.profile-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid $color-gold;
  object-fit: cover;
  flex-shrink: 0;
}

.profile-avatar-default {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-sand;
  color: $color-brown;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.25rem;
  color: $color-text-primary;
  margin: 0;
}

.profile-email {
  font-size: 0.85rem;
  color: $color-text-secondary;
  margin: 0.15rem 0 0;
}

.logout-btn {
  background: none;
  border: 1px solid $color-border;
  color: $color-text-secondary;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: $color-error;
    color: $color-error;
  }
}

.profile-nav {
  display: flex;
  border-bottom: 1px solid $color-border;
  padding: 0 1rem;
}

.nav-btn {
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: $color-text-secondary;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: $color-text-primary;
  }

  &.active {
    color: $color-marine;
    border-bottom-color: $color-marine;
    font-weight: 600;
  }
}

.profile-content {
  padding: 1.5rem 2rem;
}
</style>
