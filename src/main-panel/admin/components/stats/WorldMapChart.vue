<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  countries: { country: string; count: number }[]
}>()

const { t } = useI18n()

const COUNTRY_NAMES: Record<string, string> = {
  PT: 'Portugal', ES: 'Spain', FR: 'France', DE: 'Germany',
  US: 'United States', GB: 'United Kingdom', BR: 'Brazil', IT: 'Italy',
  NL: 'Netherlands', BE: 'Belgium', CH: 'Switzerland', AT: 'Austria',
  JP: 'Japan', AU: 'Australia', CA: 'Canada',
}

function getCountryName(code: string): string {
  return COUNTRY_NAMES[code] || code
}

function getBarColor(idx: number): string {
  const colors = ['#175976', '#1a6b8a', '#1d7d9e', '#208fb2', '#23a1c6', '#3ab0d0', '#5ac0da', '#7ad0e4']
  return colors[idx % colors.length]!
}
</script>

<template>
  <div class="chart-card">
    <h4 class="chart-title">{{ t('admin.statsUsersByCountry') }}</h4>
    <div class="country-list">
      <div
        v-for="(item, idx) in countries"
        :key="item.country"
        class="country-row"
      >
        <span class="country-flag">{{ item.country }}</span>
        <span class="country-name">{{ getCountryName(item.country) }}</span>
        <div class="country-bar-track">
          <div
            class="country-bar-fill"
            :style="{ width: `${(item.count / (countries[0]?.count || 1)) * 100}%`, backgroundColor: getBarColor(idx) }"
          />
        </div>
        <span class="country-count">{{ item.count }}</span>
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

.country-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.country-row {
  display: grid;
  grid-template-columns: 30px 100px 1fr 40px;
  align-items: center;
  gap: 0.5rem;
}

.country-flag {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-teal);
  font-family: monospace;
}

.country-name {
  font-size: 0.8rem;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.country-bar-track {
  height: 16px;
  background: var(--color-bg-alt);
  border-radius: 3px;
  overflow: hidden;
}

.country-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
  min-width: 3px;
}

.country-count {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: right;
}
</style>
