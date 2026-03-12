<script setup lang="ts">
import { ref, computed } from 'vue'
import { getAllProducts, type Product } from '@/data/products'
import { useAdminStore } from '@/stores/admin'
import { useI18n } from 'vue-i18n'
import StockAdjustModal from '../components/StockAdjustModal.vue'

const adminStore = useAdminStore()
const { t } = useI18n()

const adjustingProduct = ref<Product | null>(null)

const allProducts = getAllProducts()

const productsWithStock = computed(() =>
  allProducts.map(p => ({
    ...p,
    effectiveStock: adminStore.getEffectiveStock(p.id, p.stock),
  })),
)

const totalProducts = computed(() => allProducts.length)
const totalStockUnits = computed(() =>
  productsWithStock.value.reduce((sum, p) => sum + p.effectiveStock, 0),
)
const lowStockCount = computed(() =>
  productsWithStock.value.filter(p => p.effectiveStock > 0 && p.effectiveStock < 3).length,
)
const outOfStockCount = computed(() =>
  productsWithStock.value.filter(p => p.effectiveStock === 0).length,
)

const lowStockProducts = computed(() =>
  productsWithStock.value.filter(p => p.effectiveStock < 3).sort((a, b) => a.effectiveStock - b.effectiveStock),
)

function stockClass(stock: number): string {
  if (stock === 0) return 'stock-out'
  if (stock < 3) return 'stock-low'
  if (stock < 10) return 'stock-medium'
  return 'stock-good'
}
</script>

<template>
  <div class="admin-stock">
    <h3 class="section-heading">{{ t('admin.tabStock') }}</h3>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card">
        <span class="summary-value">{{ totalProducts }}</span>
        <span class="summary-label">{{ t('admin.totalProducts') }}</span>
      </div>
      <div class="summary-card">
        <span class="summary-value">{{ totalStockUnits }}</span>
        <span class="summary-label">{{ t('admin.totalStockUnits') }}</span>
      </div>
      <div class="summary-card warn">
        <span class="summary-value">{{ lowStockCount }}</span>
        <span class="summary-label">{{ t('admin.lowStockCount') }}</span>
      </div>
      <div class="summary-card danger">
        <span class="summary-value">{{ outOfStockCount }}</span>
        <span class="summary-label">{{ t('admin.outOfStockCount') }}</span>
      </div>
    </div>

    <!-- Low Stock Alerts -->
    <div v-if="lowStockProducts.length > 0" class="alerts-section">
      <h4 class="sub-heading">{{ t('admin.lowStockAlerts') }}</h4>
      <div class="alerts-list">
        <div
          v-for="product in lowStockProducts"
          :key="product.id"
          class="alert-item"
        >
          <img :src="product.images[2] || product.images[0]" :alt="product.id" class="alert-thumb" />
          <span class="alert-name">{{ product.id }}</span>
          <span :class="['alert-stock', stockClass(product.effectiveStock)]">
            {{ product.effectiveStock }}
          </span>
          <button class="adjust-btn" @click="adjustingProduct = product">
            {{ t('admin.adjustStock') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Full Stock Table -->
    <div class="stock-table-section">
      <h4 class="sub-heading">All Products</h4>
      <div class="stock-table">
        <div class="table-header">
          <span class="col-img"></span>
          <span class="col-name">Product</span>
          <span class="col-collection">Collection</span>
          <span class="col-stock">Stock</span>
          <span class="col-action"></span>
        </div>
        <div
          v-for="product in productsWithStock"
          :key="product.id"
          class="table-row"
        >
          <span class="col-img">
            <img :src="product.images[2] || product.images[0]" :alt="product.id" class="row-thumb" />
          </span>
          <span class="col-name">{{ product.id }}</span>
          <span class="col-collection">{{ product.collection }}</span>
          <span class="col-stock">
            <span :class="stockClass(product.effectiveStock)">{{ product.effectiveStock }}</span>
          </span>
          <span class="col-action">
            <button class="adjust-btn" @click="adjustingProduct = product">
              {{ t('admin.adjustStock') }}
            </button>
          </span>
        </div>
      </div>
    </div>

    <StockAdjustModal
      v-if="adjustingProduct"
      :product="adjustingProduct"
      @close="adjustingProduct = null"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.section-heading {
  font-family: $font-headline;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 1.25rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;

  &.warn { border-color: #D4830A; }
  &.danger { border-color: var(--color-error); }
}

.summary-value {
  display: block;
  font-family: $font-headline;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;

  .warn & { color: #D4830A; }
  .danger & { color: var(--color-error); }
}

.summary-label {
  display: block;
  font-family: $font-body;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sub-heading {
  font-family: $font-headline;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 0.75rem;
}

.alerts-section {
  margin-bottom: 1.5rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-error-bg);
  border: 1px solid rgba(192, 57, 43, 0.2);
  border-radius: 10px;
  padding: 0.6rem 1rem;
}

.alert-thumb {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
}

.alert-name {
  flex: 1;
  font-family: $font-body;
  font-size: 0.85rem;
  font-weight: 500;
}

.alert-stock {
  font-weight: 700;
  font-size: 0.9rem;
  min-width: 24px;
  text-align: center;
}

.adjust-btn {
  background: none;
  border: 1px solid var(--color-teal);
  color: var(--color-teal);
  border-radius: 6px;
  padding: 0.25rem 0.6rem;
  font-family: $font-body;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: var(--color-teal);
    color: var(--color-text-on-dark);
  }
}

.stock-table {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 50px 1fr 100px 70px 90px;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-bg-section);
  border-bottom: 1px solid var(--color-border);
  font-family: $font-headline;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
}

.table-row {
  display: grid;
  grid-template-columns: 50px 1fr 100px 70px 90px;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  font-family: $font-body;
  font-size: 0.85rem;

  &:last-child { border-bottom: none; }
}

.row-thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}

.col-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stock-out { color: var(--color-error); font-weight: 700; }
.stock-low { color: #D4830A; font-weight: 600; }
.stock-medium { color: #B8860B; }
.stock-good { color: var(--color-success); }

@media (max-width: 700px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .table-header { display: none; }
  .table-row {
    grid-template-columns: 40px 1fr;
    grid-template-rows: auto auto;
    gap: 0.25rem 0.5rem;
    padding: 0.75rem;
  }
  .col-collection, .col-stock, .col-action {
    grid-column: 2;
    font-size: 0.8rem;
  }
}
</style>
