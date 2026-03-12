<script setup lang="ts">
import { onMounted } from 'vue'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()

onMounted(() => {
  profileStore.fetchOrders()
})

function statusColor(status: string) {
  switch (status) {
    case 'delivered': return 'badge-success'
    case 'shipped': return 'badge-info'
    case 'confirmed': return 'badge-warning'
    case 'cancelled': return 'badge-error'
    default: return 'badge-default'
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="my-orders">
    <h2 class="section-title">My Orders</h2>

    <div v-if="profileStore.loading" class="loading">Loading orders...</div>

    <div v-else-if="profileStore.orders.length === 0" class="empty-state">
      <p>You have no orders yet.</p>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in profileStore.orders" :key="order.id" class="order-card">
        <div class="order-header">
          <span class="order-date">{{ formatDate(order.created_at) }}</span>
          <span :class="['badge', statusColor(order.status)]">{{ order.status }}</span>
        </div>
        <div class="order-items">
          <span v-for="(item, i) in order.items" :key="i" class="order-item">
            {{ item.name }} x{{ item.quantity }}
          </span>
        </div>
        <div class="order-total">Total: ${{ order.total_amount.toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.section-title {
  font-family: $font-headline;
  font-size: 1.1rem;
  color: var(--color-text-primary);
  margin: 0 0 1rem;
}

.loading,
.empty-state {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  padding: 2rem 0;
  text-align: center;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.order-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  transition: background-color 0.3s, border-color 0.3s;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.order-date {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-success {
  background-color: var(--color-success-bg);
  color: var(--color-success);
}

.badge-info {
  background-color: color-mix(in srgb, var(--color-teal) 10%, transparent);
  color: var(--color-teal);
}

.badge-warning {
  background-color: color-mix(in srgb, var(--color-gold) 15%, transparent);
  color: var(--color-text-primary);
}

.badge-error {
  background-color: var(--color-error-bg);
  color: var(--color-error);
}

.badge-default {
  background-color: color-mix(in srgb, var(--color-text-primary) 6%, transparent);
  color: var(--color-text-secondary);
}

.order-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.order-item {
  font-size: 0.85rem;
  color: var(--color-text-primary);
  background-color: var(--color-bg-section);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.order-total {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-teal);
}
</style>
