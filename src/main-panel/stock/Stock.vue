<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAdminStore } from '@/stores/admin'

const { t, tm } = useI18n()
const adminStore = useAdminStore()

const allCollections = computed(() => [
  {
    img: 'https://cdnx.jumpseller.com/cahico/image/73462296/thumb/299/399?1771499425',
    key: 'rings',
    count: 24,
  },
  {
    img: 'https://cdnx.jumpseller.com/cahico/image/73507472/thumb/299/399?1771500213',
    key: 'necklaces',
    count: 18,
  },
  {
    img: 'https://cdnx.jumpseller.com/cahico/image/73464402/thumb/299/399?1771427526',
    key: 'earrings',
    count: 31,
  },
  {
    img: 'https://cdnx.jumpseller.com/cahico/image/73508788/thumb/299/399?1771514251',
    key: 'bracelets',
    count: 15,
  },
  {
    img: 'https://cdnx.jumpseller.com/cahico/image/74201663/thumb/299/399?1772729987',
    key: 'anklets',
    count: 8,
  },
  {
    img: 'https://cdnx.jumpseller.com/cahico/image/74305850/thumb/299/399?1772902538',
    key: 'brooches',
    count: 12,
  },
  {
    img: 'https://cdnx.jumpseller.com/cahico/image/73511629/thumb/299/399?1772565002',
    key: 'pendants',
    count: 20,
  },
  {
    img: 'https://cdnx.jumpseller.com/cahico/image/74305962/thumb/299/399?1772902991',
    key: 'cufflinks',
    count: 9,
  },
])

const collections = computed(() =>
  allCollections.value.filter(c => adminStore.isCollectionVisible(c.key))
)
</script>

<template>
  <div class="collections-panel">
    <div class="panel-header">
      <h2 class="panel-title">{{ t('collections.title') }}</h2>
      <p class="panel-subtitle">{{ t('collections.subtitle') }}</p>
    </div>

    <div class="collections-grid">
      <div v-for="col in collections" :key="col.key" class="collection-card">
        <div class="card-image-wrap">
          <img :src="col.img" :alt="t(`collections.${col.key}`)" class="card-image" />
        </div>
        <div class="card-body">
          <div class="card-top">
            <h3 class="card-name">{{ t(`collections.${col.key}`) }}</h3>
            <span class="card-count">{{ t('collections.items', { count: col.count }) }}</span>
          </div>
          <p class="card-description">{{ t(`collections.${col.key}Desc`) }}</p>
          <div class="card-tags">
            <span v-for="tag in (tm(`collections.${col.key}Tags`) as string[])" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <router-link :to="'/collection/' + col.key" class="card-cta">{{ t('collections.viewCollection') }}</router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.collections-panel {
  width: 100%;
  padding: 2rem;
}

.panel-header {
  margin-bottom: 2rem;
}

.panel-title {
  font-family: $font-headline;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0 0 0.4rem;
}

.panel-subtitle {
  font-family: $font-body;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.collection-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: box-shadow 0.2s, transform 0.2s, background-color 0.3s, border-color 0.3s;
  cursor: pointer;

  &:hover {
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-2px);
  }
}

.card-image-wrap {
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  .collection-card:hover & {
    transform: scale(1.05);
  }
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
}

.card-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.card-name {
  font-family: $font-headline;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.card-count {
  font-family: $font-body;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-on-dark);
  background-color: var(--color-teal);
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  white-space: nowrap;
}

.card-description {
  font-family: $font-body;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.tag {
  font-family: $font-body;
  font-size: 0.7rem;
  color: var(--color-teal);
  background-color: rgba(23, 89, 118, 0.08);
  background-color: color-mix(in srgb, var(--color-teal) 8%, transparent);
  border: 1px solid rgba(23, 89, 118, 0.2);
  border: 1px solid color-mix(in srgb, var(--color-teal) 20%, transparent);
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
}

.card-cta {
  font-family: $font-headline;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--color-teal);
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0 1.25rem 1.25rem;

  &:hover {
    color: var(--color-teal-dark);
  }
}

@media (max-width: 600px) {
  .collections-panel {
    padding: 1.25rem;
  }
}
</style>
