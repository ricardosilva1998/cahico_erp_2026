<script setup lang="ts">
import { useAdminStore } from '@/stores/admin'
import { useI18n } from 'vue-i18n'

const adminStore = useAdminStore()
const { t } = useI18n()
</script>

<template>
  <div class="admin-settings">
    <h3 class="section-heading">{{ t('admin.settingsTitle') }}</h3>
    <p class="section-desc">{{ t('admin.settingsSubtitle') }}</p>

    <!-- Home Page Sections -->
    <div class="admin-section">
      <h3 class="section-title">{{ t('admin.homeSections') }}</h3>
      <div class="toggle-list">
        <div class="toggle-item">
          <span class="toggle-label">{{ t('admin.hero') }}</span>
          <button
            :class="['toggle-btn', { active: adminStore.config.heroVisible }]"
            @click="adminStore.toggleHeroVisible()"
          >
            {{ adminStore.config.heroVisible ? t('admin.visible') : t('admin.hidden') }}
          </button>
        </div>
        <div class="toggle-item">
          <span class="toggle-label">{{ t('admin.story') }}</span>
          <button
            :class="['toggle-btn', { active: adminStore.config.storyVisible }]"
            @click="adminStore.toggleStoryVisible()"
          >
            {{ adminStore.config.storyVisible ? t('admin.visible') : t('admin.hidden') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Collections -->
    <div class="admin-section">
      <h3 class="section-title">{{ t('admin.collections') }}</h3>
      <div class="toggle-list">
        <div
          v-for="item in adminStore.config.collections"
          :key="item.id"
          class="toggle-item"
        >
          <span class="toggle-label">{{ item.name }}</span>
          <button
            :class="['toggle-btn', { active: item.visible }]"
            @click="adminStore.toggleCollectionVisibility(item.id)"
          >
            {{ item.visible ? t('admin.visible') : t('admin.hidden') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Materials -->
    <div class="admin-section">
      <h3 class="section-title">{{ t('admin.materials') }}</h3>
      <div class="toggle-list">
        <div
          v-for="item in adminStore.config.materials"
          :key="item.id"
          class="toggle-item"
        >
          <span class="toggle-label">{{ item.name }}</span>
          <button
            :class="['toggle-btn', { active: item.visible }]"
            @click="adminStore.toggleMaterialVisibility(item.id)"
          >
            {{ item.visible ? t('admin.visible') : t('admin.hidden') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Featured Pieces -->
    <div class="admin-section">
      <h3 class="section-title">{{ t('admin.featured') }}</h3>
      <div class="toggle-list">
        <div
          v-for="item in adminStore.config.featuredPieces"
          :key="item.id"
          class="toggle-item"
        >
          <span class="toggle-label">{{ item.name }}</span>
          <button
            :class="['toggle-btn', { active: item.visible }]"
            @click="adminStore.toggleFeaturedVisibility(item.id)"
          >
            {{ item.visible ? t('admin.visible') : t('admin.hidden') }}
          </button>
        </div>
      </div>
    </div>
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
  margin: 0 0 0.25rem;
}

.section-desc {
  font-family: $font-body;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin: 0 0 1.5rem;
}

.admin-section {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  transition: background-color 0.3s, border-color 0.3s;
}

.section-title {
  font-family: $font-headline;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 1rem;
}

.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toggle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  background-color: var(--color-off-white);
  border: 1px solid var(--color-border);
  transition: background-color 0.2s;
}

.toggle-label {
  font-family: $font-body;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.toggle-btn {
  font-family: $font-headline;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.35rem 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
  text-align: center;
  background-color: var(--color-bg-alt);
  color: var(--color-text-secondary);

  &.active {
    background-color: var(--color-teal);
    color: var(--color-text-on-dark);
    border-color: var(--color-teal);
  }

  &:hover {
    opacity: 0.85;
  }
}
</style>
