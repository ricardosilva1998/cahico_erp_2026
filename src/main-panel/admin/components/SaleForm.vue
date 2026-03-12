<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAdminStore, type Sale } from '@/stores/admin'
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'
import { getAllProducts } from '@/data/products'

const props = defineProps<{
  editSale?: Sale
}>()

const emit = defineEmits<{
  close: []
}>()

const adminStore = useAdminStore()
const { show: showToast } = useToast()
const { t } = useI18n()

const name = ref(props.editSale?.name ?? '')
const type = ref<'product' | 'collection'>(props.editSale?.type ?? 'collection')
const selectedTargets = ref<string[]>(props.editSale?.targetIds ?? [])
const discountPercent = ref(props.editSale?.discountPercent ?? 10)
const startDate = ref(props.editSale?.startDate ?? new Date().toISOString().slice(0, 10))
const endDate = ref(props.editSale?.endDate ?? '')

const collections = ['alfama', 'chiado', 'santos', 'canastras', 'belem', 'sintra', 'cascais', 'mouraria']
const allProducts = getAllProducts()

const targetOptions = computed(() => {
  if (type.value === 'collection') {
    return collections.map(c => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
  }
  return allProducts.slice(0, 50).map(p => ({ id: p.id, label: p.id }))
})

watch(type, () => {
  selectedTargets.value = []
})

function toggleTarget(id: string) {
  const idx = selectedTargets.value.indexOf(id)
  if (idx === -1) {
    selectedTargets.value.push(id)
  } else {
    selectedTargets.value.splice(idx, 1)
  }
}

function save() {
  if (!name.value || !endDate.value || selectedTargets.value.length === 0) return

  if (props.editSale) {
    adminStore.updateSale(props.editSale.id, {
      name: name.value,
      type: type.value,
      targetIds: selectedTargets.value,
      discountPercent: discountPercent.value,
      startDate: startDate.value,
      endDate: endDate.value,
    })
    showToast(t('admin.save'), 'success')
  } else {
    adminStore.addSale({
      name: name.value,
      type: type.value,
      targetIds: selectedTargets.value,
      discountPercent: discountPercent.value,
      startDate: startDate.value,
      endDate: endDate.value,
      active: true,
    })
    showToast(t('admin.saleCreated'), 'success')
  }
  emit('close')
}
</script>

<template>
  <div class="sale-form">
    <h4 class="form-title">{{ editSale ? t('admin.editProduct') : t('admin.createSale') }}</h4>

    <div class="form-group">
      <label>{{ t('admin.saleName') }}</label>
      <input v-model="name" type="text" :placeholder="t('admin.saleName')" />
    </div>

    <div class="form-group">
      <label>{{ t('admin.saleType') }}</label>
      <div class="radio-group">
        <label class="radio-label">
          <input v-model="type" type="radio" value="collection" />
          {{ t('admin.saleTypeCollection') }}
        </label>
        <label class="radio-label">
          <input v-model="type" type="radio" value="product" />
          {{ t('admin.saleTypeProduct') }}
        </label>
      </div>
    </div>

    <div class="form-group">
      <label>{{ t('admin.selectTargets') }}</label>
      <div class="targets-list">
        <label
          v-for="opt in targetOptions"
          :key="opt.id"
          class="target-option"
        >
          <input
            type="checkbox"
            :checked="selectedTargets.includes(opt.id)"
            @change="toggleTarget(opt.id)"
          />
          {{ opt.label }}
        </label>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>{{ t('admin.discountPercentLabel') }} (%)</label>
        <input v-model.number="discountPercent" type="number" min="1" max="100" />
      </div>
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

.sale-form {
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

  input[type="text"],
  input[type="number"],
  input[type="date"] {
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
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
}

.radio-group {
  display: flex;
  gap: 1.25rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 400 !important;
  cursor: pointer;
}

.targets-list {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.5rem;
  background: var(--color-white);
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.target-option {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 400 !important;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
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
