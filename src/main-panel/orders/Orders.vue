<script setup lang="ts">
import Bubble from '../bubble-items/Bubble.vue'
</script>
<template>
  <div style="display: flex; flex-direction: column">
    <div class="bubble-title">
      <span>Orders</span>
    </div>
    <div class="orders-row">
      <Bubble :text="'Order 1'" :width="400" :height="200" />
      <Bubble :text="'Order 2'" :width="400" :height="200" />
      <Bubble :text="'Order 3'" :width="400" :height="200" />
    </div>
    <div class="orders-row">
      <Bubble :text="'Order 4'" :width="400" :height="200" />
      <Bubble :text="'Order 5'" :width="400" :height="200" />
      <Bubble :text="'Order 6'" :width="400" :height="200" />
    </div>
    <div class="orders-row">
      <Bubble :text="'Order 7'" :width="400" :height="200" />
      <Bubble :text="'Order 8'" :width="400" :height="200" />
      <Bubble :text="'Order 9'" :width="400" :height="200" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.orders-row {
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
  background-color: #175976;
  border: 1px solid #175976;
  color: #FFFFFF;
  border-radius: 10px;
  margin-bottom: 10px;
}
</style>
