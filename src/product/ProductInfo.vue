<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import type { Product } from '@/data/products'

const props = defineProps<{ product: Product }>()

const { t } = useI18n()
const { show } = useToast()
const cartStore = useCartStore()
const router = useRouter()

function addToCart() {
  cartStore.addItem(props.product.id)
  show(t('product.addedToCart'), 'success')
}

function buyNow() {
  cartStore.addItem(props.product.id)
  router.push('/cart')
}
</script>

<template>
  <div class="product-info">
    <h1 class="product-name">{{ t('product.' + product.id + '.name') }}</h1>
    <p class="product-description">{{ t('product.' + product.id + '.description') }}</p>

    <p class="product-price">{{ product.priceDisplay }}</p>

    <div class="product-materials">
      <span
        v-for="mat in product.materials"
        :key="mat"
        class="material-tag"
      >
        {{ mat }}
      </span>
    </div>

    <p class="product-weight">{{ t('product.weight') }}: {{ product.weight }}</p>

    <div class="stock-badge" :class="product.stock > 0 ? 'stock-badge--in' : 'stock-badge--out'">
      {{ product.stock > 0 ? t('product.stockAvailable', { count: product.stock }) : t('product.outOfStock') }}
    </div>

    <div class="product-actions">
      <button class="btn-add-cart" :disabled="product.stock === 0" @click="addToCart">
        {{ t('product.addToCart') }}
      </button>
      <button class="btn-buy-now" :disabled="product.stock === 0" @click="buyNow">
        {{ t('product.buyNow') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-name {
  font-family: $font-headline;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.product-description {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
}

.product-price {
  font-family: $font-headline;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-teal);
  margin: 0;
}

.product-materials {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.material-tag {
  background-color: var(--color-off-white);
  border: 1px solid var(--color-border);
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.product-weight {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  width: fit-content;

  &--in {
    background-color: $color-success-bg;
    color: $color-success;
  }

  &--out {
    background-color: $color-error-bg;
    color: $color-error;
  }
}

.product-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-add-cart {
  flex: 1;
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
  border: none;
  padding: 0.85rem 1.5rem;
  border-radius: 8px;
  font-family: $font-headline;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: var(--color-teal-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--color-teal) 25%, transparent);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-buy-now {
  flex: 1;
  background: transparent;
  color: var(--color-teal);
  border: 1.5px solid var(--color-teal);
  padding: 0.85rem 1.5rem;
  border-radius: 8px;
  font-family: $font-headline;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: var(--color-teal);
    color: var(--color-text-on-dark);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@media (max-width: 480px) {
  .product-actions {
    flex-direction: column;
  }
}
</style>
