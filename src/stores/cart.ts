import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { getAllProducts, type Product } from '@/data/products'

export interface CartItem {
  productId: string
  quantity: number
}

export interface EnrichedCartItem extends CartItem {
  product: Product
  lineTotal: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const authStore = useAuthStore()

  function storageKey(): string {
    const userId = authStore.user?.id ?? 'guest'
    return `cahico_cart_${userId}`
  }

  function loadCart() {
    try {
      const stored = localStorage.getItem(storageKey())
      items.value = stored ? JSON.parse(stored) : []
    } catch {
      items.value = []
    }
  }

  function saveCart() {
    localStorage.setItem(storageKey(), JSON.stringify(items.value))
  }

  function addItem(productId: string, quantity = 1) {
    const existing = items.value.find((i) => i.productId === productId)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ productId, quantity })
    }
    saveCart()
  }

  function removeItem(productId: string) {
    items.value = items.value.filter((i) => i.productId !== productId)
    saveCart()
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    const existing = items.value.find((i) => i.productId === productId)
    if (existing) {
      existing.quantity = quantity
      saveCart()
    }
  }

  function clearCart() {
    items.value = []
    saveCart()
  }

  const cartCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0),
  )

  const cartItems = computed<EnrichedCartItem[]>(() =>
    items.value
      .map((item) => {
        const product = getAllProducts().find((p) => p.id === item.productId)
        if (!product) return null
        return {
          ...item,
          product,
          lineTotal: product.priceEur * item.quantity,
        }
      })
      .filter((x): x is EnrichedCartItem => x !== null),
  )

  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, i) => sum + i.lineTotal, 0),
  )

  // Reload cart when auth state changes
  watch(
    () => authStore.user?.id,
    () => loadCart(),
  )

  // Initial load
  loadCart()

  return {
    items,
    cartCount,
    cartTotal,
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadCart,
  }
})
