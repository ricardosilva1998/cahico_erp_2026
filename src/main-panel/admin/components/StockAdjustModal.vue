<script setup lang="ts">
import { ref, computed } from 'vue'
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

const isAdding = ref(true)
const quantity = ref(1)
const reason = ref('')

const currentStock = computed(() => adminStore.getEffectiveStock(props.product.id, props.product.stock))
const recentLog = computed(() => adminStore.getStockLog(props.product.id).slice(0, 10))

function save() {
  if (quantity.value <= 0 || !reason.value) return
  const delta = isAdding.value ? quantity.value : -quantity.value
  adminStore.adjustStock(props.product.id, delta, reason.value)
  showToast(t('admin.stockAdjusted'), 'success')
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card">
      <h3 class="modal-title">{{ t('admin.adjustStock') }}</h3>
      <p class="product-name">{{ product.id }}</p>
      <p class="current-stock">Current: <strong>{{ currentStock }}</strong></p>

      <div class="toggle-row">
        <button
          :class="['mode-btn', { active: isAdding }]"
          @click="isAdding = true"
        >
          {{ t('admin.addStock') }}
        </button>
        <button
          :class="['mode-btn', { active: !isAdding }]"
          @click="isAdding = false"
        >
          {{ t('admin.removeStock') }}
        </button>
      </div>

      <div class="form-group">
        <label>{{ t('admin.quantity') }}</label>
        <input v-model.number="quantity" type="number" min="1" />
      </div>

      <div class="form-group">
        <label>{{ t('admin.reason') }}</label>
        <input v-model="reason" type="text" :placeholder="t('admin.reason')" />
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" @click="emit('close')">{{ t('admin.cancel') }}</button>
        <button class="btn-primary" @click="save">{{ t('admin.save') }}</button>
      </div>

      <div v-if="recentLog.length > 0" class="log-section">
        <h4 class="log-title">Recent Changes</h4>
        <div v-for="entry in recentLog" :key="entry.id" class="log-entry">
          <span :class="['log-delta', entry.delta > 0 ? 'positive' : 'negative']">
            {{ entry.delta > 0 ? '+' : '' }}{{ entry.delta }}
          </span>
          <span class="log-reason">{{ entry.reason }}</span>
          <span class="log-time">{{ new Date(entry.timestamp).toLocaleDateString() }}</span>
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

.modal-title {
  font-family: $font-headline;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.25rem;
}

.product-name {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0 0 0.5rem;
}

.current-stock {
  font-size: 0.9rem;
  margin: 0 0 1rem;
  color: var(--color-text-primary);

  strong { color: var(--color-teal); }
}

.toggle-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.mode-btn {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-alt);
  color: var(--color-text-secondary);
  font-family: $font-body;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background-color: var(--color-teal);
    color: var(--color-text-on-dark);
    border-color: var(--color-teal);
  }
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
    background: var(--color-off-white);
    color: var(--color-text-primary);
    box-sizing: border-box;

    &:focus { outline: none; border-color: var(--color-teal); }
  }
}

.modal-actions {
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

.log-section {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.log-title {
  font-family: $font-headline;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem;
}

.log-entry {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0;
  font-size: 0.8rem;
  border-bottom: 1px solid var(--color-border);

  &:last-child { border-bottom: none; }
}

.log-delta {
  font-weight: 700;
  min-width: 35px;

  &.positive { color: var(--color-success); }
  &.negative { color: var(--color-error); }
}

.log-reason {
  flex: 1;
  color: var(--color-text-primary);
}

.log-time {
  color: var(--color-text-secondary);
  font-size: 0.75rem;
}
</style>
