<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  paymentData: { method: string; count: number }[]
  shippingData: { method: string; count: number }[]
}>()

const { t } = useI18n()

const COLORS = ['#175976', '#BAA030', '#2e8b57', '#cd5c5c', '#6a5acd', '#ff8c00']

function getTotal(data: { count: number }[]): number {
  return data.reduce((sum, d) => sum + d.count, 0)
}

function getPercent(count: number, total: number): string {
  if (total === 0) return '0'
  return Math.round((count / total) * 100).toString()
}

const paymentTotal = computed(() => getTotal(props.paymentData))
const shippingTotal = computed(() => getTotal(props.shippingData))
</script>

<template>
  <div class="pie-charts-row">
    <div class="chart-card">
      <h4 class="chart-title">{{ t('admin.statsPaymentMethods') }}</h4>
      <div class="legend-list">
        <div v-for="(item, idx) in paymentData" :key="item.method" class="legend-row">
          <span class="legend-dot" :style="{ backgroundColor: COLORS[idx % COLORS.length] }" />
          <span class="legend-label">{{ item.method }}</span>
          <span class="legend-value">{{ getPercent(item.count, paymentTotal) }}%</span>
          <span class="legend-count">({{ item.count }})</span>
        </div>
      </div>
    </div>
    <div class="chart-card">
      <h4 class="chart-title">{{ t('admin.statsShippingMethods') }}</h4>
      <div class="legend-list">
        <div v-for="(item, idx) in shippingData" :key="item.method" class="legend-row">
          <span class="legend-dot" :style="{ backgroundColor: COLORS[idx % COLORS.length] }" />
          <span class="legend-label">{{ item.method }}</span>
          <span class="legend-value">{{ getPercent(item.count, shippingTotal) }}%</span>
          <span class="legend-count">({{ item.count }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.pie-charts-row {
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

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  font-size: 0.85rem;
  color: var(--color-text-primary);
}

.legend-value {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--color-text-primary);
}

.legend-count {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

@media (max-width: 600px) {
  .pie-charts-row {
    grid-template-columns: 1fr;
  }
}
</style>
