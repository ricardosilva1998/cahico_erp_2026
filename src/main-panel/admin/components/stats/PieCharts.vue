<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  paymentData: { method: string; count: number }[]
  shippingData: { method: string; count: number }[]
}>()

const { t } = useI18n()

const COLORS = ['#175976', '#BAA030', '#2e8b57', '#cd5c5c', '#6a5acd', '#ff8c00']

const PAYMENT_ICONS: Record<string, string> = {
  'Credit Card': 'M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2V5zm0 4h20v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9zm3 3h4v2H5v-2z',
  'PayPal': 'M7.5 21l1-5.5h2c3 0 5.5-2 6-5s-1.5-5-4.5-5H7L4 21h3.5zm1.2-7.5l.8-4h2c1.5 0 2.2.7 2 2s-1.3 2-2.8 2h-2zm7.3-7c.5-2.5-1-4.5-4-4.5h-2l-.5 2.5h2c1.5 0 2.2.7 2 2h2.5z',
  'Bank Transfer': 'M3 21h18v-2H3v2zm0-4h18v-1H3v1zM3 3v2l9 4 9-4V3H3zm2 6h4v6H5V9zm6 0h4v6h-4V9zm6 0h4v6h-4V9z',
  'Apple Pay': 'M17.7 9.3c-.1-1.5 1.3-2.2 1.3-2.2s-.7-1-1.7-1.3c-1.4-.3-2.1.4-2.7.4-.6 0-1.5-.4-2.5-.4-1.3 0-2.5.7-3.1 1.9-1.3 2.3-.4 5.6 1 7.5.6.9 1.4 2 2.4 1.9 1-.1 1.3-.6 2.5-.6s1.5.6 2.5.6 1.7-1 2.3-1.9c.4-.5.6-1 .8-1.5-2-.8-2.3-3-2.3-3zm-2.2-5.4c.5-.7.9-1.6.8-2.5-.8 0-1.7.5-2.3 1.2-.5.6-.9 1.5-.8 2.4.9.1 1.8-.5 2.3-1.1z',
  'Google Pay': 'M12.5 8.8V12h3.8c-.2 1-.7 1.8-1.4 2.3l2.3 1.8c1.3-1.2 2.1-3 2.1-5.2 0-.5 0-1-.1-1.4h-6.7v-.7zM12 21c2.4 0 4.5-.8 6-2.2l-2.3-1.8c-.8.5-1.8.9-3.7.9-2.8 0-5.2-1.9-6.1-4.5l-2.4 1.8C5.1 18.8 8.3 21 12 21zM5.9 14.4c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2L3.5 8.2C2.8 9.4 2.4 10.7 2.4 12s.4 2.6 1.1 3.8l2.4-1.4zM12 5.4c1.6 0 3 .5 4.1 1.6l2-2C16.4 3.4 14.4 2.6 12 2.6 8.3 2.6 5.1 4.8 3.5 8l2.4 1.8c.9-2.6 3.3-4.4 6.1-4.4z',
}

const SHIPPING_ICONS: Record<string, string> = {
  'Standard': 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
  'Express': 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM1 7h5v2H1V7zm1 3h4v2H2v-2zm2 3h3v2H4v-2z',
  'Pick-up': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
}

function getIcon(method: string, iconMap: Record<string, string>): string | undefined {
  for (const [key, path] of Object.entries(iconMap)) {
    if (method.toLowerCase().includes(key.toLowerCase())) return path
  }
  return undefined
}

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
          <span class="legend-dot" :style="{ backgroundColor: COLORS[idx % COLORS.length] }">
            <svg v-if="getIcon(item.method, PAYMENT_ICONS)" class="method-icon" viewBox="0 0 24 24">
              <path :d="getIcon(item.method, PAYMENT_ICONS)!" fill="white" />
            </svg>
          </span>
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
          <span class="legend-dot" :style="{ backgroundColor: COLORS[idx % COLORS.length] }">
            <svg v-if="getIcon(item.method, SHIPPING_ICONS)" class="method-icon" viewBox="0 0 24 24">
              <path :d="getIcon(item.method, SHIPPING_ICONS)!" fill="white" />
            </svg>
          </span>
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
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.method-icon {
  width: 12px;
  height: 12px;
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
