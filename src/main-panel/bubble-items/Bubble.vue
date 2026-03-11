<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="bubble-small" :style="{ width: `${props.width}px`, height: `${props.height}px` }">
    <span class="bubble-text">{{ props.text }}</span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.bubble-small {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: 1px solid $color-border;
  border-radius: 10px;
  padding: 8px;
  box-sizing: border-box;
  box-shadow: 0 2px 6px rgba(61, 43, 31, 0.06);
}

.bubble-text {
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  font-size: 0.9rem;
  line-height: 1.3;
  color: $color-text-primary;
}
</style>
