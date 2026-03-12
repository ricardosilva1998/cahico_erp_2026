<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  terms: { term: string; count: number }[]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="chart-card">
    <h4 class="chart-title">{{ t('admin.statsSearchTerms') }}</h4>
    <div class="terms-table">
      <div class="terms-header">
        <span>#</span>
        <span>{{ t('admin.statsSearchTerm') }}</span>
        <span>{{ t('admin.statsSearches') }}</span>
      </div>
      <div
        v-for="(item, idx) in terms.slice(0, 15)"
        :key="item.term"
        class="terms-row"
      >
        <span class="rank">{{ idx + 1 }}</span>
        <span class="term">{{ item.term }}</span>
        <span class="term-count">{{ item.count }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.chart-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.25rem;
}

.chart-title {
  font-family: $font-headline;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 1rem;
}

.terms-table {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.terms-header {
  display: grid;
  grid-template-columns: 30px 1fr 60px;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-bg-section);
  border-bottom: 1px solid var(--color-border);
  font-family: $font-headline;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.terms-row {
  display: grid;
  grid-template-columns: 30px 1fr 60px;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.85rem;
  align-items: center;

  &:last-child { border-bottom: none; }
}

.rank {
  font-weight: 700;
  color: var(--color-teal);
  font-size: 0.8rem;
}

.term {
  color: var(--color-text-primary);
}

.term-count {
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: right;
}
</style>
