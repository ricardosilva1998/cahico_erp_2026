import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface AdminContentItem {
  id: string
  name: string
  visible: boolean
}

export interface AdminConfig {
  collections: AdminContentItem[]
  materials: AdminContentItem[]
  featuredPieces: AdminContentItem[]
  heroVisible: boolean
  storyVisible: boolean
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
  }
}

export const useAdminStore = defineStore('admin', () => {
  const config = ref<AdminConfig>(defaultConfig())

  function fetchConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AdminConfig
        // Merge with defaults to handle new items added later
        const defaults = defaultConfig()
        config.value = {
          collections: mergeItems(defaults.collections, parsed.collections),
          materials: mergeItems(defaults.materials, parsed.materials),
          featuredPieces: mergeItems(defaults.featuredPieces, parsed.featuredPieces),
          heroVisible: parsed.heroVisible ?? true,
          storyVisible: parsed.storyVisible ?? true,
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
  }
})
