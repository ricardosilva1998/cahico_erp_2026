<script setup lang="ts">
import { useTabManager } from '@/composables/useTabManager'
import { useRouter } from 'vue-router'

const { setTab } = useTabManager()
const router = useRouter()

function goHome() {
  setTab('')
  router.push('/')
}
</script>

<template>
  <div class="logo" @click="goHome">
    <span class="logo-text">CAHICO</span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.logo {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.75;
  }
}

.logo-text {
  font-family: $font-brand;
  font-size: 1.5rem;
  font-weight: 700;
  color: $color-dark-brown;
  letter-spacing: 4px;
  text-align: center;
}
</style>
