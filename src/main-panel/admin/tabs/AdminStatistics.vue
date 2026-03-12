<script setup lang="ts">
import { useAnalyticsStore } from '@/stores/analytics'
import { useI18n } from 'vue-i18n'
import OrdersOverview from '../components/stats/OrdersOverview.vue'
import TopProductsChart from '../components/stats/TopProductsChart.vue'
import TrafficSourcesChart from '../components/stats/TrafficSourcesChart.vue'
import PieCharts from '../components/stats/PieCharts.vue'
import TimeSeriesCharts from '../components/stats/TimeSeriesCharts.vue'
import WorldMapChart from '../components/stats/WorldMapChart.vue'
import SearchTermsCloud from '../components/stats/SearchTermsCloud.vue'

const analyticsStore = useAnalyticsStore()
const { t } = useI18n()

function setPreset(days: number | null) {
  if (days === null) {
    // All time: from earliest order to today
    analyticsStore.setDateRange('2020-01-01', new Date().toISOString().slice(0, 10))
  } else {
    const end = new Date()
    const start = new Date(end.getTime() - days * 86400000)
    analyticsStore.setDateRange(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10))
  }
}
</script>

<template>
  <div class="admin-statistics">
    <!-- Date Range Picker -->
    <div class="date-picker">
      <div class="date-inputs">
        <div class="date-group">
          <label>{{ t('admin.startDate') }}</label>
          <input
            type="date"
            :value="analyticsStore.dateRange.start"
            @input="analyticsStore.setDateRange(($event.target as HTMLInputElement).value, analyticsStore.dateRange.end)"
          />
        </div>
        <div class="date-group">
          <label>{{ t('admin.endDate') }}</label>
          <input
            type="date"
            :value="analyticsStore.dateRange.end"
            @input="analyticsStore.setDateRange(analyticsStore.dateRange.start, ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
      <div class="preset-btns">
        <button class="preset-btn" @click="setPreset(7)">{{ t('admin.statsLast7') }}</button>
        <button class="preset-btn" @click="setPreset(30)">{{ t('admin.statsLast30') }}</button>
        <button class="preset-btn" @click="setPreset(90)">{{ t('admin.statsLast90') }}</button>
        <button class="preset-btn" @click="setPreset(null)">{{ t('admin.statsAllTime') }}</button>
      </div>
    </div>

    <!-- Overview Cards -->
    <OrdersOverview
      :completed-count="analyticsStore.completedOrders.length"
      :pending-count="analyticsStore.pendingOrders.length"
      :total-revenue="analyticsStore.totalRevenue"
      :average-purchase-value="analyticsStore.averagePurchaseValue"
    />

    <!-- Charts Grid -->
    <div class="charts-grid">
      <TopProductsChart :products="analyticsStore.topProducts" />
      <TrafficSourcesChart :sources="analyticsStore.trafficSources" />
    </div>

    <TimeSeriesCharts
      :orders-per-day="analyticsStore.ordersPerDay"
      :avg-value-per-day="analyticsStore.avgValuePerDay"
    />

    <PieCharts
      :payment-data="analyticsStore.paymentBreakdown"
      :shipping-data="analyticsStore.shippingBreakdown"
    />

    <div class="charts-grid">
      <WorldMapChart :countries="analyticsStore.usersByCountry" />
      <SearchTermsCloud :terms="analyticsStore.searchTerms" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-statistics {
  width: 100%;
}

.date-picker {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.date-inputs {
  display: flex;
  gap: 0.75rem;
}

.date-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  input {
    padding: 0.45rem 0.6rem;
    border: 1px solid var(--color-input-border);
    border-radius: 8px;
    font-family: $font-body;
    font-size: 0.85rem;
    background: var(--color-white);
    color: var(--color-text-primary);

    &:focus { outline: none; border-color: var(--color-teal); }
  }
}

.preset-btns {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.preset-btn {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  font-family: $font-body;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    border-color: var(--color-teal);
    color: var(--color-teal);
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 700px) {
  .date-picker {
    flex-direction: column;
    align-items: stretch;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
