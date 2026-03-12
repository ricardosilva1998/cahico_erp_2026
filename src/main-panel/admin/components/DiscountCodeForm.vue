<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore, type DiscountCode } from '@/stores/admin'
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  editCode?: DiscountCode
}>()

const emit = defineEmits<{
  close: []
}>()

const adminStore = useAdminStore()
const { show: showToast } = useToast()
const { t } = useI18n()

const code = ref(props.editCode?.code ?? '')
const discountPercent = ref(props.editCode?.discountPercent ?? 10)
const minOrderEur = ref(props.editCode?.minOrderEur ?? 0)
const maxUses = ref(props.editCode?.maxUses ?? 0)
const startDate = ref(props.editCode?.startDate ?? new Date().toISOString().slice(0, 10))
const endDate = ref(props.editCode?.endDate ?? '')

function save() {
  if (!code.value || !endDate.value) return

  if (props.editCode) {
    adminStore.updateDiscountCode(props.editCode.id, {
      code: code.value.toUpperCase(),
      discountPercent: discountPercent.value,
      minOrderEur: minOrderEur.value,
      maxUses: maxUses.value,
      startDate: startDate.value,
      endDate: endDate.value,
    })
    showToast(t('admin.save'), 'success')
  } else {
    adminStore.addDiscountCode({
      code: code.value.toUpperCase(),
      discountPercent: discountPercent.value,
      minOrderEur: minOrderEur.value,
      maxUses: maxUses.value,
      usedCount: 0,
      startDate: startDate.value,
      endDate: endDate.value,
      active: true,
    })
    showToast(t('admin.codeCreated'), 'success')
  }
  emit('close')
}
</script>

<template>
  <div class="code-form">
    <h4 class="form-title">{{ editCode ? t('admin.editProduct') : t('admin.createCode') }}</h4>

    <div class="form-group">
      <label>{{ t('admin.codeLabel') }}</label>
      <input
        v-model="code"
        type="text"
        :placeholder="t('admin.codeLabel')"
        style="text-transform: uppercase"
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>{{ t('admin.discountPercentLabel') }} (%)</label>
        <input v-model.number="discountPercent" type="number" min="1" max="100" />
      </div>
      <div class="form-group">
        <label>{{ t('admin.minOrder') }} (EUR)</label>
        <input v-model.number="minOrderEur" type="number" min="0" />
      </div>
      <div class="form-group">
        <label>{{ t('admin.maxUses') }}</label>
        <input v-model.number="maxUses" type="number" min="0" placeholder="0 = unlimited" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>{{ t('admin.startDate') }}</label>
        <input v-model="startDate" type="date" />
      </div>
      <div class="form-group">
        <label>{{ t('admin.endDate') }}</label>
        <input v-model="endDate" type="date" />
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
