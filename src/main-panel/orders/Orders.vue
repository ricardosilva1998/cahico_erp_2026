<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const activeSection = ref<'history' | 'processing' | 'shipped'>('history')

const completedOrders = [
  {
    id: '#ORD-2024-0091',
    date: '12 Jan 2025',
    items: ['Gold 18k Solitaire Ring', 'Pearl Drop Earrings'],
    total: '€ 1 240,00',
    status: 'Completed',
  },
  {
    id: '#ORD-2024-0078',
    date: '3 Dec 2024',
    items: ['Sterling Silver Choker', 'Rose Gold Bracelet'],
    total: '€ 520,00',
    status: 'Completed',
  },
  {
    id: '#ORD-2024-0065',
    date: '18 Nov 2024',
    items: ['Diamond Stud Earrings (pair)'],
    total: '€ 2 100,00',
    status: 'Completed',
  },
  {
    id: '#ORD-2024-0047',
    date: '5 Oct 2024',
    items: ['Sapphire Pendant', 'Gold Chain 45cm'],
    total: '€ 870,00',
    status: 'Completed',
  },
]

const processingOrders = [
  {
    id: '#ORD-2025-0112',
    date: '8 Mar 2025',
    items: ['Emerald Statement Ring', 'Enamel Floral Brooch'],
    total: '€ 1 650,00',
    status: 'Processing',
    dispatch: 'Est. dispatch: 14 Mar 2025',
  },
  {
    id: '#ORD-2025-0108',
    date: '5 Mar 2025',
    items: ['Platinum Wedding Band Set'],
    total: '€ 3 200,00',
    status: 'Processing',
    dispatch: 'Est. dispatch: 13 Mar 2025',
  },
]

const shippedOrders = [
  {
    id: '#ORD-2025-0099',
    date: '25 Feb 2025',
    items: ['Rose Gold Anklet', 'Charm Bracelet'],
    total: '€ 390,00',
    status: 'Shipped',
    tracking: 'PT048921763PT',
    trackingUrl: 'https://www.ctt.pt/feapl_2/app/open/objectSearch/objectSearch.jspx?objects=PT048921763PT',
  },
  {
    id: '#ORD-2025-0094',
    date: '20 Feb 2025',
    items: ['Gold 9k Hoop Earrings'],
    total: '€ 285,00',
    status: 'Shipped',
    tracking: 'PT037815490PT',
    trackingUrl: 'https://www.ctt.pt/feapl_2/app/open/objectSearch/objectSearch.jspx?objects=PT037815490PT',
  },
  {
    id: '#ORD-2025-0087',
    date: '14 Feb 2025',
    items: ["Valentine's Gold Locket Pendant", 'Sterling Silver Heart Ring'],
    total: '€ 740,00',
    status: 'Shipped',
    tracking: 'PT026304817PT',
    trackingUrl: 'https://www.ctt.pt/feapl_2/app/open/objectSearch/objectSearch.jspx?objects=PT026304817PT',
  },
]
</script>

<template>
  <div class="orders-panel">
    <div class="panel-header">
      <h2 class="panel-title">{{ t('orders.title') }}</h2>
      <p class="panel-subtitle">{{ t('orders.subtitle') }}</p>
    </div>

    <!-- Section tabs -->
    <div class="section-tabs">
      <button
        :class="['section-tab', { active: activeSection === 'history' }]"
        @click="activeSection = 'history'"
      >
        {{ t('orders.history') }}
        <span class="tab-badge">{{ completedOrders.length }}</span>
      </button>
      <button
        :class="['section-tab', { active: activeSection === 'processing' }]"
        @click="activeSection = 'processing'"
      >
        {{ t('orders.processing') }}
        <span class="tab-badge processing">{{ processingOrders.length }}</span>
      </button>
      <button
        :class="['section-tab', { active: activeSection === 'shipped' }]"
        @click="activeSection = 'shipped'"
      >
        {{ t('orders.shipped') }}
        <span class="tab-badge shipped">{{ shippedOrders.length }}</span>
      </button>
    </div>

    <!-- Order History -->
    <div v-if="activeSection === 'history'" class="orders-list">
      <div v-for="order in completedOrders" :key="order.id" class="order-card">
        <div class="order-icon">🛍️</div>
        <div class="order-info">
          <div class="order-top">
            <span class="order-id">{{ order.id }}</span>
            <span class="status-badge completed">{{ t('orders.completed') }}</span>
          </div>
          <div class="order-date">{{ order.date }}</div>
          <div class="order-items">{{ order.items.join(' · ') }}</div>
        </div>
        <div class="order-total">{{ order.total }}</div>
      </div>
    </div>

    <!-- Processing Orders -->
    <div v-if="activeSection === 'processing'" class="orders-list">
      <div v-for="order in processingOrders" :key="order.id" class="order-card">
        <div class="order-icon">⚙️</div>
        <div class="order-info">
          <div class="order-top">
            <span class="order-id">{{ order.id }}</span>
            <span class="status-badge processing">{{ t('orders.processing') }}</span>
          </div>
          <div class="order-date">{{ t('orders.placed') }} {{ order.date }}</div>
          <div class="order-items">{{ order.items.join(' · ') }}</div>
          <div class="order-dispatch">{{ order.dispatch }}</div>
        </div>
        <div class="order-total">{{ order.total }}</div>
      </div>
    </div>

    <!-- Shipped Orders -->
    <div v-if="activeSection === 'shipped'" class="orders-list">
      <div v-for="order in shippedOrders" :key="order.id" class="order-card">
        <div class="order-icon">📦</div>
        <div class="order-info">
          <div class="order-top">
            <span class="order-id">{{ order.id }}</span>
            <span class="status-badge shipped">{{ t('orders.shipped') }}</span>
          </div>
          <div class="order-date">{{ t('orders.shippedOn') }} {{ order.date }}</div>
          <div class="order-items">{{ order.items.join(' · ') }}</div>
          <div class="order-tracking">
            <span class="tracking-label">{{ t('orders.tracking') }}</span>
            <a :href="order.trackingUrl" target="_blank" rel="noopener" class="tracking-link">
              {{ order.tracking }} ↗
            </a>
          </div>
        </div>
        <div class="order-total">{{ order.total }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.orders-panel {
  width: 100%;
  padding: 2rem;
}

.panel-header {
  margin-bottom: 1.75rem;
}

.panel-title {
  font-family: $font-headline;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0 0 0.4rem;
}

.panel-subtitle {
  font-family: $font-body;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin: 0;
}

// Section tabs
.section-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.section-tab {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: $font-headline;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  padding: 0.65rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;
  white-space: nowrap;
  min-height: 44px;

  &:hover {
    color: var(--color-teal);
  }

  &.active {
    color: var(--color-teal);
    border-bottom-color: var(--color-teal);
  }
}

.tab-badge {
  font-family: $font-body;
  font-size: 0.7rem;
  font-weight: 700;
  background-color: var(--color-bg-alt);
  color: var(--color-text-secondary);
  border-radius: 20px;
  padding: 0.1rem 0.45rem;

  &.processing {
    background-color: rgba(217, 130, 43, 0.15);
    color: #D9822B;
  }

  &.shipped {
    background-color: color-mix(in srgb, var(--color-teal) 12%, transparent);
    color: var(--color-teal);
  }
}

// Orders list
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.order-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  transition: box-shadow 0.2s, background-color 0.3s, border-color 0.3s;

  &:hover {
    box-shadow: var(--shadow-card);
  }
}

.order-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.order-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.order-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.order-id {
  font-family: $font-headline;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 0.5px;
}

.order-date {
  font-family: $font-body;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.order-items {
  font-family: $font-body;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.order-dispatch {
  font-family: $font-body;
  font-size: 0.8rem;
  color: #D9822B;
  font-weight: 500;
}

.order-tracking {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: $font-body;
  font-size: 0.8rem;
}

.tracking-label {
  color: var(--color-text-muted);
}

.tracking-link {
  color: var(--color-teal);
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
}

.order-total {
  font-family: $font-headline;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-primary);
  white-space: nowrap;
  flex-shrink: 0;
  align-self: center;
}

// Status badges
.status-badge {
  font-family: $font-body;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 20px;
  padding: 0.2rem 0.6rem;

  &.completed {
    background-color: var(--color-success-bg);
    color: var(--color-success);
  }

  &.processing {
    background-color: rgba(217, 130, 43, 0.15);
    color: #D9822B;
  }

  &.shipped {
    background-color: color-mix(in srgb, var(--color-teal) 12%, transparent);
    color: var(--color-teal);
  }
}

@media (max-width: 600px) {
  .orders-panel {
    padding: 1.25rem;
  }

  .order-card {
    flex-direction: column;
    gap: 0.75rem;
  }

  .order-total {
    align-self: flex-start;
    font-size: 1rem;
  }

  .section-tab {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
