<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  sources: { source: string; visits: number }[]
}>()

const { t } = useI18n()

const COLORS = ['#175976', '#BAA030', '#2e8b57', '#cd5c5c', '#6a5acd', '#ff8c00', '#20b2aa', '#808080']
</script>

<template>
  <div class="chart-card">
    <h4 class="chart-title">{{ t('admin.statsTrafficSources') }}</h4>
    <div class="bar-chart">
      <div
        v-for="(src, idx) in sources"
        :key="src.source"
        class="bar-row"
      >
        <span class="bar-label">{{ src.source }}</span>
        <div class="bar-track">
          <div
            class="bar-fill"
            :style="{ width: `${(src.visits / (sources[0]?.visits || 1)) * 100}%`, backgroundColor: COLORS[idx % COLORS.length] }"
          />
        </div>
        <span class="bar-value">{{ src.visits }}</span>
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

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.bar-row {
  display: grid;
  grid-template-columns: 100px 1fr 50px;
  align-items: center;
  gap: 0.5rem;
}

.bar-label {
  font-size: 0.8rem;
  color: var(--color-text-primary);
}

.bar-track {
  height: 20px;
  background: var(--color-bg-alt);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
  min-width: 4px;
}

.bar-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: right;
}
</style>
