import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface AnalyticsOrder {
  id: string
  status: 'completed' | 'pending' | 'cancelled'
  totalEur: number
  productIds: string[]
  paymentMethod: string
  shippingMethod: string
  country: string
  createdAt: string
}

export interface TrafficSource {
  source: string
  visits: number
}

export interface SearchTerm {
  term: string
  count: number
}

const STORAGE_KEY = 'cahico_analytics'

const PRODUCT_IDS = [
  'alfama-ring', 'alfama-necklace', 'alfama-bracelet',
  'alfama-earrings', 'chiado-ring', 'chiado-necklace',
]

const PAYMENT_METHODS = ['Credit Card', 'PayPal', 'Bank Transfer', 'Apple Pay', 'Google Pay']
const SHIPPING_METHODS = ['Standard', 'Express', 'Priority', 'Free Shipping']

const COUNTRIES_WEIGHTED = [
  { code: 'PT', weight: 20 }, { code: 'ES', weight: 12 }, { code: 'FR', weight: 12 },
  { code: 'DE', weight: 10 }, { code: 'US', weight: 10 }, { code: 'GB', weight: 8 },
  { code: 'BR', weight: 7 }, { code: 'IT', weight: 6 }, { code: 'NL', weight: 4 },
  { code: 'BE', weight: 3 }, { code: 'CH', weight: 3 }, { code: 'AT', weight: 2 },
  { code: 'JP', weight: 1 }, { code: 'AU', weight: 1 }, { code: 'CA', weight: 1 },
]

const TRAFFIC_SOURCES_WEIGHTED = [
  { source: 'Instagram', weight: 25 }, { source: 'Google', weight: 20 },
  { source: 'Direct', weight: 18 }, { source: 'Facebook', weight: 15 },
  { source: 'Twitter', weight: 8 }, { source: 'Pinterest', weight: 7 },
  { source: 'Email', weight: 5 }, { source: 'Other', weight: 2 },
]

const SEARCH_TERMS = [
  'gold ring', 'silver necklace', 'pearl earrings', 'diamond bracelet',
  'engagement ring', 'wedding band', 'rose gold', 'sterling silver',
  'emerald pendant', 'topaz earrings', 'alfama collection', 'chiado collection',
  'gift ideas', 'anniversary gift', 'handmade jewelry',
]

function weightedRandom<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0)
  let r = Math.random() * total
  for (const item of items) {
    r -= item.weight
    if (r <= 0) return item
  }
  return items[items.length - 1]!
}

function randomDate(daysBack: number): string {
  const now = new Date()
  const offset = Math.floor(Math.random() * daysBack)
  const d = new Date(now.getTime() - offset * 86400000)
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
  return d.toISOString()
}

function generateMockData(): { orders: AnalyticsOrder[]; trafficSources: TrafficSource[]; searchTerms: SearchTerm[] } {
  const orders: AnalyticsOrder[] = []
  for (let i = 0; i < 200; i++) {
    const numProducts = Math.ceil(Math.random() * 3)
    const productIds = Array.from({ length: numProducts }, () =>
      PRODUCT_IDS[Math.floor(Math.random() * PRODUCT_IDS.length)]!
    )
    const statusRoll = Math.random()
    const status: AnalyticsOrder['status'] = statusRoll < 0.7 ? 'completed' : statusRoll < 0.9 ? 'pending' : 'cancelled'

    orders.push({
      id: `ord-${i + 1}`,
      status,
      totalEur: Math.round((50 + Math.random() * 950) * 100) / 100,
      productIds,
      paymentMethod: PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)]!,
      shippingMethod: SHIPPING_METHODS[Math.floor(Math.random() * SHIPPING_METHODS.length)]!,
      country: weightedRandom(COUNTRIES_WEIGHTED).code,
      createdAt: randomDate(90),
    })
  }

  const trafficSources: TrafficSource[] = TRAFFIC_SOURCES_WEIGHTED.map(ts => ({
    source: ts.source,
    visits: Math.round(ts.weight * (80 + Math.random() * 120)),
  }))

  const searchTerms: SearchTerm[] = SEARCH_TERMS.map(term => ({
    term,
    count: Math.floor(10 + Math.random() * 200),
  })).sort((a, b) => b.count - a.count)

  return { orders, trafficSources, searchTerms }
}

export const useAnalyticsStore = defineStore('analytics', () => {
  const orders = ref<AnalyticsOrder[]>([])
  const trafficSources = ref<TrafficSource[]>([])
  const searchTerms = ref<SearchTerm[]>([])

  const dateRange = ref({
    start: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10),
  })

  function loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        orders.value = parsed.orders ?? []
        trafficSources.value = parsed.trafficSources ?? []
        searchTerms.value = parsed.searchTerms ?? []
      } else {
        const mock = generateMockData()
        orders.value = mock.orders
        trafficSources.value = mock.trafficSources
        searchTerms.value = mock.searchTerms
        saveData()
      }
    } catch {
      const mock = generateMockData()
      orders.value = mock.orders
      trafficSources.value = mock.trafficSources
      searchTerms.value = mock.searchTerms
      saveData()
    }
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      orders: orders.value,
      trafficSources: trafficSources.value,
      searchTerms: searchTerms.value,
    }))
  }

  function setDateRange(start: string, end: string) {
    dateRange.value = { start, end }
  }

  const filteredOrders = computed(() => {
    const { start, end } = dateRange.value
    return orders.value.filter(o => {
      const d = o.createdAt.slice(0, 10)
      return d >= start && d <= end
    })
  })

  const completedOrders = computed(() => filteredOrders.value.filter(o => o.status === 'completed'))
  const pendingOrders = computed(() => filteredOrders.value.filter(o => o.status === 'pending'))

  const averagePurchaseValue = computed(() => {
    const completed = completedOrders.value
    if (completed.length === 0) return 0
    const sum = completed.reduce((acc, o) => acc + o.totalEur, 0)
    return Math.round((sum / completed.length) * 100) / 100
  })

  const totalRevenue = computed(() => {
    return Math.round(completedOrders.value.reduce((acc, o) => acc + o.totalEur, 0) * 100) / 100
  })

  const topProducts = computed(() => {
    const counts: Record<string, number> = {}
    for (const o of completedOrders.value) {
      for (const pid of o.productIds) {
        counts[pid] = (counts[pid] || 0) + 1
      }
    }
    return Object.entries(counts)
      .map(([productId, count]) => ({ productId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  })

  const ordersPerDay = computed(() => {
    const dayCounts: Record<string, number> = {}
    for (const o of filteredOrders.value) {
      const day = o.createdAt.slice(0, 10)
      dayCounts[day] = (dayCounts[day] || 0) + 1
    }
    return Object.entries(dayCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  })

  const avgValuePerDay = computed(() => {
    const dayData: Record<string, { sum: number; count: number }> = {}
    for (const o of completedOrders.value) {
      const day = o.createdAt.slice(0, 10)
      if (!dayData[day]) dayData[day] = { sum: 0, count: 0 }
      dayData[day].sum += o.totalEur
      dayData[day].count++
    }
    return Object.entries(dayData)
      .map(([date, d]) => ({ date, avg: Math.round((d.sum / d.count) * 100) / 100 }))
      .sort((a, b) => a.date.localeCompare(b.date))
  })

  const paymentBreakdown = computed(() => {
    const counts: Record<string, number> = {}
    for (const o of completedOrders.value) {
      counts[o.paymentMethod] = (counts[o.paymentMethod] || 0) + 1
    }
    return Object.entries(counts).map(([method, count]) => ({ method, count }))
  })

  const shippingBreakdown = computed(() => {
    const counts: Record<string, number> = {}
    for (const o of completedOrders.value) {
      counts[o.shippingMethod] = (counts[o.shippingMethod] || 0) + 1
    }
    return Object.entries(counts).map(([method, count]) => ({ method, count }))
  })

  const usersByCountry = computed(() => {
    const counts: Record<string, number> = {}
    for (const o of filteredOrders.value) {
      counts[o.country] = (counts[o.country] || 0) + 1
    }
    return Object.entries(counts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
  })

  loadData()

  return {
    orders,
    trafficSources,
    searchTerms,
    dateRange,
    setDateRange,
    filteredOrders,
    completedOrders,
    pendingOrders,
    averagePurchaseValue,
    totalRevenue,
    topProducts,
    ordersPerDay,
    avgValuePerDay,
    paymentBreakdown,
    shippingBreakdown,
    usersByCountry,
  }
})
