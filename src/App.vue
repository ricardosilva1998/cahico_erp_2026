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

<style>
body {
  font-family: 'DM Sans', sans-serif;
  background-color: #ffffff;
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
</style>
