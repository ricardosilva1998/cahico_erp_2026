<script setup lang="ts">
import Bubble from '../bubble-items/Bubble.vue'
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <div class="bubble-title">
      <span>Materials</span>
    </div>
    <div class="materials-row">
      <Bubble :text="'Material 1'" :width="280" :height="140" />
      <Bubble :text="'Material 2'" :width="280" :height="140" />
      <Bubble :text="'Material 3'" :width="280" :height="140" />
    </div>
    <div class="materials-row">
      <Bubble :text="'Material 4'" :width="280" :height="140" />
      <Bubble :text="'Material 5'" :width="280" :height="140" />
      <Bubble :text="'Material 6'" :width="280" :height="140" />
    </div>
    <div class="materials-row">
      <Bubble :text="'Material 7'" :width="280" :height="140" />
      <Bubble :text="'Material 8'" :width="280" :height="140" />
      <Bubble :text="'Material 9'" :width="280" :height="140" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.materials-row {
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
  max-width: 150px;
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: #6B4226;
  border: 1px solid #6B4226;
  color: #FAF3EB;
  border-radius: 10px;
  margin-bottom: 10px;
}
</style>
