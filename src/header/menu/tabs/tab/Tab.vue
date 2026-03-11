<script setup lang="ts">
import { computed } from 'vue'
import { useTabManager } from '@/composables/useTabManager'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const { currentTab, setTab } = useTabManager()
const isActive = computed(() => currentTab.value === props.name)

const handleClick = () => {
  setTab(props.name)
}
</script>

<template>
  <div :class="['tab', { 'tab-active': isActive }]">
    <span @click="handleClick">{{ props.name }}</span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.tab {
  padding: 10px 20px;
  background-color: $color-brown;
  border: 2px solid $color-brown;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: $color-text-on-dark;

  &:hover {
    background-color: $color-brown-light;
    border-color: $color-brown-light;
  }

  &.tab-active {
    background-color: $color-marine;
    border-color: $color-marine;
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 8px rgba(27, 58, 92, 0.3);
  }

  span {
    cursor: pointer;
    user-select: none;
  }
}
</style>
