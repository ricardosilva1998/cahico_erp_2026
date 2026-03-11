<script setup lang="ts">
import Header from './header/Header.vue'
import { onMounted, ref } from 'vue'
import { useTabManager } from '@/composables/useTabManager'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const tabs = ref([
  {
    name: 'Stock',
  },
  {
    name: 'Orders',
  },
  {
    name: 'Materials',
  },
])

// Initialize tab manager with no tab selected — home page shows by default
const { currentTab } = useTabManager()

onMounted(() => {
  document.body.style.backgroundColor = '#FDF6EC'
})
</script>

<template>
  <div class="app-container">
    <Header :tabs="tabs" />
    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
}
</style>
