<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Product } from '@/data/products'

defineProps<{ products: Product[] }>()

const { t } = useI18n()
</script>

<template>
  <section v-if="products.length" class="related">
    <h2 class="related-title">{{ t('product.relatedPieces') }}</h2>
    <div class="related-grid">
      <router-link
        v-for="p in products"
        :key="p.id"
        :to="'/product/' + p.id"
        class="related-card"
      >
        <div class="related-image">
          <img :src="p.images[0]" :alt="t('product.' + p.id + '.name')" class="related-photo" />
        </div>
        <div class="related-info">
          <h3 class="related-name">{{ t('product.' + p.id + '.name') }}</h3>
          <p class="related-material">{{ p.materials.join(' · ') }}</p>
          <p class="related-price">{{ p.priceDisplay }}</p>
        </div>
      </router-link>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.related {
  margin-top: 2.5rem;
}

.related-title {
  font-family: $font-headline;
  font-size: 1.4rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-text-primary);
  margin: 0 0 1.5rem;
  text-align: center;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.related-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.25s;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-card-hover);
    border-color: var(--color-gold);
  }
}

.related-image {
  height: 180px;
  overflow: hidden;
}

.related-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  .related-card:hover & {
    transform: scale(1.04);
  }
}

.related-info {
  padding: 1.25rem 1.25rem 1.5rem;
}

.related-name {
  font-family: $font-headline;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem;
}

.related-material {
  color: var(--color-text-secondary);
  font-size: 0.78rem;
  margin: 0 0 0.5rem;
}

.related-price {
  font-weight: 700;
  color: var(--color-teal);
  font-size: 1rem;
  margin: 0;
}
</style>
