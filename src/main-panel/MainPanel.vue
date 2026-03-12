<script setup lang="ts">
import Stock from './stock/Stock.vue'
import Orders from './orders/Orders.vue'
import Materials from './materials/Materials.vue'
import Contact from './contact/Contact.vue'
import JewelryHome from './home/JewelryHome.vue'
import { useTabManager } from '@/composables/useTabManager'

const { currentTab } = useTabManager()
</script>

<template>
  <div class="main-container">
    <!-- Jewelry store home page shown when no ERP tab is selected -->
    <JewelryHome v-if="currentTab === ''" />

    <!-- ERP management panels -->
    <div v-else class="main-bubble">
      <Stock v-if="currentTab === 'Stock'" />
      <Orders v-if="currentTab === 'Orders'" />
      <Materials v-if="currentTab === 'Materials'" />
      <Contact v-if="currentTab === 'Contact'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-container {
  margin-top: 10px;
  width: 100%;
}

.main-bubble {
  width: 100%;
  min-height: calc(100vh - 64px);
  background-color: var(--color-bg-section);
  border-top: 1px solid var(--color-border);
  transition: background-color 0.3s, border-color 0.3s;
}
</style>
