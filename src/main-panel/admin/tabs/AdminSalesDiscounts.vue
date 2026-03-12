<script setup lang="ts">
import { ref } from 'vue'
import { useAdminStore, type Sale, type DiscountCode } from '@/stores/admin'
import { useToast } from '@/composables/useToast'
import { useI18n } from 'vue-i18n'
import SaleForm from '../components/SaleForm.vue'
import DiscountCodeForm from '../components/DiscountCodeForm.vue'

const adminStore = useAdminStore()
const { show: showToast } = useToast()
const { t } = useI18n()

const showSaleForm = ref(false)
const editingSale = ref<Sale | undefined>(undefined)
const showCodeForm = ref(false)
const editingCode = ref<DiscountCode | undefined>(undefined)

function openCreateSale() {
  editingSale.value = undefined
  showSaleForm.value = true
}

function openEditSale(sale: Sale) {
  editingSale.value = sale
  showSaleForm.value = true
}

function closeSaleForm() {
  showSaleForm.value = false
  editingSale.value = undefined
}

function deleteSale(id: string) {
  adminStore.deleteSale(id)
  showToast(t('admin.saleDeleted'), 'info')
}

function toggleSaleActive(sale: Sale) {
  adminStore.updateSale(sale.id, { active: !sale.active })
}

function openCreateCode() {
  editingCode.value = undefined
  showCodeForm.value = true
}

function openEditCode(code: DiscountCode) {
  editingCode.value = code
  showCodeForm.value = true
}

function closeCodeForm() {
  showCodeForm.value = false
  editingCode.value = undefined
}

function deleteCode(id: string) {
  adminStore.deleteDiscountCode(id)
  showToast(t('admin.codeDeleted'), 'info')
}

function toggleCodeActive(code: DiscountCode) {
  adminStore.updateDiscountCode(code.id, { active: !code.active })
}
</script>

<template>
  <div class="admin-sales">
    <!-- Sales Section -->
    <div class="section-block">
      <div class="section-header">
        <h3 class="section-heading">{{ t('admin.createSale').replace('Create ', '') }}s</h3>
        <button v-if="!showSaleForm" class="btn-primary" @click="openCreateSale">
          + {{ t('admin.createSale') }}
        </button>
      </div>

      <SaleForm
        v-if="showSaleForm"
        :edit-sale="editingSale"
        @close="closeSaleForm"
      />

      <div v-if="adminStore.config.sales.length === 0 && !showSaleForm" class="empty-state">
        {{ t('admin.inactive') }} - {{ t('admin.createSale') }}
      </div>

      <div
        v-for="sale in adminStore.config.sales"
        :key="sale.id"
        class="item-card"
      >
        <div class="item-info">
          <h4 class="item-name">{{ sale.name }}</h4>
          <div class="item-meta">
            <span :class="['type-badge', sale.type]">{{ sale.type === 'collection' ? t('admin.saleTypeCollection') : t('admin.saleTypeProduct') }}</span>
            <span class="discount-badge">-{{ sale.discountPercent }}%</span>
            <span class="date-range">{{ sale.startDate }} &rarr; {{ sale.endDate }}</span>
          </div>
        </div>
        <div class="item-actions">
          <button
            :class="['status-btn', { active: sale.active }]"
            @click="toggleSaleActive(sale)"
          >
            {{ sale.active ? t('admin.active') : t('admin.inactive') }}
          </button>
          <button class="edit-btn" @click="openEditSale(sale)">{{ t('admin.editProduct') }}</button>
          <button class="delete-btn" @click="deleteSale(sale.id)">{{ t('admin.delete') }}</button>
        </div>
      </div>
    </div>

    <!-- Discount Codes Section -->
    <div class="section-block">
      <div class="section-header">
        <h3 class="section-heading">{{ t('admin.codeLabel') }}s</h3>
        <button v-if="!showCodeForm" class="btn-primary" @click="openCreateCode">
          + {{ t('admin.createCode') }}
        </button>
      </div>

      <DiscountCodeForm
        v-if="showCodeForm"
        :edit-code="editingCode"
        @close="closeCodeForm"
      />

      <div v-if="adminStore.config.discountCodes.length === 0 && !showCodeForm" class="empty-state">
        {{ t('admin.inactive') }} - {{ t('admin.createCode') }}
      </div>

      <div class="codes-table" v-if="adminStore.config.discountCodes.length > 0">
        <div class="codes-header">
          <span>{{ t('admin.codeLabel') }}</span>
          <span>{{ t('admin.discountPercentLabel') }}</span>
          <span>{{ t('admin.minOrder') }}</span>
          <span>{{ t('admin.maxUses') }}</span>
          <span>Dates</span>
          <span></span>
        </div>
        <div
          v-for="code in adminStore.config.discountCodes"
          :key="code.id"
          class="codes-row"
        >
          <span class="code-value">{{ code.code }}</span>
          <span>{{ code.discountPercent }}%</span>
          <span>&euro;{{ code.minOrderEur }}</span>
          <span>{{ code.usedCount }}/{{ code.maxUses || '&infin;' }}</span>
          <span class="date-range">{{ code.startDate }} &rarr; {{ code.endDate }}</span>
          <span class="row-actions">
            <button
              :class="['status-btn', { active: code.active }]"
              @click="toggleCodeActive(code)"
            >
              {{ code.active ? t('admin.active') : t('admin.inactive') }}
            </button>
            <button class="edit-btn" @click="openEditCode(code)">{{ t('admin.editProduct') }}</button>
            <button class="delete-btn" @click="deleteCode(code.id)">{{ t('admin.delete') }}</button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.section-block {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-heading {
  font-family: $font-headline;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.btn-primary {
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-family: $font-body;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;

  &:hover { opacity: 0.9; }
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  border: 1px dashed var(--color-border);
  border-radius: 12px;
}

.item-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.item-name {
  font-family: $font-headline;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 0.3rem;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-family: $font-headline;

  &.collection {
    background: rgba(23, 89, 118, 0.1);
    color: var(--color-teal);
  }
  &.product {
    background: rgba(186, 160, 48, 0.15);
    color: #8A7520;
  }
}

.discount-badge {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-error);
}

.date-range {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.item-actions {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.status-btn {
  font-family: $font-headline;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  background-color: var(--color-bg-alt);
  color: var(--color-text-secondary);

  &.active {
    background-color: var(--color-success);
    color: var(--color-text-on-dark);
    border-color: var(--color-success);
  }
}

.edit-btn {
  background: none;
  border: 1px solid var(--color-teal);
  color: var(--color-teal);
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  font-family: $font-body;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: var(--color-teal);
    color: var(--color-text-on-dark);
  }
}

.delete-btn {
  background: none;
  border: 1px solid var(--color-error);
  color: var(--color-error);
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  font-family: $font-body;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: var(--color-error);
    color: var(--color-text-on-dark);
  }
}

.codes-table {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.codes-header {
  display: grid;
  grid-template-columns: 120px 80px 80px 80px 1fr 160px;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: var(--color-bg-section);
  border-bottom: 1px solid var(--color-border);
  font-family: $font-headline;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.codes-row {
  display: grid;
  grid-template-columns: 120px 80px 80px 80px 1fr 160px;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  font-family: $font-body;
  font-size: 0.85rem;

  &:last-child { border-bottom: none; }
}

.code-value {
  font-family: monospace;
  font-weight: 700;
  color: var(--color-teal);
}

.row-actions {
  display: flex;
  gap: 0.35rem;
  justify-content: flex-end;
}

@media (max-width: 700px) {
  .codes-header { display: none; }
  .codes-row {
    grid-template-columns: 1fr;
    gap: 0.3rem;
  }
  .item-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
