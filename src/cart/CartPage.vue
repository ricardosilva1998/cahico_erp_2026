<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const cartStore = useCartStore()
const router = useRouter()
const { t } = useI18n()

function goShopping() {
  router.push('/')
}

function goCheckout() {
  router.push('/checkout')
}

function formatPrice(cents: number) {
  return `€${cents.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
</script>

<template>
  <div class="cart-page">
    <div class="cart-container">
      <h1 class="cart-title">{{ t('cart.title') }}</h1>

      <div v-if="cartStore.cartItems.length === 0" class="cart-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        <p>{{ t('cart.empty') }}</p>
        <button class="btn-continue" @click="goShopping">{{ t('cart.continueShopping') }}</button>
      </div>

      <template v-else>
        <div class="cart-items">
          <div v-for="item in cartStore.cartItems" :key="item.productId" class="cart-item">
            <img
              :src="item.product.images[2] || item.product.images[0]"
              :alt="t('product.' + item.productId + '.name')"
              class="item-image"
            />
            <div class="item-details">
              <h3 class="item-name">{{ t('product.' + item.productId + '.name') }}</h3>
              <p class="item-price">{{ item.product.priceDisplay }}</p>
            </div>
            <div class="item-quantity">
              <button
                class="qty-btn"
                @click="cartStore.updateQuantity(item.productId, item.quantity - 1)"
              >-</button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button
                class="qty-btn"
                @click="cartStore.updateQuantity(item.productId, item.quantity + 1)"
              >+</button>
            </div>
            <p class="item-total">{{ formatPrice(item.lineTotal) }}</p>
            <button class="item-remove" @click="cartStore.removeItem(item.productId)" :title="t('cart.remove')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </button>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span>{{ t('cart.subtotal') }}</span>
            <span class="summary-value">{{ formatPrice(cartStore.cartTotal) }}</span>
          </div>
          <div class="summary-row total">
            <span>{{ t('cart.total') }}</span>
            <span class="summary-value">{{ formatPrice(cartStore.cartTotal) }}</span>
          </div>
          <button class="btn-checkout" @click="goCheckout">{{ t('cart.proceedToCheckout') }}</button>
          <button class="btn-continue-link" @click="goShopping">{{ t('cart.continueShopping') }}</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.cart-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.cart-title {
  font-family: $font-headline;
  font-size: 1.75rem;
  color: var(--color-text-primary);
  margin: 0 0 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cart-empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);

  svg {
    margin-bottom: 1rem;
    opacity: 0.4;
  }

  p {
    font-size: 1.1rem;
    margin: 0 0 1.5rem;
  }
}

.btn-continue {
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-family: $font-headline;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-teal-dark);
  }
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1rem;
  transition: background-color 0.3s, border-color 0.3s;
}

.item-image {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-family: $font-headline;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-btn {
  width: 30px;
  height: 30px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-white);
  color: var(--color-text-primary);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-teal);
    color: var(--color-teal);
  }
}

.qty-value {
  font-weight: 600;
  min-width: 1.5rem;
  text-align: center;
  color: var(--color-text-primary);
}

.item-total {
  font-family: $font-headline;
  font-weight: 700;
  color: var(--color-teal);
  margin: 0;
  min-width: 80px;
  text-align: right;
}

.item-remove {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;

  &:hover {
    color: var(--color-error);
  }
}

.cart-summary {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1.5rem;
  transition: background-color 0.3s, border-color 0.3s;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: var(--color-text-secondary);
  font-size: 0.95rem;

  &.total {
    border-top: 1px solid var(--color-border);
    margin-top: 0.5rem;
    padding-top: 1rem;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--color-text-primary);
  }
}

.summary-value {
  font-family: $font-headline;
}

.btn-checkout {
  width: 100%;
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
  border: none;
  padding: 0.85rem;
  border-radius: 8px;
  font-family: $font-headline;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1.25rem;

  &:hover {
    background-color: var(--color-teal-dark);
  }
}

.btn-continue-link {
  width: 100%;
  background: none;
  border: none;
  color: var(--color-teal);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.75rem;
  margin-top: 0.5rem;
  text-decoration: underline;

  &:hover {
    color: var(--color-teal-dark);
  }
}

@media (max-width: 600px) {
  .cart-item {
    flex-wrap: wrap;
  }

  .item-total {
    min-width: auto;
  }

  .item-quantity {
    margin-left: auto;
  }
}
</style>
