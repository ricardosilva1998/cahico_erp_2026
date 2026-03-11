<script setup lang="ts">
import Tab from './tab/Tab.vue'

interface TabItem {
  name: string
}

const props = defineProps<{
  tabs: TabItem[]
}>()
</script>

<template>
  <div class="tabs">
    <div class="tab-row" v-for="(tab, index) in props.tabs" :key="index">
      <Tab :name="tab.name" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;

  .tab-row {
    width: auto;
  }
}
</style>
