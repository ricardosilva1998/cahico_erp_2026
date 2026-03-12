<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

const collections = computed(() => [
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
        <a class="card-cta">{{ t('collections.viewCollection') }}</a>
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
  color: $color-dark-brown;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0 0 0.4rem;
}

.panel-subtitle {
  font-family: $font-body;
  font-size: 0.95rem;
  color: $color-text-secondary;
  margin: 0;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.collection-card {
  background: $color-white;
  border: 1px solid $color-border;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 20px rgba(23, 89, 118, 0.12);
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
  padding: 1.25rem;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0;
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
  color: $color-dark-brown;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.card-count {
  font-family: $font-body;
  font-size: 0.75rem;
  font-weight: 600;
  color: $color-white;
  background-color: $color-teal;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  white-space: nowrap;
}

.card-description {
  font-family: $font-body;
  font-size: 0.875rem;
  color: $color-text-secondary;
  line-height: 1.5;
  margin: 0;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.25rem;
}

.tag {
  font-family: $font-body;
  font-size: 0.7rem;
  color: $color-teal;
  background-color: rgba(23, 89, 118, 0.08);
  border: 1px solid rgba(23, 89, 118, 0.2);
  border-radius: 4px;
  padding: 0.1rem 0.45rem;
}

.card-cta {
  font-family: $font-headline;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: $color-teal;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: $color-teal-dark;
  }
}
</style>
