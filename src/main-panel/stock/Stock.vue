<script setup lang="ts">
import Bubble from '../bubble-items/Bubble.vue'
</script>
<template>
  <div style="display: flex; flex-direction: column">
    <div class="bubble-title">
      <span>Stock</span>
    </div>
    <div class="stock-row">
      <Bubble :text="'Stock Item 1'" :width="280" :height="140" />
      <Bubble :text="'Stock Item 2'" :width="280" :height="140" />
      <Bubble :text="'Stock Item 3'" :width="280" :height="140" />
    </div>
    <div class="stock-row">
      <Bubble :text="'Stock Item 4'" :width="280" :height="140" />
      <Bubble :text="'Stock Item 5'" :width="280" :height="140" />
      <Bubble :text="'Stock Item 6'" :width="280" :height="140" />
    </div>
    <div class="stock-row">
      <Bubble :text="'Stock Item 7'" :width="280" :height="140" />
      <Bubble :text="'Stock Item 8'" :width="280" :height="140" />
      <Bubble :text="'Stock Item 9'" :width="280" :height="140" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '@/styles/variables' as *;

.stock-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: flex-end;
  gap: 10px;
  margin-bottom: 10px;
}

.bubble-title {
  padding: 10px 20px;
  width: auto;
  max-width: 100px;
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: $color-teal;
  border: 1px solid $color-teal;
  color: $color-text-on-dark;
  border-radius: 10px;
  margin-bottom: 10px;
}
</style>
