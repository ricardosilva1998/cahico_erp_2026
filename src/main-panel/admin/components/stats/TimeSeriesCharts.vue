<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  ordersPerDay: { date: string; count: number }[]
  avgValuePerDay: { date: string; avg: number }[]
}>()

const { t } = useI18n()

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function maxOf(items: { count?: number; avg?: number }[], key: 'count' | 'avg'): number {
  return Math.max(...items.map(i => (i as Record<string, number>)[key] || 0), 1)
}
</script>

<template>
  <div class="timeseries-row">
    <div class="chart-card">
      <h4 class="chart-title">{{ t('admin.statsOrdersPerDay') }}</h4>
      <div class="mini-bar-chart" v-if="ordersPerDay.length > 0">
        <div class="bars-container">
          <div
            v-for="day in ordersPerDay"
            :key="day.date"
            class="mini-bar-col"
            :title="`${day.date}: ${day.count} orders`"
          >
            <div
              class="mini-bar"
              :style="{ height: `${(day.count / maxOf(ordersPerDay, 'count')) * 100}%` }"
            />
            <span class="mini-bar-label">{{ formatDate(day.date) }}</span>
          </div>
        </div>
      </div>
      <p v-else class="no-data">{{ t('admin.statsNoData') }}</p>
    </div>
    <div class="chart-card">
      <h4 class="chart-title">{{ t('admin.statsAvgPurchaseValue') }}</h4>
      <div class="mini-bar-chart" v-if="avgValuePerDay.length > 0">
        <div class="bars-container">
          <div
            v-for="day in avgValuePerDay"
            :key="day.date"
            class="mini-bar-col"
            :title="`${day.date}: €${day.avg}`"
          >
            <div
              class="mini-bar gold"
              :style="{ height: `${(day.avg / maxOf(avgValuePerDay, 'avg')) * 100}%` }"
            />
            <span class="mini-bar-label">{{ formatDate(day.date) }}</span>
          </div>
        </div>
      </div>
      <p v-else class="no-data">{{ t('admin.statsNoData') }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.timeseries-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

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

.mini-bar-chart {
  overflow-x: auto;
}

.bars-container {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 120px;
  min-width: min-content;
}

.mini-bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 16px;
  height: 100%;
  justify-content: flex-end;
}

.mini-bar {
  width: 100%;
  max-width: 20px;
  background: var(--color-teal);
  border-radius: 2px 2px 0 0;
  min-height: 2px;
  transition: height 0.3s;

  &.gold {
    background: #BAA030;
  }
}

.mini-bar-label {
  font-size: 0.55rem;
  color: var(--color-text-secondary);
  margin-top: 2px;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  height: 30px;
}

.no-data {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  padding: 2rem 0;
  margin: 0;
}

@media (max-width: 600px) {
  .timeseries-row {
    grid-template-columns: 1fr;
  }
}
</style>
