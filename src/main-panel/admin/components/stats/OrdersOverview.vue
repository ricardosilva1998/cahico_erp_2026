<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  completedCount: number
  pendingCount: number
  totalRevenue: number
  averagePurchaseValue: number
}>()

const { t } = useI18n()

function formatEur(n: number): string {
  return `€${n.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
</script>

<template>
  <div class="overview-grid">
    <div class="stat-card completed">
      <div class="stat-value">{{ completedCount }}</div>
      <div class="stat-label">{{ t('admin.statsCompleted') }}</div>
    </div>
    <div class="stat-card pending">
      <div class="stat-value">{{ pendingCount }}</div>
      <div class="stat-label">{{ t('admin.statsPending') }}</div>
    </div>
    <div class="stat-card revenue">
      <div class="stat-value">{{ formatEur(totalRevenue) }}</div>
      <div class="stat-label">{{ t('admin.statsRevenue') }}</div>
    </div>
    <div class="stat-card avg">
      <div class="stat-value">{{ formatEur(averagePurchaseValue) }}</div>
      <div class="stat-label">{{ t('admin.statsAvgOrder') }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  border-top: 3px solid var(--color-teal);
}

.stat-card.completed { border-top-color: var(--color-success); }
.stat-card.pending { border-top-color: #e6a817; }
.stat-card.revenue { border-top-color: var(--color-teal); }
.stat-card.avg { border-top-color: #BAA030; }

.stat-value {
  font-family: $font-headline;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 700px) {
  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
