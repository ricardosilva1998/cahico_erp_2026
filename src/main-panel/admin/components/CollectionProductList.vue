<script setup lang="ts">
import { ref, computed } from 'vue'
import { getProductsByCollection, type Product } from '@/data/products'
import { useAdminStore } from '@/stores/admin'
import { useI18n } from 'vue-i18n'
import ProductEditModal from './ProductEditModal.vue'

const props = defineProps<{
  collectionSlug: string
}>()

const emit = defineEmits<{
  back: []
}>()

const adminStore = useAdminStore()
const { t } = useI18n()

const editingProduct = ref<Product | null>(null)

const products = computed(() => getProductsByCollection(props.collectionSlug))

function getEffectiveStock(product: Product): number {
  return adminStore.getEffectiveStock(product.id, product.stock)
}

function getEffectivePrice(product: Product): number {
  return adminStore.getEffectivePrice(product.id, product.priceEur)
}

function hasOverride(productId: string): boolean {
  return !!adminStore.getProductOverride(productId)
}

function isVisible(productId: string): boolean {
  return adminStore.isProductVisible(productId)
}

function stockClass(stock: number): string {
  if (stock === 0) return 'stock-out'
  if (stock < 3) return 'stock-low'
  if (stock < 10) return 'stock-medium'
  return 'stock-good'
}

function toggleVisibility(product: Product) {
  const override = adminStore.getProductOverride(product.id) ?? {}
  override.visible = !(override.visible ?? true)
  adminStore.setProductOverride(product.id, override)
}
</script>

<template>
  <div class="collection-products">
    <div class="list-header">
      <button class="back-btn" @click="emit('back')">
        &larr; {{ t('admin.backToCollections') }}
      </button>
      <h3 class="list-title">
        {{ collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1) }}
        <span class="count-badge">{{ products.length }}</span>
      </h3>
    </div>

    <div class="product-table">
      <div class="table-header">
        <span class="col-img"></span>
        <span class="col-name">{{ t('admin.searchProducts').split(' ')[0] }}</span>
        <span class="col-price">{{ t('admin.priceOverride') }}</span>
        <span class="col-stock">{{ t('admin.stockOverride') }}</span>
        <span class="col-vis">{{ t('admin.visible') }}</span>
        <span class="col-action"></span>
      </div>

      <div
        v-for="product in products"
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
        <span class="col-price">
          <span v-if="getEffectivePrice(product) !== product.priceEur" class="price-changed">
            &euro;{{ getEffectivePrice(product) }}
            <small class="original-price">&euro;{{ product.priceEur }}</small>
          </span>
          <span v-else>&euro;{{ product.priceEur }}</span>
        </span>
        <span class="col-stock">
          <span :class="stockClass(getEffectiveStock(product))">
            {{ getEffectiveStock(product) }}
          </span>
        </span>
        <span class="col-vis">
          <button
            :class="['vis-toggle', { active: isVisible(product.id) }]"
            @click="toggleVisibility(product)"
          >
            {{ isVisible(product.id) ? t('admin.visible') : t('admin.hidden') }}
          </button>
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

.list-header {
  margin-bottom: 1.25rem;
}

.back-btn {
  background: none;
  border: none;
  color: var(--color-teal);
  font-family: $font-body;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 0.5rem;
  display: block;

  &:hover { text-decoration: underline; }
}

.list-title {
  font-family: $font-headline;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.count-badge {
  background: var(--color-teal);
  color: var(--color-text-on-dark);
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-family: $font-body;
}

.product-table {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 50px 1fr 100px 80px 80px 80px;
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
  grid-template-columns: 50px 1fr 100px 80px 80px 80px;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
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
  display: flex;
  align-items: center;
  gap: 0.25rem;
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

.original-price {
  text-decoration: line-through;
  color: var(--color-text-secondary);
  font-weight: 400;
  margin-left: 0.25rem;
}

.stock-out { color: var(--color-error); font-weight: 700; }
.stock-low { color: #D4830A; font-weight: 600; }
.stock-medium { color: #B8860B; }
.stock-good { color: var(--color-success); }

.vis-toggle {
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
    background-color: var(--color-teal);
    color: var(--color-text-on-dark);
    border-color: var(--color-teal);
  }
}

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
  .col-price, .col-stock, .col-vis, .col-action {
    grid-column: 2;
    font-size: 0.8rem;
  }
}
</style>
