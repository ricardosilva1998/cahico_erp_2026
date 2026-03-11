<script setup lang="ts">
import Stock from './stock/Stock.vue'
import Orders from './orders/Orders.vue'
import Materials from './materials/Materials.vue'
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.main-container {
  margin-top: 10px;
  width: 100%;
}

.main-bubble {
  width: auto;
  height: 100%;
  background-color: $color-beige;
  border: 1px solid $color-border;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
