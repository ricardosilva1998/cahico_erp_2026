<script setup lang="ts">
import { ref, computed } from 'vue'
import { getAllProducts, type Product } from '@/data/products'
import { useAdminStore } from '@/stores/admin'
import { useI18n } from 'vue-i18n'
import ProductEditModal from '../components/ProductEditModal.vue'

const adminStore = useAdminStore()
const { t } = useI18n()

const searchQuery = ref('')
const filterCollection = ref('')
const filterCategory = ref('')
const editingProduct = ref<Product | null>(null)

const collections = ['alfama', 'chiado', 'santos', 'canastras', 'belem', 'sintra', 'cascais', 'mouraria']
const categories = ['rings', 'necklaces', 'earrings', 'bracelets', 'anklets', 'brooches', 'pendants', 'cufflinks']

const filteredProducts = computed(() => {
  let products = getAllProducts()

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    products = products.filter(p => p.id.toLowerCase().includes(q))
  }
  if (filterCollection.value) {
    products = products.filter(p => p.collection === filterCollection.value)
  }
  if (filterCategory.value) {
    products = products.filter(p => p.category === filterCategory.value)
  }

  return products
})

function getEffectiveStock(product: Product): number {
  return adminStore.getEffectiveStock(product.id, product.stock)
}

function getEffectivePrice(product: Product): number {
  return adminStore.getEffectivePrice(product.id, product.priceEur)
}

function hasOverride(productId: string): boolean {
  return !!adminStore.getProductOverride(productId)
}

function stockClass(stock: number): string {
  if (stock === 0) return 'stock-out'
  if (stock < 3) return 'stock-low'
  if (stock < 10) return 'stock-medium'
  return 'stock-good'
}
</script>

<template>
  <div class="admin-products">
    <h3 class="section-heading">{{ t('admin.tabProducts') }}</h3>

    <div class="filters-bar">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        :placeholder="t('admin.searchProducts')"
      />
      <select v-model="filterCollection" class="filter-select">
        <option value="">{{ t('admin.filterByCollection') }}</option>
        <option v-for="col in collections" :key="col" :value="col">
          {{ col.charAt(0).toUpperCase() + col.slice(1) }}
        </option>
      </select>
      <select v-model="filterCategory" class="filter-select">
        <option value="">{{ t('admin.filterByCategory') }}</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
        </option>
      </select>
    </div>

    <div class="result-count">{{ filteredProducts.length }} {{ t('admin.totalProducts').toLowerCase() }}</div>

    <div class="product-table">
      <div class="table-header">
        <span class="col-img"></span>
        <span class="col-name">Product</span>
        <span class="col-collection">Collection</span>
        <span class="col-price">Price</span>
        <span class="col-stock">Stock</span>
        <span class="col-action"></span>
      </div>

      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="table-row"
      >
        <span class="col-img">
          <img :src="product.images[2] || product.images[0]" :alt="product.id" class="row-thumb" />
        </span>
        <span class="col-name">
          {{ product.id }}
          <span v-if="hasOverride(product.id)" class="override-badge">*</span>
        </span>
        <span class="col-collection">{{ product.collection }}</span>
        <span class="col-price">
          <span v-if="getEffectivePrice(product) !== product.priceEur" class="price-changed">
            &euro;{{ getEffectivePrice(product) }}
          </span>
          <span v-else>&euro;{{ product.priceEur }}</span>
        </span>
        <span class="col-stock">
          <span :class="stockClass(getEffectiveStock(product))">
            {{ getEffectiveStock(product) }}
          </span>
        </span>
        <span class="col-action">
          <button class="edit-btn" @click="editingProduct = product">
            {{ t('admin.editProduct') }}
          </button>
        </span>
      </div>
    </div>

    <ProductEditModal
      v-if="editingProduct"
      :product="editingProduct"
      @close="editingProduct = null"
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

.filters-bar {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 180px;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-input-border);
  border-radius: 8px;
  font-family: $font-body;
  font-size: 0.9rem;
  background: var(--color-off-white);
  color: var(--color-text-primary);

  &:focus {
    outline: none;
    border-color: var(--color-teal);
  }
}

.filter-select {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-input-border);
  border-radius: 8px;
  font-family: $font-body;
  font-size: 0.85rem;
  background: var(--color-off-white);
  color: var(--color-text-primary);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-teal);
  }
}

.result-count {
  font-family: $font-body;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
}

.product-table {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 50px 1fr 100px 90px 70px 80px;
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
  grid-template-columns: 50px 1fr 100px 90px 70px 80px;
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

.override-badge {
  color: var(--color-teal);
  font-weight: 700;
}

.price-changed {
  color: var(--color-teal);
  font-weight: 600;
}

.stock-out { color: var(--color-error); font-weight: 700; }
.stock-low { color: #D4830A; font-weight: 600; }
.stock-medium { color: #B8860B; }
.stock-good { color: var(--color-success); }

.edit-btn {
  background: none;
  border: 1px solid var(--color-teal);
  color: var(--color-teal);
  border-radius: 6px;
  padding: 0.25rem 0.6rem;
  font-family: $font-body;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: var(--color-teal);
    color: var(--color-text-on-dark);
  }
}

@media (max-width: 700px) {
  .table-header { display: none; }
  .table-row {
    grid-template-columns: 40px 1fr;
    grid-template-rows: auto auto;
    gap: 0.25rem 0.5rem;
    padding: 0.75rem 0.75rem;
  }
  .col-collection, .col-price, .col-stock, .col-action {
    grid-column: 2;
    font-size: 0.8rem;
  }
}
</style>
