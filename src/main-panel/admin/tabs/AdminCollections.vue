<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getProductsByCollection } from '@/data/products'
import CollectionProductList from '../components/CollectionProductList.vue'

const { t } = useI18n()

const selectedCollection = ref<string | null>(null)

const collections = [
  'alfama', 'chiado', 'santos', 'canastras', 'belem', 'sintra', 'cascais', 'mouraria',
]

const collectionCards = computed(() =>
  collections.map(slug => ({
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    count: getProductsByCollection(slug).length,
    thumb: getProductsByCollection(slug)[0]?.images[2] || getProductsByCollection(slug)[0]?.images[0] || '',
  })),
)
</script>

<template>
  <div class="admin-collections">
    <CollectionProductList
      v-if="selectedCollection"
      :collection-slug="selectedCollection"
      @back="selectedCollection = null"
    />

    <template v-else>
      <h3 class="section-heading">{{ t('admin.tabCollections') }}</h3>
      <div class="collections-grid">
        <div
          v-for="col in collectionCards"
          :key="col.slug"
          class="collection-card"
        >
          <img v-if="col.thumb" :src="col.thumb" :alt="col.name" class="card-thumb" />
          <div class="card-body">
            <h4 class="card-name">{{ col.name }}</h4>
            <span class="card-count">{{ col.count }} {{ t('admin.productsInCollection') }}</span>
          </div>
          <button class="manage-btn" @click="selectedCollection = col.slug">
            {{ t('admin.manageCollection') }}
          </button>
        </div>
      </div>
    </template>
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

.collections-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.collection-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s;

  &:hover { border-color: var(--color-teal); }
}

.card-thumb {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.card-body {
  flex: 1;
}

.card-name {
  font-family: $font-headline;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  margin: 0 0 0.2rem;
}

.card-count {
  font-family: $font-body;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.manage-btn {
  background-color: var(--color-teal);
  color: var(--color-text-on-dark);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-family: $font-body;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover { opacity: 0.9; }
}

@media (max-width: 600px) {
  .collections-grid {
    grid-template-columns: 1fr;
  }
}
</style>
