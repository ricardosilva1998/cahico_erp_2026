<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{ productId: string }>()

const { t } = useI18n()
</script>

<template>
  <section class="product-story">
    <div class="story-cards">
      <div class="story-card">
        <h3 class="story-card-title">{{ t('product.inspiration') }}</h3>
        <p class="story-card-text">{{ t('product.' + productId + '.inspiration') }}</p>
      </div>
      <div class="story-card">
        <h3 class="story-card-title">{{ t('product.materialsUsed') }}</h3>
        <p class="story-card-text">{{ t('product.' + productId + '.materialsStory') }}</p>
      </div>
      <div class="story-card">
        <h3 class="story-card-title">{{ t('product.howItsMade') }}</h3>
        <p class="story-card-text">{{ t('product.' + productId + '.crafting') }}</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.product-story {
  margin-top: 2rem;
}

.story-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.story-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1.75rem;
  transition: all 0.25s;

  &:hover {
    border-color: var(--color-gold);
    transform: translateY(-2px);
    box-shadow: var(--shadow-card-hover);
  }
}

.story-card-title {
  font-family: $font-headline;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-teal);
  margin: 0 0 0.75rem;
}

.story-card-text {
  color: var(--color-text-secondary);
  font-size: 0.88rem;
  line-height: 1.7;
  margin: 0;
}
</style>
