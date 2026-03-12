<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  products: { productId: string; count: number }[]
}>()

const { t } = useI18n()

function getProductName(id: string): string {
  return t(`product.${id}.name`, id)
}
</script>

<template>
  <div class="chart-card">
    <h4 class="chart-title">{{ t('admin.statsTopProducts') }}</h4>
    <div class="bar-chart">
      <div
        v-for="product in products"
        :key="product.productId"
        class="bar-row"
      >
        <span class="bar-label">{{ getProductName(product.productId) }}</span>
        <div class="bar-track">
          <div
            class="bar-fill"
            :style="{ width: `${(product.count / (products[0]?.count || 1)) * 100}%` }"
          />
        </div>
        <span class="bar-value">{{ product.count }}</span>
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
  grid-template-columns: 130px 1fr 40px;
  align-items: center;
  gap: 0.5rem;
}

.bar-label {
  font-size: 0.8rem;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-track {
  height: 20px;
  background: var(--color-bg-alt);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--color-teal);
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

@media (max-width: 600px) {
  .bar-row {
    grid-template-columns: 100px 1fr 35px;
  }
}
</style>
