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
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.1rem;
  color: $color-text-primary;
  margin: 0;
}

.add-btn {
  background: none;
  border: 1px solid $color-marine;
  color: $color-marine;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: $color-marine;
    color: white;
  }
}

.add-form {
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: $color-beige;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-row {
  display: flex;
  gap: 0.75rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-size: 0.8rem;
    color: $color-text-secondary;
  }

  input,
  select {
    padding: 0.5rem;
    border: 1px solid $color-input-border;
    border-radius: 6px;
    font-size: 0.85rem;
    color: $color-text-primary;
    background: white;

    &:focus {
      outline: none;
      border-color: $color-marine;
    }
  }
}

.save-btn {
  background-color: $color-marine;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: $color-navy;
  }
}

.loading,
.empty-state {
  color: $color-text-secondary;
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
  border: 1px solid $color-border;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.card-type {
  font-weight: 600;
  color: $color-marine;
  font-size: 0.85rem;
}

.card-number {
  font-family: monospace;
  color: $color-text-primary;
  font-size: 0.9rem;
}

.card-expiry {
  color: $color-text-secondary;
  font-size: 0.8rem;
}

.default-badge {
  background-color: rgba(198, 166, 100, 0.2);
  color: $color-brown;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-weight: 600;
}

.card-holder {
  color: $color-text-secondary;
  font-size: 0.8rem;
}

.delete-btn {
  background: none;
  border: none;
  color: $color-error;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
