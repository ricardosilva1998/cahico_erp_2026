<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminCollections from './tabs/AdminCollections.vue'
import AdminProducts from './tabs/AdminProducts.vue'
import AdminSalesDiscounts from './tabs/AdminSalesDiscounts.vue'
import AdminStock from './tabs/AdminStock.vue'
import AdminSettings from './tabs/AdminSettings.vue'
import AdminStatistics from './tabs/AdminStatistics.vue'

const { t } = useI18n()

type TabKey = 'collections' | 'products' | 'sales' | 'stock' | 'statistics' | 'settings'
const activeTab = ref<TabKey>('collections')

const tabs: { key: TabKey; labelKey: string }[] = [
  { key: 'collections', labelKey: 'admin.tabCollections' },
  { key: 'products', labelKey: 'admin.tabProducts' },
  { key: 'sales', labelKey: 'admin.tabSales' },
  { key: 'stock', labelKey: 'admin.tabStock' },
  { key: 'statistics', labelKey: 'admin.tabStatistics' },
  { key: 'settings', labelKey: 'admin.tabSettings' },
]
</script>

<template>
  <div class="admin-panel">
    <div class="panel-header">
      <h2 class="panel-title">{{ t('admin.title') }}</h2>
      <p class="panel-subtitle">{{ t('admin.subtitle') }}</p>
    </div>

    <nav class="admin-nav">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['nav-btn', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ t(tab.labelKey) }}
      </button>
    </nav>

    <div class="admin-content">
      <AdminCollections v-if="activeTab === 'collections'" />
      <AdminProducts v-else-if="activeTab === 'products'" />
      <AdminSalesDiscounts v-else-if="activeTab === 'sales'" />
      <AdminStock v-else-if="activeTab === 'stock'" />
      <AdminStatistics v-else-if="activeTab === 'statistics'" />
      <AdminSettings v-else-if="activeTab === 'settings'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-panel {
  width: 100%;
  padding: 2rem;
}

.panel-header {
  margin-bottom: 1.5rem;
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

.admin-nav {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.nav-btn {
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-secondary);
  font-family: $font-body;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  min-height: 44px;

  &:hover {
    color: var(--color-text-primary);
  }

  &.active {
    color: var(--color-teal);
    border-bottom-color: var(--color-teal);
    font-weight: 600;
  }
}

.admin-content {
  min-height: 300px;
}

@media (max-width: 600px) {
  .admin-panel {
    padding: 1.25rem;
  }
}
</style>
