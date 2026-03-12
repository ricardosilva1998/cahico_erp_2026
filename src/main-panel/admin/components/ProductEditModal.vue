<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'
import type { Product } from '@/data/products'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  close: []
}>()

const adminStore = useAdminStore()
const { show: showToast } = useToast()
const { t } = useI18n()

const priceEur = ref<number | undefined>(undefined)
const stock = ref<number | undefined>(undefined)
const visible = ref(true)
const salePercent = ref(0)

onMounted(() => {
  const override = adminStore.getProductOverride(props.product.id)
  if (override) {
    priceEur.value = override.priceEur
    stock.value = override.stock
    visible.value = override.visible ?? true
    salePercent.value = override.salePercent ?? 0
  } else {
    priceEur.value = undefined
    stock.value = undefined
    visible.value = true
    salePercent.value = 0
  }
})

function save() {
  adminStore.setProductOverride(props.product.id, {
    priceEur: priceEur.value,
    stock: stock.value,
    visible: visible.value,
    salePercent: salePercent.value || undefined,
  })
  showToast(t('admin.productUpdated'), 'success')
  emit('close')
}

function resetDefaults() {
  adminStore.removeProductOverride(props.product.id)
  showToast(t('admin.resetDefaults'), 'info')
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <img :src="product.images[2] || product.images[0]" :alt="product.id" class="product-thumb" />
        <div>
          <h3 class="modal-title">{{ t('admin.editProduct') }}</h3>
          <p class="product-name">{{ product.id }}</p>
        </div>
      </div>

      <div class="form-group">
        <label>{{ t('admin.priceOverride') }} (EUR)</label>
        <input
          v-model.number="priceEur"
          type="number"
          min="0"
          step="10"
          :placeholder="String(product.priceEur)"
        />
      </div>

      <div class="form-group">
        <label>{{ t('admin.stockOverride') }}</label>
        <input
          v-model.number="stock"
          type="number"
          min="0"
          :placeholder="String(product.stock)"
        />
      </div>

      <div class="form-group">
        <label>{{ t('admin.discountPercentLabel') }} (%)</label>
        <input
          v-model.number="salePercent"
          type="number"
          min="0"
          max="100"
          placeholder="0"
        />
      </div>

      <div class="form-group toggle-row">
        <label>{{ t('admin.visible') }}</label>
        <button
          :class="['toggle-btn', { active: visible }]"
          @click="visible = !visible"
        >
          {{ visible ? t('admin.visible') : t('admin.hidden') }}
        </button>
      </div>

      <div class="modal-actions">
        <button class="btn-secondary" @click="resetDefaults">{{ t('admin.resetDefaults') }}</button>
        <div class="action-right">
          <button class="btn-cancel" @click="emit('close')">{{ t('admin.cancel') }}</button>
          <button class="btn-primary" @click="save">{{ t('admin.save') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-card {
  background: var(--color-white);
  border-radius: 16px;
  padding: 2rem;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.product-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}

.modal-title {
  font-family: $font-headline;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.product-name {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0.15rem 0 0;
}

.form-group {
  margin-bottom: 1.25rem;

  label {
    display: block;
    font-family: $font-body;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.4rem;
  }

  input {
    width: 100%;
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--color-input-border);
    border-radius: 8px;
    font-family: $font-body;
    font-size: 0.9rem;
    background: var(--color-off-white);
    color: var(--color-text-primary);
    transition: border-color 0.2s;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--color-teal);
    }
  }
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  label {
    margin-bottom: 0;
  }
}

.toggle-btn {
  font-family: $font-headline;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.35rem 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
  text-align: center;
  background-color: var(--color-bg-alt);
  color: var(--color-text-secondary);

  &.active {
    background-color: var(--color-teal);
    color: var(--color-text-on-dark);
    border-color: var(--color-teal);
  }
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.action-right {
  display: flex;
  gap: 0.5rem;
}

.btn-primary {
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.25rem;
  font-family: $font-body;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover { opacity: 0.9; }
}

.btn-secondary {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-family: $font-body;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-error);
    color: var(--color-error);
  }
}

.btn-cancel {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-family: $font-body;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.6rem 0.75rem;

  &:hover { color: var(--color-text-primary); }
}
</style>
