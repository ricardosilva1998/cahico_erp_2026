<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTabManager } from '@/composables/useTabManager'
import { getProductsByCategory } from '@/data/products'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { setTab } = useTabManager()

const category = computed(() => route.params.category as string)

const validCategories = ['rings', 'necklaces', 'earrings', 'bracelets', 'anklets', 'brooches', 'pendants', 'cufflinks']

const isValid = computed(() => validCategories.includes(category.value))

const products = computed(() => getProductsByCategory(category.value))

const categoryName = computed(() =>
  isValid.value ? t(`collections.${category.value}`) : '',
)

const categoryDesc = computed(() =>
  isValid.value ? t(`collections.${category.value}Desc`) : '',
)

function goBackToCollections() {
  router.push('/')
  setTab('Stock')
}
</script>

<template>
  <div v-if="isValid" class="collection-page">
    <div class="collection-header">
      <button class="back-link" @click="goBackToCollections">
        &larr; {{ t('collections.title') }}
      </button>
      <div class="header-title-row">
        <h1 class="header-title">{{ categoryName }}</h1>
        <span class="item-count">{{ t('collections.items', { count: products.length }) }}</span>
      </div>
      <p class="header-desc">{{ categoryDesc }}</p>
    </div>

    <div class="product-grid">
      <router-link
        v-for="product in products"
        :key="product.id"
        :to="'/product/' + product.id"
        class="product-card-link"
      >
        <div class="product-card">
          <div class="card-image-wrap">
            <img :src="product.images[0]" :alt="t(`product.${product.id}.name`)" class="card-image" />
            <span v-if="product.stock === 0" class="stock-badge out">{{ t('product.outOfStock') }}</span>
            <span v-else-if="product.stock <= 3" class="stock-badge low">{{ t('product.stockAvailable', { count: product.stock }) }}</span>
          </div>
          <div class="card-body">
            <h3 class="card-name">{{ t(`product.${product.id}.name`) }}</h3>
            <p class="card-materials">{{ product.materials.join(' · ') }}</p>
            <p class="card-price">{{ product.priceDisplay }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>

  <div v-else class="not-found">
    <h2>{{ t('product.productNotFound') }}</h2>
    <router-link to="/" class="back-link-simple">{{ t('product.backToHome') }}</router-link>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.collection-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.collection-header {
  margin-bottom: 2rem;
}

.back-link {
  background: none;
  border: none;
  font-family: $font-headline;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-teal);
  cursor: pointer;
  padding: 0;
  margin-bottom: 1rem;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    color: var(--color-teal-dark);
  }
}

.header-title-row {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.header-title {
  font-family: $font-headline;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.item-count {
  font-family: $font-body;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-on-dark);
  background-color: var(--color-teal);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  white-space: nowrap;
}

.header-desc {
  font-family: $font-body;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 600px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.product-card-link {
  text-decoration: none;
  color: inherit;
}

.product-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.25s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-card-hover);
    border-color: var(--color-gold);
  }
}

.card-image-wrap {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  .product-card:hover & {
    transform: scale(1.05);
  }
}

.stock-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-family: $font-body;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;

  &.out {
    background-color: var(--color-error-bg, rgba(192, 57, 43, 0.1));
    color: var(--color-error, #C0392B);
  }

  &.low {
    background-color: rgba(186, 160, 48, 0.15);
    color: var(--color-gold);
  }
}

.card-body {
  padding: 1.25rem;
}

.card-name {
  font-family: $font-headline;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem;
}

.card-materials {
  font-family: $font-body;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  margin: 0 0 0.5rem;
}

.card-price {
  font-family: $font-body;
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-teal);
  margin: 0;
}

.not-found {
  text-align: center;
  padding: 4rem 1rem;

  h2 {
    font-family: $font-headline;
    font-size: 1.4rem;
    color: var(--color-text-primary);
    margin: 0 0 1rem;
  }
}

.back-link-simple {
  color: var(--color-teal);
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: 480px) {
  .collection-page {
    padding: 1.25rem;
  }

  .header-title {
    font-size: 1.5rem;
  }
}
</style>
