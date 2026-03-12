<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ images: string[] }>()

const activeIndex = ref(0)

function selectImage(index: number) {
  activeIndex.value = index
}
</script>

<template>
  <div class="gallery">
    <div class="gallery-main">
      <img
        :src="props.images[activeIndex]"
        alt="Product image"
        class="gallery-main-img"
      />
    </div>
    <div class="gallery-thumbs">
      <button
        v-for="(img, i) in props.images"
        :key="i"
        class="gallery-thumb"
        :class="{ 'gallery-thumb--active': i === activeIndex }"
        @click="selectImage(i)"
      >
        <img :src="img" alt="Thumbnail" class="gallery-thumb-img" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.gallery {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gallery-main {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--color-off-white);
  border: 1px solid var(--color-border);
}

.gallery-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.gallery-thumbs {
  display: flex;
  gap: 0.5rem;
}

.gallery-thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--color-border);
  cursor: pointer;
  padding: 0;
  background: none;
  transition: border-color 0.2s;

  &--active {
    border-color: var(--color-teal);
  }

  &:hover {
    border-color: var(--color-gold);
  }
}

.gallery-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
