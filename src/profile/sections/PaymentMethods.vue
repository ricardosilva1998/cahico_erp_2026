<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const showForm = ref(false)
const form = ref({
  type: 'visa',
  last_four: '',
  expiry_month: 1,
  expiry_year: new Date().getFullYear(),
  cardholder_name: '',
})

onMounted(() => {
  profileStore.fetchPaymentMethods()
})

async function handleAdd() {
  if (form.value.last_four.length !== 4 || !form.value.cardholder_name) return
  await profileStore.addPaymentMethod({
    type: form.value.type,
    last_four: form.value.last_four,
    expiry_month: form.value.expiry_month,
    expiry_year: form.value.expiry_year,
    cardholder_name: form.value.cardholder_name,
  })
  showForm.value = false
  form.value = { type: 'visa', last_four: '', expiry_month: 1, expiry_year: new Date().getFullYear(), cardholder_name: '' }
}

function cardLabel(type: string) {
  switch (type) {
    case 'visa': return 'Visa'
    case 'mastercard': return 'Mastercard'
    case 'amex': return 'Amex'
    default: return 'Card'
  }
}
</script>

<template>
  <div class="payment-methods">
    <div class="section-header">
      <h2 class="section-title">Payment Methods</h2>
      <button class="add-btn" @click="showForm = !showForm">
        {{ showForm ? 'Cancel' : '+ Add' }}
      </button>
    </div>

    <form v-if="showForm" class="add-form" @submit.prevent="handleAdd">
      <div class="form-row">
        <div class="form-group">
          <label>Card Type</label>
          <select v-model="form.type">
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="amex">Amex</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Last 4 Digits</label>
          <input v-model="form.last_four" maxlength="4" pattern="\d{4}" placeholder="1234" required />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Expiry Month</label>
          <select v-model.number="form.expiry_month">
            <option v-for="m in 12" :key="m" :value="m">{{ String(m).padStart(2, '0') }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Expiry Year</label>
          <input v-model.number="form.expiry_year" type="number" :min="new Date().getFullYear()" :max="new Date().getFullYear() + 15" required />
        </div>
      </div>
      <div class="form-group">
        <label>Cardholder Name</label>
        <input v-model="form.cardholder_name" placeholder="Name on card" required />
      </div>
      <button type="submit" class="save-btn">Add Card</button>
    </form>

    <div v-if="profileStore.loading" class="loading">Loading...</div>

    <div v-else-if="profileStore.paymentMethods.length === 0 && !showForm" class="empty-state">
      <p>No payment methods saved.</p>
    </div>

    <div v-else class="cards-list">
      <div v-for="method in profileStore.paymentMethods" :key="method.id" class="card-item">
        <div class="card-info">
          <span class="card-type">{{ cardLabel(method.type) }}</span>
          <span class="card-number">**** {{ method.last_four }}</span>
          <span class="card-expiry">{{ String(method.expiry_month).padStart(2, '0') }}/{{ method.expiry_year }}</span>
          <span v-if="method.is_default" class="default-badge">Default</span>
        </div>
        <div class="card-holder">{{ method.cardholder_name }}</div>
        <button class="delete-btn" @click="profileStore.deletePaymentMethod(method.id)">Remove</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-family: $font-headline;
  font-size: 1.1rem;
  color: var(--color-text-primary);
  margin: 0;
}

.add-btn {
  background: none;
  border: 1px solid var(--color-teal);
  color: var(--color-teal);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 600;
  min-height: 36px;

  &:hover {
    background-color: var(--color-teal);
    color: var(--color-text-on-dark);
  }
}

.add-form {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: var(--color-bg-section);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: background-color 0.3s, border-color 0.3s;
}

.form-row {
  display: flex;
  gap: 0.75rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }

  input,
  select {
    padding: 0.5rem;
    border: 1px solid var(--color-input-border);
    border-radius: 6px;
    font-size: 0.85rem;
    color: var(--color-text-primary);
    background: var(--color-white);
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: var(--color-teal);
    }
  }
}

.save-btn {
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;

  &:hover {
    background-color: var(--color-teal-dark);
  }
}

.loading,
.empty-state {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  padding: 2rem 0;
  text-align: center;
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-item {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: background-color 0.3s, border-color 0.3s;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

.card-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;

  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
}

.card-type {
  font-weight: 600;
  color: var(--color-teal);
  font-size: 0.85rem;
}

.card-number {
  font-family: monospace;
  color: var(--color-text-primary);
  font-size: 0.9rem;
}

.card-expiry {
  color: var(--color-text-secondary);
  font-size: 0.8rem;
}

.default-badge {
  background-color: color-mix(in srgb, var(--color-gold) 20%, transparent);
  color: var(--color-text-primary);
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-weight: 600;
}

.card-holder {
  color: var(--color-text-secondary);
  font-size: 0.8rem;
}

.delete-btn {
  background: none;
  border: none;
  color: var(--color-error);
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
