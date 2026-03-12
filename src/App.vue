<script setup lang="ts">
import Header from './header/Header.vue'
import Footer from './footer/Footer.vue'
import { useTabManager } from '@/composables/useTabManager'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Initialize tab manager with no tab selected — home page shows by default
const { currentTab } = useTabManager()
</script>

<template>
  <div class="app-container">
    <Header />
    <main class="app-main">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style lang="scss">
@use '@/styles/theme';

body {
  font-family: 'DM Sans', sans-serif;
  background-color: var(--color-bg-body);
  color: var(--color-text-primary);
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s, color 0.3s;
}
</style>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding: 0 1rem;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

@media (max-width: 480px) {
  .app-main {
    padding: 0 0.5rem;
  }
}
</style>
