import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface AdminContentItem {
  id: string
  name: string
  visible: boolean
}

export interface ProductOverride {
  priceEur?: number
  stock?: number
  visible?: boolean
  salePercent?: number
  saleLabel?: string
}

export interface Sale {
  id: string
  name: string
  type: 'product' | 'collection'
  targetIds: string[]
  discountPercent: number
  startDate: string
  endDate: string
  active: boolean
}

export interface DiscountCode {
  id: string
  code: string
  discountPercent: number
  minOrderEur: number
  maxUses: number
  usedCount: number
  startDate: string
  endDate: string
  active: boolean
}

export interface StockLogEntry {
  id: string
  productId: string
  delta: number
  reason: string
  timestamp: string
}

export interface AdminConfig {
  collections: AdminContentItem[]
  materials: AdminContentItem[]
  featuredPieces: AdminContentItem[]
  heroVisible: boolean
  storyVisible: boolean
  productOverrides: Record<string, ProductOverride>
  sales: Sale[]
  discountCodes: DiscountCode[]
  stockLog: StockLogEntry[]
}

const STORAGE_KEY = 'cahico_admin_config'

function defaultConfig(): AdminConfig {
  return {
    collections: [
      { id: 'rings', name: 'Rings', visible: true },
      { id: 'necklaces', name: 'Necklaces', visible: true },
      { id: 'bracelets', name: 'Bracelets', visible: true },
      { id: 'earrings', name: 'Earrings', visible: true },
      { id: 'anklets', name: 'Anklets', visible: true },
      { id: 'brooches', name: 'Brooches', visible: true },
      { id: 'pendants', name: 'Pendants', visible: true },
      { id: 'cufflinks', name: 'Cufflinks', visible: true },
    ],
    materials: [
      { id: 'gold-18k', name: 'Gold 18k', visible: true },
      { id: 'gold-9k', name: 'Gold 9k', visible: true },
      { id: 'rose-gold-18k', name: 'Rose Gold 18k', visible: true },
      { id: 'sterling-silver', name: 'Sterling Silver', visible: true },
      { id: 'platinum', name: 'Platinum', visible: true },
      { id: 'diamond', name: 'Diamond', visible: true },
      { id: 'emerald', name: 'Emerald', visible: true },
      { id: 'sapphire', name: 'Sapphire', visible: true },
      { id: 'pearl', name: 'Pearl', visible: true },
      { id: 'enamel', name: 'Enamel', visible: true },
    ],
    featuredPieces: [
      { id: 'alfama-ring', name: 'Alfama Ring', visible: true },
      { id: 'alfama-necklace', name: 'Alfama Necklace', visible: true },
      { id: 'alfama-bracelet', name: 'Alfama Bracelet', visible: true },
      { id: 'alfama-earrings', name: 'Alfama Earrings', visible: true },
      { id: 'chiado-ring', name: 'Chiado Ring', visible: true },
      { id: 'chiado-necklace', name: 'Chiado Necklace', visible: true },
    ],
    heroVisible: true,
    storyVisible: true,
    productOverrides: {},
    sales: [],
    discountCodes: [],
    stockLog: [],
  }
}

let nextId = 1

function genId(): string {
  return `${Date.now()}-${nextId++}`
}

export const useAdminStore = defineStore('admin', () => {
  const config = ref<AdminConfig>(defaultConfig())

  function fetchConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AdminConfig
        const defaults = defaultConfig()
        config.value = {
          collections: mergeItems(defaults.collections, parsed.collections),
          materials: mergeItems(defaults.materials, parsed.materials),
          featuredPieces: mergeItems(defaults.featuredPieces, parsed.featuredPieces),
          heroVisible: parsed.heroVisible ?? true,
          storyVisible: parsed.storyVisible ?? true,
          productOverrides: parsed.productOverrides ?? {},
          sales: parsed.sales ?? [],
          discountCodes: parsed.discountCodes ?? [],
          stockLog: parsed.stockLog ?? [],
        }
      }
    } catch {
      // ignore corrupt storage
    }
  }

  function mergeItems(defaults: AdminContentItem[], stored?: AdminContentItem[]): AdminContentItem[] {
    if (!stored) return defaults
    const storedMap = new Map(stored.map(s => [s.id, s]))
    return defaults.map(d => storedMap.get(d.id) ?? d)
  }

  function saveConfig() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config.value))
  }

  function toggleCollectionVisibility(id: string) {
    const item = config.value.collections.find(c => c.id === id)
    if (item) {
      item.visible = !item.visible
      saveConfig()
    }
  }

  function toggleMaterialVisibility(id: string) {
    const item = config.value.materials.find(m => m.id === id)
    if (item) {
      item.visible = !item.visible
      saveConfig()
    }
  }

  function toggleFeaturedVisibility(id: string) {
    const item = config.value.featuredPieces.find(f => f.id === id)
    if (item) {
      item.visible = !item.visible
      saveConfig()
    }
  }

  function toggleHeroVisible() {
    config.value.heroVisible = !config.value.heroVisible
    saveConfig()
  }

  function toggleStoryVisible() {
    config.value.storyVisible = !config.value.storyVisible
    saveConfig()
  }

  function isCollectionVisible(id: string): boolean {
    return config.value.collections.find(c => c.id === id)?.visible ?? true
  }

  function isMaterialVisible(id: string): boolean {
    return config.value.materials.find(m => m.id === id)?.visible ?? true
  }

  function isFeaturedVisible(id: string): boolean {
    return config.value.featuredPieces.find(f => f.id === id)?.visible ?? true
  }

  // Product overrides
  function getProductOverride(productId: string): ProductOverride | undefined {
    return config.value.productOverrides[productId]
  }

  function setProductOverride(productId: string, override: ProductOverride) {
    config.value.productOverrides[productId] = override
    saveConfig()
  }

  function removeProductOverride(productId: string) {
    delete config.value.productOverrides[productId]
    saveConfig()
  }

  function getEffectivePrice(productId: string, basePrice: number): number {
    const override = config.value.productOverrides[productId]
    const price = override?.priceEur ?? basePrice
    // Apply sale discount
    const saleDiscount = getActiveSalesDiscountForProduct(productId)
    const overrideDiscount = override?.salePercent ?? 0
    const totalDiscount = Math.max(saleDiscount, overrideDiscount)
    if (totalDiscount > 0) {
      return Math.round(price * (1 - totalDiscount / 100))
    }
    return price
  }

  function getEffectiveStock(productId: string, baseStock: number): number {
    const override = config.value.productOverrides[productId]
    return override?.stock ?? baseStock
  }

  function isProductVisible(productId: string): boolean {
    const override = config.value.productOverrides[productId]
    return override?.visible ?? true
  }

  // Sales
  function getActiveSalesDiscountForProduct(productId: string): number {
    const now = new Date().toISOString().slice(0, 10)
    let maxDiscount = 0
    for (const sale of config.value.sales) {
      if (!sale.active) continue
      if (sale.startDate > now || sale.endDate < now) continue
      if (sale.type === 'product' && sale.targetIds.includes(productId)) {
        maxDiscount = Math.max(maxDiscount, sale.discountPercent)
      }
      if (sale.type === 'collection') {
        // Check if productId contains collection slug
        const productCollection = productId.split('-')[0]
        if (productCollection && sale.targetIds.includes(productCollection)) {
          maxDiscount = Math.max(maxDiscount, sale.discountPercent)
        }
      }
    }
    return maxDiscount
  }

  function getActiveSalesForProduct(productId: string): Sale[] {
    const now = new Date().toISOString().slice(0, 10)
    return config.value.sales.filter(sale => {
      if (!sale.active) return false
      if (sale.startDate > now || sale.endDate < now) return false
      if (sale.type === 'product') return sale.targetIds.includes(productId)
      if (sale.type === 'collection') {
        const productCollection = productId.split('-')[0]
        return productCollection ? sale.targetIds.includes(productCollection) : false
      }
      return false
    })
  }

  function addSale(sale: Omit<Sale, 'id'>): Sale {
    const newSale: Sale = { ...sale, id: genId() }
    config.value.sales.push(newSale)
    saveConfig()
    return newSale
  }

  function updateSale(id: string, updates: Partial<Sale>) {
    const idx = config.value.sales.findIndex(s => s.id === id)
    if (idx !== -1) {
      config.value.sales[idx] = { ...config.value.sales[idx], ...updates } as Sale
      saveConfig()
    }
  }

  function deleteSale(id: string) {
    config.value.sales = config.value.sales.filter(s => s.id !== id)
    saveConfig()
  }

  // Discount codes
  function addDiscountCode(code: Omit<DiscountCode, 'id'>): DiscountCode {
    const newCode: DiscountCode = { ...code, id: genId() }
    config.value.discountCodes.push(newCode)
    saveConfig()
    return newCode
  }

  function updateDiscountCode(id: string, updates: Partial<DiscountCode>) {
    const idx = config.value.discountCodes.findIndex(c => c.id === id)
    if (idx !== -1) {
      config.value.discountCodes[idx] = { ...config.value.discountCodes[idx], ...updates } as DiscountCode
      saveConfig()
    }
  }

  function deleteDiscountCode(id: string) {
    config.value.discountCodes = config.value.discountCodes.filter(c => c.id !== id)
    saveConfig()
  }

  function validateDiscountCode(code: string, orderTotal: number): { valid: boolean; discount: number } {
    const now = new Date().toISOString().slice(0, 10)
    const dc = config.value.discountCodes.find(
      c => c.code === code.toUpperCase() && c.active && c.startDate <= now && c.endDate >= now,
    )
    if (!dc) return { valid: false, discount: 0 }
    if (dc.maxUses > 0 && dc.usedCount >= dc.maxUses) return { valid: false, discount: 0 }
    if (orderTotal < dc.minOrderEur) return { valid: false, discount: 0 }
    return { valid: true, discount: dc.discountPercent }
  }

  // Stock
  function adjustStock(productId: string, delta: number, reason: string) {
    const override = config.value.productOverrides[productId] ?? {}
    const currentStock = override.stock ?? 0
    override.stock = Math.max(0, currentStock + delta)
    config.value.productOverrides[productId] = override

    config.value.stockLog.unshift({
      id: genId(),
      productId,
      delta,
      reason,
      timestamp: new Date().toISOString(),
    })
    // Cap at 500 entries
    if (config.value.stockLog.length > 500) {
      config.value.stockLog = config.value.stockLog.slice(0, 500)
    }
    saveConfig()
  }

  function getStockLog(productId?: string): StockLogEntry[] {
    if (productId) {
      return config.value.stockLog.filter(e => e.productId === productId)
    }
    return config.value.stockLog
  }

  // Initialize on creation
  fetchConfig()

  return {
    config,
    fetchConfig,
    saveConfig,
    toggleCollectionVisibility,
    toggleMaterialVisibility,
    toggleFeaturedVisibility,
    toggleHeroVisible,
    toggleStoryVisible,
    isCollectionVisible,
    isMaterialVisible,
    isFeaturedVisible,
    getProductOverride,
    setProductOverride,
    removeProductOverride,
    getEffectivePrice,
    getEffectiveStock,
    isProductVisible,
    getActiveSalesForProduct,
    addSale,
    updateSale,
    deleteSale,
    addDiscountCode,
    updateDiscountCode,
    deleteDiscountCode,
    validateDiscountCode,
    adjustStock,
    getStockLog,
  }
})
