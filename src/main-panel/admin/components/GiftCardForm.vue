<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore, type GiftCard } from '@/stores/admin'
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  editCard?: GiftCard
}>()

const emit = defineEmits<{
  close: []
}>()

const adminStore = useAdminStore()
const { show: showToast } = useToast()
const { t } = useI18n()

const code = ref(props.editCard?.code ?? '')
const valueEur = ref(props.editCard?.valueEur ?? 50)
const remainingEur = ref(props.editCard?.remainingEur ?? props.editCard?.valueEur ?? 50)
const recipientEmail = ref(props.editCard?.recipientEmail ?? '')
const expiryDate = ref(props.editCard?.expiryDate ?? '')

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const r = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  code.value = `GIFT-${r(4)}-${r(4)}`
}

if (!props.editCard) {
  generateCode()
}

function save() {
  if (!code.value || !expiryDate.value || valueEur.value <= 0) return

  if (props.editCard) {
    adminStore.updateGiftCard(props.editCard.id, {
      code: code.value.toUpperCase(),
      valueEur: valueEur.value,
      remainingEur: remainingEur.value,
      recipientEmail: recipientEmail.value,
      expiryDate: expiryDate.value,
    })
    showToast(t('admin.save'), 'success')
  } else {
    adminStore.addGiftCard({
      code: code.value.toUpperCase(),
      valueEur: valueEur.value,
      remainingEur: valueEur.value,
      recipientEmail: recipientEmail.value,
      expiryDate: expiryDate.value,
      active: true,
      createdAt: new Date().toISOString(),
    })
    showToast(t('admin.giftCardCreated'), 'success')

    if (recipientEmail.value) {
      fetch('/api/send-gift-card-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: recipientEmail.value,
          code: code.value.toUpperCase(),
          valueEur: valueEur.value,
          expiryDate: expiryDate.value,
        }),
      })
        .then((res) => {
          if (res.ok) showToast(t('admin.giftCardEmailSent'), 'success')
        })
        .catch((err) => {
          console.warn('Gift card email failed:', err)
          showToast(t('admin.giftCardEmailFailed'), 'info')
        })
    }
  }
  emit('close')
}
</script>

<template>
  <div class="code-form">
    <h4 class="form-title">{{ editCard ? t('admin.editProduct') : t('admin.createGiftCard') }}</h4>

    <div class="form-group">
      <label>{{ t('admin.giftCardCode') }}</label>
      <div class="code-input-row">
        <input
          v-model="code"
          type="text"
          :placeholder="t('admin.giftCardCode')"
          style="text-transform: uppercase"
        />
        <button v-if="!editCard" class="btn-generate" @click="generateCode">{{ t('admin.giftCardGenerate') }}</button>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>{{ t('admin.giftCardValue') }} (EUR)</label>
        <input v-model.number="valueEur" type="number" min="1" />
      </div>
      <div v-if="editCard" class="form-group">
        <label>{{ t('admin.giftCardRemaining') }} (EUR)</label>
        <input v-model.number="remainingEur" type="number" min="0" :max="valueEur" />
      </div>
      <div class="form-group">
        <label>{{ t('admin.giftCardRecipient') }}</label>
        <input v-model="recipientEmail" type="email" placeholder="recipient@email.com" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>{{ t('admin.giftCardExpiry') }}</label>
        <input v-model="expiryDate" type="date" />
      </div>
    </div>

    <div class="form-actions">
      <button class="btn-cancel" @click="emit('close')">{{ t('admin.cancel') }}</button>
      <button class="btn-primary" @click="save">{{ t('admin.save') }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.code-form {
  background: var(--color-off-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
}

.form-title {
  font-family: $font-headline;
  font-size: 1.05rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-primary);
  margin: 0 0 1rem;
}

.form-group {
  margin-bottom: 1rem;

  label {
    display: block;
    font-family: $font-body;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.35rem;
  }

  input {
    width: 100%;
    padding: 0.55rem 0.75rem;
    border: 1px solid var(--color-input-border);
    border-radius: 8px;
    font-family: $font-body;
    font-size: 0.9rem;
    background: var(--color-white);
    color: var(--color-text-primary);
    box-sizing: border-box;

    &:focus { outline: none; border-color: var(--color-teal); }
  }
}

.code-input-row {
  display: flex;
  gap: 0.5rem;

  input { flex: 1; }
}

.btn-generate {
  background: none;
  border: 1px solid var(--color-teal);
  color: var(--color-teal);
  border-radius: 8px;
  padding: 0.55rem 0.75rem;
  font-family: $font-body;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: var(--color-teal);
    color: var(--color-text-on-dark);
  }
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-primary {
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
  border: none;
  border-radius: 8px;
  padding: 0.55rem 1.25rem;
  font-family: $font-body;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;

  &:hover { opacity: 0.9; }
}

.btn-cancel {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  border-radius: 8px;
  padding: 0.55rem 1rem;
  font-family: $font-body;
  font-size: 0.85rem;
  cursor: pointer;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
