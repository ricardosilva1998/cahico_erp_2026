<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const useProfileInfo = ref(true)
const purchaseCompleted = ref(false)

const form = ref({
  fullName: '',
  email: '',
  address: '',
  address2: '',
  city: '',
  postalCode: '',
  country: '',
  phone: '',
})

const paymentMethod = ref<'saved' | 'new'>('new')
const cardForm = ref({
  number: '',
  expiry: '',
  cvv: '',
  name: '',
})

function formatPrice(cents: number) {
  return `€${cents.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function completePurchase() {
  purchaseCompleted.value = true
  cartStore.clearCart()
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="checkout-page">
    <!-- Purchase Complete Modal -->
    <div v-if="purchaseCompleted" class="modal-overlay" @click.self="goHome">
      <div class="modal-card">
        <div class="modal-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2>{{ t('checkout.purchaseCompleted') }}</h2>
        <p>{{ t('checkout.purchaseCompletedMsg') }}</p>
        <button class="btn-primary" @click="goHome">{{ t('checkout.backToHome') }}</button>
      </div>
    </div>

    <div class="checkout-container">
      <h1 class="checkout-title">{{ t('checkout.title') }}</h1>

      <div v-if="cartStore.cartItems.length === 0 && !purchaseCompleted" class="checkout-empty">
        <p>{{ t('cart.empty') }}</p>
        <button class="btn-primary" @click="goHome">{{ t('cart.continueShopping') }}</button>
      </div>

      <div v-else class="checkout-grid">
        <!-- Left: Shipping & Payment -->
        <div class="checkout-form-section">
          <h2 class="section-title">{{ t('checkout.shippingInfo') }}</h2>

          <div class="toggle-group">
            <label class="toggle-label">
              <input type="radio" :value="true" v-model="useProfileInfo" />
              {{ t('checkout.useProfileInfo') }}
            </label>
            <label class="toggle-label">
              <input type="radio" :value="false" v-model="useProfileInfo" />
              {{ t('checkout.useDifferentAddress') }}
            </label>
          </div>

          <div v-if="useProfileInfo" class="profile-info-summary">
            <p><strong>{{ authStore.userDisplayName }}</strong></p>
            <p>{{ authStore.userEmail }}</p>
          </div>

          <div v-else class="form-fields">
            <div class="form-group">
              <label>{{ t('checkout.fullName') }}</label>
              <input v-model="form.fullName" type="text" />
            </div>
            <div class="form-group">
              <label>{{ t('auth.email') }}</label>
              <input v-model="form.email" type="email" />
            </div>
            <div class="form-group">
              <label>{{ t('checkout.address') }}</label>
              <input v-model="form.address" type="text" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>{{ t('checkout.city') }}</label>
                <input v-model="form.city" type="text" />
              </div>
              <div class="form-group">
                <label>{{ t('checkout.postalCode') }}</label>
                <input v-model="form.postalCode" type="text" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>{{ t('checkout.country') }}</label>
                <input v-model="form.country" type="text" />
              </div>
              <div class="form-group">
                <label>{{ t('checkout.phone') }}</label>
                <input v-model="form.phone" type="tel" />
              </div>
            </div>
          </div>

          <h2 class="section-title">{{ t('checkout.paymentMethod') }}</h2>

          <div class="toggle-group">
            <label class="toggle-label">
              <input type="radio" value="new" v-model="paymentMethod" />
              {{ t('checkout.addNewCard') }}
            </label>
          </div>

          <div v-if="paymentMethod === 'new'" class="form-fields">
            <div class="form-group">
              <label>{{ t('checkout.cardNumber') }}</label>
              <input v-model="cardForm.number" type="text" placeholder="1234 5678 9012 3456" maxlength="19" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>{{ t('checkout.expiry') }}</label>
                <input v-model="cardForm.expiry" type="text" placeholder="MM/YY" maxlength="5" />
              </div>
              <div class="form-group">
                <label>{{ t('checkout.cvv') }}</label>
                <input v-model="cardForm.cvv" type="text" placeholder="123" maxlength="4" />
              </div>
            </div>
            <div class="form-group">
              <label>{{ t('checkout.cardholderName') }}</label>
              <input v-model="cardForm.name" type="text" />
            </div>
          </div>
        </div>

        <!-- Right: Order Summary -->
        <div class="checkout-summary">
          <h2 class="section-title">{{ t('checkout.orderSummary') }}</h2>

          <div class="summary-items">
            <div v-for="item in cartStore.cartItems" :key="item.productId" class="summary-item">
              <img :src="item.product.images[2] || item.product.images[0]" :alt="t('product.' + item.productId + '.name')" class="summary-img" />
              <div class="summary-item-info">
                <p class="summary-item-name">{{ t('product.' + item.productId + '.name') }}</p>
                <p class="summary-item-qty">x{{ item.quantity }}</p>
              </div>
              <p class="summary-item-price">{{ formatPrice(item.lineTotal) }}</p>
            </div>
          </div>

          <div class="summary-totals">
            <div class="summary-row">
              <span>{{ t('cart.subtotal') }}</span>
              <span>{{ formatPrice(cartStore.cartTotal) }}</span>
            </div>
            <div class="summary-row">
              <span>{{ t('checkout.shipping') }}</span>
              <span class="free-shipping">{{ t('checkout.freeShipping') }}</span>
            </div>
            <div class="summary-row total">
              <span>{{ t('cart.total') }}</span>
              <span>{{ formatPrice(cartStore.cartTotal) }}</span>
            </div>
          </div>

          <button class="btn-complete" @click="completePurchase">
            {{ t('checkout.completePurchase') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.checkout-page {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.checkout-title {
  font-family: $font-headline;
  font-size: 1.75rem;
  color: var(--color-text-primary);
  margin: 0 0 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.checkout-empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);

  p {
    font-size: 1.1rem;
    margin: 0 0 1.5rem;
  }
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}

.checkout-form-section,
.checkout-summary {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1.5rem;
  transition: background-color 0.3s, border-color 0.3s;
}

.section-title {
  font-family: $font-headline;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  & + .section-title {
    margin-top: 1.5rem;
  }
}

.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  cursor: pointer;

  input[type="radio"] {
    accent-color: var(--color-teal);
  }
}

.profile-info-summary {
  background-color: var(--color-bg-alt);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;

  p {
    margin: 0;
    color: var(--color-text-primary);
    font-size: 0.9rem;

    & + p {
      margin-top: 0.25rem;
      color: var(--color-text-secondary);
    }
  }
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  label {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  input {
    background: var(--color-white);
    border: 1px solid var(--color-input-border);
    border-radius: 6px;
    color: var(--color-text-primary);
    padding: 0.6rem 0.75rem;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;

    &::placeholder {
      color: var(--color-text-muted);
    }

    &:focus {
      border-color: var(--color-teal);
    }
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.summary-img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.summary-item-info {
  flex: 1;
  min-width: 0;
}

.summary-item-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-item-qty {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.summary-item-price {
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  font-size: 0.9rem;
}

.summary-totals {
  border-top: 1px solid var(--color-border);
  padding-top: 0.75rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.35rem 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary);

  &.total {
    border-top: 1px solid var(--color-border);
    margin-top: 0.5rem;
    padding-top: 0.75rem;
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--color-text-primary);
  }
}

.free-shipping {
  color: var(--color-success);
  font-weight: 500;
}

.btn-complete {
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
  margin-top: 1rem;

  &:hover {
    background-color: var(--color-teal-dark);
  }
}

.btn-primary {
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-family: $font-headline;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-teal-dark);
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-card {
  background: var(--color-white);
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);

  h2 {
    font-family: $font-headline;
    color: var(--color-teal);
    margin: 1rem 0 0.5rem;
    font-size: 1.4rem;
  }

  p {
    color: var(--color-text-secondary);
    margin: 0 0 1.5rem;
    font-size: 0.95rem;
    line-height: 1.5;
  }
}

.modal-icon {
  color: var(--color-success);
}

@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
