<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getProductById, getRelatedProducts } from '@/data/products'
import ProductGallery from './ProductGallery.vue'
import ProductInfo from './ProductInfo.vue'
import ProductStory from './ProductStory.vue'
import SocialShare from './SocialShare.vue'
import ProductReviews from './ProductReviews.vue'
import RelatedProducts from './RelatedProducts.vue'

const route = useRoute()
const { t } = useI18n()

const product = computed(() => getProductById(route.params.id as string))
const related = computed(() => getRelatedProducts(route.params.id as string))
const productUrl = computed(() => window.location.href)
const productName = computed(() =>
  product.value ? t('product.' + product.value.id + '.name') : '',
)
</script>

<template>
  <div v-if="product" class="product-detail">
    <div class="product-top">
      <div class="product-gallery-col">
        <ProductGallery :images="product.images" />
      </div>
      <div class="product-info-col">
        <ProductInfo :product="product" />
        <SocialShare :product-url="productUrl" :product-name="productName" />
      </div>
    </div>
    <ProductStory :product-id="product.id" />
    <ProductReviews :product-id="product.id" />
    <RelatedProducts :products="related" />
  </div>

  <div v-else class="product-not-found">
    <h2>{{ t('product.productNotFound') }}</h2>
    <router-link to="/" class="back-link">{{ t('product.backToHome') }}</router-link>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.product-detail {
  padding: 2rem 0 3rem;
}

.product-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.product-gallery-col {
  min-width: 0;
}

.product-info-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-not-found {
  text-align: center;
  padding: 4rem 1rem;

  h2 {
    font-family: $font-headline;
    font-size: 1.4rem;
    color: var(--color-text-primary);
    margin: 0 0 1rem;
  }
}

.back-link {
  color: var(--color-teal);
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
